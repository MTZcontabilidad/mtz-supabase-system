import { useState, useCallback, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import SimpleModal from '../../components/ui/SimpleModal';
import dataService from '../../services/dataService.js';

// Hook de Toast simplificado
const useToast = () => {
  const showToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };
  return { showToast };
};

const ClientesPage = () => {
  const { showToast } = useToast();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargarClientes = useCallback(async () => {
    try {
      setLoading(true);

      const data = await dataService.getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);

      // Fallback a datos mock si no hay conexión
      const mockData = dataService.getDatosMock().clientes;
      setClientes(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(
    cliente =>
      cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.ruc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCliente = async clienteData => {
    try {
      setSaving(true);

      if (selectedCliente) {
        // Actualizar cliente existente
        await dataService.actualizarCliente(selectedCliente.id, clienteData);
        showToast('Cliente actualizado exitosamente', 'success');
      } else {
        // Crear nuevo cliente
        await dataService.crearCliente(clienteData);
        showToast('Cliente creado exitosamente', 'success');
      }

      setShowModal(false);
      setSelectedCliente(null);
      cargarClientes(); // Recargar datos
    } catch (error) {
      console.error('Error guardando cliente:', error);
      showToast('Error al guardar cliente', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCliente = async id => {
    if (!window.confirm('¿Está seguro de eliminar este cliente?')) return;

    try {
      await dataService.eliminarCliente(id);
      showToast('Cliente eliminado exitosamente', 'success');
      cargarClientes(); // Recargar datos
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      showToast('Error al eliminar cliente', 'error');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
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
          <button
            onClick={cargarClientes}
            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </button>
          <button
            onClick={() => {
              setSelectedCliente(null);
              setShowModal(true);
            }}
            className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
          >
            <Plus className='h-4 w-4 mr-2' />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Total Clientes
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {clientes.length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <Users className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Clientes Activos
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {clientes.filter(c => c.estado !== 'inactivo').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <Users className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Nuevos este mes
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {
                  clientes.filter(c => {
                    const created = new Date(c.created_at);
                    const now = new Date();
                    return (
                      created.getMonth() === now.getMonth() &&
                      created.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Búsqueda y Filtros */}
      <Card>
        <div className='flex items-center space-x-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                type='text'
                placeholder='Buscar por nombre, RUC o email...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <button
            onClick={() => setSearchTerm('')}
            className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          >
            <Filter className='h-4 w-4 mr-2' />
            Limpiar
          </button>
        </div>
      </Card>

      {/* Tabla de Clientes */}
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>
            Lista de Clientes ({clientesFiltrados.length})
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
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cliente
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  RUC
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Contacto
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Fecha Registro
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {clientesFiltrados.map(cliente => (
                <tr key={cliente.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {cliente.nombre}
                      </div>
                      {cliente.razon_social && (
                        <div className='text-sm text-gray-500'>
                          {cliente.razon_social}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {cliente.ruc}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm text-gray-900'>
                        {cliente.email}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {cliente.telefono}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge
                      color={cliente.estado === 'activo' ? 'green' : 'gray'}
                    >
                      {cliente.estado || 'activo'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {cliente.created_at
                      ? new Date(cliente.created_at).toLocaleDateString('es-CL')
                      : 'N/A'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => {
                          setSelectedCliente(cliente);
                          setShowModal(true);
                        }}
                        className='text-blue-600 hover:text-blue-900'
                        title='Ver detalles'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCliente(cliente);
                          setShowModal(true);
                        }}
                        className='text-green-600 hover:text-green-900'
                        title='Editar'
                      >
                        <Edit className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className='text-red-600 hover:text-red-900'
                        title='Eliminar'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clientesFiltrados.length === 0 && (
            <div className='text-center py-8 text-gray-500'>
              <Users className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>No hay clientes que coincidan con la búsqueda</p>
            </div>
          )}
        </div>
      </Card>

      {/* Modal de Cliente */}
      <SimpleModal
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
          saving={saving}
        />
      </SimpleModal>
    </div>
  );
};

// Componente de formulario de cliente
const ClienteForm = ({ cliente, onSave, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    razon_social: cliente?.razon_social || '',
    ruc: cliente?.ruc || '',
    email: cliente?.email || '',
    telefono: cliente?.telefono || '',
    direccion: cliente?.direccion || '',
    estado: cliente?.estado || 'activo',
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
            Nombre *
          </label>
          <Input
            type='text'
            value={formData.nombre}
            onChange={e =>
              setFormData(prev => ({ ...prev, nombre: e.target.value }))
            }
            placeholder='Nombre del cliente'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Razón Social
          </label>
          <Input
            type='text'
            value={formData.razon_social}
            onChange={e =>
              setFormData(prev => ({ ...prev, razon_social: e.target.value }))
            }
            placeholder='Razón social'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            RUC *
          </label>
          <Input
            type='text'
            value={formData.ruc}
            onChange={e =>
              setFormData(prev => ({ ...prev, ruc: e.target.value }))
            }
            placeholder='12345678-9'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Email *
          </label>
          <Input
            type='email'
            value={formData.email}
            onChange={e =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            placeholder='cliente@empresa.cl'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Teléfono
          </label>
          <Input
            type='tel'
            value={formData.telefono}
            onChange={e =>
              setFormData(prev => ({ ...prev, telefono: e.target.value }))
            }
            placeholder='+56 2 2345 6789'
          />
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
          >
            <option value='activo'>Activo</option>
            <option value='inactivo'>Inactivo</option>
            <option value='prospecto'>Prospecto</option>
          </select>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Dirección
        </label>
        <textarea
          value={formData.direccion}
          onChange={e =>
            setFormData(prev => ({ ...prev, direccion: e.target.value }))
          }
          placeholder='Dirección completa'
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type='submit'
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
          disabled={saving}
        >
          {saving ? 'Guardando...' : cliente ? 'Actualizar' : 'Crear'} Cliente
        </button>
      </div>
    </form>
  );
};

export default ClientesPage;
