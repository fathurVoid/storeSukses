import { useSavedProducts } from '../../context/SavedProductsContext';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types/product';
import { Icon } from './Icon';

interface SaveButtonProps {
  product: Product;
  compact?: boolean;
}

export function SaveButton({ product, compact = false }: SaveButtonProps) {
  const { isSaved, addProduct, removeProduct } = useSavedProducts();
  const { notify } = useToast();
  const saved = isSaved(product.id);
  const label = saved
    ? `Hapus ${product.title} dari tersimpan`
    : `Simpan ${product.title} ke tersimpan`;

  function handleClick() {
    if (saved) {
      removeProduct(product.id);
      notify(`“${product.title}” dihapus dari tersimpan.`, 'info');
      return;
    }

    addProduct(product);
    notify(`“${product.title}” ditambahkan ke tersimpan.`, 'success');
  }

  return (
    <button
      type="button"
      className={`save-button${saved ? ' is-saved' : ''}${compact ? ' save-button--compact' : ''}`}
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
    >
      <Icon name="heart" size={16} />
      <span className="save-button__label">{saved ? 'Tersimpan' : 'Simpan'}</span>
    </button>
  );
}
