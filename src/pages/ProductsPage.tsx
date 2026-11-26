import { useEffect, useState } from 'react';
import { Link, useNavigationType, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Icon } from '../components/common/Icon';
import { LoadingState } from '../components/common/LoadingState';
import { PageHeader } from '../components/layout/PageHeader';
import { CategoryFilter } from '../components/products/CategoryFilter';
import { LocalProductsSection } from '../components/products/LocalProductsSection';
import { Pagination } from '../components/products/Pagination';
import { ProductGrid } from '../components/products/ProductGrid';
import { SearchBar } from '../components/products/SearchBar';
import { SortControls } from '../components/products/SortControls';
import { StatCards } from '../components/products/StatCards';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalProducts } from '../hooks/useLocalProducts';
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
  const { savedProducts } = useSavedProducts();
  const { products: localProducts, removeProduct: removeLocalProduct } = useLocalProducts();
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
      <PageHeader
        badge="Katalog Produk"
        title="Jelajahi katalog produk"
        description="Cari, filter, urutkan, dan simpan produk. Data eksternal berasal dari DummyJSON, sedangkan produk yang Anda tambahkan tetap tersimpan di perangkat ini."
        action={
          <Link className="button button--primary" to="/products/new">
            <Icon name="plus" size={16} />
            Tambah produk
          </Link>
        }
      />

      <StatCards
        total={total}
        categories={categories.length}
        saved={savedProducts.length}
        local={localProducts.length}
      />

      <section className="controls-panel glass-card" aria-label="Kontrol katalog">
        <div className="controls-panel__head">
          <Icon name="filter" size={18} />
          Filter &amp; pencarian
        </div>

        <SearchBar value={searchInput} onChange={setSearchInput} />

        <div className="controls-panel__row">
          <CategoryFilter
            categories={categories}
            value={query.category}
            onChange={handleCategory}
          />
          <SortControls sortBy={query.sortBy} order={query.order} onChange={handleSort} />
          <div className="filter-field">
            <label htmlFor="page-size">Per halaman</label>
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
            <Icon name="close" size={15} />
            Atur ulang
          </button>
        </div>
      </section>

      <div className="results-heading">
        <h2>Produk</h2>
        {!loading && !error && <span className="results-count">{total} hasil</span>}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : products.length === 0 ? (
        <EmptyState
          title="Produk tidak ditemukan"
          message="Coba kata kunci atau kategori lain, atau atur ulang filter yang digunakan."
          icon="search"
          action={
            <button type="button" className="button button--ghost" onClick={handleClearAll}>
              Hapus filter
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

      <LocalProductsSection products={localProducts} onRemove={removeLocalProduct} />
    </div>
  );
}
