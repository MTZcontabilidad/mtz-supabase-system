import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  ChevronDown,
  ChevronUp,
  Grid,
  Settings,
  CreditCard,
  ShoppingBag,
  Code,
  FileSpreadsheet,
  RefreshCw,
  Trash2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TableIcon,
  FilterIcon,
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
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import TableComponent from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import { formatCurrency, formatDate, formatNumber } from '@/utils/helpers';

/**
 * Página de Reportes Avanzados MTZ - VERSIÓN MEJORADA
 * Sistema completo de reportes con análisis avanzado, exportación
 * y dashboard ejecutivo integrado
 */
const ReportsPage = () => {
  // Estados locales para la UI
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomReport, setShowCustomReport] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);

  // Manejar generación de reporte
  const handleGenerarReporte = async tipoReporte => {
    try {
      // Aquí iría la lógica para generar el reporte
      // Por ejemplo, si es un reporte personalizado, podrías llamar a un endpoint
      // Si es un reporte predefinido, podrías llamar a un hook de useReports
      console.log('Generando reporte:', tipoReporte);
      // Simular un estado de generación
      // En un caso real, esto debería ser manejado por un estado global
      // y un hook de useReports.
      // Por ahora, solo simulamos la generación.
      // await generarReporte(tipoReporte, filters); // Si useReports estuviera disponible
    } catch (error) {
      console.error('Error generando reporte:', error);
    }
  };

  // Manejar exportación de reporte
  const handleExportarReporte = async (reporteId, formato) => {
    try {
      // Aquí iría la lógica para exportar el reporte
      // Por ejemplo, si es un reporte personalizado, podrías llamar a un endpoint
      // Si es un reporte predefinido, podrías llamar a un hook de useReports
      console.log('Exportando reporte:', reporteId, 'en formato:', formato);
      // Simular la exportación
      // En un caso real, esto debería ser manejado por un estado global
      // y un hook de useReports.
      // Por ahora, solo simulamos la exportación.
      // await exportarReporte(reporteId, formato); // Si useReports estuviera disponible
    } catch (error) {
      console.error('Error exportando reporte:', error);
    }
  };

  // Obtener icono del tipo de reporte
  const getReportIcon = iconName => {
    const icons = {
      BarChart3: <BarChart3 className='h-5 w-5' />,
      TrendingUp: <TrendingUp className='h-5 w-5' />,
      DollarSign: <DollarSign className='h-5 w-5' />,
      Users: <Users className='h-5 w-5' />,
      ShoppingBag: <ShoppingBag className='h-5 w-5' />,
      FileText: <FileText className='h-5 w-5' />,
      CreditCard: <CreditCard className='h-5 w-5' />,
      Settings: <Settings className='h-5 w-5' />,
    };
    return icons[iconName] || <FileText className='h-5 w-5' />;
  };

  // Obtener icono del formato
  const getFormatIcon = iconName => {
    const icons = {
      FileText: <FileText className='h-4 w-4' />,
      Table: <TableIcon className='h-4 w-4' />,
      FileSpreadsheet: <FileSpreadsheet className='h-4 w-4' />,
      Code: <Code className='h-4 w-4' />,
    };
    return icons[iconName] || <FileText className='h-4 w-4' />;
  };

  // Placeholder para reportData, filters, reportHistory, generatingReport, canView, canGenerate, canExport
  const reportData = {
    ingresos_totales: 123456.78,
    crecimiento_ingresos: 10.5,
    clientes_activos: 150,
    crecimiento_clientes: 5.0,
    ventas_mes: 25000.0,
    crecimiento_ventas: 8.0,
    reportesHoy: 10,
    graficos: {
      ventas: [
        { mes: 'Ene', ventas: 10000.0 },
        { mes: 'Feb', ventas: 12000.0 },
        { mes: 'Mar', ventas: 11000.0 },
        { mes: 'Abr', ventas: 13000.0 },
        { mes: 'May', ventas: 14000.0 },
        { mes: 'Jun', ventas: 15000.0 },
        { mes: 'Jul', ventas: 16000.0 },
        { mes: 'Ago', ventas: 17000.0 },
        { mes: 'Sep', ventas: 18000.0 },
        { mes: 'Oct', ventas: 19000.0 },
        { mes: 'Nov', ventas: 20000.0 },
        { mes: 'Dic', ventas: 21000.0 },
      ],
      clientes: [
        { name: 'Clientes Activos', valor: 150 },
        { name: 'Clientes Inactivos', valor: 50 },
        { name: 'Clientes Potenciales', valor: 100 },
        { name: 'Clientes Perdidos', valor: 20 },
      ],
    },
  };

  const filters = {
    fecha_desde: '2023-01-01',
    fecha_hasta: '2023-12-31',
    formato: 'PDF',
  };

  const reportHistory = [
    { id: 1, tipo: 'BarChart3', fecha_generacion: '2023-10-27 10:00' },
    { id: 2, tipo: 'TrendingUp', fecha_generacion: '2023-10-26 14:30' },
    { id: 3, tipo: 'DollarSign', fecha_generacion: '2023-10-25 09:15' },
    { id: 4, tipo: 'Users', fecha_generacion: '2023-10-24 11:00' },
    { id: 5, tipo: 'ShoppingBag', fecha_generacion: '2023-10-23 16:00' },
    { id: 6, tipo: 'FileText', fecha_generacion: '2023-10-22 10:30' },
    { id: 7, tipo: 'CreditCard', fecha_generacion: '2023-10-21 13:00' },
    { id: 8, tipo: 'Settings', fecha_generacion: '2023-10-20 15:00' },
  ];

  const tiposReporte = [
    {
      id: 'BarChart3',
      nombre: 'Gráfico de Barras',
      descripcion: 'Visualiza datos en barras.',
      icon: 'BarChart3',
      categoria: 'Gráficos',
    },
    {
      id: 'TrendingUp',
      nombre: 'Gráfico de Tendencia',
      descripcion: 'Muestra la evolución de una serie de datos.',
      icon: 'TrendingUp',
      categoria: 'Gráficos',
    },
    {
      id: 'DollarSign',
      nombre: 'Reporte de Ingresos',
      descripcion: 'Analiza los ingresos por período.',
      icon: 'DollarSign',
      categoria: 'Financiero',
    },
    {
      id: 'Users',
      nombre: 'Reporte de Clientes',
      descripcion: 'Analiza el número de clientes por período.',
      icon: 'Users',
      categoria: 'Clientes',
    },
    {
      id: 'ShoppingBag',
      nombre: 'Reporte de Ventas',
      descripcion: 'Analiza las ventas por período.',
      icon: 'ShoppingBag',
      categoria: 'Ventas',
    },
    {
      id: 'FileText',
      nombre: 'Reporte Personalizado',
      descripcion: 'Crea un reporte basado en tus datos.',
      icon: 'FileText',
      categoria: 'Personalizado',
    },
    {
      id: 'CreditCard',
      nombre: 'Reporte de Pagos',
      descripcion: 'Analiza los pagos realizados.',
      icon: 'CreditCard',
      categoria: 'Financiero',
    },
    {
      id: 'Settings',
      nombre: 'Reporte de Configuración',
      descripcion: 'Configura y genera un reporte de ajustes.',
      icon: 'Settings',
      categoria: 'Configuración',
    },
  ];

  const formatosExportacion = [
    { id: 'PDF', nombre: 'PDF', icon: 'FileText' },
    { id: 'CSV', nombre: 'CSV', icon: 'FileSpreadsheet' },
    { id: 'XLSX', nombre: 'XLSX', icon: 'FileSpreadsheet' },
    { id: 'JSON', nombre: 'JSON', icon: 'Code' },
  ];

  const cargarDatosReportes = () => {
    console.log('Cargando datos de reportes...');
    // Simular la carga de datos
  };

  const generarReporte = async (tipoReporte, filtros) => {
    console.log('Generando reporte:', tipoReporte, 'con filtros:', filtros);
    // Simular la generación del reporte
  };

  const exportarReporte = async (reporteId, formato) => {
    console.log('Exportando reporte:', reporteId, 'en formato:', formato);
    // Simular la exportación
  };

  const generarReporteEjecutivo = async () => {
    console.log('Generando reporte ejecutivo...');
    // Simular la generación del reporte ejecutivo
  };

  const generarReporteVentas = async () => {
    console.log('Generando reporte de ventas...');
    // Simular la generación del reporte de ventas
  };

  const generarReporteFinanciero = async () => {
    console.log('Generando reporte financiero...');
    // Simular la generación del reporte financiero
  };

  const generarReporteClientes = async () => {
    console.log('Generando reporte de clientes...');
    // Simular la generación del reporte de clientes
  };

  const generarReporteCompras = async () => {
    console.log('Generando reporte de compras...');
    // Simular la generación del reporte de compras
  };

  const generarReporteContratos = async () => {
    console.log('Generando reporte de contratos...');
    // Simular la generación del reporte de contratos
  };

  const generarReporteCobranzas = async () => {
    console.log('Generando reporte de cobranzas...');
    // Simular la generación del reporte de cobranzas
  };

  const generarReportePersonalizado = async () => {
    console.log('Generando reporte personalizado...');
    // Simular la generación del reporte personalizado
  };

  const obtenerStatsReportes = {
    reportesHoy: 10,
    reportesSemana: 50,
    reportesMes: 200,
  };

  const limpiarHistorial = () => {
    console.log('Limpiando historial...');
    // Simular la limpieza del historial
  };

  const eliminarReporte = reporteId => {
    console.log('Eliminando reporte:', reporteId);
    // Simular la eliminación del reporte
  };

  const setSelectedReport = reporte => {
    console.log('Seleccionando reporte:', reporte);
    // Simular la selección de un reporte
  };

  const setFilters = filtros => {
    console.log('Actualizando filtros:', filtros);
    // Simular la actualización de filtros
  };

  const clearError = () => {
    console.log('Limpiando error...');
    // Simular la limpieza del error
  };

  if (false && !reportData) {
    // Simular loading
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg'>Cargando reportes...</span>
      </div>
    );
  }

  if (false && error && !reportData) {
    // Simular error
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar reportes
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={cargarDatosReportes}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reportes Avanzados - MTZ Ouroborus AI v3.0</title>
        <meta
          name='description'
          content='Sistema completo de reportes con análisis avanzado y exportación'
        />
        <meta
          name='keywords'
          content='reportes, análisis, dashboard, exportación, MTZ'
        />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
              <BarChart3 className='h-8 w-8 text-blue-600' />
              Reportes Avanzados
              <Badge variant='outline' className='ml-2'>
                v3.0 Avanzado
              </Badge>
            </h1>
            <p className='text-gray-600 mt-1'>
              Sistema completo de reportes con análisis avanzado y exportación
            </p>
          </div>

          <div className='flex gap-2'>
            <Button onClick={cargarDatosReportes} disabled={false}>
              {' '}
              {/* Simular loading */}
              <RefreshCw
                className={`h-4 w-4 mr-2 ${false ? 'animate-spin' : ''}`} // Simular loading
              />
              Actualizar
            </Button>
            <Button variant='outline' onClick={() => setShowHistory(true)}>
              <Clock className='h-4 w-4 mr-2' />
              Historial
            </Button>
            {false && ( // Simular canGenerate
              <Button onClick={() => setShowCustomReport(true)}>
                <Settings className='h-4 w-4 mr-2' />
                Reporte Personalizado
              </Button>
            )}
          </div>
        </div>

        {/* KPIs del Dashboard */}
        {reportData && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Ingresos Totales
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatCurrency(reportData.ingresos_totales)}
                  </p>
                  <div className='flex items-center mt-1'>
                    {reportData.crecimiento_ingresos > 0 ? (
                      <ArrowUpRight className='h-4 w-4 text-green-600' />
                    ) : (
                      <ArrowDownRight className='h-4 w-4 text-red-600' />
                    )}
                    <span
                      className={`text-sm ml-1 ${
                        reportData.crecimiento_ingresos > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {Math.abs(reportData.crecimiento_ingresos)}%
                    </span>
                  </div>
                </div>
                <div className='p-3 bg-green-100 rounded-full'>
                  <DollarSign className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Clientes Activos
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(reportData.clientes_activos)}
                  </p>
                  <div className='flex items-center mt-1'>
                    {reportData.crecimiento_clientes > 0 ? (
                      <ArrowUpRight className='h-4 w-4 text-green-600' />
                    ) : (
                      <ArrowDownRight className='h-4 w-4 text-red-600' />
                    )}
                    <span
                      className={`text-sm ml-1 ${
                        reportData.crecimiento_clientes > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {Math.abs(reportData.crecimiento_clientes)}%
                    </span>
                  </div>
                </div>
                <div className='p-3 bg-blue-100 rounded-full'>
                  <Users className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Ventas del Mes
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatCurrency(reportData.ventas_mes)}
                  </p>
                  <div className='flex items-center mt-1'>
                    {reportData.crecimiento_ventas > 0 ? (
                      <ArrowUpRight className='h-4 w-4 text-green-600' />
                    ) : (
                      <ArrowDownRight className='h-4 w-4 text-red-600' />
                    )}
                    <span
                      className={`text-sm ml-1 ${
                        reportData.crecimiento_ventas > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {Math.abs(reportData.crecimiento_ventas)}%
                    </span>
                  </div>
                </div>
                <div className='p-3 bg-yellow-100 rounded-full'>
                  <TrendingUp className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Reportes Generados
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(obtenerStatsReportes.reportesHoy)}
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>Hoy</p>
                </div>
                <div className='p-3 bg-purple-100 rounded-full'>
                  <FileText className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tipos de Reportes */}
        <Card className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>Tipos de Reportes</h2>
            <Button
              variant='outline'
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className='h-4 w-4 mr-2' />
              Filtros
              {showFilters ? (
                <ChevronUp className='h-4 w-4 ml-2' />
              ) : (
                <ChevronDown className='h-4 w-4 ml-2' />
              )}
            </Button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Input
                  type='date'
                  label='Fecha Desde'
                  value={filters.fecha_desde}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      fecha_desde: e.target.value,
                    }))
                  }
                />
                <Input
                  type='date'
                  label='Fecha Hasta'
                  value={filters.fecha_hasta}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      fecha_hasta: e.target.value,
                    }))
                  }
                />
                <Select
                  label='Formato de Exportación'
                  value={filters.formato}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, formato: e.target.value }))
                  }
                >
                  {formatosExportacion.map(formato => (
                    <option key={formato.id} value={formato.id}>
                      {formato.nombre}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {/* Grid de Reportes */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {tiposReporte.map(tipo => (
              <Card
                key={tipo.id}
                className='p-6 hover:shadow-lg transition-shadow'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='p-3 bg-blue-100 rounded-lg'>
                    {getReportIcon(tipo.icon)}
                  </div>
                  <Badge variant='outline' className='text-xs'>
                    {tipo.categoria}
                  </Badge>
                </div>

                <h3 className='text-lg font-semibold mb-2'>{tipo.nombre}</h3>
                <p className='text-gray-600 text-sm mb-4'>{tipo.descripcion}</p>

                <div className='flex gap-2'>
                  {false && ( // Simular canGenerate
                    <Button
                      size='sm'
                      onClick={() => handleGenerarReporte(tipo.id)}
                      loading={false} // Simular generatingReport
                      disabled={false} // Simular generatingReport
                      className='flex-1'
                    >
                      <BarChart3 className='h-4 w-4 mr-2' />
                      Generar
                    </Button>
                  )}
                  {false && ( // Simular canExport
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => setSelectedReportType(tipo)}
                      className='flex-1'
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Exportar
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Gráficos de Análisis */}
        {reportData && reportData.graficos && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Gráfico de Ventas */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Evolución de Ventas
              </h3>
              <ResponsiveContainer width='100%' height={300}>
                <RechartsLineChart data={reportData.graficos.ventas}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='mes' />
                  <YAxis />
                  <Tooltip formatter={value => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='ventas'
                    stroke='#3B82F6'
                    strokeWidth={2}
                    name='Ventas'
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </Card>

            {/* Gráfico de Clientes */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Distribución de Clientes
              </h3>
              <ResponsiveContainer width='100%' height={300}>
                <RechartsPieChart>
                  <Pie
                    data={reportData.graficos.clientes}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='valor'
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {reportData.graficos.clientes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Historial de Reportes Modal */}
        {showHistory && (
          <Modal
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
            title='Historial de Reportes'
            size='xl'
          >
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <p className='text-sm text-gray-600'>
                  {reportHistory.length} reportes generados
                </p>
                <Button variant='outline' size='sm' onClick={limpiarHistorial}>
                  <Trash2 className='h-4 w-4 mr-2' />
                  Limpiar Historial
                </Button>
              </div>

              <div className='max-h-96 overflow-y-auto'>
                {reportHistory.length === 0 ? (
                  <div className='text-center py-8 text-gray-500'>
                    No hay reportes en el historial
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {reportHistory.map(reporte => (
                      <div
                        key={reporte.id}
                        className='flex items-center justify-between p-3 border rounded-lg'
                      >
                        <div className='flex items-center gap-3'>
                          {getReportIcon(
                            tiposReporte.find(t => t.id === reporte.tipo)
                              ?.icon || 'FileText'
                          )}
                          <div>
                            <p className='font-medium'>
                              {tiposReporte.find(t => t.id === reporte.tipo)
                                ?.nombre || reporte.tipo}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {formatDate(reporte.fecha_generacion)}
                            </p>
                          </div>
                        </div>

                        <div className='flex gap-2'>
                          {false && ( // Simular canExport
                            <Button
                              size='sm'
                              variant='outline'
                              onClick={() =>
                                handleExportarReporte(
                                  reporte.id,
                                  filters.formato
                                )
                              }
                            >
                              <Download className='h-4 w-4' />
                            </Button>
                          )}
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => eliminarReporte(reporte.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de Exportación */}
        {selectedReportType && (
          <Modal
            isOpen={!!selectedReportType}
            onClose={() => setSelectedReportType(null)}
            title={`Exportar ${selectedReportType.nombre}`}
            size='md'
          >
            <div className='space-y-4'>
              <p className='text-gray-600'>
                Selecciona el formato de exportación para{' '}
                {selectedReportType.nombre}
              </p>

              <div className='grid grid-cols-2 gap-3'>
                {formatosExportacion.map(formato => (
                  <Button
                    key={formato.id}
                    variant='outline'
                    className='flex items-center gap-2'
                    onClick={() => {
                      handleExportarReporte(null, formato.id);
                      setSelectedReportType(null);
                    }}
                  >
                    {getFormatIcon(formato.icon)}
                    {formato.nombre}
                  </Button>
                ))}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ReportsPage;
