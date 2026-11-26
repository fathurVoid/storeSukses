import type { Product, ProductFormErrors, ProductFormValues } from '../types/product';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Guards against corrupt or outdated localStorage content. */
export function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    (value.source === 'api' || value.source === 'local') &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    typeof value.category === 'string' &&
    value.category.length > 0
  );
}

export function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

function isValidOptionalUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const title = values.title.trim();
  const category = values.category.trim();
  const description = values.description.trim();
  const price = Number(values.price);

  if (!title) errors.title = 'Title is required.';
  else if (title.length < 3) errors.title = 'Use at least 3 characters.';
  else if (title.length > 80) errors.title = 'Use at most 80 characters.';

  if (!values.price.trim()) errors.price = 'Price is required.';
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'Enter a price greater than 0.';
  else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim()))
    errors.price = 'Use at most 2 decimal places.';

  if (!category) errors.category = 'Category is required.';
  else if (category.length > 40) errors.category = 'Use at most 40 characters.';

  if (!description) errors.description = 'Description is required.';
  else if (description.length < 10) errors.description = 'Use at least 10 characters.';
  else if (description.length > 500) errors.description = 'Use at most 500 characters.';

  if (!isValidOptionalUrl(values.imageUrl.trim()))
    errors.imageUrl = 'Enter a valid http(s) image URL.';
  if (values.brand.trim().length > 40) errors.brand = 'Use at most 40 characters.';

  if (values.stock.trim()) {
    const stock = Number(values.stock);
    if (!Number.isInteger(stock) || stock < 0)
      errors.stock = 'Enter a whole number of 0 or more.';
  }

  return errors;
}
