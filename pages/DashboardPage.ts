import { BasePage } from './BasePage';

/** Page object for `index.html`, the product dashboard reached after logging in. */
export class DashboardPage extends BasePage {
  protected readonly path = 'index.html';

  /** Greeting in the header ("Welcome, <username>!"); it has no ARIA role, so it is found by text. */
  readonly welcomeMessage = this.page.getByRole('banner').getByText('Welcome');
  readonly productList = this.page.getByRole('region', { name: 'Product list' });

  protected readonly landmark = this.productList;
}
