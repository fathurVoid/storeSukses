import { useCallback, useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { toErrorMessage } from '../services/errors';
import type { Product, ProductQuery } from '../types/product';

export interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Server state: fetching, loading/error handling and re-request on parameter change. */
export function useProducts(query: ProductQuery): UseProductsResult {
  const { q, category, sortBy, order, page, limit } = query;
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getProducts({ q, category, sortBy, order, page, limit }, controller.signal)
      .then((result) => {
        setProducts(result.products);
        setTotal(result.total);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setProducts([]);
        setTotal(0);
        setError(toErrorMessage(requestError));
        setLoading(false);
      });

    return () => controller.abort();
  }, [q, category, sortBy, order, page, limit, reloadToken]);

  return { products, total, loading, error, refetch };
}
