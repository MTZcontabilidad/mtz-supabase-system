import useAuth from '../../hooks/useAuth.js';
import { LogOut, User, Settings } from 'lucide-react';
import Button from '../ui/Button.jsx';
import GlobalSearch from '../shared/GlobalSearch.jsx';

const Header = () => {
  const { user, signOut, isDemoMode, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('🔄 Cerrando sesión...');
      await signOut();
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  // Obtener nombre del usuario
  const getUserName = () => {
    if (isDemoMode) {
      return 'Demo User';
    }
    if (userProfile?.nombre_completo) {
      return userProfile.nombre_completo;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuario';
  };

  // Obtener email del usuario
  const getUserEmail = () => {
    if (isDemoMode) {
      return 'demo@mtz.cl';
    }
    return user?.email || 'usuario@mtz.cl';
  };

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Logo MTZ */}
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-3'>
            <img
              src='/images/mtz-logo.png'
              alt='MTZ Consultores Tributarios'
              className='h-12 w-auto object-contain'
              onError={e => {
                // Fallback si no se encuentra el logo
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            {/* Fallback logo si no se carga la imagen */}
            <div
              className='bg-blue-600 p-2 rounded-lg'
              style={{ display: 'none' }}
            >
              <span className='text-white font-bold text-sm'>MTZ</span>
            </div>
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>
              MTZ Ouroborus AI
            </h1>
            <p className='text-sm text-gray-600'>
              Consultores Tributarios v3.0
              {isDemoMode && (
                <span className='ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full'>
                  DEMO
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Búsqueda Global */}
        <GlobalSearch />

        {/* Usuario */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-blue-600' />
            </div>
            <div className='text-sm'>
              <p className='font-medium text-gray-900'>{getUserName()}</p>
              <p className='text-gray-600'>{getUserEmail()}</p>
              {isDemoMode && (
                <p className='text-xs text-blue-600 font-medium'>
                  🎭 Modo Demo
                </p>
              )}
            </div>
          </div>

          <Button variant='ghost' size='sm'>
            <Settings className='w-4 h-4' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={handleLogout}
            title={isDemoMode ? 'Salir del modo demo' : 'Cerrar sesión'}
          >
            <LogOut className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
