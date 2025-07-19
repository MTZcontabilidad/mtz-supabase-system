import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🌐 PublicRoute - usuario:', !!user, 'loading:', loading);

  // Mostrar loading simple
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (user) {
    console.log('🌐 PublicRoute - Usuario autenticado, redirigiendo a dashboard');
    return <Navigate to='/app/dashboard' replace />;
  }

  // Si no hay usuario, mostrar la página pública
  console.log('🌐 PublicRoute - Sin usuario, renderizando página pública');
  return children;
};

export default PublicRoute;