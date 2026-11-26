import { useSavedProducts } from '../../context/SavedProductsContext';
import type { Product } from '../../types/product';

interface SaveButtonProps {
  product: Product;
  compact?: boolean;
}

export function SaveButton({ product, compact = false }: SaveButtonProps) {
  const { isSaved, addProduct, removeProduct } = useSavedProducts();
  const saved = isSaved(product.id);
  const label = saved ? `Remove ${product.title} from saved` : `Save ${product.title}`;

  return (
    <button
      type="button"
      className={`save-button${saved ? ' is-saved' : ''}${compact ? ' save-button--compact' : ''}`}
      onClick={() => (saved ? removeProduct(product.id) : addProduct(product))}
      aria-pressed={saved}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{saved ? '♥' : '♡'}</span>
      <span className="save-button__label">{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
