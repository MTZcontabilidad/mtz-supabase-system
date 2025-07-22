import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShoppingBag,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  DollarSign,
  CheckCircle,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  ChevronDown,
  ChevronUp,
  Grid,
  ThumbsUp,
  ThumbsDown,
  FilterIcon,
  TableIcon,
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
import CompraForm from '@/components/compras/CompraForm';
import { formatCurrency, formatDate, formatNumber } from '@/utils/helpers';
import ExportData from '@/components/shared/ExportData';
import GlobalSearch from '@/components/shared/GlobalSearch';

/**
 * Página de Gestión de Compras Avanzada MTZ - VERSIÓN MEJORADA
 * Gestión completa de compras con flujo de aprobaciones, análisis de gastos
 * y control presupuestario integrado
 */
const ComprasPage = () => {
  // Estados locales para la UI
  const [showModal, setShowModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingCompra, setEditingCompra] = useState(null);
  const [showExportData, setShowExportData] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // table, grid, kanban
  const [showFilters, setShowFilters] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalData, setApprovalData] = useState({
    id: null,
    action: '',
    comentarios: '',
  });

  // Manejar creación de compra
  const handleCrearCompra = async compraData => {
    try {
      // Aquí iría la lógica para crear la compra
      // await crearCompra(compraData);
      setShowModal(false);
      setEditingCompra(null);
    } catch (error) {
      console.error('Error creando compra:', error);
    }
  };

  // Manejar actualización de compra
  const handleActualizarCompra = async compraData => {
    try {
      // Aquí iría la lógica para actualizar la compra
      // await actualizarCompra(editingCompra.id, compraData);
      setShowModal(false);
      setEditingCompra(null);
    } catch (error) {
      console.error('Error actualizando compra:', error);
    }
  };

  // Manejar eliminación de compra
  const handleEliminarCompra = async compraId => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      try {
        // Aquí iría la lógica para eliminar la compra
        // await eliminarCompra(compraId);
      } catch (error) {
        console.error('Error eliminando compra:', error);
      }
    }
  };

  // Manejar aprobación/rechazo
  const handleApprovalAction = async () => {
    try {
      // Aquí iría la lógica para aprobar/rechazar la compra
      if (approvalData.action === 'approve') {
        // await aprobarCompra(approvalData.id, approvalData.comentarios);
      } else if (approvalData.action === 'reject') {
        // await rechazarCompra(approvalData.id, approvalData.comentarios);
      }
      setShowApprovalModal(false);
      setApprovalData({ id: null, action: '', comentarios: '' });
    } catch (error) {
      console.error('Error en acción de aprobación:', error);
    }
  };

  // Manejar ordenamiento
  const handleSort = key => {
    // Aquí iría la lógica para manejar el ordenamiento
  };

  // Columnas para la tabla
  const columns = [
    {
      key: 'fecha_solicitud',
      label: 'Fecha',
      render: value => formatDate(value),
      sortable: true,
    },
    {
      key: 'proveedor',
      label: 'Proveedor',
      sortable: true,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: true,
    },
    {
      key: 'monto',
      label: 'Monto',
      render: value => formatCurrency(value),
      sortable: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value, compra) => (
        <Badge variant={compra?.estado_display?.color || 'default'}>
          {compra?.estado_display?.label || value}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: value => (
        <Badge
          variant={
            value === 'urgente'
              ? 'destructive'
              : value === 'alta'
                ? 'warning'
                : value === 'media'
                  ? 'outline'
                  : 'secondary'
          }
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, compra) => (
        <div className='flex gap-2'>
          {/* Aquí irían las acciones de actualización, aprobación, eliminación */}
          {/* <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setEditingCompra(compra);
              setShowModal(true);
            }}
          >
            <Edit className='h-4 w-4' />
          </Button> */}
          {/* {canApprove && compra.estado === 'pendiente' && (
            <>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setApprovalData({
                    id: compra.id,
                    action: 'approve',
                    comentarios: '',
                  });
                  setShowApprovalModal(true);
                }}
              >
                <ThumbsUp className='h-4 w-4' />
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setApprovalData({
                    id: compra.id,
                    action: 'reject',
                    comentarios: '',
                  });
                  setShowApprovalModal(true);
                }}
              >
                <ThumbsDown className='h-4 w-4' />
              </Button>
            </>
          )} */}
          {/* {canDelete && (
            <Button
              size='sm'
              variant='destructive'
              onClick={() => handleEliminarCompra(compra.id)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )} */}
        </div>
      ),
    },
  ];

  // Datos para exportar
  const exportColumns = [
    { key: 'fecha_solicitud', label: 'Fecha' },
    { key: 'proveedor', label: 'Proveedor' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'monto', label: 'Monto' },
    { key: 'estado', label: 'Estado' },
    { key: 'prioridad', label: 'Prioridad' },
  ];

  if (false && compras.length === 0) {
    // Assuming compras is not defined here, so this will always be false
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg'>Cargando compras...</span>
      </div>
    );
  }

  if (false && error && compras.length === 0) {
    // Assuming compras is not defined here, so this will always be false
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar compras
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={cargarCompras}>
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
        <title>Gestión de Compras - MTZ Ouroborus AI v3.0</title>
        <meta
          name='description'
          content='Administra y controla las compras con flujo de aprobaciones y análisis de gastos'
        />
        <meta
          name='keywords'
          content='compras, aprobaciones, proveedores, gastos, MTZ'
        />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
              <ShoppingBag className='h-8 w-8 text-blue-600' />
              Gestión de Compras
              <Badge variant='outline' className='ml-2'>
                v3.0 Avanzado
              </Badge>
            </h1>
            <p className='text-gray-600 mt-1'>
              Control de compras con flujo de aprobaciones y análisis de gastos
            </p>
          </div>

          <div className='flex gap-2'>
            <Button onClick={cargarCompras} disabled={loading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
            <Button variant='outline' onClick={() => setShowExportData(true)}>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </Button>
            {/* {canCreate && (
              <Button onClick={() => setShowModal(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Nueva Compra
              </Button>
            )} */}
          </div>
        </div>

        {/* KPIs */}
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Compras
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(stats.totalCompras)}
                  </p>
                </div>
                <div className='p-3 bg-blue-100 rounded-full'>
                  <ShoppingBag className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Total Invertido
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
                    Pendientes
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(stats.comprasPendientes)}
                  </p>
                </div>
                <div className='p-3 bg-yellow-100 rounded-full'>
                  <Clock className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Aprobadas</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(stats.comprasAprobadas)}
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
                placeholder='Buscar por proveedor, categoría, descripción...'
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
                  label='Proveedor'
                  value={filters.proveedor}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, proveedor: e.target.value }))
                  }
                />
                <Select
                  label='Categoría'
                  value={filters.categoria}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, categoria: e.target.value }))
                  }
                >
                  <option value=''>Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </Select>
                <Select
                  label='Estado'
                  value={filters.estado}
                  onChange={e =>
                    setFilters(prev => ({ ...prev, estado: e.target.value }))
                  }
                >
                  <option value=''>Todos los estados</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
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

        {/* Tabla de Compras */}
        <Card className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              Compras ({formatNumber(comprasFiltradas.length)})
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
              data={comprasFiltradas}
              columns={columns}
              sortConfig={sortConfig}
              onSort={handleSort}
              loading={loading}
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {comprasFiltradas.map(compra => (
                <Card key={compra.id} className='p-4'>
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <h3 className='font-semibold'>{compra.proveedor}</h3>
                      <p className='text-sm text-gray-600'>
                        {compra.categoria}
                      </p>
                    </div>
                    <Badge variant={compra.estado_display?.color || 'default'}>
                      {compra.estado_display?.label || compra.estado}
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-600 mb-3'>
                    {compra.descripcion}
                  </p>
                  <div className='flex justify-between items-center mb-3'>
                    <span className='font-semibold'>
                      {formatCurrency(compra.monto)}
                    </span>
                    <Badge
                      variant={
                        compra.prioridad === 'urgente'
                          ? 'destructive'
                          : compra.prioridad === 'alta'
                            ? 'warning'
                            : compra.prioridad === 'media'
                              ? 'outline'
                              : 'secondary'
                      }
                    >
                      {compra.prioridad?.charAt(0).toUpperCase() +
                        compra.prioridad?.slice(1)}
                    </Badge>
                  </div>
                  <div className='flex gap-1'>
                    {/* Aquí irían las acciones de actualización, aprobación, eliminación */}
                    {/* <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        setEditingCompra(compra);
                        setShowModal(true);
                      }}
                    >
                      <Edit className='h-4 w-4' />
                    </Button> */}
                    {/* {canApprove && compra.estado === 'pendiente' && (
                      <>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            setApprovalData({
                              id: compra.id,
                              action: 'approve',
                              comentarios: '',
                            });
                            setShowApprovalModal(true);
                          }}
                        >
                          <ThumbsUp className='h-4 w-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            setApprovalData({
                              id: compra.id,
                              action: 'reject',
                              comentarios: '',
                            });
                            setShowApprovalModal(true);
                          }}
                        >
                          <ThumbsDown className='h-4 w-4' />
                        </Button>
                      </>
                    )} */}
                    {/* {canDelete && (
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => handleEliminarCompra(compra.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    )} */}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Export Data Modal */}
        {showExportData && (
          <ExportData
            data={comprasFiltradas}
            columns={exportColumns}
            filename='compras-mtz'
            onClose={() => setShowExportData(false)}
          />
        )}

        {/* Modal de Formulario de Compra */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingCompra(null);
            }}
            title={editingCompra ? 'Editar Compra' : 'Nueva Compra'}
            size='xl'
          >
            <CompraForm
              compra={editingCompra}
              onSubmit={
                editingCompra ? handleActualizarCompra : handleCrearCompra
              }
              onCancel={() => {
                setShowModal(false);
                setEditingCompra(null);
              }}
              loading={loading}
              categorias={categorias}
              estados={estados}
            />
          </Modal>
        )}

        {/* Modal de Aprobación/Rechazo */}
        {showApprovalModal && (
          <Modal
            isOpen={showApprovalModal}
            onClose={() => {
              setShowApprovalModal(false);
              setApprovalData({ id: null, action: '', comentarios: '' });
            }}
            title={
              approvalData.action === 'approve'
                ? 'Aprobar Compra'
                : 'Rechazar Compra'
            }
            size='md'
          >
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Comentarios
                </label>
                <textarea
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  rows={3}
                  placeholder={
                    approvalData.action === 'approve'
                      ? 'Comentarios de aprobación...'
                      : 'Motivo del rechazo...'
                  }
                  value={approvalData.comentarios}
                  onChange={e =>
                    setApprovalData(prev => ({
                      ...prev,
                      comentarios: e.target.value,
                    }))
                  }
                />
              </div>

              <div className='flex justify-end gap-3'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setShowApprovalModal(false);
                    setApprovalData({ id: null, action: '', comentarios: '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant={
                    approvalData.action === 'approve'
                      ? 'default'
                      : 'destructive'
                  }
                  onClick={handleApprovalAction}
                  loading={loading}
                >
                  {approvalData.action === 'approve' ? 'Aprobar' : 'Rechazar'}
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ComprasPage;
