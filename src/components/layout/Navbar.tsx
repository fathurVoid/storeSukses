import { NavLink } from 'react-router-dom';
import { useSavedProducts } from '../../context/SavedProductsContext';

const links = [
  { to: '/products', label: 'Catalog' },
  { to: '/products/new', label: 'Add Product' },
  { to: '/saved', label: 'Saved' },
];

export function Navbar() {
  const { savedProducts } = useSavedProducts();

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <NavLink
          to="/products"
          className={({ isActive }) => `brand${isActive ? ' is-active' : ''}`}
        >
          <span className="brand__mark" aria-hidden="true">
            ◈
          </span>
          <span>
            store<span className="brand__accent">Sukses</span>
          </span>
        </NavLink>

        <div className="navbar__links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              {link.label}
              {link.to === '/saved' && savedProducts.length > 0 && (
                <span className="nav-count" aria-label={`${savedProducts.length} saved products`}>
                  {savedProducts.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
