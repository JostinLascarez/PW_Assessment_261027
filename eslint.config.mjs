// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

/**
 * Lint rules that matter for UI tests:
 * - type-aware typescript-eslint rules (`no-floating-promises` reports any un-awaited async call,
 *   including page-object methods);
 * - eslint-plugin-playwright on specs (missing awaits on expect/steps, hard waits, focused or
 *   skipped tests, assertion-less tests).
 * Formatting is left to Prettier.
 */
export default defineConfig(
  { ignores: ['playwright-report/', 'test-results/', 'blob-report/'] },
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: { parserOptions: { projectService: true } },
  },
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
  },
);
