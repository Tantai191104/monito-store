/**
 * Node modules
 */
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};
