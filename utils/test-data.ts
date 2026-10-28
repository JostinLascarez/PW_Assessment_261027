import { randomBytes } from 'node:crypto';
import type { NewUser } from '../types/user';
import { env } from './env';

/**
 * Returns 8 random hexadecimal characters.
 *
 * Unique data lets the suite run repeatedly and in parallel without collisions; `node:crypto`
 * provides the randomness without an extra dependency.
 *
 * @returns A random suffix such as `3f9a1c2b`.
 */
export function uniqueId(): string {
  return randomBytes(4).toString('hex');
}

/**
 * Builds a user that does not exist yet.
 *
 * The username is the configured prefix plus a unique suffix, the e-mail is derived from it and
 * the password comes from the environment, which covers both registration requirements:
 * credentials taken from environment variables and randomized data for repeated execution.
 *
 * @returns A new user ready to be registered.
 */
export function createUser(): NewUser {
  const { usernamePrefix, emailDomain, password } = env.registration;
  const username = `${usernamePrefix}${uniqueId()}`;
  return { username, email: `${username}@${emailDomain}`, password };
}
