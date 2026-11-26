import { useEffect, useState } from 'react';
import { useNavigationType, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { CategoryFilter } from '../components/products/CategoryFilter';
import { LocalProductsSection } from '../components/products/LocalProductsSection';
import { Pagination } from '../components/products/Pagination';
import { ProductGrid } from '../components/products/ProductGrid';
import { SearchBar } from '../components/products/SearchBar';
import { SortControls } from '../components/products/SortControls';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { useProducts } from '../hooks/useProducts';
import type { ProductQuery, SortBy, SortOrder } from '../types/product';

const DEFAULT_LIMIT = 12;

function parseQuery(params: URLSearchParams): ProductQuery {
  const page = Number(params.get('page'));
  const limit = Number(params.get('limit'));
  const sortBy = params.get('sortBy');
  const order = params.get('order');

  return {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sortBy: sortBy === 'price' || sortBy === 'title' ? sortBy : '',
    order: order === 'desc' ? 'desc' : 'asc',
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 && limit <= 100 ? limit : DEFAULT_LIMIT,
  };
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationType = useNavigationType();
  const query = parseQuery(searchParams);

  const [searchInput, setSearchInput] = useState(query.q);
  const debouncedSearch = useDebounce(searchInput.trim(), 350);

  const { categories } = useCategories();
  const { products, total, loading, error, refetch } = useProducts(query);
  const totalPages = Math.max(1, Math.ceil(total / query.limit));

  // Typing writes the debounced keyword into the URL and resets pagination.
  useEffect(() => {
    if (debouncedSearch === query.q) return;

    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (debouncedSearch) next.set('q', debouncedSearch);
        else next.delete('q');
        next.delete('page');
        return next;
      },
      { replace: true },
    );
    // `query.q` is intentionally omitted: external navigation is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, setSearchParams]);

  // Back/forward navigation should restore the search box as well.
  useEffect(() => {
    if (navigationType === 'POP') setSearchInput(query.q);
  }, [navigationType, query.q]);

  // Keep an out-of-range page (e.g. a shared URL) inside the available range.
  useEffect(() => {
    if (loading || query.page <= totalPages) return;

    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.set('page', String(totalPages));
        return next;
      },
      { replace: true },
    );
  }, [loading, query.page, totalPages, setSearchParams]);

  function updateParams(change: (next: URLSearchParams) => void) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      change(next);
      next.delete('page');
      return next;
    });
  }

  function handleCategory(value: string) {
    updateParams((next) => {
      if (value) next.set('category', value);
      else next.delete('category');
    });
  }

  function handleSort(sortBy: SortBy, order: SortOrder) {
    updateParams((next) => {
      if (sortBy) {
        next.set('sortBy', sortBy);
        next.set('order', order);
      } else {
        next.delete('sortBy');
        next.delete('order');
      }
    });
  }

  function handlePage(page: number) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      if (page <= 1) next.delete('page');
      else next.set('page', String(page));
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleClearAll() {
    setSearchInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Pertemuan 8 · React Catalog</p>
        <h1>Explore the product catalog</h1>
        <p>
          Search, filter, sort and save products. External items come from DummyJSON; anything you
          add yourself stays on this device.
        </p>
      </section>

      <section className="controls-panel" aria-label="Catalog controls">
        <SearchBar value={searchInput} onChange={setSearchInput} />

        <div className="controls-panel__row">
          <CategoryFilter
            categories={categories}
            value={query.category}
            onChange={handleCategory}
          />
          <SortControls sortBy={query.sortBy} order={query.order} onChange={handleSort} />
          <div className="filter-field">
            <label htmlFor="page-size">Per page</label>
            <select
              id="page-size"
              value={query.limit}
              onChange={(event) =>
                updateParams((next) => next.set('limit', event.target.value))
              }
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={30}>30</option>
            </select>
          </div>
          <button type="button" className="button button--ghost" onClick={handleClearAll}>
            Reset
          </button>
        </div>
      </section>

      <div className="results-heading">
        <h2>Products</h2>
        {!loading && !error && <span className="results-count">{total} results</span>}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          message="Try a different keyword or category, or reset the filters."
          action={
            <button type="button" className="button button--ghost" onClick={handleClearAll}>
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination
            page={query.page}
            totalPages={totalPages}
            total={total}
            limit={query.limit}
            onPageChange={handlePage}
          />
        </>
      )}

      <LocalProductsSection />
    </div>
  );
}
