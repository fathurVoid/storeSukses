import type { NewProductInput, Product } from '../types/product';
import { readStoredProducts, STORAGE_KEYS, writeStoredProducts } from '../utils/storage';

export function readLocalProducts(): Product[] {
  return readStoredProducts(STORAGE_KEYS.localProducts).filter((product) => product.source === 'local');
}

export function writeLocalProducts(products: Product[]): void {
  writeStoredProducts(
    STORAGE_KEYS.localProducts,
    products.filter((product) => product.source === 'local'),
  );
}

export function getLocalProductById(id: string): Product | null {
  return readLocalProducts().find((product) => product.id === id) ?? null;
}

export function createLocalProduct(input: NewProductInput): Product {
  const uniquePart = Math.random().toString(36).slice(2, 8);

  return {
    id: `local-${Date.now().toString(36)}-${uniquePart}`,
    source: 'local',
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    category: input.category.trim(),
    thumbnail: input.imageUrl?.trim() || undefined,
    brand: input.brand?.trim() || undefined,
    stock: input.stock,
    createdAt: new Date().toISOString(),
  };
}
