/**
 * Credentials accepted by the login form.
 *
 * Shared by every credential source (the demo account from `.env` and users registered during a
 * test), so the login flow is written once and reused for all of them.
 */
export interface UserCredentials {
  readonly username: string;
  readonly password: string;
}

/**
 * Data required by the registration form.
 *
 * Extends {@link UserCredentials} because a registered user is later used to log in; the form's
 * "Confirm Password" field reuses `password`.
 */
export interface NewUser extends UserCredentials {
  readonly email: string;
}
