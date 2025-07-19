import useAuth from './useAuth';

/**
 * Hook para gestión de roles y permisos de usuario - VERSIÓN CORREGIDA
 * Usa AuthContext como fuente única de verdad para evitar duplicación
 * NO hace consultas adicionales a la BD para prevenir conflictos
 */
export const useUserRole = () => {
  const { 
    user, 
    userProfile, 
    role, 
    permissions, 
    loading, 
    hasPermission 
  } = useAuth();

  // Verificaciones de rol usando datos de AuthContext
  const isAdmin = () => role === 'admin' || role === 'administrador';
  const isColaborador = () => role === 'colaborador' || role === 'contador';
  const isExterno = () => role === 'externo' || role === 'asistente';
  const isCliente = () => role === 'cliente';

  // Verificar acceso completo (admin o colaborador)
  const hasFullAccess = () => {
    return isAdmin() || isColaborador();
  };

  // Obtener nivel de acceso como número
  const getAccessLevel = () => {
    if (isAdmin()) return 4;
    if (isColaborador()) return 3;
    if (isExterno()) return 2;
    if (isCliente()) return 1;
    return 0;
  };

  // Mapear nombres de roles a formato consistente
  const getRoleDisplayName = () => {
    switch (role) {
      case 'admin':
      case 'administrador':
        return 'Administrador';
      case 'colaborador':
      case 'contador':
        return 'Colaborador';
      case 'externo':
      case 'asistente':
        return 'Externo';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Sin Rol';
    }
  };

  return {
    // Datos del AuthContext (fuente única de verdad)
    user,
    userRole: role,
    userPermissions: permissions,
    userProfile,
    loading,
    error: null, // AuthContext maneja errores
    
    // Funciones de verificación
    hasPermission,
    isAdmin,
    isColaborador,
    isExterno,
    isCliente,
    hasFullAccess,
    getAccessLevel,
    getRoleDisplayName,
    
    // No incluir refetch para evitar conflictos con AuthContext
  };
};

export default useUserRole;