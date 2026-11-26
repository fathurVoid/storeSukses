import { Link } from 'react-router-dom';
import { ProductImage } from '../common/ProductImage';
import { RatingBadge } from '../common/RatingBadge';
import { SaveButton } from '../common/SaveButton';
import { SourceBadge } from '../common/SourceBadge';
import type { Product } from '../../types/product';
import { formatCategory, formatPrice, truncate } from '../../utils/format';

export function ProductCard({ product }: { product: Product }) {
  const detailUrl = `/products/${product.id}`;

  return (
    <article className="product-card">
      <Link to={detailUrl} className="product-card__media" aria-label={`Lihat ${product.title}`}>
        <ProductImage product={product} className="product-card__image" />
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="category-tag">{formatCategory(product.category)}</span>
          <SourceBadge source={product.source} />
        </div>

        <h3 className="product-card__title">
          <Link to={detailUrl}>{product.title}</Link>
        </h3>
        <p className="product-card__description">
          {truncate(product.description || 'Deskripsi tidak tersedia.')}
        </p>

        <div className="product-card__footer">
          <div className="product-card__pricing">
            <strong className="product-card__price">{formatPrice(product.price)}</strong>
            <RatingBadge rating={product.rating} />
          </div>
          <SaveButton product={product} compact />
        </div>
      </div>
    </article>
  );
}
