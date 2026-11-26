import { AddProductForm } from '../components/forms/AddProductForm';
import { Icon } from '../components/common/Icon';
import { PageHeader } from '../components/layout/PageHeader';

export function AddProductPage() {
  return (
    <div className="page page--narrow">
      <PageHeader
        badge="Form Lokal"
        title="Tambah produk"
        description="Isi formulir untuk membuat produk di perangkat ini. Setiap input akan divalidasi sebelum disimpan."
      />

      <aside className="info-panel">
        <strong>
          <Icon name="info" size={15} /> Hanya lokal.
        </strong>{' '}
        Produk disimpan di localStorage, tampil di bagian Produk Lokal pada katalog, dan dapat
        difavoritkan. Data ini tidak pernah dikirim ke DummyJSON maupun server lainnya.
      </aside>

      <AddProductForm />
    </div>
  );
}
