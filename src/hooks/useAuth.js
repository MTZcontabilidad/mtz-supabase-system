import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook para usar el contexto de autenticación
 * Proporciona acceso a usuario, perfil, roles, permisos y funciones de auth
 *
 * @returns {Object} Contexto de autenticación completo
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  return context;
};

export default useAuth;