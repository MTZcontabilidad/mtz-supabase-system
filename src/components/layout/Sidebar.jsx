import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext.jsx';
import {
  Home,
  Users,
  TrendingUp,
  DollarSign,
  Building,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Calculator
} from 'lucide-react';
import Button from '../ui/Button.jsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      path: '/clientes',
      name: 'Clientes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      path: '/ventas',
      name: 'Ventas',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      path: '/cobranza',
      name: 'Cobranzas',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      path: '/rrhh',
      name: 'RRHH',
      icon: Building,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      path: '/iva',
      name: 'IVA',
      icon: Calculator,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-gray-800">MTZ Sistema</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                active
                  ? `${item.bgColor} ${item.color} font-medium`
                  : 'text-gray-600 hover:bg-gray-50'
              } ${item.hoverColor}`}
            >
              <IconComponent className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        {!collapsed && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.user_metadata?.nombre || 'Sin nombre'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            onClick={() => navigate('/settings')}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {!collapsed && <Settings className="h-4 w-4 mr-2" />}
            {!collapsed && 'Configuración'}
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            {!collapsed && <LogOut className="h-4 w-4 mr-2" />}
            {!collapsed && 'Salir'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
