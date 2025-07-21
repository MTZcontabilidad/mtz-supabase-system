import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Settings,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Shield,
  Zap,
  RefreshCw,
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
import ClienteForm from '@/components/clientes/ClienteForm';
import { formatCurrency, formatDate, formatNumber } from '@/utils/helpers';
import ExportData from '@/components/shared/ExportData';
import FileUpload from '@/components/shared/FileUpload';
import GlobalSearch from '@/components/shared/GlobalSearch';

/**
 * Página de Clientes Avanzada MTZ - VERSIÓN MEJORADA
 * Gestión completa de clientes con análisis avanzado, búsqueda inteligente
 * y sistema de documentos integrado
 */
const ClientesPage = () => {
  // Estados locales para la UI
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [showExportData, setShowExportData] = useState(false);
  const [showCargaMasiva, setShowCargaMasiva] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // table, grid, kanban
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [bulkActions, setBulkActions] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Obtener historial del cliente (función local para simulación)
  const obtenerHistorialCliente = clienteId => {
    // Simulación de historial
    return [
      {
        fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        accion: 'Nueva venta',
        monto: 2500000,
        tipo: 'venta',
      },
      {
        fecha: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        accion: 'Pago recibido',
        monto: 1800000,
        tipo: 'pago',
      },
      {
        fecha: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        accion: 'Contacto realizado',
        monto: 0,
        tipo: 'contacto',
      },
    ];
  };

  // Manejar ordenamiento
  const handleSort = key => {
    // setSortConfig(prev => ({
    //   key,
    //   direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    // }));
  };

  // Manejar creación de cliente
  const handleCrearCliente = async clienteData => {
    try {
      // await crearCliente(clienteData); // Originalmente de useClientes
      console.log('Simulando creación de cliente:', clienteData);
      // setShowModal(false);
      // setEditingCliente(null);
    } catch (error) {
      console.error('Error creando cliente:', error);
    }
  };

  // Manejar actualización de cliente
  const handleActualizarCliente = async clienteData => {
    try {
      // await actualizarCliente(editingCliente.id, clienteData); // Originalmente de useClientes
      console.log(
        'Simulando actualización de cliente:',
        editingCliente.id,
        clienteData
      );
      // setShowModal(false);
      // setEditingCliente(null);
    } catch (error) {
      console.error('Error actualizando cliente:', error);
    }
  };

  // Manejar eliminación de cliente
  const handleEliminarCliente = async clienteId => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        // await eliminarCliente(clienteId); // Originalmente de useClientes
        console.log('Simulando eliminación de cliente:', clienteId);
      } catch (error) {
        console.error('Error eliminando cliente:', error);
      }
    }
  };

  // Abrir perfil del cliente
  const abrirPerfil = cliente => {
    // setSelectedCliente(cliente); // Originalmente de useClientes
    setShowProfile(true);
  };

  // Abrir análisis del cliente
  const abrirAnalisis = cliente => {
    // setSelectedCliente(cliente); // Originalmente de useClientes
    setShowAnalytics(true);
  };

  // Abrir documentos del cliente
  const abrirDocumentos = cliente => {
    // setSelectedCliente(cliente); // Originalmente de useClientes
    setShowDocuments(true);
    cargarDocumentos(cliente.id);
  };

  // Cargar documentos del cliente
  const cargarDocumentos = async clienteId => {
    try {
      // Simulación de documentos
      const docs = [
        {
          id: 1,
          nombre: 'Contrato de Servicios.pdf',
          tipo: 'contrato',
          fecha: new Date(),
          tamaño: '2.5 MB',
          estado: 'activo',
        },
        {
          id: 2,
          nombre: 'Factura 001-2024.pdf',
          tipo: 'factura',
          fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          tamaño: '1.2 MB',
          estado: 'activo',
        },
        {
          id: 3,
          nombre: 'Certificado Tributario.pdf',
          tipo: 'certificado',
          fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          tamaño: '3.1 MB',
          estado: 'activo',
        },
      ];
      setDocuments(docs);
    } catch (error) {
      console.error('Error cargando documentos:', error);
    }
  };

  // Generar datos para gráficos de análisis
  const generarDatosAnalisis = cliente => {
    const analisis = cliente.analisis;
    const historial = cliente.historial;

    // Gráfico de evolución de facturación
    const evolucionFacturacion = historial
      .filter(h => h.tipo === 'venta')
      .map((h, index) => ({
        mes: `Mes ${index + 1}`,
        facturacion: h.monto,
        crecimiento:
          index > 0
            ? ((h.monto - historial[index - 1]?.monto) /
                historial[index - 1]?.monto) *
              100
            : 0,
      }));

    // Gráfico de distribución por tipo de actividad
    const distribucionActividad = [
      {
        tipo: 'Ventas',
        cantidad: historial.filter(h => h.tipo === 'venta').length,
        color: '#3B82F6',
      },
      {
        tipo: 'Pagos',
        cantidad: historial.filter(h => h.tipo === 'pago').length,
        color: '#10B981',
      },
      {
        tipo: 'Contactos',
        cantidad: historial.filter(h => h.tipo === 'contacto').length,
        color: '#F59E0B',
      },
    ];

    return {
      evolucionFacturacion,
      distribucionActividad,
    };
  };

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simular carga de clientes
        console.log('Simulando carga de clientes...');
      }, 60000); // 1 minuto
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Cargar datos al montar
  useEffect(() => {
    // Simular carga de clientes
    console.log('Simulando carga de clientes al montar...');
  }, []);

  // Configuración para exportación
  const exportColumns = [
    { key: 'razon_social', label: 'Razón Social', format: 'text' },
    { key: 'rut', label: 'RUT', format: 'text' },
    { key: 'email', label: 'Email', format: 'text' },
    { key: 'telefono', label: 'Teléfono', format: 'text' },
    { key: 'total_facturado', label: 'Total Facturado', format: 'currency' },
    { key: 'categoria_cliente', label: 'Categoría', format: 'text' },
    { key: 'estado', label: 'Estado', format: 'text' },
    { key: 'region', label: 'Región', format: 'text' },
  ];

  if (false && clientes.length === 0) {
    // Simular loading y error
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg'>Cargando análisis de clientes...</span>
      </div>
    );
  }

  if (false && clientes.length === 0) {
    // Simular loading y error
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar clientes
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button
            onClick={() => {
              // Simular carga de clientes
              console.log('Simulando reintentar carga de clientes...');
            }}
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const datosAnalisis = selectedCliente
    ? generarDatosAnalisis(selectedCliente)
    : null;

  return (
    <>
      <Helmet>
        <title>Gestión de Clientes - MTZ Ouroborus AI v3.0</title>
        <meta
          name='description'
          content='Administra y analiza tu cartera de clientes con herramientas avanzadas de gestión y análisis'
        />
        <meta
          name='keywords'
          content='clientes, gestión, análisis, cartera, MTZ'
        />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
              <Users className='h-8 w-8 text-blue-600' />
              Gestión de Clientes
              <Badge variant='outline' className='ml-2'>
                v3.0 Avanzado
              </Badge>
            </h1>
            <p className='text-gray-600 mt-1'>
              Análisis avanzado y gestión integral de clientes
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => {
                // Simular carga de clientes
                console.log('Simulando actualizar clientes...');
              }}
              disabled={false}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${false ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
            <Button variant='outline' onClick={() => setShowCargaMasiva(true)}>
              <Upload className='h-4 w-4 mr-2' />
              Carga Masiva
            </Button>
            <Button variant='outline' onClick={() => setShowExportData(true)}>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </Button>
            <Button onClick={() => setShowModal(true)}>
              <Plus className='h-4 w-4 mr-2' />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Filtros y Búsqueda Avanzada */}
        <Card className='p-4'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <div className='flex-1'>
              <GlobalSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder='Buscar por nombre, RUT, email...'
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

          {/* Filtros Avanzados */}
          {showFilters && (
            <div className='mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
              <select
                value={filters.categoria}
                onChange={e =>
                  setFilters(prev => ({ ...prev, categoria: e.target.value }))
                }
                className='border rounded-lg px-3 py-2'
              >
                <option value=''>Todas las categorías</option>
                <option value='VIP'>VIP</option>
                <option value='Premium'>Premium</option>
                <option value='Top'>Top</option>
                <option value='Regular'>Regular</option>
                <option value='Bajo'>Bajo</option>
              </select>

              <select
                value={filters.estado}
                onChange={e =>
                  setFilters(prev => ({ ...prev, estado: e.target.value }))
                }
                className='border rounded-lg px-3 py-2'
              >
                <option value=''>Todos los estados</option>
                <option value='Activo'>Activo</option>
                <option value='Inactivo'>Inactivo</option>
                <option value='Suspendido'>Suspendido</option>
              </select>

              <Input
                type='number'
                placeholder='Facturación mín.'
                value={filters.facturacion_min}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    facturacion_min: e.target.value,
                  }))
                }
              />

              <Input
                type='number'
                placeholder='Facturación máx.'
                value={filters.facturacion_max}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    facturacion_max: e.target.value,
                  }))
                }
              />

              <Input
                type='date'
                value={filters.fecha_registro}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    fecha_registro: e.target.value,
                  }))
                }
              />

              <Button
                variant='outline'
                onClick={() =>
                  setFilters({
                    categoria: '',
                    estado: '',
                    region: '',
                    facturacion_min: '',
                    facturacion_max: '',
                    fecha_registro: '',
                  })
                }
              >
                Limpiar
              </Button>
            </div>
          )}
        </Card>

        {/* Estadísticas Rápidas */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Card className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-full'>
                <Users className='h-5 w-5 text-blue-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-gray-600'>Total Clientes</p>
                <p className='text-xl font-bold'>
                  {formatNumber(clientesFiltrados.length)}
                </p>
              </div>
            </div>
          </Card>

          <Card className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-full'>
                <TrendingUp className='h-5 w-5 text-green-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-gray-600'>Facturación Total</p>
                <p className='text-xl font-bold'>
                  {formatCurrency(
                    clientesFiltrados.reduce(
                      (sum, c) => sum + parseFloat(c.total_facturado || 0),
                      0
                    )
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-yellow-100 rounded-full'>
                <Star className='h-5 w-5 text-yellow-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-gray-600'>Clientes Premium</p>
                <p className='text-xl font-bold'>
                  {formatNumber(
                    clientesFiltrados.filter(
                      c =>
                        c.categoria_cliente === 'Premium' ||
                        c.categoria_cliente === 'VIP'
                    ).length
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 rounded-full'>
                <AlertTriangle className='h-5 w-5 text-red-600' />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-gray-600'>En Riesgo</p>
                <p className='text-xl font-bold'>
                  {formatNumber(
                    clientesFiltrados.filter(
                      c => c.analisis?.riesgo?.nivel === 'alto'
                    ).length
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vista de Clientes */}
        {viewMode === 'table' ? (
          <Card className='p-6'>
            <TableComponent>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('razon_social')}
                    className='cursor-pointer'
                  >
                    <div className='flex items-center gap-2'>
                      Cliente
                      {sortConfig.key === 'razon_social' &&
                        (sortConfig.direction === 'asc' ? (
                          <SortAsc className='h-4 w-4' />
                        ) : (
                          <SortDesc className='h-4 w-4' />
                        ))}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('total_facturado')}
                    className='cursor-pointer'
                  >
                    <div className='flex items-center gap-2'>
                      Facturación
                      {sortConfig.key === 'total_facturado' &&
                        (sortConfig.direction === 'asc' ? (
                          <SortAsc className='h-4 w-4' />
                        ) : (
                          <SortDesc className='h-4 w-4' />
                        ))}
                    </div>
                  </th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Riesgo</th>
                  <th>Análisis</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => (
                  <tr key={cliente.id} className='hover:bg-gray-50'>
                    <td>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                          <Building className='h-5 w-5 text-blue-600' />
                        </div>
                        <div>
                          <p className='font-semibold'>
                            {cliente.razon_social}
                          </p>
                          <p className='text-sm text-gray-600'>{cliente.rut}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className='font-semibold'>
                          {formatCurrency(cliente.total_facturado)}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {cliente.analisis?.crecimiento > 0 ? '+' : ''}
                          {formatNumber(cliente.analisis?.crecimiento)}% vs mes
                          anterior
                        </p>
                      </div>
                    </td>
                    <td>
                      <Badge
                        variant={
                          cliente.categoria_cliente === 'VIP'
                            ? 'default'
                            : cliente.categoria_cliente === 'Premium'
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {cliente.categoria_cliente}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          cliente.estado === 'Activo'
                            ? 'default'
                            : cliente.estado === 'Inactivo'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {cliente.estado}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          cliente.analisis?.riesgo?.nivel === 'alto'
                            ? 'destructive'
                            : cliente.analisis?.riesgo?.nivel === 'medio'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {cliente.analisis?.riesgo?.nivel}
                      </Badge>
                    </td>
                    <td>
                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => abrirAnalisis(cliente)}
                        >
                          <BarChart3 className='h-4 w-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => abrirDocumentos(cliente)}
                        >
                          <FileText className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                    <td>
                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => abrirPerfil(cliente)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => setEditingCliente(cliente)}
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            /* Implementar eliminación */
                          }}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableComponent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {clientesFiltrados.map(cliente => (
              <Card
                key={cliente.id}
                className='p-6 hover:shadow-lg transition-shadow'
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                      <Building className='h-6 w-6 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg'>
                        {cliente.razon_social}
                      </h3>
                      <p className='text-sm text-gray-600'>{cliente.rut}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      cliente.categoria_cliente === 'VIP'
                        ? 'default'
                        : cliente.categoria_cliente === 'Premium'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {cliente.categoria_cliente}
                  </Badge>
                </div>

                <div className='space-y-3 mb-4'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Facturación:</span>
                    <span className='font-semibold'>
                      {formatCurrency(cliente.total_facturado)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Estado:</span>
                    <Badge
                      variant={
                        cliente.estado === 'Activo'
                          ? 'default'
                          : cliente.estado === 'Inactivo'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {cliente.estado}
                    </Badge>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm text-gray-600'>Riesgo:</span>
                    <Badge
                      variant={
                        cliente.analisis?.riesgo?.nivel === 'alto'
                          ? 'destructive'
                          : cliente.analisis?.riesgo?.nivel === 'medio'
                            ? 'secondary'
                            : 'default'
                      }
                    >
                      {cliente.analisis?.riesgo?.nivel}
                    </Badge>
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => abrirPerfil(cliente)}
                    className='flex-1'
                  >
                    <Eye className='h-4 w-4 mr-1' />
                    Ver
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => abrirAnalisis(cliente)}
                    className='flex-1'
                  >
                    <BarChart3 className='h-4 w-4 mr-1' />
                    Análisis
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de Perfil del Cliente */}
        {showProfile && selectedCliente && (
          <Modal
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            title={`Perfil de ${selectedCliente.razon_social}`}
            size='lg'
          >
            <div className='space-y-6'>
              {/* Información Básica */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Información General
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Razón Social:
                      </span>
                      <span className='font-medium'>
                        {selectedCliente.razon_social}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>RUT:</span>
                      <span className='font-medium'>{selectedCliente.rut}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Email:</span>
                      <span className='font-medium'>
                        {selectedCliente.email}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Teléfono:</span>
                      <span className='font-medium'>
                        {selectedCliente.telefono}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Análisis de Riesgo
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Nivel de Riesgo:
                      </span>
                      <Badge
                        variant={
                          selectedCliente.analisis?.riesgo?.nivel === 'alto'
                            ? 'destructive'
                            : selectedCliente.analisis?.riesgo?.nivel ===
                                'medio'
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {selectedCliente.analisis?.riesgo?.nivel}
                      </Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>Puntuación:</span>
                      <span className='font-medium'>
                        {selectedCliente.analisis?.riesgo?.puntuacion}/100
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Crecimiento:
                      </span>
                      <span className='font-medium'>
                        {selectedCliente.analisis?.crecimiento > 0 ? '+' : ''}
                        {formatNumber(selectedCliente.analisis?.crecimiento)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Oportunidades */}
              {selectedCliente.oportunidades?.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Oportunidades Identificadas
                  </h3>
                  <div className='space-y-3'>
                    {selectedCliente.oportunidades.map((oportunidad, index) => (
                      <div key={index} className='p-3 bg-blue-50 rounded-lg'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <p className='font-medium'>
                              {oportunidad.descripcion}
                            </p>
                            <p className='text-sm text-gray-600'>
                              Probabilidad: {oportunidad.probabilidad}%
                            </p>
                          </div>
                          <Badge variant='outline'>
                            {formatCurrency(oportunidad.valor_estimado)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historial Reciente */}
              <div>
                <h3 className='text-lg font-semibold mb-3'>
                  Historial Reciente
                </h3>
                <div className='space-y-2'>
                  {selectedCliente.historial
                    ?.slice(0, 5)
                    .map((evento, index) => (
                      <div
                        key={index}
                        className='flex items-center justify-between p-2 bg-gray-50 rounded'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`p-1 rounded ${
                              evento.tipo === 'venta'
                                ? 'bg-green-100'
                                : evento.tipo === 'pago'
                                  ? 'bg-blue-100'
                                  : 'bg-yellow-100'
                            }`}
                          >
                            {evento.tipo === 'venta' ? (
                              <TrendingUp className='h-4 w-4 text-green-600' />
                            ) : evento.tipo === 'pago' ? (
                              <CheckCircle className='h-4 w-4 text-blue-600' />
                            ) : (
                              <Clock className='h-4 w-4 text-yellow-600' />
                            )}
                          </div>
                          <div>
                            <p className='font-medium'>{evento.accion}</p>
                            <p className='text-sm text-gray-600'>
                              {formatDate(evento.fecha)}
                            </p>
                          </div>
                        </div>
                        {evento.monto > 0 && (
                          <span className='font-semibold'>
                            {formatCurrency(evento.monto)}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de Análisis */}
        {showAnalytics && selectedCliente && datosAnalisis && (
          <Modal
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)}
            title={`Análisis de ${selectedCliente.razon_social}`}
            size='xl'
          >
            <div className='space-y-6'>
              {/* Métricas Clave */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <Card className='p-4'>
                  <div className='text-center'>
                    <p className='text-2xl font-bold text-blue-600'>
                      {formatNumber(selectedCliente.analisis?.satisfaccion)}%
                    </p>
                    <p className='text-sm text-gray-600'>Satisfacción</p>
                  </div>
                </Card>
                <Card className='p-4'>
                  <div className='text-center'>
                    <p className='text-2xl font-bold text-green-600'>
                      {formatCurrency(
                        selectedCliente.analisis?.ticket_promedio
                      )}
                    </p>
                    <p className='text-sm text-gray-600'>Ticket Promedio</p>
                  </div>
                </Card>
                <Card className='p-4'>
                  <div className='text-center'>
                    <p className='text-2xl font-bold text-purple-600'>
                      {selectedCliente.analisis?.frecuencia_compra}
                    </p>
                    <p className='text-sm text-gray-600'>Frecuencia Compra</p>
                  </div>
                </Card>
                <Card className='p-4'>
                  <div className='text-center'>
                    <p className='text-2xl font-bold text-orange-600'>
                      {formatNumber(
                        selectedCliente.analisis?.potencial_expansion
                      )}
                      %
                    </p>
                    <p className='text-sm text-gray-600'>Potencial Expansión</p>
                  </div>
                </Card>
              </div>

              {/* Gráficos */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Evolución de Facturación
                  </h3>
                  <ResponsiveContainer width='100%' height={300}>
                    <RechartsLineChart
                      data={datosAnalisis.evolucionFacturacion}
                    >
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='mes' />
                      <YAxis />
                      <Tooltip formatter={value => formatCurrency(value)} />
                      <Legend />
                      <Line
                        type='monotone'
                        dataKey='facturacion'
                        stroke='#3B82F6'
                        name='Facturación'
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Distribución de Actividad
                  </h3>
                  <ResponsiveContainer width='100%' height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={datosAnalisis.distribucionActividad}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='cantidad'
                      >
                        {datosAnalisis.distribucionActividad.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de Documentos */}
        {showDocuments && selectedCliente && (
          <Modal
            isOpen={showDocuments}
            onClose={() => setShowDocuments(false)}
            title={`Documentos de ${selectedCliente.razon_social}`}
            size='lg'
          >
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold'>
                  Documentos del Cliente
                </h3>
                <Button size='sm'>
                  <Upload className='h-4 w-4 mr-2' />
                  Subir Documento
                </Button>
              </div>

              <div className='space-y-2'>
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-blue-100 rounded'>
                        <FileText className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <p className='font-medium'>{doc.nombre}</p>
                        <p className='text-sm text-gray-600'>
                          {formatDate(doc.fecha)} • {doc.tamaño}
                        </p>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button size='sm' variant='outline'>
                        <Download className='h-4 w-4' />
                      </Button>
                      <Button size='sm' variant='outline'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Modal>
        )}

        {/* Export Data Modal */}
        {showExportData && (
          <ExportData
            data={clientesFiltrados}
            columns={exportColumns}
            filename='clientes-mtz'
            onClose={() => setShowExportData(false)}
          />
        )}

        {/* Modal de Formulario de Cliente */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingCliente(null);
            }}
            title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
            size='xl'
          >
            <ClienteForm
              cliente={editingCliente}
              onSubmit={
                editingCliente ? handleActualizarCliente : handleCrearCliente
              }
              onCancel={() => {
                setShowModal(false);
                setEditingCliente(null);
              }}
              loading={false}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default ClientesPage;
