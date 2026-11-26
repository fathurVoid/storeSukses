import { useEffect, useState } from 'react';
import { getCategories } from '../services/productService';
import { toErrorMessage } from '../services/errors';
import type { Category } from '../types/product';

let cachedCategories: Category[] | null = null;

/** Categories are static enough to reuse within the current browser session. */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(cachedCategories ?? []);
  const [loading, setLoading] = useState(cachedCategories === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedCategories) {
      setCategories(cachedCategories);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    getCategories(controller.signal)
      .then((result) => {
        cachedCategories = result;
        setCategories(result);
        setLoading(false);
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return;
        setError(toErrorMessage(requestError));
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}
