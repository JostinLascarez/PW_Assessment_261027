import type { Locator } from '@playwright/test';
import type { Product, ProductCategory } from '../types/product';
import { step } from '../utils/step';
import { BasePage } from './BasePage';

/** Page object for `index.html`, the product dashboard reached after logging in. */
export class DashboardPage extends BasePage {
  protected readonly path = 'index.html';

  /** Greeting in the header ("Welcome, <username>!"); it has no ARIA role, so it is found by text. */
  readonly welcomeMessage = this.page.getByRole('banner').getByText('Welcome');
  readonly categoryFilter = this.page.getByRole('combobox', { name: 'Filter by category' });

  readonly productForm = this.page.getByRole('region', { name: 'Add Product' });
  readonly nameInput = this.productForm.getByRole('textbox', { name: 'Name' });
  readonly skuInput = this.productForm.getByRole('textbox', { name: 'SKU' });
  readonly priceInput = this.productForm.getByRole('spinbutton', { name: 'Price' });
  readonly categorySelect = this.productForm.getByRole('combobox', { name: 'Category' });
  // The switch's <label> is empty, so the checkbox has no accessible name; it is the form's only one.
  readonly inStockCheckbox = this.productForm.getByRole('checkbox');
  readonly saveButton = this.productForm.getByRole('button', { name: 'Save' });

  readonly productList = this.page.getByRole('region', { name: 'Product list' });
  // Cards have no role or test id, so their class is the only stable hook for a whole card.
  readonly productCards = this.productList.locator('.product-card');
  readonly deleteDialog = this.page.getByRole('dialog', { name: 'Delete Product' });

  protected readonly landmark = this.productList;

  /**
   * Locates the card (the product list's "row") of a product.
   *
   * @param name - Exact product name; matching the card heading keeps every lookup scoped to a
   *   single product.
   * @returns Locator of that product's card.
   */
  productCard(name: string): Locator {
    return this.productCards.filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  /**
   * Locates the cards whose category label is not `category`, to prove a filter left only
   * products of that category.
   *
   * @param category - Category every visible card should belong to.
   * @returns Locator of the non-matching cards.
   */
  productCardsNotInCategory(category: ProductCategory): Locator {
    return this.productCards.filter({ hasNot: this.page.getByText(category, { exact: true }) });
  }

  /**
   * Fills in and saves the "Add Product" form.
   *
   * @param product - Values to enter.
   */
  @step('Fill in and save the "Add Product" form')
  async addProduct({ name, sku, price, category, inStock }: Product): Promise<void> {
    await this.nameInput.fill(name);
    await this.skuInput.fill(sku);
    await this.priceInput.fill(String(price));
    await this.categorySelect.selectOption(category);
    // The native checkbox is invisible (opacity 0) under a custom switch that intercepts clicks;
    // forcing the click lands it on the switch, which toggles this same input.
    await this.inStockCheckbox.setChecked(inStock, { force: true });
    await this.saveButton.click();
  }

  /**
   * Selects a category in the "Filter by category" dropdown.
   *
   * @param category - Category to keep in the list.
   */
  @step('Filter the product list by category')
  async filterByCategory(category: ProductCategory): Promise<void> {
    await this.categoryFilter.selectOption(category);
  }

  /**
   * Deletes a product through its card's Delete button and the confirmation dialog.
   *
   * @param name - Exact name of the product to delete.
   */
  @step('Delete the product and confirm the dialog')
  async deleteProduct(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Delete' }).click();
    // Only a dialog naming this product is confirmed, so another product can never be deleted.
    await this.deleteDialog
      .filter({ hasText: `Are you sure you want to delete "${name}"?` })
      .getByRole('button', { name: 'Delete' })
      .click();
  }
}
