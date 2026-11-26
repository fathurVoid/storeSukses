import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/common/ErrorState';
import { Icon } from '../components/common/Icon';
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
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const { product, loading, error } = useProductDetail(productId);

  if (loading) {
    return (
      <div className="page">
        <LoadingState label="Memuat detail produk…" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page page--narrow">
        <ErrorState message={error ?? 'Produk tidak ditemukan.'} />
        <p className="back-row">
          <Link className="button button--ghost" to="/products">
            <Icon name="chevron-left" size={16} />
            Kembali ke katalog
          </Link>
        </p>
      </div>
    );
  }

  const facts = [
    { label: 'Kategori', value: formatCategory(product.category) },
    { label: 'Merek', value: product.brand ?? '—' },
    { label: 'Stok', value: typeof product.stock === 'number' ? String(product.stock) : '—' },
    { label: 'Ketersediaan', value: product.availabilityStatus ?? '—' },
    { label: 'SKU', value: product.sku ?? '—' },
    { label: 'ID Produk', value: product.id },
    ...(product.createdAt ? [{ label: 'Ditambahkan pada', value: formatDate(product.createdAt) }] : []),
  ];

  return (
    <div className="page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/products">Katalog</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-media glass-card">
          <ProductImage key={product.id} product={product} className="detail-image" />
        </div>

        <div className="detail-info glass-card">
          <div className="detail-badges">
            <span className="status-pill">
              <span className="status-dot" aria-hidden="true" />
              Detail produk
            </span>
            <span className="category-tag">{formatCategory(product.category)}</span>
            <SourceBadge source={product.source} />
          </div>

          <h1>{product.title}</h1>
          <p className="detail-rating">
            <RatingBadge rating={product.rating} /> <span>· rating pelanggan</span>
          </p>
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-description">
            {product.description || 'Produk ini tidak memiliki deskripsi.'}
          </p>

          <div className="detail-actions">
            <SaveButton product={product} />
            <Link className="button button--ghost" to="/products">
              <Icon name="chevron-left" size={16} />
              Kembali ke katalog
            </Link>
          </div>

          {product.source === 'local' && (
            <p className="detail-note">
              <strong>Produk lokal.</strong> Produk ini ditambahkan di perangkat ini, disimpan di
              localStorage, dan tidak pernah dikirim ke API eksternal.
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
