import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';

/**
 * Hook para usar el contexto de autenticación
 * Proporciona acceso a usuario, perfil, roles, permisos y funciones de auth
 *
 * @returns {Object} Contexto de autenticación completo
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default useAuth;
