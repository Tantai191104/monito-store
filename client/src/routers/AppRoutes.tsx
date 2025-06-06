/**
 * Node modules
 */
import { Navigate, Route, Routes } from 'react-router-dom';

/**
 * Pages
 */
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

/**
 * Components
 */
import { ProtectedRoute } from './components/ProtectedRoute';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/layouts/AuthLayout';

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
            <></>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <></>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <></>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={`/${user?.role}`} />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
};
export default AppRoutes;
