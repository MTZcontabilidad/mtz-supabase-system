import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  TrendingUp,
  Building,
  Calculator,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  BarChart3,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      path: '/clientes',
      label: 'Clientes',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:bg-green-100'
    },
    {
      path: '/ventas',
      label: 'Ventas',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      path: '/cobranza',
      label: 'Cobranzas',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      path: '/rrhh',
      label: 'RRHH',
      icon: Building,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      hoverColor: 'hover:bg-red-100'
    },
    {
      path: '/iva',
      label: 'IVA',
      icon: Calculator,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverColor: 'hover:bg-indigo-100'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getActiveItem = () => {
    return menuItems.find(item => isActive(item.path));
  };

  const activeItem = getActiveItem();

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">MTZ Sistema</h1>
                <p className="text-xs text-gray-500">v3.0</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <Menu className="h-5 w-5 text-gray-600" /> : <X className="h-5 w-5 text-gray-600" />}
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
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? `${item.bgColor} ${item.color} shadow-sm`
                  : 'text-gray-600 hover:bg-gray-50'
              } ${collapsed ? 'justify-center' : 'justify-start'}`}
            >
              <IconComponent className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">Sesión activa</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/settings')}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Config
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </button>
          </div>
        </div>
      )}

      {/* Collapsed User Section */}
      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
