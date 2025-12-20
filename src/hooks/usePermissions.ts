import { useAuthStore } from '../stores/auth.store';

/**
 * Hook personnalisé pour gérer les permissions RBAC/ABAC
 */
export const usePermissions = () => {
  const permissions =  useAuthStore((state) => state.permissions) ?? [];

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   */
  const hasPermission = (resource: string, action: string): boolean => {
    const permissionCode = `${resource}:${action}`;
    return permissions.includes(permissionCode);
  };

  /**
   * Vérifie si l'utilisateur a au moins une des permissions
   */
  const hasAnyPermission = (permissionCodes: string[]): boolean => {
      if (!permissionCodes || permissionCodes.length === 0) return true;
      if (!permissions || permissions.length === 0) return false;

      return permissionCodes.some((code) => permissions.includes(code));
    };


  /**
   * Vérifie si l'utilisateur a toutes les permissions
   */
  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    return permissionCodes.every((code) => permissions.includes(code));
  };

  // Helpers spécifiques pour les modules principaux
  const canReadSuppliers = () => hasPermission('suppliers', 'read');
  const canCreateSuppliers = () => hasPermission('suppliers', 'create');
  const canUpdateSuppliers = () => hasPermission('suppliers', 'update');
  const canDeleteSuppliers = () => hasPermission('suppliers', 'delete');

  const canReadProducts = () => hasPermission('products', 'read');
  const canCreateProducts = () => hasPermission('products', 'create');
  const canUpdateProducts = () => hasPermission('products', 'update');
  const canDeleteProducts = () => hasPermission('products', 'delete');

  const canReadUsers = () => hasPermission('users', 'read');
  const canCreateUsers = () => hasPermission('users', 'create');
  const canUpdateUsers = () => hasPermission('users', 'update');
  const canDeleteUsers = () => hasPermission('users', 'delete');

  const canReadRoles = () => hasPermission('roles', 'read');
  const canCreateRoles = () => hasPermission('roles', 'create');
  const canUpdateRoles = () => hasPermission('roles', 'update');
  const canDeleteRoles = () => hasPermission('roles', 'delete');

  const canReadPermissions = () => hasPermission('permissions', 'read');
  const canReadReferences = () => hasPermission('references', 'read');
    const canAccessMenu = (required?: string[]) => {
      if (!required || required.length === 0) return true;
      return hasAnyPermission(required);
    };
  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Suppliers
    canReadSuppliers,
    canCreateSuppliers,
    canUpdateSuppliers,
    canDeleteSuppliers,

    // Products
    canReadProducts,
    canCreateProducts,
    canUpdateProducts,
    canDeleteProducts,

    // Users
    canReadUsers,
    canCreateUsers,
    canUpdateUsers,
    canDeleteUsers,

    // Roles
    canReadRoles,
    canCreateRoles,
    canUpdateRoles,
    canDeleteRoles,

    // Others
    canReadPermissions,
    canReadReferences,
    canAccessMenu,
  };
};