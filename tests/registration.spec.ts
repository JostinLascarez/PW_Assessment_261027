/**
 * Scenario A - User registration (happy path).
 *
 * PDF Part II: navigate to the Login Page, follow "Register here", register a user with a
 * randomized username and e-mail, and verify the redirect back to the Login Page. The username
 * prefix, e-mail domain and password come from environment variables (see utils/test-data.ts).
 */
import { expect, test } from '../fixtures';
import { createUser } from '../utils/test-data';

test.describe('Scenario A: User registration', { tag: '@regression' }, () => {
  test(
    'registers a user with a randomized username and e-mail and redirects to the login page',
    { tag: '@smoke' },
    async ({ loginPage, registerPage }, testInfo) => {
      const user = createUser();
      testInfo.annotations.push(
        { type: 'username', description: user.username },
        { type: 'email', description: user.email },
      );

      await loginPage.goto();
      await loginPage.openRegistration();

      await test.step('Verify the registration form is displayed', () =>
        registerPage.expectLoaded());

      await registerPage.fillForm(user);

      // The success message only stays for 2 s before the redirect, so the check starts right
      // before the click: a slow click acknowledgement (seen in Firefox under load) can outlast it.
      await test.step('Submit and verify the success message', () =>
        Promise.all([expect(registerPage.successMessage).toBeVisible(), registerPage.submit()]));

      await test.step('Verify the redirect to the login page', () => loginPage.expectLoaded());
    },
  );
});
