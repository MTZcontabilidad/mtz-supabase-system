import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  TrendingUp,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/utils/helpers.js';
import useAuth from '@/hooks/useAuth.js';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', href: '/app/clients', icon: Users },
  { name: 'Reportes', href: '/app/reports', icon: FileText },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Proyecciones', href: '/app/proyecciones', icon: TrendingUp },
  { name: 'Administración', href: '/app/admin', icon: Shield, adminOnly: true },
  {
    name: 'Configuración',
    href: '/app/settings',
    icon: Settings,
    adminOnly: true,
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useAuth();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón móvil para abrir/cerrar sidebar */}
      <button
        onClick={toggleSidebar}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg'
      >
        {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar principal */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header del sidebar */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
              <LayoutDashboard className='w-5 h-5 text-white' />
            </div>
            <span className='font-semibold text-gray-900'>MTZ</span>
          </div>
          <button
            onClick={toggleSidebar}
            className='lg:hidden p-1 hover:bg-gray-100 rounded'
          >
            <X className='h-4 w-4' />
          </button>
        </div>

        {/* Navegación */}
        <nav className='p-4'>
          <div className='space-y-1'>
            {navigation.map(item => {
              // Ocultar elementos solo para admin si el usuario no es admin
              if (item.adminOnly && role !== 'admin') {
                return null;
              }

              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <Icon className='mr-3 h-5 w-5' />
                  {item.name}
                  {item.adminOnly && (
                    <Shield className='ml-auto h-3 w-3 text-gray-400' />
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Información del usuario */}
          <div className='mt-8 pt-4 border-t border-gray-200'>
            <div className='px-3 py-2'>
              <p className='text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Rol Actual
              </p>
              <p className='text-sm text-gray-900 capitalize'>
                {role || 'Sin rol'}
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
