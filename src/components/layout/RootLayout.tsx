import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function RootLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten
      </a>
      <div className="sidebar-slot">
        <Sidebar />
      </div>
      <main id="main-content" className="main-content">
        <div className="main-inner">
          <Outlet />
          <p className="app-footer">
            storeSukses &copy; {new Date().getFullYear()} &middot; Dibangun dengan React &amp; TypeScript
          </p>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
