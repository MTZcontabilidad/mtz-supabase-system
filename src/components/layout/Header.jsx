import useAuth from '@/hooks/useAuth';
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
            </p>
          </div>
        </div>

        {/* Usuario */}
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-blue-600' />
            </div>
            <div className='text-sm'>
              <p className='font-medium text-gray-900'>
                {user?.user_metadata?.full_name || 'Usuario'}
              </p>
              <p className='text-gray-600'>{user?.email}</p>
            </div>
          </div>

          <Button variant='ghost' size='sm'>
            <Settings className='w-4 h-4' />
          </Button>

          <Button variant='ghost' size='sm' onClick={handleLogout}>
            <LogOut className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
