/** Categories offered by both the product form and the category filter. */
export type ProductCategory = 'Electronics' | 'Books' | 'Clothing' | 'Home' | 'Other';

/**
 * Values entered in the "Add Product" form.
 *
 * `sku` is mandatory in the application even though the assessment does not mention it; tests
 * generate a unique one because the application rejects duplicate SKUs.
 */
export interface Product {
  readonly name: string;
  readonly sku: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly inStock: boolean;
}
