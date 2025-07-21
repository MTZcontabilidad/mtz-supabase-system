import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Shield,
  Zap,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Grid,
  Table as TableIcon,
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
import VentaForm from '@/components/ventas/VentaForm';
import { formatCurrency, formatDate, formatNumber } from '@/utils/helpers';
import ExportData from '@/components/shared/ExportData';
import GlobalSearch from '@/components/shared/GlobalSearch';

/**
 * Página de Gestión de Ventas Avanzada MTZ - VERSIÓN MEJORADA
 * Gestión completa de ventas con análisis avanzado, búsqueda inteligente
 * y sistema de facturación integrado
 */
const VentasPage = () => {
  // Estados locales para la UI
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [showExportData, setShowExportData] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, kanban
  const [showFilters, setShowFilters] = useState(false);

  // Manejar creación de venta
  const handleCrearVenta = async ventaData => {
    try {
      // Aquí iría la lógica para crear la venta
      // await crearVenta(ventaData); // useVentas.crearVenta
      console.log('Crear Venta:', ventaData);
      setShowModal(false);
      setEditingVenta(null);
    } catch (error) {
      console.error('Error creando venta:', error);
    }
  };

  // Manejar actualización de venta
  const handleActualizarVenta = async ventaData => {
    try {
      // Aquí iría la lógica para actualizar la venta
      // await actualizarVenta(editingVenta.id, ventaData); // useVentas.actualizarVenta
      console.log('Actualizar Venta:', editingVenta.id, ventaData);
      setShowModal(false);
      setEditingVenta(null);
    } catch (error) {
      console.error('Error actualizando venta:', error);
    }
  };

  // Manejar eliminación de venta
  const handleEliminarVenta = async ventaId => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        // Aquí iría la lógica para eliminar la venta
        // await eliminarVenta(ventaId); // useVentas.eliminarVenta
        console.log('Eliminar Venta:', ventaId);
      } catch (error) {
        console.error('Error eliminando venta:', error);
      }
    }
  };

  // Manejar ordenamiento
  const handleSort = key => {
    // Aquí iría la lógica para manejar el ordenamiento
    console.log('Ordenar por:', key);
  };

  // Columnas para la tabla
  const columns = [
    {
      key: 'fecha_emision',
      label: 'Fecha',
      render: value => formatDate(value),
      sortable: true,
    },
    {
      key: 'cliente',
      label: 'Cliente',
      sortable: true,
    },
    {
      key: 'numero_factura',
      label: 'N° Factura',
      sortable: true,
    },
    {
      key: 'monto_total',
      label: 'Total',
      render: value => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value, venta) => (
        <Badge variant={venta?.estado_display?.color || 'default'}>
          {venta?.estado_display?.label || value}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, venta) => (
        <div className='flex gap-2'>
          {/* Aquí irían las acciones de actualización/eliminación */}
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setEditingVenta(venta);
              setShowModal(true);
            }}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='destructive'
            onClick={() => handleEliminarVenta(venta.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  // Datos para exportar
  const exportColumns = [
    { key: 'fecha_emision', label: 'Fecha' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'numero_factura', label: 'N° Factura' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'monto_total', label: 'Total' },
    { key: 'estado', label: 'Estado' },
  ];

  // Placeholder para datos de ventas
  const ventas = [
    {
      id: 1,
      fecha_emision: '2023-10-26',
      cliente: 'Cliente A',
      numero_factura: 'F001',
      descripcion: 'Venta de productos varios',
      monto_total: 1200.5,
      estado: 'pagado',
      estado_display: { label: 'Pagado', color: 'green' },
    },
    {
      id: 2,
      fecha_emision: '2023-10-25',
      cliente: 'Cliente B',
      numero_factura: 'F002',
      descripcion: 'Venta de equipos de oficina',
      monto_total: 800.0,
      estado: 'pendiente',
      estado_display: { label: 'Pendiente', color: 'yellow' },
    },
    {
      id: 3,
      fecha_emision: '2023-10-24',
      cliente: 'Cliente A',
      numero_factura: 'F003',
      descripcion: 'Venta de software',
      monto_total: 1500.75,
      estado: 'vencido',
      estado_display: { label: 'Vencido', color: 'red' },
    },
  ];

  const ventasFiltradas = ventas.filter(venta => {
    const matchesSearch =
      venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      filters.fecha_desde &&
      new Date(venta.fecha_emision) >= new Date(filters.fecha_desde);
    const matchesDateHasta =
      filters.fecha_hasta &&
      new Date(venta.fecha_emision) <= new Date(filters.fecha_hasta);
    const matchesCliente = filters.cliente
      ? venta.cliente.toLowerCase().includes(filters.cliente.toLowerCase())
      : true;
    const matchesEstado = filters.estado
      ? venta.estado === filters.estado
      : true;
    const matchesMontoMin = filters.monto_min
      ? venta.monto_total >= parseFloat(filters.monto_min)
      : true;
    const matchesMontoMax = filters.monto_max
      ? venta.monto_total <= parseFloat(filters.monto_max)
      : true;

    return (
      matchesSearch &&
      matchesDate &&
      matchesDateHasta &&
      matchesCliente &&
      matchesEstado &&
      matchesMontoMin &&
      matchesMontoMax
    );
  });

  const stats = {
    totalVentas: ventasFiltradas.length,
    totalMonto: ventasFiltradas.reduce(
      (sum, venta) => sum + venta.monto_total,
      0
    ),
    ticketPromedio:
      ventasFiltradas.length > 0
        ? ventasFiltradas.reduce((sum, venta) => sum + venta.monto_total, 0) /
          ventasFiltradas.length
        : 0,
    ventasPagadas: ventasFiltradas.filter(venta => venta.estado === 'pagado')
      .length,
  };

  const loading = false; // Placeholder
  const error = null; // Placeholder
  const filters = {
    fecha_desde: '',
    fecha_hasta: '',
    cliente: '',
    estado: '',
    monto_min: '',
    monto_max: '',
  };
  const sortConfig = { key: 'fecha_emision', direction: 'desc' };
  const searchTerm = '';
  const selectedVenta = null;

  // Placeholder para calcularTotales
  const calcularTotales = () => {
    console.log('Calcular Totales');
  };

  // Placeholder para setFilters
  const setFilters = updater => {
    console.log('Set Filters:', updater);
  };

  // Placeholder para setSortConfig
  const setSortConfig = updater => {
    console.log('Set Sort Config:', updater);
  };

  // Placeholder para setSearchTerm
  const setSearchTerm = value => {
    console.log('Set Search Term:', value);
  };

  // Placeholder para setSelectedVenta
  const setSelectedVenta = value => {
    console.log('Set Selected Venta:', value);
  };

  // Placeholder para clearError
  const clearError = () => {
    console.log('Clear Error');
  };

  // Placeholder para canView, canCreate, canUpdate, canDelete
  const canView = true;
  const canCreate = true;
  const canUpdate = true;
  const canDelete = true;

  if (loading && ventas.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg'>Cargando ventas...</span>
      </div>
    );
  }

  if (error && ventas.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar ventas
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button
            onClick={() => {
              // Placeholder para cargarVentas
              console.log('Cargar Ventas');
            }}
          >
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
        <title>Gestión de Ventas - MTZ Ouroborus AI v3.0</title>
        <meta
          name='description'
          content='Administra y analiza las ventas con herramientas avanzadas de gestión y análisis'
        />
        <meta
          name='keywords'
          content='ventas, facturación, análisis, gestión, MTZ'
        />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
              <ShoppingCart className='h-8 w-8 text-blue-600' />
              Gestión de Ventas
              <Badge variant='outline' className='ml-2'>
                v3.0 Avanzado
              </Badge>
            </h1>
            <p className='text-gray-600 mt-1'>
              Análisis avanzado y gestión integral de ventas
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => {
                // Placeholder para cargarVentas
                console.log('Cargar Ventas');
              }}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
            <Button variant='outline' onClick={() => setShowExportData(true)}>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </Button>
            {canCreate && (
              <Button onClick={() => setShowModal(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Nueva Venta
              </Button>
            )}
          </div>
        </div>

        {/* KPIs */}
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Ventas
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(stats.totalVentas)}
                  </p>
                </div>
                <div className='p-3 bg-blue-100 rounded-full'>
                  <ShoppingCart className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Facturado
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatCurrency(stats.totalMonto)}
                  </p>
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
                    Ticket Promedio
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatCurrency(stats.ticketPromedio)}
                  </p>
                </div>
                <div className='p-3 bg-yellow-100 rounded-full'>
                  <Target className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Ventas Pagadas
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(stats.ventasPagadas)}
                  </p>
                </div>
                <div className='p-3 bg-green-100 rounded-full'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <Card className='p-4'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <GlobalSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder='Buscar por cliente, factura, descripción...'
              />
            </div>

            <div className='flex gap-2'>
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

              <div className='flex gap-1'>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className='h-4 w-4' />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros expandibles */}
          {showFilters && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                <Input
                  label='Cliente'
                  value={filters.cliente}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, cliente: e.target.value }))
                  }
                />
                <Select
                  label='Estado'
                  value={filters.estado}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, estado: e.target.value }))
                  }
                >
                  <option value=''>Todos los estados</option>
                  <option value='pendiente'>Pendiente</option>
                  <option value='pagado'>Pagado</option>
                  <option value='vencido'>Vencido</option>
                  <option value='cancelado'>Cancelado</option>
                </Select>
                <Input
                  label='Monto Mínimo'
                  type='number'
                  value={filters.monto_min}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, monto_min: e.target.value }))
                  }
                />
                <Input
                  label='Monto Máximo'
                  type='number'
                  value={filters.monto_max}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, monto_max: e.target.value }))
                  }
                />
              </div>
            </div>
          )}
        </Card>

        {/* Tabla de Ventas */}
        <Card className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              Ventas ({formatNumber(ventasFiltradas.length)})
            </h2>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowAnalytics(true)}
              >
                <BarChart3 className='h-4 w-4 mr-2' />
                Análisis
              </Button>
            </div>
          </div>

          {viewMode === 'table' ? (
            <TableComponent
              data={ventasFiltradas}
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
              loading={loading}
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {ventasFiltradas.map(venta => (
                <Card key={venta.id} className='p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <h3 className='font-semibold'>{venta.cliente}</h3>
                      <p className='text-sm text-gray-600'>
                        {venta.numero_factura}
                      </p>
                    </div>
                    <Badge variant={venta.estado_display?.color || 'default'}>
                      {venta.estado_display?.label || venta.estado}
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    {venta.descripcion}
                  </p>
                  <div className='flex justify-between items-center'>
                    <span className='font-semibold'>
                      {formatCurrency(venta.monto_total)}
                    </span>
                    <div className='flex gap-1'>
                      {/* Aquí irían las acciones de actualización/eliminación */}
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          setEditingVenta(venta);
                          setShowModal(true);
                        }}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleEliminarVenta(venta.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Export Data Modal */}
        {showExportData && (
          <ExportData
            data={ventasFiltradas}
            columns={exportColumns}
            filename='ventas-mtz'
            onClose={() => setShowExportData(false)}
          />
        )}

        {/* Modal de Formulario de Venta */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingVenta(null);
            }}
            title={editingVenta ? 'Editar Venta' : 'Nueva Venta'}
            size='xl'
          >
            <VentaForm
              venta={editingVenta}
              onSubmit={editingVenta ? handleActualizarVenta : handleCrearVenta}
              onCancel={() => {
                setShowModal(false);
                setEditingVenta(null);
              }}
              loading={loading}
              calcularTotales={calcularTotales}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default VentasPage;
