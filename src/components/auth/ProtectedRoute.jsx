import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute - usuario:', !!user, 'loading:', loading);

  // Mostrar loading simple
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir a login si no hay usuario
  if (!user) {
    console.log('🔒 ProtectedRoute - Redirigiendo a login (sin usuario)');
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Render los children si el usuario está autenticado
  console.log('🔒 ProtectedRoute - Usuario autenticado, renderizando children');
  return children;
};

export default ProtectedRoute;