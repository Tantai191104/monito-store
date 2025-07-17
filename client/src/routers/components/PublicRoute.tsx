/**
 * Node modules
 */
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * A route component that is only accessible to the public (guests) and customers.
 * If an admin or staff tries to access it, they are redirected to their respective dashboards.
 */
export const PublicRoute = () => {
  const { user, isAuthenticated } = useAuth();

  // If the user is an admin or staff, redirect them away from public pages
  if (isAuthenticated && (user?.role === 'admin' || user?.role === 'staff')) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  // Allow guests and customers to access the route
  return <Outlet />;
};
