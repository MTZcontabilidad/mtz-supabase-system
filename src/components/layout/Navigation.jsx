import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import {
  Home,
  Users,
  TrendingUp,
  Building,
  Calculator,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/ventas', label: 'Ventas', icon: TrendingUp },
    { path: '/cobranza', label: 'Cobranza', icon: TrendingUp },
    { path: '/rrhh', label: 'RRHH', icon: Building },
    { path: '/iva', label: 'IVA', icon: Calculator },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <div className='flex'>
            <div className='flex-shrink-0 flex items-center'>
              <h1 className='text-xl font-bold text-white'>MTZ Sistema v3.0</h1>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              {menuItems.map(item => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'text-white hover:bg-white hover:text-blue-600 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className='h-4 w-4 mr-2' />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            {user && (
              <div className='hidden sm:flex items-center text-white'>
                <div className='w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-medium'>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className='ml-2 text-sm'>{user.email}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className='bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors flex items-center'
            >
              <LogOut className='h-4 w-4 mr-2' />
              <span className='hidden sm:inline'>Cerrar Sesión</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='sm:hidden text-white hover:text-gray-200'
            >
              {mobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className='sm:hidden bg-white shadow-lg'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {menuItems.map(item => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className='h-5 w-5 mr-3' />
                  {item.label}
                </button>
              );
            })}
            {user && (
              <div className='px-3 py-2 border-t border-gray-200'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-medium text-white'>
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className='ml-3 text-sm text-gray-700'>{user.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
