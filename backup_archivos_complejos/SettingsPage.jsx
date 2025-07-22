import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Settings,
  User,
  Shield,
  Database,
  Filter,
  Plus,
  RefreshCw,
  Edit,
  Bell,
  Lock,
  Globe,
  Palette,
  Mail,
  Key,
  FileText,
  Activity,
  Server,
  Calendar,
  PieChart,
  LineChart,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Hash,
  ToggleLeft,
  Code,
  UsersIcon,
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
} from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import TableComponent from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import ConfiguracionForm from '@/components/settings/ConfiguracionForm';
import { formatCurrency, formatDate, formatNumber } from '@/utils/helpers';

/**
 * Página de Configuraciones Avanzadas MTZ - VERSIÓN MEJORADA
 * Gestión completa de configuraciones del sistema, usuarios y seguridad
 */
const SettingsPage = () => {
  // Estados locales para la UI
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('configuraciones');
  const [showSystemInfo, setShowSystemInfo] = useState(false);

  // Manejar actualización de configuración
  const handleActualizarConfiguracion = async configData => {
    try {
      // En un entorno real, aquí se llamaría a una API para actualizar
      // await actualizarConfiguracion(editingConfig.id, configData);
      console.log('Simulando actualización de configuración:', configData);
      setShowModal(false);
      setEditingConfig(null);
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  };

  // Manejar restauración de configuración
  const handleRestaurarConfiguracion = async configId => {
    try {
      // En un entorno real, aquí se llamaría a una API para restaurar
      console.log('Simulando restauración de configuración con ID:', configId);
    } catch (error) {
      console.error('Error restaurando configuración:', error);
    }
  };

  // Manejar generación de backup
  const handleGenerarBackup = async () => {
    try {
      // En un entorno real, aquí se llamaría a una API para generar backup
      console.log('Simulando generación de backup...');
    } catch (error) {
      console.error('Error generando backup:', error);
    }
  };

  // Obtener icono según categoría
  const getCategoryIcon = categoria => {
    const icons = {
      Sistema: <Settings className='h-4 w-4' />,
      Seguridad: <Shield className='h-4 w-4' />,
      Notificaciones: <Bell className='h-4 w-4' />,
      Apariencia: <Palette className='h-4 w-4' />,
      Integración: <Globe className='h-4 w-4' />,
      Backup: <Database className='h-4 w-4' />,
      Email: <Mail className='h-4 w-4' />,
      API: <Key className='h-4 w-4' />,
    };
    return icons[categoria] || <Settings className='h-4 w-4' />;
  };

  // Obtener icono según tipo
  const getTypeIcon = tipo => {
    const icons = {
      Texto: <FileText className='h-4 w-4' />,
      Número: <Hash className='h-4 w-4' />,
      Booleano: <ToggleLeft className='h-4 w-4' />,
      JSON: <Code className='h-4 w-4' />,
      Fecha: <Calendar className='h-4 w-4' />,
      Select: <FileText className='h-4 w-4' />,
      Password: <Lock className='h-4 w-4' />,
      URL: <Globe className='h-4 w-4' />,
    };
    return icons[tipo] || <FileText className='h-4 w-4' />;
  };

  // Columnas para la tabla de configuraciones
  const configColumns = [
    {
      key: 'nombre',
      label: 'Configuración',
      render: (value, config) => (
        <div className='flex items-center gap-2'>
          {getCategoryIcon(config.categoria)}
          <div>
            <p className='font-medium'>{value}</p>
            <p className='text-sm text-gray-500'>{config.descripcion}</p>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'categoria',
      label: 'Categoría',
      render: value => (
        <Badge variant='outline' className='text-xs'>
          {value}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value, config) => (
        <div className='flex items-center gap-1'>
          {getTypeIcon(value)}
          <span className='text-sm'>{value}</span>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'valor',
      label: 'Valor',
      render: (value, config) => {
        if (config.tipo === 'Password') {
          return <span className='text-gray-500'>••••••••</span>;
        }
        if (config.tipo === 'Booleano') {
          return (
            <Badge variant={value ? 'success' : 'secondary'}>
              {value ? 'Sí' : 'No'}
            </Badge>
          );
        }
        if (config.tipo === 'JSON') {
          return (
            <span className='text-xs font-mono bg-gray-100 px-2 py-1 rounded'>
              {JSON.stringify(JSON.parse(value || '{}')).substring(0, 30)}...
            </span>
          );
        }
        return (
          <span className='text-sm'>{String(value).substring(0, 50)}</span>
        );
      },
      sortable: true,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: value => (
        <Badge
          variant={
            value === 'Activo'
              ? 'success'
              : value === 'Inactivo'
                ? 'secondary'
                : value === 'En Mantenimiento'
                  ? 'warning'
                  : 'destructive'
          }
        >
          {value}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, config) => (
        <div className='flex gap-2'>
          {/* En un entorno real, canUpdate y config.editable se obtendrían de un hook */}
          {/* <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setEditingConfig(config);
              setShowModal(true);
            }}
          >
            <Edit className='h-4 w-4' />
          </Button> */}
          {/* En un entorno real, config.valor !== config.valor_por_defecto se obtendría de un hook */}
          {/* <Button
            size='sm'
            variant='outline'
            onClick={() => handleRestaurarConfiguracion(config.id)}
          >
            <RotateCcw className='h-4 w-4' />
          </Button> */}
        </div>
      ),
    },
  ];

  // NOTA IMPORTANTE:
  // Actualmente esta página usa datos simulados para configuraciones, usuarios y estadísticas.
  // Para producción, reemplaza los arrays y objetos simulados por consultas reales a Supabase.
  // Si tienes dudas, consulta a un programador o revisa la documentación interna.
  // En un entorno real, loading, error, configuraciones, usuarios, estadisticas, systemHealth, canView, canUpdate, canManageUsers, canManageSystem, categoriasConfig, tiposConfig, estadosConfig, configuracionesFiltradas, searchTerm, filterCategoria, setSearchTerm, setFilterCategoria, setSelectedConfig, clearError se obtendrían de un hook
  const loading = false;
  const error = null;
  const configuraciones = [
    {
      id: 1,
      nombre: 'Tema Oscuro',
      categoria: 'Apariencia',
      tipo: 'Booleano',
      valor: 'false',
      valor_por_defecto: 'false',
      descripcion: 'Activar tema oscuro',
    },
    {
      id: 2,
      nombre: 'Límite de Usuarios',
      categoria: 'Seguridad',
      tipo: 'Número',
      valor: '100',
      valor_por_defecto: '100',
      descripcion: 'Número máximo de usuarios permitidos',
    },
    {
      id: 3,
      nombre: 'Tiempo de Inactividad',
      categoria: 'Seguridad',
      tipo: 'Número',
      valor: '30',
      valor_por_defecto: '30',
      descripcion: 'Tiempo en minutos para considerar un usuario inactivo',
    },
  ];
  const usuarios = [
    {
      id: 1,
      nombre: 'Usuario 1',
      email: 'usuario1@example.com',
      estado: 'activo',
      rol: 'Administrador',
    },
    {
      id: 2,
      nombre: 'Usuario 2',
      email: 'usuario2@example.com',
      estado: 'inactivo',
      rol: 'Usuario',
    },
    {
      id: 3,
      nombre: 'Usuario 3',
      email: 'usuario3@example.com',
      estado: 'activo',
      rol: 'Editor',
    },
  ];
  const estadisticas = {
    configuraciones: { total: 100, activas: 80 },
    usuarios: { total: 50, activos: 45 },
    sistema: { version: '3.0.0', tiempoActivo: '15 días' },
  };
  const systemHealth = {
    estado: 'saludable',
    metricas: {
      cpu: '80%',
      memoria: '70%',
      disco: '90%',
      red: '95%',
      base_datos: 'conectada',
    },
  };
  const canView = true;
  const canUpdate = true;
  const canManageUsers = true;
  const canManageSystem = true;
  const categoriasConfig = [
    'Sistema',
    'Seguridad',
    'Notificaciones',
    'Apariencia',
    'Integración',
    'Backup',
    'Email',
    'API',
  ];
  const tiposConfig = [
    'Texto',
    'Número',
    'Booleano',
    'JSON',
    'Fecha',
    'Select',
    'Password',
    'URL',
  ];
  const estadosConfig = ['Activo', 'Inactivo', 'En Mantenimiento'];
  const configuracionesFiltradas = configuraciones;
  const searchTerm = '';
  const filterCategoria = 'todos';
  const setSearchTerm = () => {};
  const setFilterCategoria = () => {};
  const setSelectedConfig = () => {};
  const clearError = () => {};

  if (loading && configuraciones.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg'>Cargando configuraciones...</span>
      </div>
    );
  }

  if (error && configuraciones.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar configuraciones
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button
            onClick={() => {
              // En un entorno real, cargarConfiguraciones se obtendría de un hook
              console.log('Simulando carga de configuraciones...');
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
        <title>Configuraciones del Sistema - MTZ Ouroborus AI v3.0</title>
        <meta
          name='description'
          content='Gestión completa de configuraciones del sistema, usuarios y seguridad'
        />
        <meta
          name='keywords'
          content='configuraciones, sistema, seguridad, usuarios, MTZ'
        />
      </Helmet>

      <div className='space-y-6'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
              <Settings className='h-8 w-8 text-blue-600' />
              Configuraciones del Sistema
              <Badge variant='outline' className='ml-2'>
                v3.0 Avanzado
              </Badge>
            </h1>
            <p className='text-gray-600 mt-1'>
              Gestión completa de configuraciones, usuarios y seguridad del
              sistema
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={() => {
                // En un entorno real, cargarConfiguraciones se obtendría de un hook
                console.log('Simulando carga de configuraciones...');
              }}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
            {canManageSystem && (
              <Button variant='outline' onClick={handleGenerarBackup}>
                <Database className='h-4 w-4 mr-2' />
                Generar Backup
              </Button>
            )}
            {canUpdate && (
              <Button onClick={() => setShowModal(true)}>
                <Plus className='h-4 w-4 mr-2' />
                Nueva Configuración
              </Button>
            )}
          </div>
        </div>

        {/* KPIs del Sistema */}
        {estadisticas && Object.keys(estadisticas).length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Configuraciones
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(estadisticas.configuraciones?.total || 0)}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {estadisticas.configuraciones?.activas || 0} activas
                  </p>
                </div>
                <div className='p-3 bg-blue-100 rounded-full'>
                  <Settings className='h-6 w-6 text-blue-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Usuarios</p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {formatNumber(estadisticas.usuarios?.total || 0)}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {estadisticas.usuarios?.activos || 0} activos
                  </p>
                </div>
                <div className='p-3 bg-green-100 rounded-full'>
                  <UsersIcon className='h-6 w-6 text-green-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Versión Sistema
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {estadisticas.sistema?.version || '3.0.0'}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {estadisticas.sistema?.tiempoActivo || '15 días'}
                  </p>
                </div>
                <div className='p-3 bg-purple-100 rounded-full'>
                  <Server className='h-6 w-6 text-purple-600' />
                </div>
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>
                    Salud del Sistema
                  </p>
                  <p className='text-2xl font-bold text-gray-900'>
                    {systemHealth?.estado === 'saludable'
                      ? 'Saludable'
                      : 'Atención'}
                  </p>
                  <p className='text-sm text-gray-500'>
                    CPU: {systemHealth?.metricas?.cpu || 'N/A'}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    systemHealth?.estado === 'saludable'
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <Activity
                    className={`h-6 w-6 ${
                      systemHealth?.estado === 'saludable'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs de Navegación */}
        <Card className='p-4'>
          <div className='flex space-x-1'>
            <button
              onClick={() => setActiveTab('configuraciones')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'configuraciones'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className='h-4 w-4 inline mr-2' />
              Configuraciones
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'usuarios'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UsersIcon className='h-4 w-4 inline mr-2' />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('sistema')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sistema'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Server className='h-4 w-4 inline mr-2' />
              Sistema
            </button>
          </div>
        </Card>

        {/* Contenido de Configuraciones */}
        {activeTab === 'configuraciones' && (
          <Card className='p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold'>
                Configuraciones ({formatNumber(configuracionesFiltradas.length)}
                )
              </h2>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className='h-4 w-4 mr-2' />
                  Filtros
                  {showFilters ? (
                    <ChevronUp className='h-4 w-4 ml-2' />
                  ) : (
                    <ChevronDown className='h-4 w-4 ml-2' />
                  )}
                </Button>
              </div>
            </div>

            {/* Filtros */}
            {showFilters && (
              <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Input
                    label='Buscar'
                    placeholder='Buscar configuraciones...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                  <Select
                    label='Categoría'
                    value={filterCategoria}
                    onChange={e => setFilterCategoria(e.target.value)}
                  >
                    <option value='todos'>Todas las categorías</option>
                    {categoriasConfig.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            )}

            {/* Tabla de Configuraciones */}
            <TableComponent
              data={configuracionesFiltradas}
              columns={configColumns}
              loading={loading}
            />
          </Card>
        )}

        {/* Contenido de Usuarios */}
        {activeTab === 'usuarios' && (
          <Card className='p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold'>
                Usuarios del Sistema ({formatNumber(usuarios.length)})
              </h2>
            </div>

            {usuarios.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                No hay usuarios para mostrar
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {usuarios.map(usuario => (
                  <Card key={usuario.id} className='p-4'>
                    <div className='flex items-center gap-3 mb-3'>
                      <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                        <User className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <h3 className='font-semibold'>{usuario.nombre}</h3>
                        <p className='text-sm text-gray-500'>{usuario.email}</p>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <Badge
                        variant={
                          usuario.estado === 'activo' ? 'success' : 'secondary'
                        }
                      >
                        {usuario.estado}
                      </Badge>
                      <span className='text-sm text-gray-500'>
                        {usuario.rol}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Contenido de Sistema */}
        {activeTab === 'sistema' && (
          <div className='space-y-6'>
            {/* Estado del Sistema */}
            {systemHealth && (
              <Card className='p-6'>
                <h2 className='text-xl font-semibold mb-4'>
                  Estado del Sistema
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {systemHealth.metricas?.cpu || 'N/A'}
                    </div>
                    <div className='text-sm text-gray-500'>CPU</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {systemHealth.metricas?.memoria || 'N/A'}
                    </div>
                    <div className='text-sm text-gray-500'>Memoria</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {systemHealth.metricas?.disco || 'N/A'}
                    </div>
                    <div className='text-sm text-gray-500'>Disco</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {systemHealth.metricas?.red || 'N/A'}
                    </div>
                    <div className='text-sm text-gray-500'>Red</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-indigo-600'>
                      {systemHealth.metricas?.base_datos === 'conectada'
                        ? 'OK'
                        : 'Error'}
                    </div>
                    <div className='text-sm text-gray-500'>Base de Datos</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Estado de Backup */}
            {/* En un entorno real, backupStatus se obtendría de un hook */}
            {/* <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Estado de Backup</h2>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Último Backup</p>
                  <p className='text-sm text-gray-500'>
                    {formatDate(backupStatus.fecha)}
                  </p>
                  <p className='text-sm text-gray-500'>
                    Archivo: {backupStatus.archivo} ({backupStatus.tamaño})
                  </p>
                </div>
                <Badge
                  variant={
                    backupStatus.estado === 'completado'
                      ? 'success'
                      : 'warning'
                  }
                >
                  {backupStatus.estado}
                </Badge>
              </div>
            </Card> */}
          </div>
        )}

        {/* Modal de Configuración */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingConfig(null);
            }}
            title={
              editingConfig ? 'Editar Configuración' : 'Nueva Configuración'
            }
            size='xl'
          >
            <ConfiguracionForm
              configuracion={editingConfig}
              onSubmit={
                editingConfig ? handleActualizarConfiguracion : () => {}
              }
              onCancel={() => {
                setShowModal(false);
                setEditingConfig(null);
              }}
              onRestore={handleRestaurarConfiguracion}
              loading={loading}
              categorias={categoriasConfig}
              tipos={tiposConfig}
              estados={estadosConfig}
            />
          </Modal>
        )}
      </div>
    </>
  );
};

export default SettingsPage;
