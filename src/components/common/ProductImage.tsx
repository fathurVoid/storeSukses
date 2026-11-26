import { useState } from 'react';
import type { Product } from '../../types/product';

interface ProductImageProps {
  product: Product;
  className?: string;
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

export function ProductImage({ product, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const source = product.images?.[0] ?? product.thumbnail;

  if (!source || failed) {
    return (
      <div className={`image-placeholder ${className}`} role="img" aria-label={product.title}>
        {getInitials(product.title)}
      </div>
    );
  }

  return (
    <img
      className={className}
      src={source}
      alt={product.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
