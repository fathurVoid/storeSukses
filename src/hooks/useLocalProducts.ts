import { useCallback, useEffect, useState } from 'react';
import {
  createLocalProduct,
  readLocalProducts,
  writeLocalProducts,
} from '../services/localProductService';
import type { NewProductInput, Product } from '../types/product';

/** Local-only products: persisted in localStorage, never sent to the external API. */
export function useLocalProducts() {
  const [products, setProducts] = useState<Product[]>(() => readLocalProducts());

  useEffect(() => {
    writeLocalProducts(products);
  }, [products]);

  const addProduct = useCallback((input: NewProductInput): Product => {
    const product = createLocalProduct(input);
    setProducts((current) => [product, ...current]);
    return product;
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  }, []);

  return { products, addProduct, removeProduct };
}
