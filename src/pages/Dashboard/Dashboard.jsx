import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import dataService from '../../services/dataService.js';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientes: 0,
    ventas: 0,
    cobranzas: 0,
    empleados: 0,
    totalVentas: 0,
    totalCobranzas: 0,
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
      // Cargar datos reales de Supabase
      const [clientes, ventas, cobranzas, empleados] = await Promise.all([
        dataService.getClientes(),
        dataService.getVentas(),
        dataService.getCobranzas(),
        dataService.getEmpleados(),
      ]);

      setStats({
        clientes: clientes.length,
        ventas: ventas.length,
        cobranzas: cobranzas.length,
        empleados: empleados.length,
        totalVentas: ventas.reduce(
          (sum, venta) => sum + (venta.monto_total || 0),
          0
        ),
        totalCobranzas: cobranzas.reduce(
          (sum, cobranza) => sum + (cobranza.monto_total || 0),
          0
        ),
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Valores por defecto si hay error
      setStats({
        clientes: 0,
        ventas: 0,
        cobranzas: 0,
        empleados: 0,
        totalVentas: 0,
        totalCobranzas: 0,
      });
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='bg-white shadow rounded-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Dashboard MTZ
        </h1>
        <p className='text-gray-600'>
          Bienvenido al sistema de gestión empresarial
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
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
                  <dd className='text-sm text-gray-500'>
                    ${stats.totalVentas.toLocaleString()}
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
                  <dd className='text-sm text-gray-500'>
                    ${stats.totalCobranzas.toLocaleString()}
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
                <div className='w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center'>
                  <span className='text-white font-bold'>👨‍💼</span>
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Empleados
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {stats.empleados}
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
            className='bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors'
          >
            <div className='text-center'>
              <div className='text-2xl mb-1'>👥</div>
              <div className='text-sm font-medium'>Gestionar Clientes</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/ventas')}
            className='bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors'
          >
            <div className='text-center'>
              <div className='text-2xl mb-1'>📈</div>
              <div className='text-sm font-medium'>Gestionar Ventas</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/cobranza')}
            className='bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors'
          >
            <div className='text-center'>
              <div className='text-2xl mb-1'>💰</div>
              <div className='text-sm font-medium'>Gestionar Cobranzas</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/rrhh')}
            className='bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors'
          >
            <div className='text-center'>
              <div className='text-2xl mb-1'>👨‍💼</div>
              <div className='text-sm font-medium'>Gestionar RRHH</div>
            </div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className='bg-white shadow rounded-lg p-6'>
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
    </div>
  );
}

export default Dashboard;
