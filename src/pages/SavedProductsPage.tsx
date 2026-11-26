import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Icon } from '../components/common/Icon';
import { PageHeader } from '../components/layout/PageHeader';
import { ProductGrid } from '../components/products/ProductGrid';
import { useSavedProducts } from '../context/SavedProductsContext';
import { useToast } from '../context/ToastContext';

export function SavedProductsPage() {
  const { savedProducts, clearSavedProducts } = useSavedProducts();
  const { notify } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirm() {
    clearSavedProducts();
    setConfirmOpen(false);
    notify('Semua produk tersimpan berhasil dihapus.', 'info');
  }

  return (
    <div className="page">
      <PageHeader
        badge="Koleksi Saya"
        title="Produk tersimpan"
        description="Favorit Anda disimpan di localStorage sehingga tetap ada setelah halaman dimuat ulang."
      />

      {savedProducts.length === 0 ? (
        <EmptyState
          title="Belum ada produk tersimpan"
          message="Buka produk mana pun lalu gunakan tombol Simpan untuk membangun koleksi Anda."
          icon="bookmark"
          action={
            <Link className="button button--primary" to="/products">
              <Icon name="grid" size={16} />
              Jelajahi produk
            </Link>
          }
        />
      ) : (
        <>
          <div className="results-heading">
            <h2>{savedProducts.length} produk tersimpan</h2>
            <button type="button" className="button button--ghost" onClick={() => setConfirmOpen(true)}>
              <Icon name="trash" size={16} />
              Hapus semua
            </button>
          </div>
          <ProductGrid products={savedProducts} />
          <p className="saved-hint">
            Gunakan tombol hati pada kartu untuk menghapus produk dari daftar tersimpan.
          </p>
        </>
      )}

      {confirmOpen && (
        <ConfirmDialog
          title="Hapus semua produk tersimpan?"
          message="Seluruh favorit di perangkat ini akan dihapus. Tindakan ini tidak dapat dibatalkan."
          confirmLabel="Ya, hapus"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
