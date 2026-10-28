import type { UserCredentials } from '../types/user';
import { step } from '../utils/step';
import { BasePage } from './BasePage';

/** Page object for `login.html`, the entry point of the application. */
export class LoginPage extends BasePage {
  protected readonly path = 'login.html';

  readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  // getByLabel('Password') would also match the "Toggle password visibility" button.
  readonly passwordInput = this.page.getByRole('textbox', { name: 'Password' });
  readonly signInButton = this.page.getByRole('button', { name: 'Sign In' });
  readonly registerLink = this.page.getByRole('link', { name: 'Register here' });
  /** Alert shown for unknown users and wrong passwords; it has no ARIA role, so it is found by text. */
  readonly invalidCredentialsError = this.page.getByText('Invalid username or password', {
    exact: true,
  });

  protected readonly landmark = this.signInButton;

  /** Opens the login page. */
  @step('Open the login page')
  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  /**
   * Fills in the login form without submitting it. Empty values are typed as-is, so the same
   * action also drives the field-validation cases.
   *
   * @param credentials - Username and password to type.
   */
  @step('Fill in the login form')
  async fillForm({ username, password }: UserCredentials): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Submits the login form. Kept separate from {@link LoginPage.fillForm} so a spec can start
   * watching for short-lived feedback right before the click.
   */
  @step('Submit the login form')
  async submit(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Fills in and submits the login form.
   *
   * @param credentials - Username and password to submit.
   */
  async login(credentials: UserCredentials): Promise<void> {
    await this.fillForm(credentials);
    await this.submit();
  }

  /** Follows the "Register here" link to the registration page. */
  @step('Follow the "Register here" link')
  async openRegistration(): Promise<void> {
    await this.registerLink.click();
  }
}
