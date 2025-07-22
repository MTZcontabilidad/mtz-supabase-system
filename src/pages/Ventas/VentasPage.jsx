import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  FileText,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Receipt,
  CreditCard,
  Coins,
  Banknote,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import TableComponent from '@/components/ui/Table';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
// Funciones de utilidad
const formatCurrency = amount => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
};

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('es-CL');
};

const getStatusColor = status => {
  switch (status) {
    case 'Pagada':
      return 'success';
    case 'Pendiente':
      return 'warning';
    case 'Vencida':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = status => {
  return status || 'Desconocido';
};

/**
 * Página de Gestión de Ventas MTZ - VERSIÓN MEJORADA
 * Gestión completa de ventas con filtros, búsqueda y análisis
 */
const VentasPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [sortBy, setSortBy] = useState('fecha_emision');
  const [sortOrder, setSortOrder] = useState('desc');

  // Cargar datos de ventas
  const cargarVentas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando ventas...');

      // Usar el script MCP para cargar ventas
      const { SupabaseMCP } = await import('../../../supabase-mcp-complete.js');
      const result = await SupabaseMCP.queryTable('ventas', 100);

      if (result.success) {
        setVentas(result.data || []);
      } else {
        console.log('⚠️ No hay ventas, usando datos de ejemplo');
        // Datos de ejemplo si no hay ventas en la base de datos
        const ventasEjemplo = [
          {
            id: 1,
            numero_factura: 'F001-2024',
            cliente: 'Empresa ABC Ltda.',
            descripcion: 'Servicios de contabilidad mensual',
            monto_subtotal: 500000,
            monto_iva: 95000,
            monto_total: 595000,
            estado: 'Pagada',
            forma_pago: 'Transferencia',
            categoria: 'Contabilidad',
            fecha_emision: '2024-01-15',
            fecha_vencimiento: '2024-02-15',
            dias_vencimiento: 30,
          },
          {
            id: 2,
            numero_factura: 'F002-2024',
            cliente: 'Comercial XYZ SpA',
            descripcion: 'Declaración de IVA',
            monto_subtotal: 300000,
            monto_iva: 57000,
            monto_total: 357000,
            estado: 'Pendiente',
            forma_pago: 'Efectivo',
            categoria: 'Tributario',
            fecha_emision: '2024-01-20',
            fecha_vencimiento: '2024-02-20',
            dias_vencimiento: 15,
          },
        ];
        setVentas(ventasEjemplo);
      }
    } catch (err) {
      console.error('❌ Error cargando ventas:', err);
      setError('Error al cargar las ventas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  // Filtrar y ordenar ventas
  const ventasFiltradas = ventas
    .filter(venta => {
      const matchesSearch =
        venta.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venta.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEstado = !filterEstado || venta.estado === filterEstado;
      const matchesCategoria =
        !filterCategoria || venta.categoria === filterCategoria;

      return matchesSearch && matchesEstado && matchesCategoria;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Manejar edición de venta
  const handleEditVenta = venta => {
    setSelectedVenta(venta);
    setShowModal(true);
  };

  // Manejar eliminación de venta
  const handleDeleteVenta = async ventaId => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        console.log('🗑️ Eliminando venta:', ventaId);
        // En producción aquí se llamaría a la API
        setVentas(prev => prev.filter(v => v.id !== ventaId));
      } catch (error) {
        console.error('❌ Error eliminando venta:', error);
      }
    }
  };

  // Manejar guardar cambios
  const handleSaveVenta = async ventaData => {
    try {
      if (selectedVenta) {
        // Actualizar venta existente
        setVentas(prev =>
          prev.map(v =>
            v.id === selectedVenta.id ? { ...v, ...ventaData } : v
          )
        );
      } else {
        // Crear nueva venta
        const newVenta = {
          id: Date.now(),
          ...ventaData,
          fecha_emision: new Date().toISOString().split('T')[0],
          fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        };
        setVentas(prev => [...prev, newVenta]);
      }
      setShowModal(false);
      setSelectedVenta(null);
    } catch (error) {
      console.error('❌ Error guardando venta:', error);
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'numero_factura',
      label: 'Factura',
      sortable: true,
      render: (value, venta) => (
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
            <Receipt className='h-4 w-4 text-blue-600' />
          </div>
          <div>
            <p className='font-medium text-gray-900'>{value}</p>
            <p className='text-sm text-gray-500'>{venta.cliente}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'fecha_emision',
      label: 'Fecha Emisión',
      sortable: true,
      render: value => (
        <div className='flex items-center text-sm text-gray-500'>
          <Calendar className='h-3 w-3 mr-1' />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: true,
      render: value => (
        <Badge
          variant={
            value === 'Contabilidad'
              ? 'info'
              : value === 'Tributario'
              ? 'warning'
              : 'success'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'monto_total',
      label: 'Monto Total',
      sortable: true,
      render: value => formatCurrency(value),
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      render: value => (
        <Badge variant={getStatusColor(value)}>{getStatusLabel(value)}</Badge>
      ),
    },
    {
      key: 'forma_pago',
      label: 'Forma de Pago',
      sortable: true,
      render: value => (
        <div className='flex items-center text-sm'>
          {value === 'Transferencia' ? (
            <Banknote className='h-3 w-3 mr-1 text-green-500' />
          ) : value === 'Efectivo' ? (
            <Coins className='h-3 w-3 mr-1 text-green-500' />
          ) : (
            <CreditCard className='h-3 w-3 mr-1 text-blue-500' />
          )}
          <span className='text-gray-600'>{value}</span>
        </div>
      ),
    },
    {
      key: 'dias_vencimiento',
      label: 'Vencimiento',
      sortable: true,
      render: value => {
        if (value < 0) {
          return (
            <div className='flex items-center text-sm text-red-600'>
              <AlertTriangle className='h-3 w-3 mr-1' />
              Vencida
            </div>
          );
        } else if (value <= 7) {
          return (
            <div className='flex items-center text-sm text-yellow-600'>
              <Clock className='h-3 w-3 mr-1' />
              {value} días
            </div>
          );
        } else {
          return (
            <div className='flex items-center text-sm text-green-600'>
              <CheckCircle className='h-3 w-3 mr-1' />
              {value} días
            </div>
          );
        }
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, venta) => (
        <div className='flex items-center space-x-2'>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleEditVenta(venta)}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleEditVenta(venta)}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleDeleteVenta(venta.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  // Estadísticas
  const estadisticas = {
    total: ventas.length,
    pagadas: ventas.filter(v => v.estado === 'Pagada').length,
    pendientes: ventas.filter(v => v.estado === 'Pendiente').length,
    vencidas: ventas.filter(v => v.estado === 'Vencida').length,
    totalFacturado: ventas.reduce((sum, v) => sum + v.monto_total, 0),
    totalCobrado: ventas
      .filter(v => v.estado === 'Pagada')
      .reduce((sum, v) => sum + v.monto_total, 0),
  };

  return (
    <>
      <Helmet>
        <title>Ventas - MTZ Consultores Tributarios</title>
        <meta name='description' content='Gestión de ventas MTZ' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Gestión de Ventas
            </h1>
            <p className='text-gray-600'>
              Administra y gestiona todas las ventas del sistema
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button onClick={cargarVentas} variant='outline'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Actualizar
            </Button>
            <Button onClick={() => setShowModal(true)} variant='primary'>
              <Plus className='h-4 w-4 mr-2' />
              Nueva Venta
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6'>
          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Ventas
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.total}
                </p>
              </div>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <TrendingUp className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pagadas</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.pagadas}
                </p>
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pendientes</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.pendientes}
                </p>
              </div>
              <div className='p-3 bg-yellow-100 rounded-lg'>
                <Clock className='h-6 w-6 text-yellow-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Vencidas</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.vencidas}
                </p>
              </div>
              <div className='p-3 bg-red-100 rounded-lg'>
                <AlertTriangle className='h-6 w-6 text-red-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Facturado
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(estadisticas.totalFacturado)}
                </p>
              </div>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <DollarSign className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </Card>

          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Cobrado
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(estadisticas.totalCobrado)}
                </p>
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Buscar
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Buscar por factura, cliente...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Estado
              </label>
              <Select
                value={filterEstado}
                onChange={e => setFilterEstado(e.target.value)}
              >
                <option value=''>Todos los estados</option>
                <option value='Pagada'>Pagada</option>
                <option value='Pendiente'>Pendiente</option>
                <option value='Vencida'>Vencida</option>
              </Select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Categoría
              </label>
              <Select
                value={filterCategoria}
                onChange={e => setFilterCategoria(e.target.value)}
              >
                <option value=''>Todas las categorías</option>
                <option value='Contabilidad'>Contabilidad</option>
                <option value='Tributario'>Tributario</option>
                <option value='Asesoría'>Asesoría</option>
                <option value='Auditoría'>Auditoría</option>
              </Select>
            </div>

            <div className='flex items-end'>
              <Button variant='outline' className='w-full'>
                <Filter className='h-4 w-4 mr-2' />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabla de Ventas */}
        <Card>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Lista de Ventas ({ventasFiltradas.length})
            </h3>
            <Button variant='outline'>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </Button>
          </div>

          {loading ? (
            <div className='flex justify-center py-8'>
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className='text-center py-8'>
              <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
              <p className='text-red-600'>{error}</p>
            </div>
          ) : (
            <TableComponent
              data={ventasFiltradas}
              columns={columns}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={key => {
                if (sortBy === key) {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy(key);
                  setSortOrder('asc');
                }
              }}
            />
          )}
        </Card>
      </div>

      {/* Modal de Venta */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVenta(null);
        }}
        title={selectedVenta ? 'Editar Venta' : 'Nueva Venta'}
      >
        <VentaForm
          venta={selectedVenta}
          onSave={handleSaveVenta}
          onCancel={() => {
            setShowModal(false);
            setSelectedVenta(null);
          }}
        />
      </Modal>
    </>
  );
};

// Componente de formulario de venta
const VentaForm = ({ venta, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    numero_factura: venta?.numero_factura || '',
    cliente: venta?.cliente || '',
    descripcion: venta?.descripcion || '',
    monto_subtotal: venta?.monto_subtotal || 0,
    monto_iva: venta?.monto_iva || 0,
    monto_total: venta?.monto_total || 0,
    estado: venta?.estado || 'Pendiente',
    forma_pago: venta?.forma_pago || 'Transferencia',
    categoria: venta?.categoria || 'Contabilidad',
  });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  const calcularTotal = () => {
    const subtotal = parseFloat(formData.monto_subtotal) || 0;
    const iva = subtotal * 0.19; // 19% IVA
    const total = subtotal + iva;

    setFormData(prev => ({
      ...prev,
      monto_iva: iva,
      monto_total: total,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Número de Factura
          </label>
          <Input
            type='text'
            value={formData.numero_factura}
            onChange={e =>
              setFormData(prev => ({ ...prev, numero_factura: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Cliente
          </label>
          <Input
            type='text'
            value={formData.cliente}
            onChange={e =>
              setFormData(prev => ({ ...prev, cliente: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Categoría
          </label>
          <Select
            value={formData.categoria}
            onChange={e =>
              setFormData(prev => ({ ...prev, categoria: e.target.value }))
            }
          >
            <option value='Contabilidad'>Contabilidad</option>
            <option value='Tributario'>Tributario</option>
            <option value='Asesoría'>Asesoría</option>
            <option value='Auditoría'>Auditoría</option>
          </Select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Estado
          </label>
          <Select
            value={formData.estado}
            onChange={e =>
              setFormData(prev => ({ ...prev, estado: e.target.value }))
            }
          >
            <option value='Pendiente'>Pendiente</option>
            <option value='Pagada'>Pagada</option>
            <option value='Vencida'>Vencida</option>
          </Select>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Descripción
        </label>
        <textarea
          value={formData.descripcion}
          onChange={e =>
            setFormData(prev => ({ ...prev, descripcion: e.target.value }))
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Subtotal
          </label>
          <Input
            type='number'
            value={formData.monto_subtotal}
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                monto_subtotal: parseFloat(e.target.value) || 0,
              }));
              setTimeout(calcularTotal, 100);
            }}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            IVA (19%)
          </label>
          <Input
            type='number'
            value={formData.monto_iva}
            readOnly
            className='bg-gray-50'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Total
          </label>
          <Input
            type='number'
            value={formData.monto_total}
            readOnly
            className='bg-gray-50 font-bold'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Forma de Pago
        </label>
        <Select
          value={formData.forma_pago}
          onChange={e =>
            setFormData(prev => ({ ...prev, forma_pago: e.target.value }))
          }
        >
          <option value='Transferencia'>Transferencia</option>
          <option value='Efectivo'>Efectivo</option>
          <option value='Cheque'>Cheque</option>
        </Select>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' variant='primary'>
          {venta ? 'Actualizar' : 'Crear'} Venta
        </Button>
      </div>
    </form>
  );
};

export default VentasPage;
