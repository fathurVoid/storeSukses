import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { ProductGrid } from '../components/products/ProductGrid';
import { useSavedProducts } from '../context/SavedProductsContext';

export function SavedProductsPage() {
  const { savedProducts, clearSavedProducts } = useSavedProducts();

  function handleClear() {
    if (window.confirm('Remove all saved products?')) clearSavedProducts();
  }

  return (
    <div className="page">
      <section className="page-heading">
        <p className="eyebrow">Your collection</p>
        <h1>Saved products</h1>
        <p>Favorites are stored in localStorage, so they survive a browser refresh.</p>
      </section>

      {savedProducts.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          message="Open any product and use the Save button to build your collection."
          action={
            <Link className="button button--primary" to="/products">
              Browse products
            </Link>
          }
        />
      ) : (
        <>
          <div className="results-heading">
            <h2>
              {savedProducts.length} saved {savedProducts.length === 1 ? 'product' : 'products'}
            </h2>
            <button type="button" className="button button--ghost" onClick={handleClear}>
              Clear all
            </button>
          </div>
          <ProductGrid products={savedProducts} />
          <p className="saved-hint">
            Use the heart button on a card to remove it from your saved list.
          </p>
        </>
      )}
    </div>
  );
}
