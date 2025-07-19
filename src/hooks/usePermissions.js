import useAuth from './useAuth';

/**
 * Hook para verificación de permisos específicos
 * Centraliza la lógica de autorización por recurso y acción
 * MEJORADO: Validación más robusta y logging para debugging
 *
 * @returns {Object} Objeto con flags de permisos y funciones de verificación
 */
const usePermissions = () => {
  const { hasPermission, role, permissions, user } = useAuth();

  // Función de validación mejorada con logging
  const validatePermission = (resource, action) => {
    if (!user) {
      console.log('🔐 Permission denied: No user authenticated');
      return false;
    }

    const permissionKey = action ? `${resource}.${action}` : resource;
    const hasAccess = hasPermission(permissionKey);
    
    console.log(`🔍 Permission check: ${permissionKey} = ${hasAccess} (role: ${role})`);
    return hasAccess;
  };

  // Permisos específicos del sistema MTZ
  const canViewDashboard = validatePermission('dashboard', 'view');
  const canManageClients = validatePermission('clients', 'manage');
  const canCreateClients = validatePermission('clients', 'create');
  const canUpdateClients = validatePermission('clients', 'update');
  const canDeleteClients = validatePermission('clients', 'delete');
  const canExportData = validatePermission('data', 'export');
  const canImportData = validatePermission('data', 'import');
  const canAccessAdmin = role === 'admin';
  const canManageUsers = validatePermission('users', 'manage');
  const canViewReports = validatePermission('reports', 'view');
  const canManageSettings = validatePermission('settings', 'manage');

  // Función para verificar permisos dinámicamente
  const checkPermission = (resource, action = null) => {
    return validatePermission(resource, action);
  };

  // Función para verificar múltiples permisos
  const checkMultiplePermissions = (permissionsList, requireAll = false) => {
    if (requireAll) {
      return permissionsList.every(({ resource, action }) => 
        validatePermission(resource, action)
      );
    } else {
      return permissionsList.some(({ resource, action }) => 
        validatePermission(resource, action)
      );
    }
  };

  // Función para obtener nivel de acceso
  const getAccessLevel = () => {
    if (role === 'admin') return 'full';
    if (role === 'manager') return 'limited';
    if (role === 'user') return 'basic';
    return 'none';
  };

  return {
    // Permisos específicos
    canViewDashboard,
    canManageClients,
    canCreateClients,
    canUpdateClients,
    canDeleteClients,
    canExportData,
    canImportData,
    canAccessAdmin,
    canManageUsers,
    canViewReports,
    canManageSettings,
    
    // Funciones de verificación
    checkPermission,
    checkMultiplePermissions,
    getAccessLevel,
    
    // Información de contexto
    userRole: role,
    isAuthenticated: !!user,
    permissions,
  };
};

export default usePermissions;