import { useEffect, useState } from 'react';
import { getLocalProductById } from '../services/localProductService';
import { getProductDetail } from '../services/productService';
import { toErrorMessage } from '../services/errors';
import type { Product } from '../types/product';

export interface UseProductDetailResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

/** Resolves API IDs and locally created IDs behind the same dynamic route. */
export function useProductDetail(productId: string | undefined): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setProduct(null);

    if (!productId) {
      setError('Invalid product ID.');
      setLoading(false);
      return () => controller.abort();
    }

    const localProduct = getLocalProductById(productId);
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
      return () => controller.abort();
    }

    if (productId.startsWith('local-')) {
      setError('This locally added product is no longer available on this device.');
      setLoading(false);
      return () => controller.abort();
    }

    getProductDetail(productId, controller.signal)
      .then((result) => {
        setProduct(result);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setError(toErrorMessage(requestError));
        setLoading(false);
      });

    return () => controller.abort();
  }, [productId]);

  return { product, loading, error };
}
