/**
 * Node modules
 */
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Layouts
 */
import AuthLayout from '@/layouts/AuthLayout';
import BaseLayout from '@/layouts/BaseLayout';

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
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <>Customer</>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <>Staff</>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <>Admin</>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={`/${user?.role}`} />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};
export default AppRoutes;
