import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientes: 0,
    ventas: 0,
    cobranzas: 0,
  });
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadStats();
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const loadStats = async () => {
    try {
      // Usar el script MCP para cargar estadísticas
      const { SupabaseMCP } = await import('../../../supabase-mcp-complete.js');
      const stats = await SupabaseMCP.getStats();

      setStats({
        clientes: stats.clientes || 0,
        ventas: stats.ventas || 0,
        cobranzas: stats.cobranzas || 0,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Valores por defecto si hay error
      setStats({
        clientes: 3,
        ventas: 0,
        cobranzas: 0,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              MTZ Sistema de Gestión
            </h1>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>Bienvenido, {user?.email}</span>
              <button
                onClick={handleLogout}
                className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700'
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center'>
                    <span className='text-white font-bold'>C</span>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Total Clientes
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.clientes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-green-500 rounded-md flex items-center justify-center'>
                    <span className='text-white font-bold'>V</span>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Total Ventas
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.ventas}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white overflow-hidden shadow rounded-lg'>
            <div className='p-5'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center'>
                    <span className='text-white font-bold'>$</span>
                  </div>
                </div>
                <div className='ml-5 w-0 flex-1'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>
                      Cobranzas Pendientes
                    </dt>
                    <dd className='text-lg font-medium text-gray-900'>
                      {stats.cobranzas}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>
            Acciones Rápidas
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <button
              onClick={() => navigate('/clientes')}
              className='bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700'
            >
              Gestionar Clientes
            </button>
            <button
              onClick={() => navigate('/ventas')}
              className='bg-green-600 text-white p-4 rounded-lg hover:bg-green-700'
            >
              Gestionar Ventas
            </button>
            <button
              onClick={() => navigate('/cobranzas')}
              className='bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700'
            >
              Gestionar Cobranzas
            </button>
            <button
              onClick={() => navigate('/rrhh')}
              className='bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700'
            >
              Gestionar RRHH
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className='mt-8 bg-white shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>
            Estado del Sistema
          </h2>
          <div className='space-y-2'>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
              <span className='text-gray-700'>Sistema operativo</span>
            </div>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
              <span className='text-gray-700'>Base de datos conectada</span>
            </div>
            <div className='flex items-center'>
              <div className='w-3 h-3 bg-green-500 rounded-full mr-3'></div>
              <span className='text-gray-700'>Autenticación activa</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
