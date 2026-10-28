/**
 * Scenario B - Authentication (negative and positive) and login field validation.
 *
 * PDF Part III:
 * - Negative: an invalid username or password shows "Invalid username or password".
 * - Positive: a user registered through the Scenario A flow, and the demo account, land on the
 *   Dashboard (index.html). The registered user comes from the `registerUser` fixture, so no test
 *   depends on another one.
 * - Field validation: required-field messages for empty inputs and a masked password field.
 */
import { expect, test, type Fixtures } from '../fixtures';
import type { UserCredentials } from '../types/user';
import { env } from '../utils/env';
import { uniqueId } from '../utils/test-data';

/** A login attempt that the application must reject. */
interface InvalidLoginCase {
  readonly scenario: string;
  readonly credentials: UserCredentials;
}

/** A login attempt blocked by field validation; an empty string means no error is expected. */
interface FieldValidationCase {
  readonly scenario: string;
  readonly credentials: UserCredentials;
  readonly errors: { readonly username: string; readonly password: string };
}

/** A source of valid credentials for the positive login test. */
interface AccountCase {
  readonly account: string;
  /** Resolves the credentials, registering a user only for the sources that need one. */
  readonly credentials: (registerUser: Fixtures['registerUser']) => Promise<UserCredentials>;
}

const invalidLogins: InvalidLoginCase[] = [
  {
    scenario: 'an unknown username',
    credentials: { username: `unknown_${uniqueId()}`, password: env.demoUser.password },
  },
  {
    scenario: 'a wrong password for an existing username',
    credentials: { username: env.demoUser.username, password: `wrong_${uniqueId()}` },
  },
];

const fieldValidations: FieldValidationCase[] = [
  {
    scenario: 'the username is empty',
    credentials: { username: '', password: uniqueId() },
    errors: { username: 'Username is required', password: '' },
  },
  {
    scenario: 'the password is empty',
    credentials: { username: uniqueId(), password: '' },
    errors: { username: '', password: 'Password is required' },
  },
  {
    scenario: 'both fields are empty',
    credentials: { username: '', password: '' },
    errors: { username: 'Username is required', password: 'Password is required' },
  },
];

const accounts: AccountCase[] = [
  { account: 'a user registered through the UI', credentials: (registerUser) => registerUser() },
  { account: 'the demo account', credentials: () => Promise.resolve(env.demoUser) },
];

test.describe('Scenario B: Authentication', { tag: '@regression' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test.describe('Invalid credentials', { tag: '@negative' }, () => {
    for (const { scenario, credentials } of invalidLogins) {
      test(`rejects ${scenario} with "Invalid username or password"`, async ({ loginPage }) => {
        await loginPage.fillForm(credentials);

        // The application hides the error after 5 s, so the check starts right before the click:
        // a slow click acknowledgement (seen in Firefox under load) can outlast the message.
        await test.step('Submit and verify the error message', () =>
          Promise.all([
            expect(loginPage.invalidCredentialsError).toBeVisible(),
            loginPage.submit(),
          ]));

        await test.step('Verify the user stays on the login page', () => loginPage.expectLoaded());
      });
    }
  });

  test.describe('Field validation', () => {
    for (const { scenario, credentials, errors } of fieldValidations) {
      test(`blocks the login when ${scenario}`, { tag: '@negative' }, async ({ loginPage }) => {
        await loginPage.login(credentials);

        // Each message is linked to its input through aria-describedby, so the accessible
        // description checks the text and that it belongs to the right field, in any browser.
        await test.step('Verify the required-field errors and no redirect', async () => {
          await expect(loginPage.usernameInput).toHaveAccessibleDescription(errors.username);
          await expect(loginPage.passwordInput).toHaveAccessibleDescription(errors.password);
          await loginPage.expectLoaded();
        });
      });
    }

    test('masks the password field', async ({ loginPage }) => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Successful login', { tag: '@smoke' }, () => {
    for (const { account, credentials } of accounts) {
      test(`logs in with ${account} and lands on the dashboard`, async ({
        loginPage,
        dashboardPage,
        registerUser,
      }, testInfo) => {
        const user = await credentials(registerUser);
        testInfo.annotations.push({ type: 'username', description: user.username });

        await loginPage.login(user);

        await test.step('Verify the dashboard is displayed for the logged-in user', async () => {
          await dashboardPage.expectLoaded();
          await expect(dashboardPage.welcomeMessage).toHaveText(`Welcome, ${user.username}!`);
        });
      });
    }
  });
});
