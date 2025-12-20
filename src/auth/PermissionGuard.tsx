import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { usePermissions } from "../hooks/usePermissions";
import { useAuthStore } from "../stores/auth.store";

type PermissionGuardProps = {
  requiredPermissions?: string[];
  children: ReactNode;
};

const PermissionGuard = ({
  requiredPermissions,
  children,
}: PermissionGuardProps) => {
  const { isAuthenticated, permissionsLoaded, permissions } = useAuthStore();
  const { hasAnyPermission } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  const permissionsReady =
    permissionsLoaded || (permissions && permissions.length > 0);

  if (requiredPermissions && requiredPermissions.length > 0 && !permissionsReady) {
    return null;
  }

  if (
    requiredPermissions &&
    requiredPermissions.length > 0 &&
    !hasAnyPermission(requiredPermissions)
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;