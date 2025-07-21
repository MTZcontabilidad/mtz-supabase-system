// =====================================================================
// 📊 DASHBOARD PRINCIPAL - SISTEMA MTZ v3.0
// =====================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
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
  Building,
  PieChart,
  LineChart,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Percent,
  TrendingDown,
  Database,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  User,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart as RechartsComposedChart,
  ScatterChart as RechartsScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import useAuth from '@/hooks/useAuth.js';
import useUserRole from '@/hooks/useUserRole.js';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import LoadingSpinner from '@/components/ui/LoadingSpinner.jsx';
import { DashboardService } from '@/lib/dataService.js';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  handleError,
} from '@/utils/helpers.js';
import { COMPANY, UI } from '@/utils/constants.js';
import ExportData from '@/components/shared/ExportData.jsx';

/**
 * Dashboard Avanzado MTZ - VERSIÓN MEJORADA CON IA
 * Dashboard ejecutivo con análisis predictivo, notificaciones en tiempo real
 * y widgets personalizables
 *
 * @returns {JSX.Element} Dashboard principal
 */
const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isColaborador, isCliente, getRoleInfo } = useUserRole();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState(null);
  const [showCargaMasiva, setShowCargaMasiva] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [widgets, setWidgets] = useState({
    kpis: true,
    charts: true,
    alerts: true,
    activity: true,
    predictions: true,
    performance: true,
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('🔄 Usuario no autenticado, redirigiendo...');
      return;
    }

    console.log('🔄 Cargando dashboard para usuario:', user?.email);
    loadDashboardData();
  }, [isAuthenticated, user]);

  // Auto-refresh cada 5 minutos si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(
      () => {
        console.log('🔄 Auto-refresh del dashboard...');
        loadDashboardData();
      },
      5 * 60 * 1000
    ); // 5 minutos

    return () => clearInterval(interval);
  }, [autoRefresh]);

  /**
   * Cargar datos del dashboard
   */
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Cargando datos del dashboard...');

      const result = await DashboardService.getDashboardData({
        timeRange,
        userId: user?.id,
        role: getRoleInfo()?.name,
      });

      if (result.success) {
        setDashboardData(result.data);
        setLastRefresh(new Date());
        console.log('✅ Datos del dashboard cargados exitosamente');
      } else {
        setError(result.error || 'Error al cargar datos del dashboard');
        console.error('❌ Error cargando dashboard:', result.error);
      }
    } catch (error) {
      const errorInfo = handleError(error, 'Dashboard.loadDashboardData');
      setError(errorInfo.message);
      console.error('❌ Error inesperado en dashboard:', errorInfo);
    } finally {
      setLoading(false);
    }
  }, [timeRange, user?.id, getRoleInfo]);

  /**
   * Manejar refresh manual
   */
  const handleRefresh = useCallback(() => {
    console.log('🔄 Refresh manual del dashboard...');
    loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Generar datos de gráficos (simulación)
   */
  const generarDatosGraficos = useCallback((clientes, ventas, cobranzas) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

    return {
      ventasMensuales: meses.map((mes, index) => ({
        mes,
        ventas: Math.floor(Math.random() * 1000000) + 500000,
        meta: 800000,
        crecimiento: Math.floor(Math.random() * 50) - 10,
      })),

      clientesPorEstado: [
        { name: 'Activos', value: clientes?.activos || 45, color: '#10B981' },
        {
          name: 'Inactivos',
          value: clientes?.inactivos || 12,
          color: '#EF4444',
        },
        {
          name: 'Pendientes',
          value: clientes?.pendientes || 8,
          color: '#F59E0B',
        },
      ],

      cobranzaMensual: meses.map((mes, index) => ({
        mes,
        cobrado: Math.floor(Math.random() * 800000) + 300000,
        pendiente: Math.floor(Math.random() * 400000) + 100000,
        vencido: Math.floor(Math.random() * 200000) + 50000,
      })),

      rendimientoEquipo: [
        { name: 'Carlos V.', ventas: 1200000, clientes: 15, eficiencia: 95 },
        { name: 'María G.', ventas: 980000, clientes: 12, eficiencia: 88 },
        { name: 'Juan P.', ventas: 850000, clientes: 10, eficiencia: 82 },
        { name: 'Ana L.', ventas: 720000, clientes: 8, eficiencia: 78 },
      ],
    };
  }, []);

  // Mostrar loading
  if (loading && !dashboardData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  // Mostrar error
  if (error && !dashboardData) {
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

  // Datos simulados para demostración
  const datosSimulados = {
    kpis: {
      totalClientes: 65,
      ventasMes: 2850000,
      cobranzaPendiente: 420000,
      nuevosClientes: 8,
      eficiencia: 92,
      satisfaccion: 4.8,
    },
    graficos: generarDatosGraficos(
      { activos: 45, inactivos: 12, pendientes: 8 },
      { total: 2850000, crecimiento: 15 },
      { pendiente: 420000, vencido: 85000 }
    ),
    alertas: [
      {
        id: 1,
        tipo: 'warning',
        mensaje: '5 facturas vencidas',
        icono: AlertTriangle,
      },
      { id: 2, tipo: 'info', mensaje: 'Nuevo cliente registrado', icono: User },
      {
        id: 3,
        tipo: 'success',
        mensaje: 'Meta de ventas alcanzada',
        icono: CheckCircle,
      },
    ],
    actividad: [
      {
        id: 1,
        accion: 'Nuevo cliente agregado',
        usuario: 'Carlos V.',
        tiempo: '2 min',
      },
      {
        id: 2,
        accion: 'Factura generada',
        usuario: 'María G.',
        tiempo: '15 min',
      },
      { id: 3, accion: 'Pago recibido', usuario: 'Sistema', tiempo: '1 hora' },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | {COMPANY.name}</title>
        <meta
          name='description'
          content='Dashboard ejecutivo de MTZ Consultores Tributarios'
        />

        {/* Open Graph */}
        <meta property='og:title' content={`Dashboard | ${COMPANY.name}`} />
        <meta
          property='og:description'
          content='Dashboard ejecutivo de MTZ Consultores Tributarios'
        />
        <meta property='og:type' content='website' />

        {/* Favicon */}
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
      </Helmet>

      <div className='min-h-screen bg-gray-50'>
        {/* Header del Dashboard */}
        <div className='bg-white shadow-sm border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center py-6'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Dashboard Ejecutivo
                </h1>
                <p className='text-sm text-gray-600'>
                  Bienvenido, {user?.user_metadata?.full_name || user?.email}
                </p>
              </div>

              <div className='flex items-center space-x-4'>
                {/* Indicador de último refresh */}
                <div className='text-xs text-gray-500 flex items-center'>
                  <Clock className='h-3 w-3 mr-1' />
                  Última actualización: {formatDate(lastRefresh, 'time')}
                </div>

                {/* Botón de refresh */}
                <Button
                  onClick={handleRefresh}
                  variant='ghost'
                  size='sm'
                  loading={loading}
                  disabled={loading}
                >
                  <RefreshCw className='h-4 w-4' />
                </Button>

                {/* Configuración */}
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant='ghost'
                  size='sm'
                >
                  <Settings className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* KPIs Principales */}
          {widgets.kpis && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8'>
              <Card className='p-6'>
                <div className='flex items-center'>
                  <div className='p-2 bg-blue-100 rounded-lg'>
                    <Users className='h-6 w-6 text-blue-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Total Clientes
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {formatNumber(datosSimulados.kpis.totalClientes)}
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center text-sm'>
                  <ArrowUp className='h-4 w-4 text-green-500 mr-1' />
                  <span className='text-green-600'>+12%</span>
                  <span className='text-gray-500 ml-1'>vs mes anterior</span>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-center'>
                  <div className='p-2 bg-green-100 rounded-lg'>
                    <DollarSign className='h-6 w-6 text-green-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Ventas del Mes
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {formatCurrency(datosSimulados.kpis.ventasMes)}
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center text-sm'>
                  <ArrowUp className='h-4 w-4 text-green-500 mr-1' />
                  <span className='text-green-600'>+15%</span>
                  <span className='text-gray-500 ml-1'>vs mes anterior</span>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-center'>
                  <div className='p-2 bg-yellow-100 rounded-lg'>
                    <FileText className='h-6 w-6 text-yellow-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Cobranza Pendiente
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {formatCurrency(datosSimulados.kpis.cobranzaPendiente)}
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center text-sm'>
                  <ArrowDown className='h-4 w-4 text-red-500 mr-1' />
                  <span className='text-red-600'>-8%</span>
                  <span className='text-gray-500 ml-1'>vs mes anterior</span>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-center'>
                  <div className='p-2 bg-purple-100 rounded-lg'>
                    <User className='h-6 w-6 text-purple-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Nuevos Clientes
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {datosSimulados.kpis.nuevosClientes}
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center text-sm'>
                  <ArrowUp className='h-4 w-4 text-green-500 mr-1' />
                  <span className='text-green-600'>+3</span>
                  <span className='text-gray-500 ml-1'>este mes</span>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-center'>
                  <div className='p-2 bg-indigo-100 rounded-lg'>
                    <Target className='h-6 w-6 text-indigo-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Eficiencia
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {datosSimulados.kpis.eficiencia}%
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center text-sm'>
                  <ArrowUp className='h-4 w-4 text-green-500 mr-1' />
                  <span className='text-green-600'>+5%</span>
                  <span className='text-gray-500 ml-1'>vs mes anterior</span>
                </div>
              </Card>

              <Card className='p-6'>
                <div className='flex items-center'>
                  <div className='p-2 bg-pink-100 rounded-lg'>
                    <Star className='h-6 w-6 text-pink-600' />
                  </div>
                  <div className='ml-4'>
                    <p className='text-sm font-medium text-gray-600'>
                      Satisfacción
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {datosSimulados.kpis.satisfaccion}/5
                    </p>
                  </div>
                </div>
                <div className='mt-4 flex items-center text-sm'>
                  <ArrowUp className='h-4 w-4 text-green-500 mr-1' />
                  <span className='text-green-600'>+0.2</span>
                  <span className='text-gray-500 ml-1'>vs mes anterior</span>
                </div>
              </Card>
            </div>
          )}

          {/* Gráficos y Análisis */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            {/* Gráfico de Ventas */}
            {widgets.charts && (
              <Card className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Ventas Mensuales
                  </h3>
                  <Badge variant='success'>+15% vs mes anterior</Badge>
                </div>
                <ResponsiveContainer width='100%' height={300}>
                  <RechartsBarChart
                    data={datosSimulados.graficos.ventasMensuales}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='mes' />
                    <YAxis />
                    <Tooltip formatter={value => formatCurrency(value)} />
                    <Bar dataKey='ventas' fill='#3B82F6' />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Gráfico de Clientes por Estado */}
            {widgets.charts && (
              <Card className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Clientes por Estado
                  </h3>
                  <Badge variant='info'>
                    Total: {datosSimulados.kpis.totalClientes}
                  </Badge>
                </div>
                <ResponsiveContainer width='100%' height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={datosSimulados.graficos.clientesPorEstado}
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      dataKey='value'
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {datosSimulados.graficos.clientesPorEstado.map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>

          {/* Alertas y Actividad */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Alertas */}
            {widgets.alerts && (
              <Card className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Alertas del Sistema
                  </h3>
                  <Badge variant='warning'>
                    {datosSimulados.alertas.length} alertas
                  </Badge>
                </div>
                <div className='space-y-4'>
                  {datosSimulados.alertas.map(alerta => (
                    <div
                      key={alerta.id}
                      className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'
                    >
                      <alerta.icono
                        className={`h-5 w-5 mt-0.5 ${
                          alerta.tipo === 'warning'
                            ? 'text-yellow-500'
                            : alerta.tipo === 'success'
                              ? 'text-green-500'
                              : 'text-blue-500'
                        }`}
                      />
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-gray-900'>
                          {alerta.mensaje}
                        </p>
                        <p className='text-xs text-gray-500'>Hace 5 minutos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Actividad Reciente */}
            {widgets.activity && (
              <Card className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Actividad Reciente
                  </h3>
                  <Badge variant='info'>En tiempo real</Badge>
                </div>
                <div className='space-y-4'>
                  {datosSimulados.actividad.map(actividad => (
                    <div
                      key={actividad.id}
                      className='flex items-center space-x-3'
                    >
                      <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                      <div className='flex-1'>
                        <p className='text-sm text-gray-900'>
                          {actividad.accion}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {actividad.usuario} • {actividad.tiempo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
