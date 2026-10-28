/**
 * Scenario C - Product management (CRUD flow).
 *
 * PDF Part IV, with a logged-in user as precondition (`loggedInDashboard` fixture): create
 * "Automation Laptop <id>" (price 1500, Electronics, in stock), filter the list by Electronics and
 * delete the product. Each phase depends on the previous one, so they form a single test with one
 * step per phase, and every check is scoped to the created product's card.
 */
import { expect, test } from '../fixtures';
import type { Product } from '../types/product';
import { uniqueId } from '../utils/test-data';

test.describe('Scenario C: Product management', { tag: '@regression' }, () => {
  test(
    'creates, filters and deletes a product',
    { tag: '@smoke' },
    async ({ loggedInDashboard: dashboard }, testInfo) => {
      const id = uniqueId();
      const product: Product = {
        name: `Automation Laptop ${id}`,
        sku: `AL-${id}`,
        price: 1500,
        category: 'Electronics',
        inStock: true,
      };
      testInfo.annotations.push(
        { type: 'product', description: product.name },
        { type: 'sku', description: product.sku },
      );
      const card = dashboard.productCard(product.name);

      await test.step(`Create product "${product.name}"`, async () => {
        await dashboard.addProduct(product);
        await expect(card).toBeVisible();
        // Values as the list renders them: en-US currency format and a stock label.
        await expect(card).toContainText('$1,500.00');
        await expect(card).toContainText(product.category);
        await expect(card).toContainText('In Stock');
      });

      await test.step(`Filter the list by category "${product.category}"`, async () => {
        await dashboard.filterByCategory(product.category);
        await expect(card).toBeVisible();
        await expect(dashboard.productCardsNotInCategory(product.category)).toHaveCount(0);
      });

      await test.step(`Delete product "${product.name}"`, async () => {
        await dashboard.deleteProduct(product.name);
        await expect(card).toHaveCount(0);
      });
    },
  );
});
