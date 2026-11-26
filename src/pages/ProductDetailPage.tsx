import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { ProductImage } from '../components/common/ProductImage';
import { RatingBadge } from '../components/common/RatingBadge';
import { SaveButton } from '../components/common/SaveButton';
import { SourceBadge } from '../components/common/SourceBadge';
import { useProductDetail } from '../hooks/useProductDetail';
import { formatCategory, formatPrice } from '../utils/format';

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const { product, loading, error } = useProductDetail(productId);

  if (loading) {
    return (
      <div className="page">
        <LoadingState label="Loading product details…" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page page--narrow">
        <ErrorState message={error ?? 'Product not found.'} />
        <p className="back-row">
          <Link className="button button--ghost" to="/products">
            ← Back to catalog
          </Link>
        </p>
      </div>
    );
  }

  const facts = [
    { label: 'Category', value: formatCategory(product.category) },
    { label: 'Brand', value: product.brand ?? '—' },
    { label: 'Stock', value: typeof product.stock === 'number' ? String(product.stock) : '—' },
    { label: 'Availability', value: product.availabilityStatus ?? '—' },
    { label: 'SKU', value: product.sku ?? '—' },
    { label: 'Product ID', value: product.id },
    ...(product.createdAt ? [{ label: 'Added on', value: formatDate(product.createdAt) }] : []),
  ];

  return (
    <div className="page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/products">Catalog</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-media">
          <ProductImage key={product.id} product={product} className="detail-image" />
        </div>

        <div className="detail-info">
          <div className="detail-badges">
            <span className="category-tag">{formatCategory(product.category)}</span>
            <SourceBadge source={product.source} />
          </div>

          <h1>{product.title}</h1>
          <p className="detail-rating">
            <RatingBadge rating={product.rating} /> <span>· customer rating</span>
          </p>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">
            {product.description || 'No description was provided for this product.'}
          </p>

          <div className="detail-actions">
            <SaveButton product={product} />
            <Link className="button button--ghost" to="/products">
              ← Back to catalog
            </Link>
          </div>

          {product.source === 'local' && (
            <p className="detail-note">
              This product was added on this device. It is stored in localStorage and was never sent
              to the external API.
            </p>
          )}

          <dl className="detail-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
