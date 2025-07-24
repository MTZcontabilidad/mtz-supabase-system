import React, { useState, useCallback, useEffect } from 'react';
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
import SimpleModal from '../../components/ui/SimpleModal';
import dataService from '../../services/dataService.js';

// Funciones de utilidad
const formatCurrency = amount => {
  const numAmount = parseFloat(amount) || 0;
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(numAmount);
};

const formatDate = dateString => {
  if (!dateString) return 'Sin fecha';
  try {
    return new Date(dateString).toLocaleDateString('es-CL');
  } catch (error) {
    return 'Fecha inválida';
  }
};

const getStatusColor = status => {
  if (!status) return 'bg-gray-100 text-gray-800';

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

const getStatusLabel = status => {
  return status || 'Desconocido';
};

const VentasPageSimple = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  // Cargar datos de ventas
  const cargarVentas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando ventas...');

      const data = await dataService.getVentas();
      setVentas(data);
      console.log('✅ Ventas cargadas exitosamente:', data.length, 'registros');
    } catch (error) {
      console.error('Error cargando ventas:', error);
      setError('Error al cargar ventas');
      // Fallback a datos mock si no hay conexión
      const ventasEjemplo = dataService.getDatosMock().ventas;
      setVentas(ventasEjemplo);
      console.log(
        '✅ Usando datos mock para ventas:',
        ventasEjemplo.length,
        'registros'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    // Verificar que venta y sus propiedades existan antes de acceder
    if (!venta) return false;

    const numeroFactura = venta.numero_factura || '';
    const cliente = venta.cliente || '';
    const descripcion = venta.descripcion || '';
    const estado = venta.estado || '';
    const categoria = venta.categoria || '';

    const matchesSearch =
      numeroFactura.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || estado === filterEstado;
    const matchesCategoria = !filterCategoria || categoria === filterCategoria;

    return matchesSearch && matchesEstado && matchesCategoria;
  });

  // Estadísticas
  const estadisticas = {
    total: ventas.length,
    pagadas: ventas.filter(v => v && v.estado === 'Pagada').length,
    pendientes: ventas.filter(v => v && v.estado === 'Pendiente').length,
    vencidas: ventas.filter(v => v && v.estado === 'Vencida').length,
    totalFacturado: ventas.reduce((sum, v) => sum + (v?.monto_total || 0), 0),
    totalCobrado: ventas
      .filter(v => v && v.estado === 'Pagada')
      .reduce((sum, v) => sum + (v?.monto_total || 0), 0),
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600 to-blue-600 shadow-lg rounded-lg p-6 text-white'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>
              Gestión de Ventas
            </h1>
            <p className='text-green-100'>
              Administra y gestiona todas las ventas del sistema
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button
              onClick={cargarVentas}
              variant='outline'
              className='text-white border-white hover:bg-white hover:text-green-600'
            >
              <RefreshCw className='h-4 w-4 mr-2' />
              Actualizar
            </Button>
            <Button
              onClick={() => {
                setSelectedVenta(null);
                setShowModal(true);
              }}
              className='bg-white text-green-600 hover:bg-green-50'
            >
              <Plus className='h-4 w-4 mr-2' />
              Nueva Venta
            </Button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        <div className='bg-white overflow-hidden shadow rounded-lg'>
          <div className='p-5'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <TrendingUp className='h-6 w-6 text-blue-600' />
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Ventas
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {estadisticas.total}
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
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Pagadas
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {estadisticas.pagadas}
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
                <div className='w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  <Clock className='h-6 w-6 text-yellow-600' />
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Pendientes
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {estadisticas.pendientes}
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
                <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                  <AlertTriangle className='h-6 w-6 text-red-600' />
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Vencidas
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {estadisticas.vencidas}
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
                <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <DollarSign className='h-6 w-6 text-purple-600' />
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Facturado
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {formatCurrency(estadisticas.totalFacturado)}
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
                <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                  <CheckCircle className='h-6 w-6 text-green-600' />
                </div>
              </div>
              <div className='ml-5 w-0 flex-1'>
                <dl>
                  <dt className='text-sm font-medium text-gray-500 truncate'>
                    Total Cobrado
                  </dt>
                  <dd className='text-lg font-medium text-gray-900'>
                    {formatCurrency(estadisticas.totalCobrado)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className='bg-white shadow rounded-lg p-6'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Buscar
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Buscar por factura, cliente...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Estado
            </label>
            <select
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value)}
              className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            >
              <option value=''>Todos los estados</option>
              <option value='Pagada'>Pagada</option>
              <option value='Pendiente'>Pendiente</option>
              <option value='Vencida'>Vencida</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Categoría
            </label>
            <select
              value={filterCategoria}
              onChange={e => setFilterCategoria(e.target.value)}
              className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            >
              <option value=''>Todas las categorías</option>
              <option value='Contabilidad'>Contabilidad</option>
              <option value='Tributario'>Tributario</option>
              <option value='Asesoría'>Asesoría</option>
              <option value='Auditoría'>Auditoría</option>
            </select>
          </div>

          <div className='flex items-end'>
            <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full'>
              <Filter className='h-4 w-4 mr-2' />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className='bg-white shadow rounded-lg'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex justify-between items-center'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Lista de Ventas ({ventasFiltradas.length})
            </h3>
            <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        ) : error ? (
          <div className='text-center py-8'>
            <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <p className='text-red-600'>{error}</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Factura
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cliente
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Fecha
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Categoría
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Monto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Estado
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {ventasFiltradas.map(venta => (
                  <tr
                    key={venta?.id || Math.random()}
                    className='hover:bg-gray-50'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                          <Receipt className='h-4 w-4 text-blue-600' />
                        </div>
                        <div className='ml-3'>
                          <div className='text-sm font-medium text-gray-900'>
                            {venta?.numero_factura || 'Sin número'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {venta?.cliente || 'Sin cliente'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Calendar className='h-3 w-3 mr-1' />
                        {venta?.fecha_emision
                          ? formatDate(venta.fecha_emision)
                          : 'Sin fecha'}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          venta?.categoria
                        )}`}
                      >
                        {venta?.categoria || 'Sin categoría'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatCurrency(venta?.monto_total || 0)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          venta?.estado
                        )}`}
                      >
                        {getStatusLabel(venta?.estado)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => {
                            setSelectedVenta(venta);
                            setShowModal(true);
                          }}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          <Eye className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVenta(venta);
                            setShowModal(true);
                          }}
                          className='text-green-600 hover:text-green-900'
                        >
                          <Edit className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                '¿Estás seguro de eliminar esta venta?'
                              )
                            ) {
                              setVentas(prev =>
                                prev.filter(v => v.id !== venta.id)
                              );
                            }
                          }}
                          className='text-red-600 hover:text-red-900'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Venta */}
      <SimpleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVenta(null);
        }}
        title={selectedVenta ? 'Editar Venta' : 'Nueva Venta'}
      >
        <VentaForm
          venta={selectedVenta}
          onSave={ventaData => {
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
                fecha_vencimiento: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                )
                  .toISOString()
                  .split('T')[0],
              };
              setVentas(prev => [...prev, newVenta]);
            }
            setShowModal(false);
            setSelectedVenta(null);
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedVenta(null);
          }}
        />
      </SimpleModal>
    </div>
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
          <input
            type='text'
            value={formData.numero_factura}
            onChange={e =>
              setFormData(prev => ({ ...prev, numero_factura: e.target.value }))
            }
            className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Cliente
          </label>
          <input
            type='text'
            value={formData.cliente}
            onChange={e =>
              setFormData(prev => ({ ...prev, cliente: e.target.value }))
            }
            className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Categoría
          </label>
          <select
            value={formData.categoria}
            onChange={e =>
              setFormData(prev => ({ ...prev, categoria: e.target.value }))
            }
            className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          >
            <option value='Contabilidad'>Contabilidad</option>
            <option value='Tributario'>Tributario</option>
            <option value='Asesoría'>Asesoría</option>
            <option value='Auditoría'>Auditoría</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Estado
          </label>
          <select
            value={formData.estado}
            onChange={e =>
              setFormData(prev => ({ ...prev, estado: e.target.value }))
            }
            className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
          >
            <option value='Pendiente'>Pendiente</option>
            <option value='Pagada'>Pagada</option>
            <option value='Vencida'>Vencida</option>
          </select>
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
          <input
            type='number'
            value={formData.monto_subtotal}
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                monto_subtotal: parseFloat(e.target.value) || 0,
              }));
              setTimeout(calcularTotal, 100);
            }}
            className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            IVA (19%)
          </label>
          <input
            type='number'
            value={formData.monto_iva}
            readOnly
            className='block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Total
          </label>
          <input
            type='number'
            value={formData.monto_total}
            readOnly
            className='block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 font-bold sm:text-sm'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Forma de Pago
        </label>
        <select
          value={formData.forma_pago}
          onChange={e =>
            setFormData(prev => ({ ...prev, forma_pago: e.target.value }))
          }
          className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
        >
          <option value='Transferencia'>Transferencia</option>
          <option value='Efectivo'>Efectivo</option>
          <option value='Cheque'>Cheque</option>
        </select>
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
        >
          Cancelar
        </button>
        <button
          type='submit'
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
        >
          {venta ? 'Actualizar' : 'Crear'} Venta
        </button>
      </div>
    </form>
  );
};

export default VentasPageSimple;
