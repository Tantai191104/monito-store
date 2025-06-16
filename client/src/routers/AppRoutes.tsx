/**
 * Node modules
 */
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Layouts
 */
import AuthLayout from '@/layouts/AuthLayout';
import BaseLayout from '@/layouts/BaseLayout';
import StaffLayout from '@/layouts/StaffLayout';

/**
 * Components
 */
import { ProtectedRoute } from './components/ProtectedRoute';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * Pages
 */
import HomePage from '@/pages/home/HomePage';

import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

import StaffDashboard from '@/pages/staff/StaffDashboard';
import ProductsManagement from '@/pages/staff/ProductsManagement';
import PetsManagement from '@/pages/staff/PetsManagement';
import OrdersManagement from '@/pages/staff/OrdersManagement';
import CategoriesManagement from '@/pages/staff/CategoriesManagement';
import ColorsManagement from '@/pages/staff/ColorsManagement';
import BreedsManagement from '@/pages/staff/BreedsManagement';

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  console.log(user, isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<BaseLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Navigate to={`/${user?.role}`} />} />
        <Route path="/register" element={<Navigate to={`/${user?.role}`} />} />
      </Route>
      <Route
        path="/customer/*"
        element={<ProtectedRoute allowedRoles={['customer']} />}
      />
      <Route
        path="/staff"
        element={<ProtectedRoute allowedRoles={['staff']} />}
      >
        <Route element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="pets" element={<PetsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="colors" element={<ColorsManagement />} />
          <Route path="breeds" element={<BreedsManagement />} />
        </Route>
      </Route>
      <Route
        path="/admin/*"
        element={<ProtectedRoute allowedRoles={['admin']} />}
      />
      <Route path="/" element={<Navigate to={`/${user?.role}`} />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};
export default AppRoutes;
