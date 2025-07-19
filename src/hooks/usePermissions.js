import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase.js';
import useAuth from '@/hooks/useAuth.js';

/**
 * Hook para manejar permisos granulares del sistema
 * Basado en roles y asignaciones de clientes
 */
export const usePermissions = () => {
  const { user, userProfile } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState({});
  const [assignedClients, setAssignedClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar rol y permisos del usuario
  const loadUserRole = async () => {
    if (!user) return;

    try {
      // Obtener información del usuario desde usuarios_sistema
      const { data: userData, error: userError } = await supabase
        .from('usuarios_sistema')
        .select(
          `
          *,
          roles:rol_id (
            nombre,
            descripcion,
            permisos
          )
        `
        )
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Error cargando rol de usuario:', userError);
        return;
      }

      if (userData) {
        setUserRole(userData.roles?.nombre || 'usuario');
        setUserPermissions(userData.roles?.permisos || {});

        // Si es usuario, cargar clientes asignados
        if (userData.roles?.nombre === 'usuario') {
          await loadAssignedClients(user.id);
        }
      }
    } catch (error) {
      console.error('Error en loadUserRole:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes asignados al usuario
  const loadAssignedClients = async userId => {
    try {
      const { data: asignaciones, error } = await supabase
        .from('asignaciones_clientes')
        .select(
          `
          cliente_id,
          permisos_especiales,
          clientes_contables (
            id_cliente,
            razon_social,
            rut
          )
        `
        )
        .eq('usuario_id', userId)
        .eq('activo', true);

      if (error) {
        console.error('Error cargando asignaciones:', error);
        return;
      }

      setAssignedClients(asignaciones || []);
    } catch (error) {
      console.error('Error en loadAssignedClients:', error);
    }
  };

  // Verificar si el usuario tiene permiso para una acción específica
  const hasPermission = (resource, action) => {
    if (!userPermissions || !userPermissions[resource]) {
      return false;
    }

    return userPermissions[resource][action] === true;
  };

  // Verificar si el usuario puede acceder a un cliente específico
  const canAccessClient = clientId => {
    // Administradores y colaboradores pueden acceder a todos los clientes
    if (userRole === 'administrador' || userRole === 'colaborador') {
      return true;
    }

    // Usuarios solo pueden acceder a clientes asignados
    if (userRole === 'usuario') {
      return assignedClients.some(
        asignacion => asignacion.cliente_id === clientId
      );
    }

    return false;
  };

  // Obtener clientes a los que el usuario puede acceder
  const getAccessibleClients = () => {
    if (userRole === 'administrador' || userRole === 'colaborador') {
      return 'all'; // Puede acceder a todos
    }

    if (userRole === 'usuario') {
      return assignedClients.map(asignacion => asignacion.cliente_id);
    }

    return [];
  };

  // Verificar si el usuario puede realizar una acción en un cliente
  const canPerformAction = (clientId, action) => {
    if (!canAccessClient(clientId)) {
      return false;
    }

    // Administradores pueden hacer todo
    if (userRole === 'administrador') {
      return true;
    }

    // Colaboradores tienen permisos limitados
    if (userRole === 'colaborador') {
      const restrictedActions = ['delete', 'assign', 'approve'];
      return !restrictedActions.includes(action);
    }

    // Usuarios tienen permisos muy limitados
    if (userRole === 'usuario') {
      const allowedActions = ['read', 'write'];
      return allowedActions.includes(action);
    }

    return false;
  };

  // Verificar si el usuario puede ver una página específica
  const canViewPage = page => {
    const pagePermissions = {
      dashboard: 'read',
      clientes: 'read',
      cobranza: 'read',
      requerimientos: 'read',
      usuarios: 'read',
      reportes: 'read',
      analytics: 'read',
      configuracion: 'read',
    };

    const requiredAction = pagePermissions[page];
    if (!requiredAction) return false;

    return hasPermission(page, requiredAction);
  };

  // Obtener permisos especiales para un cliente específico
  const getClientSpecialPermissions = clientId => {
    const asignacion = assignedClients.find(a => a.cliente_id === clientId);
    return asignacion?.permisos_especiales || {};
  };

  // Cargar datos al montar
  useEffect(() => {
    loadUserRole();
  }, [user]);

  return {
    // Estados
    userRole,
    userPermissions,
    assignedClients,
    loading,

    // Funciones de verificación
    hasPermission,
    canAccessClient,
    canPerformAction,
    canViewPage,
    getAccessibleClients,
    getClientSpecialPermissions,

    // Funciones de recarga
    reloadPermissions: loadUserRole,
    reloadAssignedClients: () => loadAssignedClients(user?.id),

    // Helpers
    isAdmin: userRole === 'administrador',
    isCollaborator: userRole === 'colaborador',
    isUser: userRole === 'usuario',
  };
};

export default usePermissions;
