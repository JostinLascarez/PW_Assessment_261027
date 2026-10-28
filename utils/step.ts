import { test } from '@playwright/test';

/**
 * Method decorator that reports a page-object action as a named step in the HTML report.
 *
 * Every action becomes a readable step without wrapping each call by hand, and `box: true` makes
 * a failure point at the spec line that called the action instead of the page-object internals.
 * Titles are static on purpose so they can never leak test data such as passwords.
 *
 * @param title - Step title shown in the report.
 * @returns A standard (TC39) decorator for async methods.
 */
export function step(title: string) {
  return function <This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
  ) {
    return function (this: This, ...args: Args): Promise<Return> {
      return test.step(title, () => target.apply(this, args), { box: true });
    };
  };
}
