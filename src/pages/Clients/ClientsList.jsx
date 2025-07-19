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
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Input from '@/components/ui/Input.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog.jsx';
import DataTable from '@/components/shared/DataTable.jsx';
import SearchFilters from '@/components/clientes/SearchFilters.jsx';
import ClienteForm from '@/components/clientes/ClienteForm.jsx';
import CargaMasiva from '@/components/clientes/CargaMasiva.jsx';
import ExportData from '@/components/shared/ExportData.jsx';
import useAuth from '@/hooks/useAuth.js';
import useSupabaseAvanzado from '@/hooks/useSupabaseAvanzado.js';
import { formatCurrency, formatRUT } from '@/utils/helpers.js';
import { ESTADOS_CLIENTE, TIPOS_EMPRESA } from '@/utils/constants.js';
import { getClientes } from '@/lib/supabase.js';
import { supabase } from '@/lib/supabase.js';

/**
 * ClientsList Component - Versión Optimizada
 * Lista de clientes integrada con Supabase y búsqueda inteligente
 */
const ClientsList = () => {
  const { buscarClientesInteligente } = useSupabaseAvanzado();

  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCargaMasiva, setShowCargaMasiva] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  // const [selectedClientes, setSelectedClientes] = useState([]); // Removido - DataTable no soporta selección
  const [searchResults, setSearchResults] = useState(null);
  const [estadisticas, setEstadisticas] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cargar TODOS los clientes directamente desde Supabase
  const cargarDatosClientes = async () => {
    try {
      setLoadingClientes(true);
      console.log('🔄 Cargando todos los clientes...');

      // Obtener todos los clientes directamente
      const { data: todosLosClientes, error } = await supabase
        .from('clientes_contables')
        .select('*')
        .order('razon_social');

      if (error) throw error;

      if (todosLosClientes && todosLosClientes.length > 0) {
        console.log(`✅ ${todosLosClientes.length} clientes encontrados en BD`);

        // Procesar clientes de forma simple
        const clientesProcesados = todosLosClientes.map((cliente, index) => ({
          ...cliente,
          posicion: index + 1,
          tipo_empresa:
            cliente.total_facturado > 10000000
              ? 'SPA'
              : cliente.total_facturado > 5000000
                ? 'LTDA'
                : cliente.total_facturado > 1000000
                  ? 'SA'
                  : 'EIRL',
          rubro: cliente.razon_social.includes('INVERSIONES')
            ? 'Inversiones'
            : cliente.razon_social.includes('GPS')
              ? 'Tecnología GPS'
              : cliente.razon_social.includes('MINERO')
                ? 'Minería'
                : cliente.razon_social.includes('AGRICOLA')
                  ? 'Agricultura'
                  : cliente.razon_social.includes('CONSTRUCTORA')
                    ? 'Construcción'
                    : 'Servicios Generales',
          categoria:
            cliente.total_facturado > 10000000
              ? 'VIP'
              : cliente.total_facturado > 5000000
                ? 'Premium'
                : cliente.total_facturado > 1000000
                  ? 'Top'
                  : 'Estándar',
        }));

        setClientes(clientesProcesados);
        setFilteredClientes(clientesProcesados);

        console.log('🔍 DEBUG: Clientes procesados:', clientesProcesados);
        console.log(
          '🔍 DEBUG: filteredClientes después de set:',
          clientesProcesados.length
        );
        console.log(
          '🔍 DEBUG: Estado actual - clientes:',
          clientesProcesados.length,
          'filteredClientes:',
          clientesProcesados.length
        );

        // Calcular estadísticas
        const facturacionTotal = clientesProcesados.reduce(
          (sum, c) => sum + parseFloat(c.total_facturado || 0),
          0
        );

        setEstadisticas({
          total_clientes: clientesProcesados.length,
          facturacion_total: facturacionTotal,
          promedio:
            clientesProcesados.length > 0
              ? facturacionTotal / clientesProcesados.length
              : 0,
        });

        console.log('✅ Clientes procesados y cargados en tabla');
        setError(null);
        setInitialized(true);
      } else {
        console.log('⚠️ No se encontraron clientes en la base de datos');
        setClientes([]);
        setFilteredClientes([]);
        setEstadisticas({
          total_clientes: 0,
          facturacion_total: 0,
          promedio: 0,
        });
        setInitialized(true);
      }
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
      setError(error.message);
      setClientes([]);
      setFilteredClientes([]);
      setEstadisticas({ total_clientes: 0, facturacion_total: 0, promedio: 0 });
      setInitialized(true);
    } finally {
      setLoadingClientes(false);
    }
  };

  // Cargar datos cuando el componente se monte
  useEffect(() => {
    console.log('🚀 ClientsList montado - Iniciando carga automática');
    cargarDatosClientes();
  }, []);

  // Debug: Monitorear cambios en filteredClientes
  useEffect(() => {
    console.log('🔍 DEBUG: filteredClientes cambió:', filteredClientes.length);
    if (filteredClientes.length > 0) {
      console.log(
        '✅ Clientes disponibles para mostrar:',
        filteredClientes.length
      );
    }
  }, [filteredClientes]);

  // Forzar carga si no se ha inicializado después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialized && !loadingClientes) {
        console.log('⏰ Forzando carga después de timeout');
        cargarDatosClientes();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [initialized, loadingClientes]);

  // Función para actualizar datos (conectada al botón Actualizar)
  const handleActualizar = async () => {
    console.log('🔄 Botón Actualizar presionado');
    await cargarDatosClientes();
  };

  // Manejar búsqueda inteligente
  const handleBusquedaInteligente = async termino => {
    if (!termino.trim()) {
      setSearchResults(null);
      setFilteredClientes(clientes); // Volver a todos los clientes
      return;
    }

    try {
      setLoading(true);
      const resultados = await buscarClientesInteligente(termino);

      if (resultados?.resultados) {
        // Procesar resultados con datos adicionales
        const resultadosConDatos = resultados.resultados.map(cliente => ({
          ...cliente,
          posicion:
            clientes.findIndex(c => c.id_cliente === cliente.id_cliente) + 1 ||
            999,
          // Mantener estructura similar al resto
          numero_facturas:
            Math.floor(parseFloat(cliente.total_facturado || 0) / 100000) || 1,
          promedio_factura:
            parseFloat(cliente.total_facturado || 0) /
            (Math.floor(parseFloat(cliente.total_facturado || 0) / 100000) ||
              1),
        }));

        setSearchResults(resultados);
        setFilteredClientes(resultadosConDatos); // Actualizar directamente
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      handleBusquedaInteligente(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Aplicar filtros adicionales
  useEffect(() => {
    // No aplicar filtros si hay búsqueda activa (se manejan por separado)
    if (searchTerm || searchResults) {
      return;
    }

    // Solo aplicar filtros cuando hay clientes cargados
    if (clientes.length === 0) {
      return;
    }

    // Solo aplicar filtros cuando no hay búsqueda
    let filtered = [...clientes];

    // Aplicar filtros específicos
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(cliente => {
          if (key === 'estado') {
            return cliente.estado === filters[key];
          }
          if (key === 'tipo_empresa') {
            return cliente.tipo_empresa === filters[key];
          }
          if (key === 'rubro') {
            return cliente.rubro === filters[key];
          }
          if (key === 'categoria_cliente') {
            return cliente.categoria === filters[key];
          }
          return true;
        });
      }
    });

    console.log('🔍 Aplicando filtros:', {
      clientes: clientes.length,
      filtrados: filtered.length,
    });
    setFilteredClientes(filtered);
  }, [filters, clientes, searchTerm, searchResults]);

  // Manejar acciones de cliente
  const handleAction = (action, cliente) => {
    switch (action) {
      case 'edit':
        setEditingCliente(cliente);
        setShowForm(true);
        break;
      case 'delete':
        handleDelete(cliente);
        break;
      case 'view':
        handleView(cliente);
        break;
      default:
        break;
    }
  };

  // Eliminar cliente
  const handleDelete = cliente => {
    if (
      window.confirm(`¿Estás seguro de eliminar a ${cliente.razon_social}?`)
    ) {
      setClientes(prev =>
        prev.filter(c => c.id_cliente !== cliente.id_cliente)
      );
      setFilteredClientes(prev =>
        prev.filter(c => c.id_cliente !== cliente.id_cliente)
      );
    }
  };

  // Ver cliente
  const handleView = cliente => {
    console.log('Ver cliente:', cliente);
    // Implementar vista detallada
  };

  // Guardar cliente
  const handleSave = async clienteData => {
    try {
      setLoading(true);
      if (editingCliente) {
        // Actualizar cliente existente
        setClientes(prev =>
          prev.map(c =>
            c.id_cliente === editingCliente.id_cliente
              ? { ...c, ...clienteData }
              : c
          )
        );
        setFilteredClientes(prev =>
          prev.map(c =>
            c.id_cliente === editingCliente.id_cliente
              ? { ...c, ...clienteData }
              : c
          )
        );
      } else {
        // Crear nuevo cliente
        const newCliente = {
          id_cliente: 'NEW' + Date.now(),
          posicion: clientes.length + 1,
          ...clienteData,
          fecha_registro: new Date().toISOString().split('T')[0],
        };
        setClientes(prev => [...prev, newCliente]);
        setFilteredClientes(prev => [...prev, newCliente]);
      }

      setShowForm(false);
      setEditingCliente(null);
    } catch (error) {
      console.error('Error guardando cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejar carga masiva
  const handleCargaMasiva = async clienteData => {
    try {
      setLoading(true);
      const newCliente = {
        id_cliente: 'IMPORT' + Date.now(),
        posicion: clientes.length + 1,
        ...clienteData,
        fecha_registro: new Date().toISOString().split('T')[0],
      };
      setClientes(prev => [...prev, newCliente]);
      setFilteredClientes(prev => [...prev, newCliente]);
      return true;
    } catch (error) {
      console.error('Error al importar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar búsqueda y filtros
  const limpiarBusquedaYFiltros = () => {
    setSearchTerm('');
    setFilters({});
    setSearchResults(null);
    setFilteredClientes(clientes);
  };

  // Columnas para la tabla
  const columns = [
    {
      key: 'posicion',
      header: '#',
      cell: item => (
        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-sm font-bold text-blue-600'>
            #{item.posicion}
          </span>
        </div>
      ),
    },
    {
      key: 'id_cliente',
      header: 'Código',
      cell: item => (
        <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
          {item.id_cliente}
        </span>
      ),
    },
    {
      key: 'razon_social',
      header: 'Razón Social',
      cell: item => (
        <div>
          <div className='font-medium text-gray-900'>{item.razon_social}</div>
          <div className='text-sm text-gray-500'>
            {item.categoria && (
              <Badge
                variant={
                  item.categoria === 'VIP'
                    ? 'default'
                    : item.categoria === 'Premium'
                      ? 'secondary'
                      : item.categoria === 'Top'
                        ? 'success'
                        : 'outline'
                }
                size='sm'
                className='mr-2'
              >
                {item.categoria}
              </Badge>
            )}
            {item.rut && formatRUT(item.rut)}
          </div>
        </div>
      ),
    },
    {
      key: 'tipo_empresa',
      header: 'Tipo',
      cell: item => (
        <Badge variant='outline' size='sm'>
          {item.tipo_empresa}
        </Badge>
      ),
    },
    {
      key: 'rubro',
      header: 'Rubro',
      cell: item => <span className='text-sm text-gray-600'>{item.rubro}</span>,
    },
    {
      key: 'total_facturado',
      header: 'Total Facturado',
      cell: item => (
        <div className='text-right'>
          <div className='font-semibold text-gray-900'>
            {formatCurrency(item.total_facturado)}
          </div>
        </div>
      ),
    },
    {
      key: 'participacion_pct',
      header: 'Participación',
      cell: item => (
        <div className='text-center'>
          <span className='text-sm font-medium text-blue-600'>
            {item.participacion_pct ? `${item.participacion_pct}%` : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'prioridad',
      header: 'Prioridad',
      cell: item => (
        <Badge
          variant={
            item.prioridad === 'CRÍTICA'
              ? 'destructive'
              : item.prioridad === 'ALTA'
                ? 'warning'
                : item.prioridad === 'MEDIA'
                  ? 'secondary'
                  : 'outline'
          }
          size='sm'
        >
          {item.prioridad || 'BAJA'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      cell: item => (
        <div className='flex items-center gap-1'>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleAction('view', item)}
            title='Ver detalles'
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleAction('edit', item)}
            title='Editar'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => handleAction('delete', item)}
            title='Eliminar'
            className='text-red-600 hover:text-red-700'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ];

  // Columnas para exportación
  const exportColumns = [
    { key: 'posicion', label: 'Posición', format: 'number' },
    { key: 'id_cliente', label: 'Código Cliente', format: 'text' },
    { key: 'razon_social', label: 'Razón Social', format: 'text' },
    { key: 'categoria', label: 'Categoría', format: 'text' },
    { key: 'total_facturado', label: 'Total Facturado', format: 'currency' },
    { key: 'participacion_pct', label: 'Participación %', format: 'number' },
    { key: 'prioridad', label: 'Prioridad', format: 'text' },
    { key: 'tipo_empresa', label: 'Tipo Empresa', format: 'text' },
    { key: 'rubro', label: 'Rubro', format: 'text' },
    { key: 'estado', label: 'Estado', format: 'text' },
  ];

  if (error && clientes.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <AlertCircle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar clientes
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={cargarDatosClientes}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <Users className='h-8 w-8 text-blue-600' />
            Gestión de Clientes
          </h1>
          <p className='text-gray-600'>
            Lista inteligente con datos reales de Supabase
          </p>
          {searchResults && (
            <p className='text-sm text-blue-600 mt-1'>
              🔍 Búsqueda: &quot;{searchResults.termino_buscado}&quot; -{' '}
              {searchResults.total_encontrados} resultados
            </p>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button
            onClick={cargarDatosClientes}
            disabled={loading || loadingClientes}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading || loadingClientes ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
          <Button onClick={() => setShowCargaMasiva(true)}>
            <Upload className='h-4 w-4 mr-2' />
            Carga Masiva
          </Button>
          <Button variant='outline' onClick={() => setShowExportData(true)}>
            <Download className='h-4 w-4 mr-2' />
            Exportar
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Búsqueda inteligente */}
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          {/* Búsqueda */}
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Búsqueda inteligente: razón social, RUT, código, rubro...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
              {searchTerm && (
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                  {loading ? (
                    <RefreshCw className='h-4 w-4 text-blue-500 animate-spin' />
                  ) : (
                    <Badge variant='outline' size='sm'>
                      {filteredClientes.length}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Controles */}
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
            >
              <Filter className='h-4 w-4 mr-2' />
              Filtros
              {Object.keys(filters).filter(key => filters[key]).length > 0 && (
                <Badge variant='secondary' size='sm' className='ml-2'>
                  {Object.keys(filters).filter(key => filters[key]).length}
                </Badge>
              )}
            </Button>

            <Button variant='outline' onClick={limpiarBusquedaYFiltros}>
              <RefreshCw className='h-4 w-4 mr-2' />
              Limpiar
            </Button>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className='mt-4 pt-4 border-t'>
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              estados={ESTADOS_CLIENTE}
              tiposEmpresa={TIPOS_EMPRESA}
            />
          </div>
        )}
      </Card>

      {/* Estadísticas en tiempo real */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-blue-600'>
              {estadisticas?.total_clientes || clientes.length}
            </p>
            <p className='text-sm text-gray-600'>Total Clientes</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600'>
              {clientes.filter(c => c.estado === 'Activo').length}
            </p>
            <p className='text-sm text-gray-600'>Activos</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-yellow-600'>
              {formatCurrency(
                estadisticas?.facturacion_total ||
                  clientes.reduce(
                    (sum, c) => sum + parseFloat(c.total_facturado || 0),
                    0
                  )
              )}
            </p>
            <p className='text-sm text-gray-600'>Total Facturado</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-purple-600'>
              {formatCurrency(
                estadisticas?.promedio ||
                  (clientes.length > 0
                    ? clientes.reduce(
                        (sum, c) => sum + parseFloat(c.total_facturado || 0),
                        0
                      ) / clientes.length
                    : 0)
              )}
            </p>
            <p className='text-sm text-gray-600'>Promedio Cliente</p>
          </div>
        </Card>
      </div>

      {/* Tabla de clientes */}
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {searchResults
              ? `Resultados de búsqueda (${searchResults.total_encontrados})`
              : `Lista de clientes (${filteredClientes.length})`}
          </h3>
          {searchResults && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                setSearchTerm('');
                setSearchResults(null);
                setFilteredClientes(clientes);
              }}
            >
              Ver todos los clientes
            </Button>
          )}
        </div>

        {/* Tabla simple y funcional */}
        {loadingClientes ? (
          <div className='text-center py-8'>
            <RefreshCw className='h-8 w-8 mx-auto animate-spin text-blue-500' />
            <p className='mt-2 text-gray-600'>Cargando clientes...</p>
          </div>
        ) : filteredClientes.length === 0 ? (
          <div className='text-center py-8'>
            <Users className='h-12 w-12 mx-auto text-gray-400' />
            <p className='mt-2 text-gray-600'>No hay clientes para mostrar</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='border-b border-gray-200 bg-gray-50'>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                    #
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                    Código
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                    Razón Social
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                    RUT
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                    Tipo
                  </th>
                  <th className='px-4 py-3 text-left text-sm font-medium text-gray-700'>
                    Rubro
                  </th>
                  <th className='px-4 py-3 text-right text-sm font-medium text-gray-700'>
                    Total Facturado
                  </th>
                  <th className='px-4 py-3 text-center text-sm font-medium text-gray-700'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClientes.map((cliente, index) => (
                  <tr
                    key={cliente.id_cliente}
                    className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                        <span className='text-sm font-bold text-blue-600'>
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      <span className='font-mono text-sm bg-gray-100 px-2 py-1 rounded'>
                        {cliente.id_cliente}
                      </span>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      <div>
                        <div className='font-medium text-gray-900'>
                          {cliente.razon_social}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {cliente.categoria && (
                            <Badge variant='outline' size='sm' className='mr-2'>
                              {cliente.categoria}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      {cliente.rut && formatRUT(cliente.rut)}
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      <Badge variant='outline' size='sm'>
                        {cliente.tipo_empresa}
                      </Badge>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-600'>
                      {cliente.rubro}
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                      <div className='font-semibold text-gray-900'>
                        {formatCurrency(cliente.total_facturado)}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900'>
                      <div className='flex items-center gap-1'>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleAction('view', cliente)}
                          title='Ver detalles'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleAction('edit', cliente)}
                          title='Editar'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => handleAction('delete', cliente)}
                          title='Eliminar'
                          className='text-red-600 hover:text-red-700'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Componentes modales */}
      <ClienteForm
        open={showForm}
        onOpenChange={setShowForm}
        cliente={editingCliente}
        onSave={handleSave}
      />

      <CargaMasiva
        open={showCargaMasiva}
        onOpenChange={setShowCargaMasiva}
        onImport={handleCargaMasiva}
        loading={loading}
      />

      <ExportData
        open={showExportData}
        onOpenChange={setShowExportData}
        data={filteredClientes}
        columns={exportColumns}
        filename='clientes-mtz-inteligente'
      />
    </div>
  );
};

export default ClientsList;
