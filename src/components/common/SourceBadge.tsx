import type { ProductSource } from '../../types/product';

export function SourceBadge({ source }: { source: ProductSource }) {
  return (
    <span className={`source-badge source-badge--${source}`}>
      {source === 'api' ? 'API' : 'Local'}
    </span>
  );
}
