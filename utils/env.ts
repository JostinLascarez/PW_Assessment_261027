import { config } from 'dotenv';
import type { UserCredentials } from '../types/user';

// Load `.env` when it exists. Variables already defined (e.g. by CI) take precedence over it.
config({ quiet: true });

/** Typed view of the environment variables used by the suite. */
export interface Environment {
  /** Root URL of the application; always ends with "/" so relative page paths resolve under it. */
  readonly baseUrl: string;
  /** Whether the suite runs on a CI server (GitHub Actions and most providers set `CI`). */
  readonly isCI: boolean;
  /** Account seeded by the application. */
  readonly demoUser: UserCredentials;
  /** Inputs used to build a unique user for every registration. */
  readonly registration: {
    /** Username prefix; a random suffix is appended per user. */
    readonly usernamePrefix: string;
    /** Domain of the generated e-mail addresses. */
    readonly emailDomain: string;
    /** Password given to every registered user. */
    readonly password: string;
  };
}

/**
 * Returns a required variable, trimmed so stray whitespace from copy-pasted values cannot cause
 * confusing failures.
 *
 * @param name - Variable name.
 * @returns The non-empty value.
 * @throws Error naming the missing variable (never its value), so the run fails at startup
 *   instead of in the middle of a test.
 */
function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Create .env from .env.example locally, or define it in the CI settings.',
    );
  }
  return value;
}

const baseUrl = required('BASE_URL');

/**
 * Environment configuration, loaded and validated once on first import.
 *
 * This module is the only reader of `process.env`: everything else depends on this typed object,
 * so configuration lives in one place and switching environments only means changing `.env`.
 */
export const env: Environment = {
  baseUrl: baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
  isCI: Boolean(process.env.CI),
  demoUser: { username: required('DEMO_USERNAME'), password: required('DEMO_PASSWORD') },
  registration: {
    usernamePrefix: required('REGISTER_USERNAME_PREFIX'),
    emailDomain: required('REGISTER_EMAIL_DOMAIN'),
    password: required('REGISTER_PASSWORD'),
  },
};
