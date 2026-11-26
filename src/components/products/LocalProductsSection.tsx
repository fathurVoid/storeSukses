import { Link } from 'react-router-dom';
import { EmptyState } from '../common/EmptyState';
import { useLocalProducts } from '../../hooks/useLocalProducts';
import { ProductCard } from './ProductCard';

export function LocalProductsSection() {
  const { products, removeProduct } = useLocalProducts();

  return (
    <section className="local-section" aria-labelledby="local-products-heading">
      <div className="section-heading">
        <div>
          <p className="eyebrow">On this device</p>
          <h2 id="local-products-heading">Your local products</h2>
          <p className="section-heading__description">
            Added through the form and stored in localStorage. They are never sent to DummyJSON.
          </p>
        </div>
        <Link className="button button--primary" to="/products/new">
          Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No local products yet"
          message="Use the form to add a product and it will appear here, clearly marked as Local."
          action={
            <Link className="button button--ghost" to="/products/new">
              Create one
            </Link>
          }
        />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card-wrapper" key={product.id}>
              <ProductCard product={product} />
              <button
                type="button"
                className="remove-local-button"
                onClick={() => removeProduct(product.id)}
                aria-label={`Delete local product ${product.title}`}
              >
                Delete local product
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
