import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * Each test runs in its own browser context (fresh storage), so the suite is fully parallel and
 * runs on the three engines. Failures keep a screenshot, a trace and a video, all linked from the
 * HTML report, so they can be diagnosed without re-running anything.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never', title: 'Product Manager App - E2E Test Report' }]],
  expect: { timeout: 10_000 },
  use: {
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
