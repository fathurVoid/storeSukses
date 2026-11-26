import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '../types/product';
import { readStoredProducts, STORAGE_KEYS, writeStoredProducts } from '../utils/storage';

interface SavedProductsContextValue {
  savedProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  clearSavedProducts: () => void;
  isSaved: (id: string) => boolean;
}

const SavedProductsContext = createContext<SavedProductsContextValue | null>(null);

export function SavedProductsProvider({ children }: { children: ReactNode }) {
  const [savedProducts, setSavedProducts] = useState<Product[]>(() =>
    readStoredProducts(STORAGE_KEYS.savedProducts),
  );

  useEffect(() => {
    writeStoredProducts(STORAGE_KEYS.savedProducts, savedProducts);
  }, [savedProducts]);

  const addProduct = useCallback((product: Product) => {
    setSavedProducts((current) =>
      current.some((item) => item.id === product.id) ? current : [product, ...current],
    );
  }, []);

  const removeProduct = useCallback((id: string) => {
    setSavedProducts((current) => current.filter((product) => product.id !== id));
  }, []);

  const clearSavedProducts = useCallback(() => setSavedProducts([]), []);

  const isSaved = useCallback(
    (id: string) => savedProducts.some((product) => product.id === id),
    [savedProducts],
  );

  const value = useMemo(
    () => ({ savedProducts, addProduct, removeProduct, clearSavedProducts, isSaved }),
    [savedProducts, addProduct, removeProduct, clearSavedProducts, isSaved],
  );

  return (
    <SavedProductsContext.Provider value={value}>{children}</SavedProductsContext.Provider>
  );
}

export function useSavedProducts(): SavedProductsContextValue {
  const context = useContext(SavedProductsContext);
  if (!context) throw new Error('useSavedProducts must be used inside SavedProductsProvider.');
  return context;
}
