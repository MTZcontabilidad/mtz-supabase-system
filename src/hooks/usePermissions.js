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
      console.warn('🔒 Permiso denegado: Usuario no autenticado', {
        resource,
        action,
      });
      return false;
    }

    const hasAccess = hasPermission(`${resource}:${action}`);

    if (!hasAccess) {
      console.warn('🔒 Permiso denegado:', {
        user: user.email,
        resource,
        action,
        role,
      });
    } else {
      console.log('✅ Permiso concedido:', {
        user: user.email,
        resource,
        action,
        role,
      });
    }

    return hasAccess;
  };

  return {
    // =====================================================================
    // PERMISOS DE CLIENTES
    // =====================================================================
    canViewClients: validatePermission('clientes', 'read'),
    canCreateClients: validatePermission('clientes', 'write'),
    canEditClients: validatePermission('clientes', 'write'),
    canDeleteClients: validatePermission('clientes', 'delete'),

    // =====================================================================
    // PERMISOS DE USUARIOS
    // =====================================================================
    canViewUsers: validatePermission('usuarios', 'read'),
    canCreateUsers: validatePermission('usuarios', 'write'),
    canEditUsers: validatePermission('usuarios', 'write'),
    canDeleteUsers: validatePermission('usuarios', 'delete'),

    // =====================================================================
    // PERMISOS DE REPORTES
    // =====================================================================
    canViewReports: validatePermission('reportes', 'read'),
    canCreateReports: validatePermission('reportes', 'write'),
    canEditReports: validatePermission('reportes', 'write'),
    canDeleteReports: validatePermission('reportes', 'delete'),

    // =====================================================================
    // PERMISOS DE CONFIGURACIÓN
    // =====================================================================
    canViewConfig: validatePermission('configuracion', 'read'),
    canEditConfig: validatePermission('configuracion', 'write'),

    // =====================================================================
    // PERMISOS DE ASIGNACIONES
    // =====================================================================
    canViewAssignments: validatePermission('asignaciones', 'read'),
    canCreateAssignments: validatePermission('asignaciones', 'write'),
    canEditAssignments: validatePermission('asignaciones', 'write'),
    canDeleteAssignments: validatePermission('asignaciones', 'delete'),

    // =====================================================================
    // INFORMACIÓN DEL ROL
    // =====================================================================
    role,
    permissions,
    isAdmin: role === 'administrador',
    isCollaborator: role === 'colaborador',
    isExternal: role === 'externo',
    isClient: role === 'cliente',
  };
};

export default usePermissions;
