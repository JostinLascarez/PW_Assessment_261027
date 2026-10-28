import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

/** Page objects and preconditions injected into the specs. */
export interface Fixtures {
  /** Login page object bound to the test's page. */
  loginPage: LoginPage;
  /** Registration page object bound to the test's page. */
  registerPage: RegisterPage;
}

/**
 * Playwright `test` extended with the suite's fixtures.
 *
 * Specs import `test` and `expect` from here, so page objects are injected instead of being
 * created in every test, and each fixture is only set up when a test asks for it.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from '@playwright/test';
