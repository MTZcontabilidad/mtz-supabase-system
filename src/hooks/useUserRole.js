// =====================================================================
// 👤 HOOK DE ROLES DE USUARIO - SISTEMA MTZ v3.0
// =====================================================================

import { useCallback, useMemo } from 'react';
import useAuth from './useAuth.js';
import { SECURITY } from '@/utils/constants.js';

/**
 * Hook especializado para manejo de roles de usuario
 * Proporciona funciones para verificar roles y obtener información específica del rol
 *
 * @returns {Object} Objeto con funciones de verificación de roles
 *
 * @example
 * ```jsx
 * const { isAdmin, isColaborador, canAccessModule, getRoleInfo } = useUserRole();
 *
 * if (isAdmin) {
 *   // Mostrar funcionalidades de administrador
 * }
 *
 * if (canAccessModule('clientes')) {
 *   // Mostrar módulo de clientes
 * }
 * ```
 */
const useUserRole = () => {
  const { user, role, isAuthenticated, userProfile } = useAuth();

  /**
   * Verificar si el usuario es administrador
   * @returns {boolean} True si es admin
   */
  const isAdmin = useCallback(() => {
    return isAuthenticated && role === SECURITY.roles.ADMIN;
  }, [isAuthenticated, role]);

  /**
   * Verificar si el usuario es colaborador
   * @returns {boolean} True si es colaborador
   */
  const isColaborador = useCallback(() => {
    return isAuthenticated && role === SECURITY.roles.COLABORADOR;
  }, [isAuthenticated, role]);

  /**
   * Verificar si el usuario es cliente
   * @returns {boolean} True si es cliente
   */
  const isCliente = useCallback(() => {
    return isAuthenticated && role === SECURITY.roles.CLIENTE;
  }, [isAuthenticated, role]);

  /**
   * Verificar si el usuario es externo
   * @returns {boolean} True si es externo
   */
  const isExterno = useCallback(() => {
    return isAuthenticated && role === SECURITY.roles.EXTERNO;
  }, [isAuthenticated, role]);

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol requerido
   * @returns {boolean} True si tiene el rol
   */
  const hasRole = useCallback(
    requiredRole => {
      return isAuthenticated && role === requiredRole;
    },
    [isAuthenticated, role]
  );

  /**
   * Verificar si el usuario tiene al menos uno de los roles especificados
   * @param {string[]} roles - Array de roles a verificar
   * @returns {boolean} True si tiene al menos uno de los roles
   */
  const hasAnyRole = useCallback(
    roles => {
      return isAuthenticated && roles.includes(role);
    },
    [isAuthenticated, role]
  );

  /**
   * Verificar si el usuario puede acceder a un módulo específico
   * @param {string} module - Módulo a verificar
   * @returns {boolean} True si puede acceder
   */
  const canAccessModule = useCallback(
    module => {
      if (!isAuthenticated) return false;

      // Definir permisos por módulo y rol
      const modulePermissions = {
        // Módulos de administración
        usuarios: [SECURITY.roles.ADMIN],
        configuracion: [SECURITY.roles.ADMIN],
        carga_masiva: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Módulos de gestión
        clientes: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        ventas: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        cobranza: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        compras: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        contratos: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Módulos de reportes
        reportes: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        analytics: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Módulos específicos de cliente
        portal_clientes: [SECURITY.roles.CLIENTE],
        documentos: [
          SECURITY.roles.CLIENTE,
          SECURITY.roles.ADMIN,
          SECURITY.roles.COLABORADOR,
        ],

        // Módulos de RRHH
        rrhh: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Módulos de IVA
        iva: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Módulos de proyecciones
        proyecciones: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Módulos de requerimientos
        requerimientos: [
          SECURITY.roles.ADMIN,
          SECURITY.roles.COLABORADOR,
          SECURITY.roles.CLIENTE,
        ],
      };

      const allowedRoles = modulePermissions[module];
      if (!allowedRoles) return false;

      return allowedRoles.includes(role);
    },
    [isAuthenticated, role]
  );

  /**
   * Obtener información del rol actual
   * @returns {Object} Información del rol
   */
  const getRoleInfo = useCallback(() => {
    if (!isAuthenticated || !role) {
      return null;
    }

    const roleInfo = {
      [SECURITY.roles.ADMIN]: {
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        level: 4,
        color: 'red',
        icon: 'shield',
        permissions: ['all'],
      },
      [SECURITY.roles.COLABORADOR]: {
        name: 'Colaborador',
        description: 'Acceso a módulos de gestión',
        level: 3,
        color: 'blue',
        icon: 'users',
        permissions: [
          'clientes',
          'ventas',
          'cobranza',
          'compras',
          'contratos',
          'reportes',
        ],
      },
      [SECURITY.roles.CLIENTE]: {
        name: 'Cliente',
        description: 'Acceso a portal de cliente',
        level: 2,
        color: 'green',
        icon: 'user',
        permissions: ['portal_clientes', 'documentos', 'requerimientos'],
      },
      [SECURITY.roles.EXTERNO]: {
        name: 'Usuario Externo',
        description: 'Acceso limitado',
        level: 1,
        color: 'gray',
        icon: 'user-check',
        permissions: ['requerimientos'],
      },
    };

    return roleInfo[role] || null;
  }, [isAuthenticated, role]);

  /**
   * Obtener módulos accesibles para el rol actual
   * @returns {Array} Array de módulos accesibles
   */
  const getAccessibleModules = useCallback(() => {
    if (!isAuthenticated) return [];

    const allModules = [
      { id: 'dashboard', name: 'Dashboard', icon: 'home' },
      { id: 'clientes', name: 'Clientes', icon: 'users' },
      { id: 'ventas', name: 'Ventas', icon: 'trending-up' },
      { id: 'cobranza', name: 'Cobranza', icon: 'credit-card' },
      { id: 'compras', name: 'Compras', icon: 'shopping-cart' },
      { id: 'contratos', name: 'Contratos', icon: 'file-text' },
      { id: 'reportes', name: 'Reportes', icon: 'bar-chart' },
      { id: 'analytics', name: 'Analytics', icon: 'pie-chart' },
      { id: 'rrhh', name: 'RRHH', icon: 'user-check' },
      { id: 'iva', name: 'IVA', icon: 'calculator' },
      { id: 'proyecciones', name: 'Proyecciones', icon: 'target' },
      { id: 'requerimientos', name: 'Requerimientos', icon: 'clipboard-list' },
      { id: 'portal_clientes', name: 'Portal Clientes', icon: 'external-link' },
      { id: 'documentos', name: 'Documentos', icon: 'folder' },
      { id: 'usuarios', name: 'Usuarios', icon: 'user-cog' },
      { id: 'configuracion', name: 'Configuración', icon: 'settings' },
      { id: 'carga_masiva', name: 'Carga Masiva', icon: 'upload' },
    ];

    return allModules.filter(module => canAccessModule(module.id));
  }, [isAuthenticated, canAccessModule]);

  /**
   * Verificar si el usuario puede realizar una acción específica
   * @param {string} action - Acción a verificar
   * @returns {boolean} True si puede realizar la acción
   */
  const canPerformAction = useCallback(
    action => {
      if (!isAuthenticated) return false;

      // Administradores pueden hacer todo
      if (isAdmin()) return true;

      // Definir acciones por rol
      const actionPermissions = {
        // Acciones de gestión
        create_cliente: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        edit_cliente: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        delete_cliente: [SECURITY.roles.ADMIN],

        create_venta: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        edit_venta: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        delete_venta: [SECURITY.roles.ADMIN],

        create_cobranza: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        edit_cobranza: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        delete_cobranza: [SECURITY.roles.ADMIN],

        // Acciones de administración
        manage_users: [SECURITY.roles.ADMIN],
        manage_roles: [SECURITY.roles.ADMIN],
        manage_config: [SECURITY.roles.ADMIN],

        // Acciones de reportes
        view_reports: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
        export_reports: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],

        // Acciones de cliente
        view_portal: [SECURITY.roles.CLIENTE],
        upload_documents: [
          SECURITY.roles.CLIENTE,
          SECURITY.roles.ADMIN,
          SECURITY.roles.COLABORADOR,
        ],

        // Acciones de carga masiva
        bulk_upload: [SECURITY.roles.ADMIN, SECURITY.roles.COLABORADOR],
      };

      const allowedRoles = actionPermissions[action];
      if (!allowedRoles) return false;

      return allowedRoles.includes(role);
    },
    [isAuthenticated, role, isAdmin]
  );

  /**
   * Obtener el nivel de acceso del usuario
   * @returns {number} Nivel de acceso (1-4)
   */
  const getAccessLevel = useCallback(() => {
    if (!isAuthenticated) return 0;

    const roleInfo = getRoleInfo();
    return roleInfo?.level || 0;
  }, [isAuthenticated, getRoleInfo]);

  /**
   * Verificar si el usuario tiene un nivel de acceso mínimo
   * @param {number} minLevel - Nivel mínimo requerido
   * @returns {boolean} True si tiene el nivel mínimo
   */
  const hasMinAccessLevel = useCallback(
    minLevel => {
      const currentLevel = getAccessLevel();
      return currentLevel >= minLevel;
    },
    [getAccessLevel]
  );

  // Memoizar valores computados
  const roleState = useMemo(
    () => ({
      // Estado del rol
      currentRole: role,
      roleInfo: getRoleInfo(),
      accessLevel: getAccessLevel(),

      // Verificaciones de rol
      isAdmin: isAdmin(),
      isColaborador: isColaborador(),
      isCliente: isCliente(),
      isExterno: isExterno(),

      // Módulos accesibles
      accessibleModules: getAccessibleModules(),

      // Información del usuario
      userProfile,
    }),
    [
      role,
      getRoleInfo,
      getAccessLevel,
      isAdmin,
      isColaborador,
      isCliente,
      isExterno,
      getAccessibleModules,
      userProfile,
    ]
  );

  return {
    // Funciones de verificación
    isAdmin,
    isColaborador,
    isCliente,
    isExterno,
    hasRole,
    hasAnyRole,
    canAccessModule,
    canPerformAction,
    getAccessLevel,
    hasMinAccessLevel,

    // Información del rol
    getRoleInfo,
    getAccessibleModules,

    // Estado del rol
    ...roleState,

    // Utilidades
    isAuthenticated,
    user,
  };
};

export default useUserRole;
