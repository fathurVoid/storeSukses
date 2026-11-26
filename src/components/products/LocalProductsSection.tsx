import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types/product';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { Icon } from '../common/Icon';
import { ProductCard } from './ProductCard';

interface LocalProductsSectionProps {
  products: Product[];
  onRemove: (id: string) => void;
}

export function LocalProductsSection({ products, onRemove }: LocalProductsSectionProps) {
  const { notify } = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const pendingProduct = products.find((product) => product.id === pendingId);

  function handleConfirm() {
    if (!pendingProduct) return;

    onRemove(pendingProduct.id);
    notify(`“${pendingProduct.title}” dihapus dari produk lokal.`, 'info');
    setPendingId(null);
  }

  return (
    <section className="local-section" aria-labelledby="local-products-heading">
      <div className="section-heading">
        <div>
          <span className="status-pill">
            <span className="status-dot" aria-hidden="true" />
            Di perangkat ini
          </span>
          <h2 id="local-products-heading">Produk lokal Anda</h2>
          <p>
            Ditambahkan lewat form dan disimpan di localStorage. Tidak pernah dikirim ke DummyJSON.
          </p>
        </div>
        <Link className="button button--primary" to="/products/new">
          <Icon name="plus" size={16} />
          Tambah produk
        </Link>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="Belum ada produk lokal"
          message="Gunakan form untuk menambah produk. Produk tersebut akan tampil di sini dengan badge Local."
          icon="book"
          action={
            <Link className="button button--ghost" to="/products/new">
              Buat sekarang
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
                onClick={() => setPendingId(product.id)}
                aria-label={`Hapus produk lokal ${product.title}`}
              >
                <Icon name="trash" size={14} />
                Hapus produk lokal
              </button>
            </div>
          ))}
        </div>
      )}

      {pendingProduct && (
        <ConfirmDialog
          title="Hapus produk lokal?"
          message={`“${pendingProduct.title}” akan dihapus dari perangkat ini. Tindakan ini tidak dapat dibatalkan.`}
          confirmLabel="Ya, hapus"
          onConfirm={handleConfirm}
          onCancel={() => setPendingId(null)}
        />
      )}
    </section>
  );
}
