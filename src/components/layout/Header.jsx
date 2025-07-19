import useAuth from '../../hooks/useAuth';
import { LogOut, User, Settings } from 'lucide-react';
import Button from '../ui/Button';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className='bg-white border-b border-gray-200 px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Logo MTZ */}
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg'>
              M
            </div>
            <div>
              <h1 className='text-xl font-bold text-gray-900'>MTZ Ouroborus AI</h1>
              <p className='text-sm text-gray-500'>Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* Usuario y acciones */}
        <div className='flex items-center space-x-4'>
          {user && (
            <>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                  <User className='w-4 h-4' />
                </div>
                <div className='hidden md:block'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.user_metadata?.nombre_completo || user.email}
                  </p>
                  <p className='text-xs text-gray-500'>Administrador</p>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <Button variant='ghost' size='sm'>
                  <Settings className='w-4 h-4' />
                </Button>
                <Button 
                  variant='outline' 
                  size='sm' 
                  onClick={handleLogout}
                  className='flex items-center space-x-2'
                >
                  <LogOut className='w-4 h-4' />
                  <span className='hidden sm:inline'>Salir</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;