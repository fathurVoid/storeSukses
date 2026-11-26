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

  if (!title) errors.title = 'Nama produk wajib diisi.';
  else if (title.length < 3) errors.title = 'Gunakan minimal 3 karakter.';
  else if (title.length > 80) errors.title = 'Gunakan maksimal 80 karakter.';

  if (!values.price.trim()) errors.price = 'Harga wajib diisi.';
  else if (!Number.isFinite(price) || price <= 0) errors.price = 'Masukkan harga lebih besar dari 0.';
  else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim()))
    errors.price = 'Gunakan maksimal 2 angka desimal.';

  if (!category) errors.category = 'Kategori wajib diisi.';
  else if (category.length > 40) errors.category = 'Gunakan maksimal 40 karakter.';

  if (!description) errors.description = 'Deskripsi wajib diisi.';
  else if (description.length < 10) errors.description = 'Gunakan minimal 10 karakter.';
  else if (description.length > 500) errors.description = 'Gunakan maksimal 500 karakter.';

  if (!isValidOptionalUrl(values.imageUrl.trim()))
    errors.imageUrl = 'Masukkan URL gambar http(s) yang valid.';
  if (values.brand.trim().length > 40) errors.brand = 'Gunakan maksimal 40 karakter.';

  if (values.stock.trim()) {
    const stock = Number(values.stock);
    if (!Number.isInteger(stock) || stock < 0)
      errors.stock = 'Masukkan bilangan bulat 0 atau lebih.';
  }

  return errors;
}
