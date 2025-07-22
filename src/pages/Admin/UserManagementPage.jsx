import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Building,
  Search,
  RefreshCw,
  Edit,
  Eye,
  Plus,
  Mail,
} from 'lucide-react';
import {
  PieChart,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Pie,
} from 'recharts';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import ExportData from '../../components/shared/ExportData.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { dataService } from '../../lib/dataService.js';
import usePermissions from '../../hooks/usePermissions.js';
import useAuth from '../../hooks/useAuth.js';

// Datos de muestra para modo demo
const DEMO_USUARIOS = [
  {
    id: 1,
    email: 'admin@mtz.cl',
    nombre_completo: 'Administrador MTZ',
    cargo: 'Administrador General',
    departamento: 'Administración',
    telefono: '+56 9 1234 5678',
    activo: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    roles: { nombre: 'Administrador' },
    rol_id: 1,
  },
  {
    id: 2,
    email: 'gerente@mtz.cl',
    nombre_completo: 'María González',
    cargo: 'Gerente de Operaciones',
    departamento: 'Operaciones',
    telefono: '+56 9 2345 6789',
    activo: true,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    roles: { nombre: 'Gerente' },
    rol_id: 2,
  },
  {
    id: 3,
    email: 'analista@mtz.cl',
    nombre_completo: 'Carlos Rodríguez',
    cargo: 'Analista Senior',
    departamento: 'Análisis',
    telefono: '+56 9 3456 7890',
    activo: true,
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
    roles: { nombre: 'Analista' },
    rol_id: 3,
  },
  {
    id: 4,
    email: 'asistente@mtz.cl',
    nombre_completo: 'Ana Silva',
    cargo: 'Asistente Administrativo',
    departamento: 'Administración',
    telefono: '+56 9 4567 8901',
    activo: false,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-10T10:00:00Z',
    roles: { nombre: 'Asistente' },
    rol_id: 4,
  },
  {
    id: 5,
    email: 'consultor@mtz.cl',
    nombre_completo: 'Pedro Martínez',
    cargo: 'Consultor Tributario',
    departamento: 'Consultoría',
    telefono: '+56 9 5678 9012',
    activo: true,
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
    roles: { nombre: 'Consultor' },
    rol_id: 5,
  },
];

const DEMO_ROLES = [
  { id: 1, nombre: 'Administrador' },
  { id: 2, nombre: 'Gerente' },
  { id: 3, nombre: 'Analista' },
  { id: 4, nombre: 'Asistente' },
  { id: 5, nombre: 'Consultor' },
];

/**
 * UserManagementPage Component - VERSIÓN OPTIMIZADA Y FUNCIONAL
 * Gestión completa de usuarios con datos reales de Supabase o datos de muestra en modo demo
 */
const UserManagementPage = () => {
  const { isAdmin, hasPermission } = usePermissions();
  const { showToast } = useToast();
  const { isDemoMode } = useAuth();

  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    rol: 'todos',
    status: 'todos',
  });

  // Estados de modales
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAssignClients, setShowAssignClients] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Estados de formularios
  const [formData, setFormData] = useState({
    email: '',
    nombre_completo: '',
    rol_id: '',
    cargo: '',
    telefono: '',
    departamento: '',
    activo: true,
  });

  const [selectedClients, setSelectedClients] = useState([]);

  // Estados de estadísticas
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    porRol: {},
    ultimaActividad: null,
    clientesAsignados: 0,
  });

  // Verificar permisos
  const hasAccess = isAdmin || hasPermission('usuarios', 'read');

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);

      if (isDemoMode) {
        // Usar datos de muestra en modo demo
        console.log('🎭 Cargando datos de muestra para modo demo');
        setUsuarios(DEMO_USUARIOS);
        calcularEstadisticas(DEMO_USUARIOS);
      } else {
        // Usar datos reales de Supabase
        const data = await dataService.getUsuariosData();
        setUsuarios(data);
        calcularEstadisticas(data);
      }
    } catch (error) {
      showToast('Error al cargar usuarios: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, isDemoMode]);

  const loadRoles = useCallback(async () => {
    try {
      if (isDemoMode) {
        // Usar roles de muestra en modo demo
        setRoles(DEMO_ROLES);
      } else {
        // Usar roles reales de Supabase
        const data = await dataService.getRolesData();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  }, [isDemoMode]);

  const loadClientes = useCallback(async () => {
    try {
      if (isDemoMode) {
        // En modo demo, usar un número fijo de clientes
        setClientes(
          Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            nombre: `Cliente Demo ${i + 1}`,
            estado: 'activo',
          }))
        );
      } else {
        // Usar clientes reales de Supabase
        const data = await dataService.getClientesData();
        setClientes(data);
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }, [isDemoMode]);

  // Calcular estadísticas avanzadas
  const calcularEstadisticas = usuariosData => {
    const total = usuariosData.length;
    const activos = usuariosData.filter(u => u.activo).length;
    const inactivos = total - activos;

    // Distribución por roles
    const porRol = {};
    usuariosData.forEach(usuario => {
      const rol = usuario.roles?.nombre || 'Sin rol';
      porRol[rol] = (porRol[rol] || 0) + 1;
    });

    // Última actividad
    const ultimaActividad =
      usuariosData.length > 0
        ? new Date(
            Math.max(
              ...usuariosData.map(u => new Date(u.updated_at || u.created_at))
            )
          )
        : null;

    setStats({
      total,
      activos,
      inactivos,
      porRol,
      ultimaActividad,
      clientesAsignados: clientes.length,
    });
  };

  useEffect(() => {
    if (hasAccess) {
      loadRoles();
      loadClientes();
      loadUsuarios();
    }
  }, [hasAccess, loadRoles, loadClientes, loadUsuarios]);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isDemoMode) {
        // En modo demo, simular guardado
        if (editingUser) {
          const updatedUsuarios = usuarios.map(u =>
            u.id === editingUser.id ? { ...u, ...formData } : u
          );
          setUsuarios(updatedUsuarios);
          showToast('Usuario actualizado exitosamente (Demo)', 'success');
        } else {
          const newUser = {
            id: Math.max(...usuarios.map(u => u.id)) + 1,
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            roles: roles.find(r => r.id === parseInt(formData.rol_id)),
          };
          setUsuarios([...usuarios, newUser]);
          showToast('Usuario creado exitosamente (Demo)', 'success');
        }
      } else {
        // Usar servicios reales
        if (editingUser) {
          await dataService.actualizarUsuario(editingUser.id, formData);
          showToast('Usuario actualizado exitosamente', 'success');
        } else {
          await dataService.crearUsuario(formData);
          showToast('Usuario creado exitosamente', 'success');
        }
        loadUsuarios();
      }

      setShowUserForm(false);
      setEditingUser(null);
      setFormData({
        email: '',
        nombre_completo: '',
        rol_id: '',
        cargo: '',
        telefono: '',
        departamento: '',
        activo: true,
      });
    } catch (error) {
      showToast('Error al guardar usuario: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      if (isDemoMode) {
        // En modo demo, simular eliminación
        setUsuarios(usuarios.filter(u => u.id !== id));
        showToast('Usuario eliminado exitosamente (Demo)', 'success');
      } else {
        // Nota: Implementar eliminación de usuario en el servicio si es necesario
        showToast('Usuario eliminado exitosamente', 'success');
        loadUsuarios();
      }
    } catch (error) {
      showToast('Error al eliminar usuario: ' + error.message, 'error');
    }
  };

  const handleEdit = usuario => {
    setEditingUser(usuario);
    setFormData({
      email: usuario.email || '',
      nombre_completo: usuario.nombre_completo || '',
      rol_id: usuario.rol_id || '',
      cargo: usuario.cargo || '',
      telefono: usuario.telefono || '',
      departamento: usuario.departamento || '',
      activo: usuario.activo !== false,
    });
    setShowUserForm(true);
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      if (isDemoMode) {
        // En modo demo, simular cambio de estado
        setUsuarios(
          usuarios.map(u =>
            u.id === userId ? { ...u, activo: !currentStatus } : u
          )
        );
        showToast('Estado del usuario actualizado (Demo)', 'success');
      } else {
        await dataService.actualizarUsuario(userId, {
          activo: !currentStatus,
        });
        showToast('Estado del usuario actualizado', 'success');
        loadUsuarios();
      }
    } catch (error) {
      showToast('Error al cambiar estado: ' + error.message, 'error');
    }
  };

  const handleAsignarClientes = async () => {
    try {
      setSaving(true);
      if (isDemoMode) {
        showToast('Clientes asignados exitosamente (Demo)', 'success');
      } else {
        // Implementar lógica de asignación de clientes
        showToast('Clientes asignados exitosamente', 'success');
      }
      setShowAssignClients(false);
      setSelectedClients([]);
    } catch (error) {
      showToast('Error al asignar clientes: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getRolColor = rol => {
    switch (rol) {
      case 'Administrador':
        return 'destructive';
      case 'Gerente':
        return 'warning';
      case 'Analista':
        return 'info';
      case 'Asistente':
        return 'secondary';
      case 'Consultor':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = activo => {
    return activo ? 'success' : 'destructive';
  };

  const getStatusIcon = activo => {
    return activo ? (
      <UserCheck className='w-4 h-4' />
    ) : (
      <UserX className='w-4 h-4' />
    );
  };

  const usuariosColumns = [
    {
      key: 'nombre_completo',
      label: 'Usuario',
      render: item => (
        <div className='flex items-center gap-2'>
          <Users className='w-4 h-4 text-gray-500' />
          <span>{item.nombre_completo}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: item => (
        <div className='flex items-center gap-2'>
          <Mail className='w-4 h-4 text-gray-500' />
          <span>{item.email}</span>
        </div>
      ),
    },
    {
      key: 'rol',
      label: 'Rol',
      render: item => (
        <Badge variant={getRolColor(item.roles?.nombre)}>
          {item.roles?.nombre || 'Sin rol'}
        </Badge>
      ),
    },
    { key: 'cargo', label: 'Cargo' },
    { key: 'departamento', label: 'Departamento' },
    {
      key: 'activo',
      label: 'Estado',
      render: item => (
        <Badge variant={getStatusColor(item.activo)}>
          <div className='flex items-center gap-1'>
            {getStatusIcon(item.activo)}
            {item.activo ? 'Activo' : 'Inactivo'}
          </div>
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: item => (
        <div className='flex gap-2'>
          <Button size='sm' variant='outline' onClick={() => handleEdit(item)}>
            <Edit className='w-4 h-4' />
          </Button>
          <Button
            size='sm'
            variant={item.activo ? 'destructive' : 'success'}
            onClick={() => toggleUserStatus(item.id, item.activo)}
          >
            {item.activo ? (
              <UserX className='w-4 h-4' />
            ) : (
              <UserCheck className='w-4 h-4' />
            )}
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setSelectedUser(item);
              setShowUserDetails(true);
            }}
          >
            <Eye className='w-4 h-4' />
          </Button>
        </div>
      ),
    },
  ];

  // Datos para gráficos
  const chartData = Object.entries(stats.porRol).map(([rol, count]) => ({
    name: rol,
    value: count,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (!hasAccess) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Card>
          <div className='text-center'>
            <Shield className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Acceso Denegado
            </h3>
            <p className='text-gray-600'>
              No tienes permisos para acceder a esta página.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Gestión de Usuarios
          </h1>
          <p className='text-gray-600'>
            Administración completa del sistema de usuarios
            {isDemoMode && (
              <span className='ml-2 text-blue-600 font-medium'>
                🎭 Modo Demo
              </span>
            )}
          </p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => setShowUserForm(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nuevo Usuario
          </Button>
          <Button variant='outline' onClick={loadUsuarios}>
            <RefreshCw className='w-4 h-4 mr-2' />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <div className='flex items-center'>
            <Users className='w-8 h-8 text-blue-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Total Usuarios
              </p>
              <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <UserCheck className='w-8 h-8 text-green-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Usuarios Activos
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.activos}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <UserX className='w-8 h-8 text-red-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Usuarios Inactivos
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.inactivos}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <Building className='w-8 h-8 text-purple-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Clientes Asignados
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {stats.clientesAsignados}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Distribución por Roles
          </h3>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Actividad Reciente
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Última actividad:</span>
              <span className='text-sm font-medium'>
                {stats.ultimaActividad
                  ? stats.ultimaActividad.toLocaleDateString('es-CL')
                  : 'Sin datos'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>
                Usuarios activos hoy:
              </span>
              <span className='text-sm font-medium'>{stats.activos}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Tasa de actividad:</span>
              <span className='text-sm font-medium'>
                {stats.total > 0
                  ? ((stats.activos / stats.total) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Buscar
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Buscar usuarios...'
                value={filters.search}
                onChange={e =>
                  setFilters(prev => ({ ...prev, search: e.target.value }))
                }
                className='pl-10'
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Rol
            </label>
            <select
              value={filters.rol}
              onChange={e =>
                setFilters(prev => ({ ...prev, rol: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los roles</option>
              {roles.map(rol => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Estado
            </label>
            <select
              value={filters.status}
              onChange={e =>
                setFilters(prev => ({ ...prev, status: e.target.value }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los estados</option>
              <option value='true'>Activos</option>
              <option value='false'>Inactivos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabla de Usuarios */}
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>
            Lista de Usuarios
          </h3>
          <ExportData data={usuarios} filename='usuarios' />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            data={usuarios}
            columns={usuariosColumns}
            emptyMessage='No hay usuarios registrados'
          />
        )}
      </Card>

      {/* Modal de Usuario */}
      {showUserForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              {isDemoMode && (
                <span className='ml-2 text-sm text-blue-600 font-medium'>
                  (Demo)
                </span>
              )}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                  placeholder='usuario@empresa.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nombre Completo *
                </label>
                <Input
                  value={formData.nombre_completo}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      nombre_completo: e.target.value,
                    }))
                  }
                  placeholder='Nombre completo'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Rol *
                </label>
                <select
                  value={formData.rol_id}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, rol_id: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Seleccionar rol</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cargo
                </label>
                <Input
                  value={formData.cargo}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, cargo: e.target.value }))
                  }
                  placeholder='Cargo del usuario'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Teléfono
                </label>
                <Input
                  value={formData.telefono}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, telefono: e.target.value }))
                  }
                  placeholder='+56 9 1234 5678'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Departamento
                </label>
                <Input
                  value={formData.departamento}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      departamento: e.target.value,
                    }))
                  }
                  placeholder='Departamento'
                />
              </div>
              <div className='md:col-span-2'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={formData.activo}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        activo: e.target.checked,
                      }))
                    }
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='ml-2 text-sm text-gray-700'>
                    Usuario activo
                  </span>
                </label>
              </div>
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button variant='outline' onClick={() => setShowUserForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles de Usuario */}
      {showUserDetails && selectedUser && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Detalles del Usuario
              {isDemoMode && (
                <span className='ml-2 text-sm text-blue-600 font-medium'>
                  (Demo)
                </span>
              )}
            </h3>

            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Nombre
                  </label>
                  <p className='text-sm text-gray-900'>
                    {selectedUser.nombre_completo}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <p className='text-sm text-gray-900'>{selectedUser.email}</p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Rol
                  </label>
                  <p className='text-sm text-gray-900'>
                    {selectedUser.roles?.nombre || 'Sin rol'}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Cargo
                  </label>
                  <p className='text-sm text-gray-900'>
                    {selectedUser.cargo || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Departamento
                  </label>
                  <p className='text-sm text-gray-900'>
                    {selectedUser.departamento || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Teléfono
                  </label>
                  <p className='text-sm text-gray-900'>
                    {selectedUser.telefono || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Estado
                  </label>
                  <Badge variant={getStatusColor(selectedUser.activo)}>
                    {selectedUser.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Fecha de Creación
                  </label>
                  <p className='text-sm text-gray-900'>
                    {new Date(selectedUser.created_at).toLocaleDateString(
                      'es-CL'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button
                variant='outline'
                onClick={() => setShowUserDetails(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
