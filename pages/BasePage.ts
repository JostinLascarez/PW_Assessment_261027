import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Base class for page objects.
 *
 * Every page declares its URL and a landmark element, so "the browser shows this page" is
 * verified the same way everywhere: after registering, after a rejected login and after a
 * successful one.
 */
export abstract class BasePage {
  /** Path relative to `baseURL`, e.g. `login.html`. */
  protected abstract readonly path: string;

  /** Element that only this page renders. */
  protected abstract readonly landmark: Locator;

  /** @param page - Playwright page driven by this page object. */
  constructor(protected readonly page: Page) {}

  /**
   * Asserts that the browser shows this page (URL and landmark).
   *
   * Web-first assertions retry until the expect timeout, so this also waits out the application's
   * delayed redirects without any hard wait.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.path);
    await expect(this.landmark).toBeVisible();
  }
}
