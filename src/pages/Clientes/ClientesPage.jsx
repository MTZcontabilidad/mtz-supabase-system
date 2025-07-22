import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  RefreshCw,
  UserPlus,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import TableComponent from '@/components/ui/Table';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  clientesData,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
} from '@/lib/sampleData';

/**
 * Página de Gestión de Clientes MTZ - VERSIÓN MEJORADA
 * Gestión completa de clientes con filtros, búsqueda y acciones
 */
const ClientesPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortBy, setSortBy] = useState('razon_social');
  const [sortOrder, setSortOrder] = useState('asc');

  // Cargar datos de clientes
  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando clientes...');

      // Simular carga de datos (en producción usaría un servicio real)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setClientes(clientesData);
    } catch (err) {
      console.error('❌ Error cargando clientes:', err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  // Filtrar y ordenar clientes
  const clientesFiltrados = clientes
    .filter(cliente => {
      const matchesSearch =
        cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.rut.includes(searchTerm);
      const matchesCategoria =
        !filterCategoria || cliente.categoria === filterCategoria;
      const matchesEstado = !filterEstado || cliente.estado === filterEstado;

      return matchesSearch && matchesCategoria && matchesEstado;
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

  // Manejar edición de cliente
  const handleEditCliente = cliente => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  // Manejar eliminación de cliente
  const handleDeleteCliente = async clienteId => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        console.log('🗑️ Eliminando cliente:', clienteId);
        // En producción aquí se llamaría a la API
        setClientes(prev => prev.filter(c => c.id !== clienteId));
      } catch (error) {
        console.error('❌ Error eliminando cliente:', error);
      }
    }
  };

  // Manejar guardar cambios
  const handleSaveCliente = async clienteData => {
    try {
      if (selectedCliente) {
        // Actualizar cliente existente
        setClientes(prev =>
          prev.map(c =>
            c.id === selectedCliente.id ? { ...c, ...clienteData } : c
          )
        );
      } else {
        // Crear nuevo cliente
        const newCliente = {
          id: Date.now(),
          ...clienteData,
          fecha_registro: new Date().toISOString().split('T')[0],
          ultima_actividad: new Date().toISOString().split('T')[0],
        };
        setClientes(prev => [...prev, newCliente]);
      }
      setShowModal(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error('❌ Error guardando cliente:', error);
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'razon_social',
      label: 'Razón Social',
      sortable: true,
      render: (value, cliente) => (
        <div className='flex items-center space-x-3'>
          <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
            <Users className='h-4 w-4 text-blue-600' />
          </div>
          <div>
            <p className='font-medium text-gray-900'>{value}</p>
            <p className='text-sm text-gray-500'>{cliente.rut}</p>
          </div>
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
            value === 'VIP'
              ? 'success'
              : value === 'Premium'
                ? 'warning'
                : 'info'
          }
        >
          {value}
        </Badge>
      ),
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
      key: 'total_facturado',
      label: 'Total Facturado',
      sortable: true,
      render: value => formatCurrency(value),
    },
    {
      key: 'contacto',
      label: 'Contacto',
      render: (_, cliente) => (
        <div className='space-y-1'>
          <div className='flex items-center text-sm'>
            <Mail className='h-3 w-3 mr-1 text-gray-400' />
            <span className='text-gray-600'>{cliente.email}</span>
          </div>
          <div className='flex items-center text-sm'>
            <Phone className='h-3 w-3 mr-1 text-gray-400' />
            <span className='text-gray-600'>{cliente.telefono}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'ultima_actividad',
      label: 'Última Actividad',
      sortable: true,
      render: value => (
        <div className='flex items-center text-sm text-gray-500'>
          <Calendar className='h-3 w-3 mr-1' />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, cliente) => (
        <div className='flex items-center space-x-2'>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleEditCliente(cliente)}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleEditCliente(cliente)}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleDeleteCliente(cliente.id)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  // Estadísticas
  const estadisticas = {
    total: clientes.length,
    activos: clientes.filter(c => c.estado === 'Activo').length,
    vip: clientes.filter(c => c.categoria === 'VIP').length,
    totalFacturado: clientes.reduce((sum, c) => sum + c.total_facturado, 0),
  };

  return (
    <>
      <Helmet>
        <title>Clientes - MTZ Consultores Tributarios</title>
        <meta name='description' content='Gestión de clientes MTZ' />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Gestión de Clientes
            </h1>
            <p className='text-gray-600'>
              Administra y gestiona todos los clientes del sistema
            </p>
          </div>
          <div className='flex items-center space-x-3'>
            <Button onClick={cargarClientes} variant='outline'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Actualizar
            </Button>
            <Button onClick={() => setShowModal(true)} variant='primary'>
              <UserPlus className='h-4 w-4 mr-2' />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Clientes
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.total}
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
                  Clientes Activos
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.activos}
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
                <p className='text-sm font-medium text-gray-600'>
                  Clientes VIP
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.vip}
                </p>
              </div>
              <div className='p-3 bg-purple-100 rounded-lg'>
                <TrendingUp className='h-6 w-6 text-purple-600' />
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
              <div className='p-3 bg-yellow-100 rounded-lg'>
                <FileText className='h-6 w-6 text-yellow-600' />
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
                  placeholder='Buscar por nombre, email o RUT...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
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
                <option value='VIP'>VIP</option>
                <option value='Premium'>Premium</option>
                <option value='Regular'>Regular</option>
              </Select>
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
                <option value='Activo'>Activo</option>
                <option value='Inactivo'>Inactivo</option>
                <option value='Pendiente'>Pendiente</option>
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

        {/* Tabla de Clientes */}
        <Card>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Lista de Clientes ({clientesFiltrados.length})
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
              data={clientesFiltrados}
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

      {/* Modal de Cliente */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCliente(null);
        }}
        title={selectedCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
      >
        <ClienteForm
          cliente={selectedCliente}
          onSave={handleSaveCliente}
          onCancel={() => {
            setShowModal(false);
            setSelectedCliente(null);
          }}
        />
      </Modal>
    </>
  );
};

// Componente de formulario de cliente
const ClienteForm = ({ cliente, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    razon_social: cliente?.razon_social || '',
    rut: cliente?.rut || '',
    email: cliente?.email || '',
    telefono: cliente?.telefono || '',
    direccion: cliente?.direccion || '',
    categoria: cliente?.categoria || 'Regular',
    estado: cliente?.estado || 'Activo',
    rubro: cliente?.rubro || '',
    observaciones: cliente?.observaciones || '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Razón Social
          </label>
          <Input
            type='text'
            value={formData.razon_social}
            onChange={e =>
              setFormData(prev => ({ ...prev, razon_social: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            RUT
          </label>
          <Input
            type='text'
            value={formData.rut}
            onChange={e =>
              setFormData(prev => ({ ...prev, rut: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email
          </label>
          <Input
            type='email'
            value={formData.email}
            onChange={e =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Teléfono
          </label>
          <Input
            type='tel'
            value={formData.telefono}
            onChange={e =>
              setFormData(prev => ({ ...prev, telefono: e.target.value }))
            }
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
            <option value='Regular'>Regular</option>
            <option value='Premium'>Premium</option>
            <option value='VIP'>VIP</option>
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
            <option value='Activo'>Activo</option>
            <option value='Inactivo'>Inactivo</option>
            <option value='Pendiente'>Pendiente</option>
          </Select>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Dirección
        </label>
        <Input
          type='text'
          value={formData.direccion}
          onChange={e =>
            setFormData(prev => ({ ...prev, direccion: e.target.value }))
          }
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Rubro
        </label>
        <Input
          type='text'
          value={formData.rubro}
          onChange={e =>
            setFormData(prev => ({ ...prev, rubro: e.target.value }))
          }
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Observaciones
        </label>
        <textarea
          value={formData.observaciones}
          onChange={e =>
            setFormData(prev => ({ ...prev, observaciones: e.target.value }))
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit' variant='primary'>
          {cliente ? 'Actualizar' : 'Crear'} Cliente
        </Button>
      </div>
    </form>
  );
};

export default ClientesPage;
