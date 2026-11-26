import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';
import { Icon } from '../components/common/Icon';

export function NotFoundPage() {
  return (
    <div className="page page--narrow">
      <EmptyState
        title="Halaman tidak ditemukan"
        message="Rute yang Anda buka tidak tersedia di katalog ini."
        icon="alert"
        action={
          <Link className="button button--primary" to="/products">
            <Icon name="grid" size={16} />
            Ke katalog
          </Link>
        }
      />
    </div>
  );
}
