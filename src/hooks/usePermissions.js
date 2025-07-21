// =====================================================================
// 🔐 HOOK DE PERMISOS - SISTEMA MTZ v3.0
// =====================================================================

import { useCallback, useMemo } from 'react';
import useAuth from './useAuth.js';
import { SECURITY } from '@/utils/constants.js';

/**
 * Hook especializado para manejo de permisos y autorización
 * Proporciona funciones para verificar permisos específicos y roles
 *
 * @returns {Object} Objeto con funciones de verificación de permisos
 *
 * @example
 * ```jsx
 * const { canRead, canWrite, canDelete, hasRole, checkPermission } = usePermissions();
 *
 * if (canRead('clientes')) {
 *   // Mostrar lista de clientes
 * }
 *
 * if (canWrite('ventas')) {
 *   // Mostrar botón de crear venta
 * }
 * ```
 */
const usePermissions = () => {
  const { user, role, isAuthenticated } = useAuth();

  /**
   * Verificar permiso específico del usuario
   * @param {string} permission - Permiso a verificar
   * @returns {boolean} True si tiene el permiso
   */
  const checkPermission = useCallback(
    permission => {
      if (!isAuthenticated || !user) return false;

      // Admin tiene acceso completo
      if (role === SECURITY.roles.ADMIN) return true;

      // Verificar permisos del usuario
      if (user.permisos && Array.isArray(user.permisos)) {
        return user.permisos.includes(permission);
      }

      // Verificar rol específico
      if (user.rol_permisos && user.rol_permisos[permission]) {
        return true;
      }

      return false;
    },
    [isAuthenticated, user, role]
  );

  /**
   * Verificar si el usuario puede leer un recurso específico
   * @param {string} resource - Recurso a verificar (ej: 'clientes', 'ventas')
   * @returns {boolean} True si puede leer
   */
  const canRead = useCallback(
    resource => {
      if (!isAuthenticated || !user) return false;

      // Admin tiene acceso completo
      if (role === SECURITY.roles.ADMIN) return true;

      // Verificar permiso específico
      return (
        checkPermission(`${resource}:${SECURITY.permissions.READ}`) ||
        checkPermission(SECURITY.permissions.READ)
      );
    },
    [isAuthenticated, user, role, checkPermission]
  );

  /**
   * Verificar si el usuario puede escribir/crear un recurso específico
   * @param {string} resource - Recurso a verificar
   * @returns {boolean} True si puede escribir
   */
  const canWrite = useCallback(
    resource => {
      if (!isAuthenticated || !user) return false;

      // Admin tiene acceso completo
      if (role === SECURITY.roles.ADMIN) return true;

      // Verificar permiso específico
      return (
        checkPermission(`${resource}:${SECURITY.permissions.WRITE}`) ||
        checkPermission(SECURITY.permissions.WRITE)
      );
    },
    [isAuthenticated, user, role, checkPermission]
  );

  /**
   * Verificar si el usuario puede eliminar un recurso específico
   * @param {string} resource - Recurso a verificar
   * @returns {boolean} True si puede eliminar
   */
  const canDelete = useCallback(
    resource => {
      if (!isAuthenticated || !user) return false;

      // Admin tiene acceso completo
      if (role === SECURITY.roles.ADMIN) return true;

      // Verificar permiso específico
      return (
        checkPermission(`${resource}:${SECURITY.permissions.DELETE}`) ||
        checkPermission(SECURITY.permissions.DELETE)
      );
    },
    [isAuthenticated, user, role, checkPermission]
  );

  /**
   * Verificar si el usuario puede administrar un recurso específico
   * @param {string} resource - Recurso a verificar
   * @returns {boolean} True si puede administrar
   */
  const canAdmin = useCallback(
    resource => {
      if (!isAuthenticated || !user) return false;

      // Admin tiene acceso completo
      if (role === SECURITY.roles.ADMIN) return true;

      // Verificar permiso específico
      return (
        checkPermission(`${resource}:${SECURITY.permissions.ADMIN}`) ||
        checkPermission(SECURITY.permissions.ADMIN)
      );
    },
    [isAuthenticated, user, role, checkPermission]
  );

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol requerido
   * @returns {boolean} True si tiene el rol
   */
  const hasRole = useCallback(
    requiredRole => {
      if (!isAuthenticated || !user) return false;

      return role === requiredRole;
    },
    [isAuthenticated, user, role]
  );

  /**
   * Verificar si el usuario tiene al menos uno de los roles especificados
   * @param {string[]} roles - Array de roles a verificar
   * @returns {boolean} True si tiene al menos uno de los roles
   */
  const hasAnyRole = useCallback(
    roles => {
      if (!isAuthenticated || !user) return false;

      return roles.includes(role);
    },
    [isAuthenticated, user, role]
  );

  /**
   * Verificar si el usuario tiene todos los roles especificados
   * @param {string[]} roles - Array de roles a verificar
   * @returns {boolean} True si tiene todos los roles
   */
  const hasAllRoles = useCallback(
    roles => {
      if (!isAuthenticated || !user) return false;

      return roles.every(requiredRole => role === requiredRole);
    },
    [isAuthenticated, user, role]
  );

  /**
   * Verificar un permiso específico
   * @param {string} permission - Permiso a verificar
   * @returns {boolean} True si tiene el permiso
   */
  const checkUserPermission = useCallback(
    permission => {
      if (!isAuthenticated || !user) return false;

      return checkPermission(permission);
    },
    [isAuthenticated, user, checkPermission]
  );

  /**
   * Verificar múltiples permisos (AND lógico)
   * @param {string[]} permissions - Array de permisos a verificar
   * @returns {boolean} True si tiene todos los permisos
   */
  const checkAllPermissions = useCallback(
    permissions => {
      if (!isAuthenticated || !user) return false;

      return permissions.every(permission => checkUserPermission(permission));
    },
    [isAuthenticated, user, checkUserPermission]
  );

  /**
   * Verificar múltiples permisos (OR lógico)
   * @param {string[]} permissions - Array de permisos a verificar
   * @returns {boolean} True si tiene al menos uno de los permisos
   */
  const checkAnyPermission = useCallback(
    permissions => {
      if (!isAuthenticated || !user) return false;

      return permissions.some(permission => checkUserPermission(permission));
    },
    [isAuthenticated, user, checkUserPermission]
  );

  /**
   * Obtener permisos específicos para un recurso
   * @param {string} resource - Recurso para el cual obtener permisos
   * @returns {Object} Objeto con permisos del recurso
   */
  const getResourcePermissions = useCallback(
    resource => {
      if (!isAuthenticated || !user) {
        return {
          read: false,
          write: false,
          delete: false,
          admin: false,
        };
      }

      return {
        read: canRead(resource),
        write: canWrite(resource),
        delete: canDelete(resource),
        admin: canAdmin(resource),
      };
    },
    [isAuthenticated, user, canRead, canWrite, canDelete, canAdmin]
  );

  /**
   * Verificar si el usuario puede acceder a una ruta específica
   * @param {string} route - Ruta a verificar
   * @returns {boolean} True si puede acceder
   */
  const canAccessRoute = useCallback(
    route => {
      if (!isAuthenticated || !user) return false;

      // Rutas públicas que no requieren autenticación
      const publicRoutes = ['/login', '/register', '/reset-password', '/'];
      if (publicRoutes.includes(route)) return true;

      // Rutas específicas por rol
      const routePermissions = {
        '/admin/usuarios': [SECURITY.roles.ADMIN],
        '/configuracion': [SECURITY.roles.ADMIN],
        '/portal-clientes': [SECURITY.roles.CLIENTE],
        '/carga-masiva': [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
      };

      const requiredRoles = routePermissions[route];
      if (requiredRoles) {
        return hasAnyRole(requiredRoles);
      }

      // Por defecto, usuarios autenticados pueden acceder
      return true;
    },
    [isAuthenticated, user, hasAnyRole]
  );

  // Memoizar valores computados
  const permissions = useMemo(
    () => ({
      // Permisos básicos
      isAdmin: hasRole(SECURITY.roles.ADMIN),
      isColaborador: hasRole(SECURITY.roles.COLABORADOR),
      isCliente: hasRole(SECURITY.roles.CLIENTE),
      isExterno: hasRole(SECURITY.roles.EXTERNO),

      // Permisos por módulo
      clientes: getResourcePermissions('clientes'),
      ventas: getResourcePermissions('ventas'),
      cobranza: getResourcePermissions('cobranza'),
      compras: getResourcePermissions('compras'),
      contratos: getResourcePermissions('contratos'),
      reportes: getResourcePermissions('reportes'),
      analytics: getResourcePermissions('analytics'),
      configuracion: getResourcePermissions('configuracion'),
    }),
    [hasRole, getResourcePermissions]
  );

  return {
    // Funciones de verificación
    canRead,
    canWrite,
    canDelete,
    canAdmin,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    checkUserPermission,
    hasPermission: checkUserPermission, // Alias para compatibilidad
    checkAllPermissions,
    checkAnyPermission,
    getResourcePermissions,
    canAccessRoute,

    // Estado de permisos
    permissions,
    userRole: role,
    isAuthenticated,

    // Utilidades
    isAdmin: permissions.isAdmin,
    isColaborador: permissions.isColaborador,
    isCliente: permissions.isCliente,
    isExterno: permissions.isExterno,
  };
};

export default usePermissions;
