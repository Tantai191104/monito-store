/**
 * Node modules
 */
import { Navigate } from 'react-router-dom';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
