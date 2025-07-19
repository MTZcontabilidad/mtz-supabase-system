import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Upload,
  Download,
  BarChart3,
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  Star,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui/index.js';
import ClientesChart from '../../components/charts/ClientesChart.jsx';
import CargaMasiva from '../../components/clientes/CargaMasiva.jsx';
import ExportData from '../../components/shared/ExportData.jsx';
import useAuth from '../../hooks/useAuth.js';
import useSupabaseAvanzado from '../../hooks/useSupabaseAvanzado.js';

/**
 * Dashboard Optimizado MTZ
 * Dashboard con análisis ejecutivos avanzados y métricas en tiempo real
 * Integrado con consultas optimizadas de Supabase
 */
const Dashboard = () => {
  const { role } = useAuth();
  const {
    dashboardData,
    loading,
    error,
    loadDashboardData,
    refreshData
  } = useSupabaseAvanzado();

  // Estados del dashboard
  const [showCargaMasiva, setShowCargaMasiva] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Función para refrescar datos manualmente
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Métricas del dashboard (fallback si no hay datos)
  const metrics = dashboardData || {
    totalClientes: 125,
    clientesActivos: 98,
    facturacionTotal: 2540000,
    ventasMes: 185000,
    crecimientoMensual: 12.5,
    satisfaccionCliente: 94.2,
    proyectosActivos: 23,
    tareasPendientes: 7
  };

  const quickStats = [
    {
      title: 'Total Clientes',
      value: metrics.totalClientes || 0,
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Facturación Total',
      value: `$${(metrics.facturacionTotal || 0).toLocaleString()}`,
      change: '+15.3%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Crecimiento',
      value: `${metrics.crecimientoMensual || 0}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Satisfacción',
      value: `${metrics.satisfaccionCliente || 0}%`,
      change: '+0.8%',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  const actividadReciente = [
    {
      id: 1,
      tipo: 'nuevo_cliente',
      titulo: 'Nuevo cliente registrado',
      descripcion: 'Empresa Tech Innovations S.A.',
      tiempo: 'Hace 2 horas',
      icon: Users,
      color: 'text-green-600',
    },
    {
      id: 2,
      tipo: 'factura',
      titulo: 'Factura generada',
      descripcion: 'Factura #2024-001 por $850.000',
      tiempo: 'Hace 4 horas',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      id: 3,
      tipo: 'reunion',
      titulo: 'Reunión programada',
      descripcion: 'Revisión proyecto MTZ Analytics',
      tiempo: 'Hace 6 horas',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      id: 4,
      tipo: 'alerta',
      titulo: 'Pago pendiente',
      descripcion: 'Cliente XYZ - Factura vencida',
      tiempo: 'Hace 1 día',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
          <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-red-900 mb-2'>Error al cargar datos</h3>
          <p className='text-red-700 mb-4'>{error}</p>
          <Button onClick={handleRefresh} variant='outline'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header con título y acciones */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Dashboard Ejecutivo</h1>
          <p className='text-gray-600 mt-1'>
            Resumen general y métricas clave del sistema MTZ
          </p>
        </div>
        <div className='flex gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          {role === 'admin' && (
            <>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowCargaMasiva(true)}
              >
                <Upload className='w-4 h-4 mr-2' />
                Carga Masiva
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowExportData(true)}
              >
                <Download className='w-4 h-4 mr-2' />
                Exportar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>{stat.title}</p>
                  <p className='text-2xl font-bold text-gray-900 mt-1'>{stat.value}</p>
                  <div className='flex items-center mt-2'>
                    <span className='text-sm font-medium text-green-600'>{stat.change}</span>
                    <span className='text-sm text-gray-500 ml-1'>vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Gráficos y análisis */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Gráfico de clientes */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>Análisis de Clientes</h3>
            <div className='flex items-center gap-2'>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className='text-sm border border-gray-300 rounded px-2 py-1'
              >
                <option value='week'>Esta semana</option>
                <option value='month'>Este mes</option>
                <option value='quarter'>Este trimestre</option>
                <option value='year'>Este año</option>
              </select>
            </div>
          </div>
          <ClientesChart data={dashboardData?.chartData} />
        </Card>

        {/* Actividad reciente */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-gray-900'>Actividad Reciente</h3>
            <Badge variant='outline' size='sm'>
              {actividadReciente.length} eventos
            </Badge>
          </div>
          <div className='space-y-4'>
            {actividadReciente.map(actividad => {
              const Icon = actividad.icon;
              return (
                <div key={actividad.id} className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                  <div className={`p-2 rounded-lg bg-gray-50`}>
                    <Icon className={`w-4 h-4 ${actividad.color}`} />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-gray-900 truncate'>
                      {actividad.titulo}
                    </p>
                    <p className='text-sm text-gray-600 truncate'>
                      {actividad.descripcion}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>{actividad.tiempo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Métricas avanzadas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-blue-50 rounded-lg'>
              <Target className='w-5 h-5 text-blue-600' />
            </div>
            <h3 className='font-semibold text-gray-900'>Objetivos del Mes</h3>
          </div>
          <div className='space-y-3'>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span>Nuevos Clientes</span>
                <span>8/12</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div className='bg-blue-600 h-2 rounded-full' style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span>Facturación</span>
                <span>$185k/$200k</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div className='bg-green-600 h-2 rounded-full' style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-green-50 rounded-lg'>
              <Activity className='w-5 h-5 text-green-600' />
            </div>
            <h3 className='font-semibold text-gray-900'>Performance</h3>
          </div>
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span>Tiempo respuesta</span>
              <Badge variant='success' size='sm'>Excelente</Badge>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Uptime sistema</span>
              <span className='font-medium'>99.9%</span>
            </div>
            <div className='flex justify-between text-sm'>
              <span>Satisfacción</span>
              <span className='font-medium text-green-600'>94.2%</span>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 bg-purple-50 rounded-lg'>
              <Zap className='w-5 h-5 text-purple-600' />
            </div>
            <h3 className='font-semibold text-gray-900'>Acciones Rápidas</h3>
          </div>
          <div className='space-y-2'>
            <Button variant='outline' size='sm' className='w-full justify-start'>
              <Users className='w-4 h-4 mr-2' />
              Nuevo Cliente
            </Button>
            <Button variant='outline' size='sm' className='w-full justify-start'>
              <FileText className='w-4 h-4 mr-2' />
              Generar Reporte
            </Button>
            <Button variant='outline' size='sm' className='w-full justify-start'>
              <BarChart3 className='w-4 h-4 mr-2' />
              Ver Analytics
            </Button>
          </div>
        </Card>
      </div>

      {/* Modales */}
      {showCargaMasiva && (
        <CargaMasiva
          isOpen={showCargaMasiva}
          onClose={() => setShowCargaMasiva(false)}
          onUploadComplete={(results) => {
            console.log('Carga masiva completada:', results);
            handleRefresh();
          }}
        />
      )}

      {showExportData && (
        <ExportData
          isOpen={showExportData}
          onClose={() => setShowExportData(false)}
          data={dashboardData?.rawData || []}
          filename='dashboard-export'
        />
      )}
    </div>
  );
};

export default Dashboard;