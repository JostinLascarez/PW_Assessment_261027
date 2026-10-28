import { test as base } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import type { NewUser } from '../types/user';
import { env } from '../utils/env';
import { createUser } from '../utils/test-data';

/** Page objects and preconditions injected into the specs. */
export interface Fixtures {
  /** Login page object bound to the test's page. */
  loginPage: LoginPage;
  /** Registration page object bound to the test's page. */
  registerPage: RegisterPage;
  /** Dashboard page object bound to the test's page. */
  dashboardPage: DashboardPage;
  /**
   * Registers a brand-new user through the UI in the test's own browser context and returns it,
   * leaving the browser on the login page.
   *
   * The application stores users in the browser's localStorage and every test gets a fresh
   * context, so a user registered by another test does not exist here. It is a factory rather
   * than a ready-made user so data-driven tests only register when a case needs it.
   */
  registerUser: () => Promise<NewUser>;
  /**
   * Dashboard of the demo account, logged in through the UI (precondition of Scenario C).
   *
   * A UI login is used instead of a saved `storageState`: part of the session lives in
   * sessionStorage, which `storageState` does not persist, and the test stays independent of the
   * application's internal storage keys.
   */
  loggedInDashboard: DashboardPage;
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
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  registerUser: async ({ loginPage, registerPage }, use) => {
    await use(() =>
      base.step('Register a new user through the UI', async () => {
        const user = createUser();
        await loginPage.goto();
        await loginPage.openRegistration();
        await registerPage.register(user);
        await loginPage.expectLoaded();
        return user;
      }),
    );
  },
  loggedInDashboard: async ({ loginPage, dashboardPage }, use) => {
    await loginPage.goto();
    await loginPage.login(env.demoUser);
    await dashboardPage.expectLoaded();
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
