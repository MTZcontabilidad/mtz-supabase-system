// =====================================================================
// 📊 DASHBOARD PRINCIPAL - SISTEMA MTZ v3.0 (DATOS REALES)
// =====================================================================

import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Clock,
  FileText,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { dataService } from '@/lib/dataService.js';

/**
 * Dashboard Principal MTZ - VERSIÓN CON DATOS REALES
 * Panel de control con métricas, gráficos y actividad reciente desde Supabase
 */
const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardInfo, setDashboardInfo] = useState(null);

  // Cargar datos del dashboard desde Supabase
  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando dashboard desde Supabase...');

      const data = await dataService.getDashboardData();
      setDashboardInfo(data);
    } catch (err) {
      console.error('❌ Error cargando dashboard:', err);
      setError('Error al cargar el dashboard desde la base de datos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  // Manejar refresh
  const handleRefresh = () => {
    cargarDashboard();
  };

  // Mostrar loading
  if (loading && !dashboardInfo) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  // Mostrar error
  if (error && !dashboardInfo) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <AlertTriangle className='h-16 w-16 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Error al cargar el dashboard
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={handleRefresh} variant='primary'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Usar datos reales de Supabase
  const data = dashboardInfo;

  // Si no hay datos, mostrar mensaje
  if (!data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <AlertTriangle className='h-16 w-16 text-yellow-500 mx-auto mb-4' />
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            No hay datos disponibles
          </h2>
          <p className='text-gray-600 mb-4'>
            No se encontraron datos en la base de datos. Ejecuta el script de
            datos de prueba.
          </p>
          <Button onClick={handleRefresh} variant='primary'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - MTZ Consultores Tributarios</title>
        <meta
          name='description'
          content='Panel de control MTZ con datos reales'
        />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Dashboard MTZ</h1>
            <p className='text-gray-600'>
              Panel de control y métricas del sistema (Datos reales de Supabase)
            </p>
          </div>
          <Button onClick={handleRefresh} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
        </div>

        {/* KPIs Principales */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clientes
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {data.kpis.totalClientes.toLocaleString()}
                </p>
                <p className='text-sm text-green-600 flex items-center mt-1'>
                  <TrendingUp className='h-4 w-4 mr-1' />+
                  {data.kpis.nuevosClientes} este mes
                </p>
              </div>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Ventas del Mes
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${data.kpis.ventasMes.toLocaleString()}
                </p>
                <p className='text-sm text-green-600 flex items-center mt-1'>
                  <TrendingUp className='h-4 w-4 mr-1' />
                  Datos reales de Supabase
                </p>
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <DollarSign className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Cobranza Pendiente
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  ${data.kpis.cobranzaPendiente.toLocaleString()}
                </p>
                <p className='text-sm text-yellow-600 flex items-center mt-1'>
                  <AlertTriangle className='h-4 w-4 mr-1' />
                  {data.kpis.facturasPendientes} facturas pendientes
                </p>
              </div>
              <div className='p-3 bg-yellow-100 rounded-lg'>
                <AlertTriangle className='h-6 w-6 text-yellow-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Eficiencia</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {data.kpis.eficiencia}%
                </p>
                <p className='text-sm text-green-600 flex items-center mt-1'>
                  <Award className='h-4 w-4 mr-1' />
                  Meta: 90%
                </p>
              </div>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <Activity className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </Card>
        </div>

        {/* Gráficos y Métricas */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Gráfico de Ventas */}
          <Card>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Ventas Mensuales (Datos Reales)
              </h3>
              <Badge variant='success'>En tiempo real</Badge>
            </div>
            <div className='space-y-3'>
              {data.graficos.ventasMensuales?.slice(0, 6).map((item, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>{item.mes}</span>
                  <div className='flex items-center space-x-4'>
                    <span className='text-sm font-medium'>
                      ${item.ventas.toLocaleString()}
                    </span>
                    <span
                      className={`text-xs ${
                        item.crecimiento >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {item.crecimiento >= 0 ? '+' : ''}
                      {item.crecimiento}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Distribución de Clientes */}
          <Card>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Distribución de Clientes
              </h3>
              <Badge variant='info'>{data.kpis.totalClientes} total</Badge>
            </div>
            <div className='space-y-3'>
              {data.graficos.clientesPorEstado?.map((item, index) => (
                <div key={index} className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-full mr-3'
                      style={{ backgroundColor: item.color }}
                    />
                    <span className='text-sm text-gray-600'>{item.name}</span>
                  </div>
                  <span className='text-sm font-medium'>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Rendimiento del Equipo */}
        <Card>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Rendimiento del Equipo
            </h3>
            <Badge variant='success'>Excelente</Badge>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {data.graficos.rendimientoEquipo?.map((miembro, index) => (
              <div
                key={index}
                className='text-center p-4 bg-gray-50 rounded-lg'
              >
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2'>
                  <User className='h-6 w-6 text-blue-600' />
                </div>
                <h4 className='font-medium text-gray-900'>{miembro.name}</h4>
                <p className='text-sm text-gray-600'>
                  ${miembro.ventas.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>
                  {miembro.clientes} clientes
                </p>
                <Badge
                  variant={miembro.eficiencia >= 90 ? 'success' : 'warning'}
                  className='mt-1'
                >
                  {miembro.eficiencia}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Alertas y Actividad */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Alertas */}
          <Card>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Alertas Recientes
              </h3>
              <Badge variant='warning'>
                {data.alertas?.length || 0} nuevas
              </Badge>
            </div>
            <div className='space-y-3'>
              {data.alertas?.length > 0 ? (
                data.alertas.map(alerta => (
                  <div
                    key={alerta.id}
                    className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'
                  >
                    <div
                      className={`p-2 rounded-full ${
                        alerta.tipo === 'warning'
                          ? 'bg-yellow-100'
                          : alerta.tipo === 'success'
                            ? 'bg-green-100'
                            : 'bg-blue-100'
                      }`}
                    >
                      {alerta.tipo === 'warning' ? (
                        <AlertTriangle className='h-4 w-4 text-yellow-600' />
                      ) : alerta.tipo === 'success' ? (
                        <CheckCircle className='h-4 w-4 text-green-600' />
                      ) : (
                        <User className='h-4 w-4 text-blue-600' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900'>
                        {alerta.mensaje}
                      </p>
                      <p className='text-xs text-gray-500'>{alerta.fecha}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-4 text-gray-500'>
                  No hay alertas pendientes
                </div>
              )}
            </div>
          </Card>

          {/* Actividad Reciente */}
          <Card>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Actividad Reciente
              </h3>
              <Badge variant='info'>En tiempo real</Badge>
            </div>
            <div className='space-y-3'>
              {data.actividad?.length > 0 ? (
                data.actividad.map(actividad => (
                  <div
                    key={actividad.id}
                    className='flex items-start space-x-3'
                  >
                    <div className='p-2 bg-blue-100 rounded-full'>
                      <Clock className='h-4 w-4 text-blue-600' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900'>
                        {actividad.accion}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {actividad.usuario} • {actividad.tiempo}
                      </p>
                      {actividad.detalles && (
                        <p className='text-xs text-gray-400 mt-1'>
                          {actividad.detalles}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-4 text-gray-500'>
                  No hay actividad reciente
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Métricas Adicionales */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card>
            <div className='text-center'>
              <div className='p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3'>
                <Target className='h-6 w-6 text-green-600' />
              </div>
              <h4 className='font-medium text-gray-900'>Satisfacción</h4>
              <p className='text-2xl font-bold text-gray-900'>
                {data.kpis.satisfaccion}/5.0
              </p>
              <p className='text-sm text-green-600'>Excelente</p>
            </div>
          </Card>

          <Card>
            <div className='text-center'>
              <div className='p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3'>
                <FileText className='h-6 w-6 text-blue-600' />
              </div>
              <h4 className='font-medium text-gray-900'>Facturas Pendientes</h4>
              <p className='text-2xl font-bold text-gray-900'>
                {data.kpis.facturasPendientes}
              </p>
              <p className='text-sm text-yellow-600'>Requieren atención</p>
            </div>
          </Card>

          <Card>
            <div className='text-center'>
              <div className='p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3'>
                <BarChart3 className='h-6 w-6 text-purple-600' />
              </div>
              <h4 className='font-medium text-gray-900'>Ingresos Anuales</h4>
              <p className='text-2xl font-bold text-gray-900'>
                ${(data.kpis.ingresosAnuales / 1000000).toFixed(1)}M
              </p>
              <p className='text-sm text-green-600'>Datos reales 2024</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
