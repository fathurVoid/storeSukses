import { NavLink } from 'react-router-dom';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { Icon, type IconName } from '../common/Icon';

const items: Array<{ to: string; label: string; icon: IconName }> = [
  { to: '/products', label: 'Katalog', icon: 'grid' },
  { to: '/products/new', label: 'Tambah Produk', icon: 'plus' },
  { to: '/saved', label: 'Tersimpan', icon: 'bookmark' },
];

export function Sidebar() {
  const { savedProducts } = useSavedProducts();

  return (
    <aside className="sidebar" aria-label="Navigasi utama">
      <div className="sidebar__brand">
        <span className="sidebar__mark">SS</span>
        <div>
          <p className="sidebar__name">storeSukses</p>
          <p className="sidebar__subtitle">Product Catalog</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Menu utama">
        <p className="sidebar__label">Menu Utama</p>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
            {item.to === '/saved' && savedProducts.length > 0 && (
              <span className="nav-count">{savedProducts.length}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__footer-row">
          <span>Versi Aplikasi</span>
          <span className="font-mono">v1.0.0</span>
        </div>
        <div className="sidebar__footer-row">
          <span>Tugas Pertemuan 8</span>
          <span className="sidebar__env">DEVELOPMENT</span>
        </div>
      </div>
    </aside>
  );
}
