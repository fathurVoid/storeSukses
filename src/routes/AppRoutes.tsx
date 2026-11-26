import { Navigate, Route, Routes } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { AddProductPage } from '../pages/AddProductPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { ProductsPage } from '../pages/ProductsPage';
import { SavedProductsPage } from '../pages/SavedProductsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Parent route without a path = nested layout shared by every page. */}
      <Route element={<RootLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<AddProductPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="saved" element={<SavedProductsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
