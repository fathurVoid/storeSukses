import type { Product } from '../types/product';
import { isProductArray } from './validation';

export const STORAGE_KEYS = {
  savedProducts: 'storeSukses:savedProducts:v1',
  localProducts: 'storeSukses:localProducts:v1',
} as const;

export function readStoredProducts(key: string): Product[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return isProductArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredProducts(key: string, products: Product[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(products));
  } catch {
    // Storage can be unavailable (private mode / quota). The app stays usable in memory.
  }
}
