import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

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

  // Si no hay usuario, redirigir a login
  if (!user) {
    console.log('❌ No hay usuario, redirigiendo a login');
    return <Navigate to='/login' replace />;
  }

  // Si hay usuario, mostrar contenido
  console.log('✅ Usuario autenticado, mostrando contenido');
  return children;
};

export default ProtectedRoute;