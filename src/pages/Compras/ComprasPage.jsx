import React, { useState, useCallback, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  DollarSign,
  Calendar,
  Package,
  Truck,
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import SimpleModal from '../../components/ui/SimpleModal';

// Funciones de utilidad
const formatCurrency = amount => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
};

const formatDate = date => {
  return new Date(date).toLocaleDateString('es-CL');
};

const getStatusColor = status => {
  switch (status) {
    case 'Pendiente':
      return 'yellow';
    case 'Aprobada':
      return 'green';
    case 'Rechazada':
      return 'red';
    case 'En proceso':
      return 'blue';
    case 'Completada':
      return 'green';
    default:
      return 'gray';
  }
};

const getStatusLabel = status => {
  switch (status) {
    case 'Pendiente':
      return 'Pendiente';
    case 'Aprobada':
      return 'Aprobada';
    case 'Rechazada':
      return 'Rechazada';
    case 'En proceso':
      return 'En proceso';
    case 'Completada':
      return 'Completada';
    default:
      return status;
  }
};

// Simulación del servicio de datos
const dataService = {
  getComprasData: async () => {
    // Datos de ejemplo para compras
    return [
      {
        id: 1,
        numero_orden: 'OC-2024-001',
        proveedor: 'Proveedor ABC Ltda.',
        descripcion: 'Materiales de oficina',
        monto_total: 250000,
        fecha_orden: '2024-12-15',
        fecha_entrega: '2024-12-20',
        estado: 'Aprobada',
        categoria: 'Oficina',
        forma_pago: 'Transferencia',
        prioridad: 'Normal',
      },
      {
        id: 2,
        numero_orden: 'OC-2024-002',
        proveedor: 'Tecnología XYZ SpA',
        descripcion: 'Equipos informáticos',
        monto_total: 1500000,
        fecha_orden: '2024-12-10',
        fecha_entrega: '2024-12-25',
        estado: 'En proceso',
        categoria: 'Tecnología',
        forma_pago: 'Transferencia',
        prioridad: 'Alta',
      },
      {
        id: 3,
        numero_orden: 'OC-2024-003',
        proveedor: 'Servicios LTDA',
        descripcion: 'Servicios de limpieza',
        monto_total: 500000,
        fecha_orden: '2024-12-05',
        fecha_entrega: '2024-12-30',
        estado: 'Pendiente',
        categoria: 'Servicios',
        forma_pago: 'Transferencia',
        prioridad: 'Normal',
      },
    ];
  },

  getEstadisticasCompras: async () => {
    return {
      total_compras: 3,
      compras_pendientes: 1,
      compras_aprobadas: 1,
      compras_en_proceso: 1,
      monto_total: 2250000,
      promedio_por_compra: 750000,
    };
  },

  crearCompra: async compra => {
    console.log('Creando compra:', compra);
    return { success: true, id: Date.now() };
  },

  actualizarCompra: async (id, compra) => {
    console.log('Actualizando compra:', id, compra);
    return { success: true };
  },

  eliminarCompra: async id => {
    console.log('Eliminando compra:', id);
    return { success: true };
  },
};

// Hook de Toast simplificado
const useToast = () => {
  const showToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };
  return { showToast };
};

const ComprasPage = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compras, setCompras] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    total_compras: 0,
    compras_pendientes: 0,
    compras_aprobadas: 0,
    compras_en_proceso: 0,
    monto_total: 0,
    promedio_por_compra: 0,
  });

  const cargarCompras = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dataService.getComprasData();
      setCompras(data);
    } catch (error) {
      console.log('Error al cargar compras: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarEstadisticas = useCallback(async () => {
    try {
      const stats = await dataService.getEstadisticasCompras();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  useEffect(() => {
    cargarCompras();
    cargarEstadisticas();
  }, [cargarCompras, cargarEstadisticas]);

  // Filtrar compras
  const comprasFiltradas = compras.filter(compra => {
    const matchesSearch =
      compra.numero_orden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = !filterEstado || compra.estado === filterEstado;
    const matchesCategoria =
      !filterCategoria || compra.categoria === filterCategoria;

    return matchesSearch && matchesEstado && matchesCategoria;
  });

  // Columnas de la tabla
  const comprasColumns = [
    {
      key: 'numero_orden',
      header: 'Número Orden',
      cell: compra => (
        <span className='font-medium text-blue-600'>{compra.numero_orden}</span>
      ),
    },
    {
      key: 'proveedor',
      header: 'Proveedor',
      cell: compra => compra.proveedor,
    },
    {
      key: 'descripcion',
      header: 'Descripción',
      cell: compra => (
        <span className='max-w-xs truncate' title={compra.descripcion}>
          {compra.descripcion}
        </span>
      ),
    },
    {
      key: 'monto_total',
      header: 'Monto Total',
      cell: compra => (
        <span className='font-medium text-green-600'>
          {formatCurrency(compra.monto_total)}
        </span>
      ),
    },
    {
      key: 'fecha_orden',
      header: 'Fecha Orden',
      cell: compra => formatDate(compra.fecha_orden),
    },
    {
      key: 'estado',
      header: 'Estado',
      cell: compra => (
        <Badge color={getStatusColor(compra.estado)}>
          {getStatusLabel(compra.estado)}
        </Badge>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      cell: compra => compra.categoria,
    },
    {
      key: 'actions',
      header: 'Acciones',
      cell: compra => (
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => {
              setSelectedCompra(compra);
              setShowModal(true);
            }}
            className='text-blue-600 hover:text-blue-800'
            title='Ver detalles'
          >
            <Eye className='h-4 w-4' />
          </button>
          <button
            onClick={() => {
              setSelectedCompra(compra);
              setShowModal(true);
            }}
            className='text-green-600 hover:text-green-800'
            title='Editar'
          >
            <Edit className='h-4 w-4' />
          </button>
          <button
            onClick={() => {
              if (window.confirm('¿Está seguro de eliminar esta compra?')) {
                setCompras(prev => prev.filter(c => c.id !== compra.id));
                showToast('Compra eliminada exitosamente', 'success');
              }
            }}
            className='text-red-600 hover:text-red-800'
            title='Eliminar'
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Gestión de Compras
          </h1>
          <p className='text-gray-600'>
            Administra y gestiona todas las compras del sistema
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <button
            onClick={cargarCompras}
            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </button>
          <button
            onClick={() => {
              setSelectedCompra(null);
              setShowModal(true);
            }}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
          >
            <Plus className='h-4 w-4 mr-2' />
            Nueva Compra
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <ShoppingCart className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Total Compras</p>
              <p className='text-2xl font-bold text-gray-900'>
                {estadisticas.total_compras}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <Package className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Pendientes</p>
              <p className='text-2xl font-bold text-gray-900'>
                {estadisticas.compras_pendientes}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Truck className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Aprobadas</p>
              <p className='text-2xl font-bold text-gray-900'>
                {estadisticas.compras_aprobadas}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <DollarSign className='h-6 w-6 text-purple-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Monto Total</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(estadisticas.monto_total)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Buscar
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                type='text'
                placeholder='Buscar por orden, proveedor...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Estado
            </label>
            <select
              value={filterEstado}
              onChange={e => setFilterEstado(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Todos los estados</option>
              <option value='Pendiente'>Pendiente</option>
              <option value='Aprobada'>Aprobada</option>
              <option value='Rechazada'>Rechazada</option>
              <option value='En proceso'>En proceso</option>
              <option value='Completada'>Completada</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Categoría
            </label>
            <select
              value={filterCategoria}
              onChange={e => setFilterCategoria(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Todas las categorías</option>
              <option value='Oficina'>Oficina</option>
              <option value='Tecnología'>Tecnología</option>
              <option value='Servicios'>Servicios</option>
              <option value='Equipos'>Equipos</option>
              <option value='Materiales'>Materiales</option>
            </select>
          </div>

          <div className='flex items-end'>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterEstado('');
                setFilterCategoria('');
              }}
              className='w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
            >
              <Filter className='h-4 w-4 mr-2' />
              Limpiar Filtros
            </button>
          </div>
        </div>
      </Card>

      {/* Tabla de Compras */}
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>
            Lista de Compras
          </h3>
          <div className='flex gap-2'>
            <button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
              <Download className='h-4 w-4 mr-2' />
              Exportar (Funcionalidad en desarrollo)
            </button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                {comprasColumns.map((column, index) => (
                  <th
                    key={column.key || index}
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {comprasFiltradas.map(compra => (
                <tr key={compra.id} className='hover:bg-gray-50'>
                  {comprasColumns.map((column, index) => (
                    <td
                      key={column.key || index}
                      className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
                    >
                      {column.cell ? column.cell(compra) : compra[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {comprasFiltradas.length === 0 && (
            <div className='text-center py-8 text-gray-500'>
              <ShoppingCart className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>No hay compras que coincidan con los filtros</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Compra */}
      <SimpleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCompra(null);
        }}
        title={selectedCompra ? 'Editar Compra' : 'Nueva Compra'}
      >
        <CompraForm
          compra={selectedCompra}
          onSave={compraData => {
            if (selectedCompra) {
              // Actualizar compra existente
              setCompras(prev =>
                prev.map(c =>
                  c.id === selectedCompra.id ? { ...c, ...compraData } : c
                )
              );
            } else {
              // Crear nueva compra
              const newCompra = {
                id: Date.now(),
                ...compraData,
                numero_orden: `OC-2024-${String(Date.now()).slice(-3)}`,
                fecha_orden: new Date().toISOString().split('T')[0],
              };
              setCompras(prev => [...prev, newCompra]);
            }
            setShowModal(false);
            setSelectedCompra(null);
            showToast(
              selectedCompra
                ? 'Compra actualizada exitosamente'
                : 'Compra creada exitosamente',
              'success'
            );
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedCompra(null);
          }}
        />
      </SimpleModal>
    </div>
  );
};

// Componente de formulario de compra
const CompraForm = ({ compra, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    proveedor: compra?.proveedor || '',
    descripcion: compra?.descripcion || '',
    monto_total: compra?.monto_total || 0,
    fecha_entrega: compra?.fecha_entrega || '',
    estado: compra?.estado || 'Pendiente',
    categoria: compra?.categoria || 'Oficina',
    forma_pago: compra?.forma_pago || 'Transferencia',
    prioridad: compra?.prioridad || 'Normal',
  });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Proveedor
          </label>
          <Input
            type='text'
            value={formData.proveedor}
            onChange={e =>
              setFormData(prev => ({ ...prev, proveedor: e.target.value }))
            }
            placeholder='Nombre del proveedor'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Categoría
          </label>
          <select
            value={formData.categoria}
            onChange={e =>
              setFormData(prev => ({ ...prev, categoria: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value='Oficina'>Oficina</option>
            <option value='Tecnología'>Tecnología</option>
            <option value='Servicios'>Servicios</option>
            <option value='Equipos'>Equipos</option>
            <option value='Materiales'>Materiales</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Estado
          </label>
          <select
            value={formData.estado}
            onChange={e =>
              setFormData(prev => ({ ...prev, estado: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value='Pendiente'>Pendiente</option>
            <option value='Aprobada'>Aprobada</option>
            <option value='Rechazada'>Rechazada</option>
            <option value='En proceso'>En proceso</option>
            <option value='Completada'>Completada</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Prioridad
          </label>
          <select
            value={formData.prioridad}
            onChange={e =>
              setFormData(prev => ({ ...prev, prioridad: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value='Baja'>Baja</option>
            <option value='Normal'>Normal</option>
            <option value='Alta'>Alta</option>
            <option value='Urgente'>Urgente</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Monto Total
          </label>
          <Input
            type='number'
            value={formData.monto_total}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                monto_total: parseFloat(e.target.value) || 0,
              }))
            }
            placeholder='0'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Fecha de Entrega
          </label>
          <Input
            type='date'
            value={formData.fecha_entrega}
            onChange={e =>
              setFormData(prev => ({ ...prev, fecha_entrega: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Forma de Pago
          </label>
          <select
            value={formData.forma_pago}
            onChange={e =>
              setFormData(prev => ({ ...prev, forma_pago: e.target.value }))
            }
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          >
            <option value='Transferencia'>Transferencia</option>
            <option value='Cheque'>Cheque</option>
            <option value='Efectivo'>Efectivo</option>
            <option value='Tarjeta'>Tarjeta</option>
          </select>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Descripción
        </label>
        <textarea
          value={formData.descripcion}
          onChange={e =>
            setFormData(prev => ({ ...prev, descripcion: e.target.value }))
          }
          placeholder='Descripción detallada de la compra'
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
          required
        />
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
          {compra ? 'Actualizar' : 'Crear'} Compra
        </button>
      </div>
    </form>
  );
};

export default ComprasPage;
