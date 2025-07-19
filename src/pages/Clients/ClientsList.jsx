import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Users,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../../components/ui/index.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/Dialog.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import SearchFilters from '../../components/clientes/SearchFilters.jsx';
import ClienteForm from '../../components/clientes/ClienteForm.jsx';
import CargaMasiva from '../../components/clientes/CargaMasiva.jsx';
import ExportData from '../../components/shared/ExportData.jsx';
import useAuth from '../../hooks/useAuth.js';
import useSupabaseAvanzado from '../../hooks/useSupabaseAvanzado.js';
import { formatCurrency, formatRUT } from '../../utils/helpers.js';
import { ESTADOS_CLIENTE, TIPOS_EMPRESA } from '../../utils/constants.js';

// 🔧 Debug tools (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  import('../../utils/supabaseDebug.js');
}

/**
 * ClientsList Component - Versión Optimizada
 * Lista de clientes con funcionalidades avanzadas:
 * - Búsqueda y filtros inteligentes
 * - Paginación optimizada
 * - Carga masiva de datos
 * - Exportación múltiple formato
 * - Gestión CRUD completa
 */
const ClientsList = () => {
  const { role, hasPermission } = useAuth();
  const {
    clientes,
    loading,
    error,
    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    refreshData
  } = useSupabaseAvanzado();

  // Estados del componente
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [showCargaMasiva, setShowCargaMasiva] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    estado: [],
    tipo_empresa: [],
    region: [],
    fecha_desde: '',
    fecha_hasta: ''
  });

  // Cargar clientes al montar
  useEffect(() => {
    loadClientes();
  }, []);

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'nombre_empresa',
      title: 'Empresa',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className='font-medium text-gray-900'>{value}</div>
          <div className='text-sm text-gray-500'>{formatRUT(row.rut)}</div>
        </div>
      ),
    },
    {
      key: 'nombre_contacto',
      title: 'Contacto',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className='font-medium text-gray-900'>{value}</div>
          <div className='text-sm text-gray-500'>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'telefono',
      title: 'Teléfono',
      render: (value) => (
        <span className='text-gray-900'>{value}</span>
      ),
    },
    {
      key: 'ciudad',
      title: 'Ubicación',
      render: (value, row) => (
        <div>
          <div className='text-gray-900'>{value}</div>
          <div className='text-sm text-gray-500'>{row.region}</div>
        </div>
      ),
    },
    {
      key: 'tipo_empresa',
      title: 'Tipo',
      render: (value) => {
        const tipo = TIPOS_EMPRESA.find(t => t.value === value);
        return (
          <Badge variant='outline' size='sm'>
            {tipo?.label || value}
          </Badge>
        );
      },
    },
    {
      key: 'estado',
      title: 'Estado',
      render: (value) => {
        const estado = ESTADOS_CLIENTE.find(e => e.value === value);
        const variants = {
          activo: 'success',
          inactivo: 'secondary',
          prospecto: 'warning',
          suspendido: 'danger'
        };
        return (
          <Badge variant={variants[value] || 'outline'} size='sm'>
            {estado?.label || value}
          </Badge>
        );
      },
    },
    {
      key: 'acciones',
      title: 'Acciones',
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleViewCliente(row)}
          >
            <Eye className='w-4 h-4' />
          </Button>
          {hasPermission('clientes.update') && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleEditCliente(row)}
            >
              <Edit className='w-4 h-4' />
            </Button>
          )}
          {hasPermission('clientes.delete') && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteCliente(row)}
              className='text-red-600 hover:text-red-700'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Filtrar clientes basado en filtros activos
  const filteredClientes = React.useMemo(() => {
    if (!clientes) return [];

    return clientes.filter(cliente => {
      // Búsqueda de texto
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          cliente.nombre_empresa,
          cliente.rut,
          cliente.nombre_contacto,
          cliente.email,
          cliente.telefono
        ];
        
        const matches = searchFields.some(field => 
          field?.toLowerCase().includes(searchTerm)
        );
        
        if (!matches) return false;
      }

      // Filtros de estado
      if (filters.estado?.length && !filters.estado.includes(cliente.estado)) {
        return false;
      }

      // Filtros de tipo de empresa
      if (filters.tipo_empresa?.length && !filters.tipo_empresa.includes(cliente.tipo_empresa)) {
        return false;
      }

      // Filtros de región
      if (filters.region?.length && !filters.region.includes(cliente.region)) {
        return false;
      }

      // Filtros de fecha
      if (filters.fecha_desde || filters.fecha_hasta) {
        const clienteDate = new Date(cliente.created_at);
        if (filters.fecha_desde && clienteDate < new Date(filters.fecha_desde)) {
          return false;
        }
        if (filters.fecha_hasta && clienteDate > new Date(filters.fecha_hasta)) {
          return false;
        }
      }

      return true;
    });
  }, [clientes, filters]);

  // Handlers
  const handleNewCliente = () => {
    setSelectedCliente(null);
    setShowClienteForm(true);
  };

  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente);
    setShowClienteForm(true);
  };

  const handleViewCliente = (cliente) => {
    // Implementar vista detallada del cliente
    console.log('Ver cliente:', cliente);
  };

  const handleDeleteCliente = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      try {
        await deleteCliente(clienteToDelete.id);
        setShowDeleteDialog(false);
        setClienteToDelete(null);
      } catch (error) {
        console.error('Error eliminando cliente:', error);
      }
    }
  };

  const handleSaveCliente = async (clienteData) => {
    try {
      if (selectedCliente) {
        await updateCliente(selectedCliente.id, clienteData);
      } else {
        await createCliente(clienteData);
      }
      setShowClienteForm(false);
      setSelectedCliente(null);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      throw error;
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      estado: [],
      tipo_empresa: [],
      region: [],
      fecha_desde: '',
      fecha_hasta: ''
    });
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-red-900 mb-2'>Error al cargar clientes</h3>
          <p className='text-red-700 mb-4'>{error}</p>
          <Button onClick={handleRefresh} variant='outline'>
            <RefreshCw className='w-4 h-4 mr-2' />
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Gestión de Clientes</h1>
          <p className='text-gray-600 mt-1'>
            Administra tu cartera de clientes de forma eficiente
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className='w-4 h-4 mr-2' />
            Filtros
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          {hasPermission('clientes.export') && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowExportData(true)}
            >
              <Download className='w-4 h-4 mr-2' />
              Exportar
            </Button>
          )}
          {hasPermission('clientes.import') && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowCargaMasiva(true)}
            >
              <Upload className='w-4 h-4 mr-2' />
              Carga Masiva
            </Button>
          )}
          {hasPermission('clientes.create') && (
            <Button onClick={handleNewCliente}>
              <Plus className='w-4 h-4 mr-2' />
              Nuevo Cliente
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-50 rounded-lg'>
              <Users className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Clientes</p>
              <p className='text-xl font-bold text-gray-900'>{clientes?.length || 0}</p>
            </div>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-50 rounded-lg'>
              <TrendingUp className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Activos</p>
              <p className='text-xl font-bold text-gray-900'>
                {clientes?.filter(c => c.estado === 'activo').length || 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-yellow-50 rounded-lg'>
              <AlertCircle className='w-5 h-5 text-yellow-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Prospectos</p>
              <p className='text-xl font-bold text-gray-900'>
                {clientes?.filter(c => c.estado === 'prospecto').length || 0}
              </p>
            </div>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-purple-50 rounded-lg'>
              <Filter className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Filtrados</p>
              <p className='text-xl font-bold text-gray-900'>{filteredClientes.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      {showFilters && (
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Tabla de clientes */}
      <Card>
        <DataTable
          data={filteredClientes}
          columns={columns}
          loading={loading}
          searchConfig={{
            searchable: true,
            searchPlaceholder: 'Buscar clientes...',
            searchFields: ['nombre_empresa', 'rut', 'nombre_contacto', 'email', 'telefono']
          }}
          paginationConfig={{
            enabled: true,
            pageSize: 15,
            showPageInfo: true,
            showPageSizeSelector: true
          }}
          onRowClick={(cliente) => handleViewCliente(cliente)}
          onExport={() => setShowExportData(true)}
        />
      </Card>

      {/* Modales */}
      {showClienteForm && (
        <ClienteForm
          isOpen={showClienteForm}
          onClose={() => {
            setShowClienteForm(false);
            setSelectedCliente(null);
          }}
          cliente={selectedCliente}
          onSave={handleSaveCliente}
        />
      )}

      {showCargaMasiva && (
        <CargaMasiva
          isOpen={showCargaMasiva}
          onClose={() => setShowCargaMasiva(false)}
          onUploadComplete={(results) => {
            console.log('Carga masiva completada:', results);
            handleRefresh();
          }}
        />
      )}

      {showExportData && (
        <ExportData
          isOpen={showExportData}
          onClose={() => setShowExportData(false)}
          data={filteredClientes}
          filename='clientes-export'
        />
      )}

      {/* Diálogo de confirmación de eliminación */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <div className='py-4'>
              <p className='text-gray-600'>
                ¿Estás seguro de que deseas eliminar el cliente{' '}
                <strong>{clienteToDelete?.nombre_empresa}</strong>?
              </p>
              <p className='text-sm text-red-600 mt-2'>
                Esta acción no se puede deshacer.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                variant='destructive'
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientsList;