import { NavLink } from 'react-router-dom';
import { useSavedProducts } from '../../context/SavedProductsContext';
import { Icon } from '../common/Icon';

export function MobileNav() {
  const { savedProducts } = useSavedProducts();

  return (
    <nav className="mobile-nav" aria-label="Navigasi bawah">
      <NavLink
        to="/products"
        className={({ isActive }) => `mobile-nav__link${isActive ? ' is-active' : ''}`}
      >
        <Icon name="grid" size={20} />
        <span>Katalog</span>
      </NavLink>

      <NavLink
        to="/products/new"
        className={({ isActive }) => `mobile-nav__link mobile-nav__add${isActive ? ' is-active' : ''}`}
      >
        <span className="mobile-nav__add-mark">
          <Icon name="plus" size={20} />
        </span>
        <span>Tambah</span>
      </NavLink>

      <NavLink
        to="/saved"
        className={({ isActive }) => `mobile-nav__link${isActive ? ' is-active' : ''}`}
      >
        <span className="mobile-nav__saved">
          <Icon name="bookmark" size={20} />
          {savedProducts.length > 0 && <span className="nav-count">{savedProducts.length}</span>}
        </span>
        <span>Tersimpan</span>
      </NavLink>
    </nav>
  );
}
