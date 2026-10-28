import type { NewUser } from '../types/user';
import { step } from '../utils/step';
import { BasePage } from './BasePage';

/** Page object for `register.html`. */
export class RegisterPage extends BasePage {
  protected readonly path = 'register.html';

  readonly usernameInput = this.page.getByRole('textbox', { name: 'Username' });
  readonly emailInput = this.page.getByRole('textbox', { name: 'Email' });
  // Anchored so it does not also match "Confirm Password".
  readonly passwordInput = this.page.getByRole('textbox', { name: /^Password/ });
  readonly confirmPasswordInput = this.page.getByRole('textbox', { name: 'Confirm Password' });
  readonly registerButton = this.page.getByRole('button', { name: 'Register' });
  /**
   * Confirmation shown for about two seconds before the redirect to the login page; it has no ARIA
   * role, so it is found by text.
   */
  readonly successMessage = this.page.getByText(
    'Registration successful! Redirecting to login...',
    { exact: true },
  );

  protected readonly landmark = this.page.getByRole('heading', { name: 'Create Account' });

  /**
   * Fills in the registration form without submitting it.
   *
   * @param user - User to register; its password is typed in both password fields.
   */
  @step('Fill in the registration form')
  async fillForm({ username, email, password }: NewUser): Promise<void> {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Submits the registration form. Kept separate from {@link RegisterPage.fillForm} so a spec can
   * start watching for the short-lived success message right before the click.
   */
  @step('Submit the registration form')
  async submit(): Promise<void> {
    await this.registerButton.click();
  }

  /**
   * Fills in and submits the registration form.
   *
   * @param user - User to register.
   */
  async register(user: NewUser): Promise<void> {
    await this.fillForm(user);
    await this.submit();
  }
}
