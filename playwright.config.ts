import { defineConfig, devices } from '@playwright/test';
import { env } from './utils/env';

/**
 * Playwright configuration.
 *
 * Each test runs in its own browser context (fresh storage), so the suite is fully parallel and
 * runs on the three engines. Failures keep a screenshot, a trace and a video, all linked from the
 * HTML report, so they can be diagnosed without re-running anything. On CI a committed `test.only`
 * fails the run, and retries absorb infrastructure hiccups while still flagging flaky tests.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', title: 'Product Manager App - E2E Test Report' }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: env.baseUrl,
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
