import type { Product, SortBy, SortOrder } from '../types/product';

/** Used only for the API endpoint that cannot combine search + category. */
export function sortProducts(products: Product[], sortBy: SortBy, order: SortOrder): Product[] {
  if (!sortBy) return products;

  const direction = order === 'desc' ? -1 : 1;

  if (sortBy === 'price') {
    return [...products].sort((a, b) => direction * (a.price - b.price));
  }

  return [...products].sort((a, b) => direction * a.title.localeCompare(b.title));
}
