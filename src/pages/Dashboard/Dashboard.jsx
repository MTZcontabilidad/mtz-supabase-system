import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import dataService from '../../services/dataService.js';
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Building,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Activity,
  PieChart,
  BarChart3,
} from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    clientes: 0,
    ventas: 0,
    cobranzas: 0,
    empleados: 0,
    totalVentas: 0,
    totalCobranzas: 0,
    totalPendiente: 0,
    totalPagado: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadStats();
    loadRecentActivity();
    setLoading(false);
  }, [isAuthenticated, navigate]);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      console.log('🔄 Cargando estadísticas del dashboard...');

      // Cargar datos reales de Supabase
      const [clientes, ventas, cobranzas, empleados] = await Promise.allSettled([
        dataService.getClientes(),
        dataService.getVentas(),
        dataService.getCobranzas(),
        dataService.getEmpleados(),
      ]);

      const clientesData = clientes.status === 'fulfilled' ? clientes.value : [];
      const ventasData = ventas.status === 'fulfilled' ? ventas.value : [];
      const cobranzasData = cobranzas.status === 'fulfilled' ? cobranzas.value : [];
      const empleadosData = empleados.status === 'fulfilled' ? empleados.value : [];

      const totalVentas = ventasData.reduce((sum, venta) => sum + (venta?.monto_total || 0), 0);
      const totalCobranzas = cobranzasData.reduce((sum, cobranza) => sum + (cobranza?.monto_total || 0), 0);
      const totalPendiente = cobranzasData.reduce((sum, cobranza) => sum + (cobranza?.monto_pendiente || 0), 0);
      const totalPagado = cobranzasData.reduce((sum, cobranza) => sum + (cobranza?.monto_pagado || 0), 0);

      setStats({
        clientes: clientesData.length,
        ventas: ventasData.length,
        cobranzas: cobranzasData.length,
        empleados: empleadosData.length,
        totalVentas,
        totalCobranzas,
        totalPendiente,
        totalPagado,
      });

      console.log('✅ Estadísticas cargadas exitosamente');
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
        totalPendiente: 0,
        totalPagado: 0,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const [ventas, cobranzas] = await Promise.allSettled([
        dataService.getVentas(),
        dataService.getCobranzas(),
      ]);

      const ventasData = ventas.status === 'fulfilled' ? ventas.value.slice(0, 3) : [];
      const cobranzasData = cobranzas.status === 'fulfilled' ? cobranzas.value.slice(0, 3) : [];

      const activity = [
        ...ventasData.map(venta => ({
          id: venta.id,
          type: 'venta',
          title: `Venta ${venta.numero_factura}`,
          description: venta.cliente,
          amount: venta.monto_total,
          date: venta.fecha_emision,
          status: venta.estado,
        })),
        ...cobranzasData.map(cobranza => ({
          id: cobranza.id,
          type: 'cobranza',
          title: `Cobranza ${cobranza.numero_factura}`,
          description: cobranza.cliente,
          amount: cobranza.monto_total,
          date: cobranza.fecha_emision,
          status: cobranza.estado,
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error cargando actividad reciente:', error);
      setRecentActivity([]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      return new Date(dateString).toLocaleDateString('es-CL');
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pagada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Vencida':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg rounded-lg p-6 text-white'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>
              Dashboard MTZ
            </h1>
            <p className='text-blue-100'>
              Bienvenido al sistema de gestión empresarial
            </p>
          </div>
          <Button
            onClick={loadStats}
            disabled={loadingStats}
            variant='outline'
            className='text-white border-white hover:bg-white hover:text-blue-600'
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingStats ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <div className='p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'>
                  <Users className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clientes
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.clientes}
                </p>
              </div>
              <div className='text-green-500'>
                <ArrowUpRight className='h-5 w-5' />
              </div>
            </div>
          </div>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <div className='p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Ventas
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.ventas}
                </p>
                <p className='text-sm text-gray-500'>
                  {formatCurrency(stats.totalVentas)}
                </p>
              </div>
              <div className='text-green-500'>
                <ArrowUpRight className='h-5 w-5' />
              </div>
            </div>
          </div>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <div className='p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center'>
                  <DollarSign className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Cobranzas
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.cobranzas}
                </p>
                <p className='text-sm text-gray-500'>
                  {formatCurrency(stats.totalCobranzas)}
                </p>
              </div>
              <div className='text-green-500'>
                <ArrowUpRight className='h-5 w-5' />
              </div>
            </div>
          </div>
        </Card>

        <Card className='hover:shadow-lg transition-shadow duration-300'>
          <div className='p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center'>
                  <Building className='h-6 w-6 text-white' />
                </div>
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-600'>
                  Empleados
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.empleados}
                </p>
              </div>
              <div className='text-green-500'>
                <ArrowUpRight className='h-5 w-5' />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <div className='p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Resumen Financiero
            </h3>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-4 bg-green-50 rounded-lg'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                    <DollarSign className='h-4 w-4 text-white' />
                  </div>
                  <span className='ml-3 font-medium text-gray-700'>Total Pagado</span>
                </div>
                <span className='text-lg font-bold text-green-600'>
                  {formatCurrency(stats.totalPagado)}
                </span>
              </div>
              <div className='flex justify-between items-center p-4 bg-yellow-50 rounded-lg'>
                <div className='flex items-center'>
                  <div className='w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center'>
                    <Calendar className='h-4 w-4 text-white' />
                  </div>
                  <span className='ml-3 font-medium text-gray-700'>Total Pendiente</span>
                </div>
                <span className='text-lg font-bold text-yellow-600'>
                  {formatCurrency(stats.totalPendiente)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Actividad Reciente
            </h3>
            <div className='space-y-3'>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'venta' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {activity.type === 'venta' ? (
                        <TrendingUp className='h-4 w-4 text-white' />
                      ) : (
                        <DollarSign className='h-4 w-4 text-white' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {activity.title}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {activity.description} • {formatDate(activity.date)}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-medium text-gray-900'>
                        {formatCurrency(activity.amount)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <Activity className='h-12 w-12 mx-auto mb-2 text-gray-300' />
                  <p>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Acciones Rápidas
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Button
              onClick={() => navigate('/clientes')}
              className='flex flex-col items-center p-4 h-auto'
            >
              <Users className='h-6 w-6 mb-2' />
              <span>Gestionar Clientes</span>
            </Button>
            <Button
              onClick={() => navigate('/ventas')}
              className='flex flex-col items-center p-4 h-auto'
            >
              <TrendingUp className='h-6 w-6 mb-2' />
              <span>Nueva Venta</span>
            </Button>
            <Button
              onClick={() => navigate('/cobranza')}
              className='flex flex-col items-center p-4 h-auto'
            >
              <DollarSign className='h-6 w-6 mb-2' />
              <span>Gestionar Cobranzas</span>
            </Button>
            <Button
              onClick={() => navigate('/rrhh')}
              className='flex flex-col items-center p-4 h-auto'
            >
              <Building className='h-6 w-6 mb-2' />
              <span>Gestionar RRHH</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
