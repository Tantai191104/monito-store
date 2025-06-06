/**
 * Node modules
 */
import { Navigate } from "react-router-dom";

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
