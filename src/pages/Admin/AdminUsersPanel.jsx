import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Search,
  AlertTriangle,
  Settings,
  Eye,
  Lock,
} from 'lucide-react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { supabase } from '@/lib/supabase.js';
import useAuth from '@/hooks/useAuth.js';

/**
 * AdminUsersPanel Component - Versión Simplificada
 * Panel administrativo para gestión básica de usuarios del sistema
 * Funciona con el sistema de roles actual sin requerir admin API
 */
const AdminUsersPanel = () => {
  const { user, userProfile, role, hasPermission } = useAuth();

  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Verificar si el usuario es administrador
  const isAdmin = role === 'admin' || hasPermission('usuarios', 'read');

  // Cargar usuarios del sistema (desde usuarios_sistema)
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: usuariosError } = await supabase
        .from('usuarios_sistema')
        .select(
          `
          *,
          roles:rol_id (
            nombre,
            descripcion,
            permisos
          )
        `
        )
        .order('fecha_creacion', { ascending: false });

      if (usuariosError) throw usuariosError;

      setUsuarios(data || []);
      console.log('✅ Usuarios del sistema cargados:', data?.length || 0);
    } catch (err) {
      setError(`Error cargando usuarios: ${err.message}`);
      console.error('❌ Error cargarUsuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios por búsqueda
  useEffect(() => {
    let filtered = usuarios;

    if (searchTerm.trim()) {
      filtered = usuarios.filter(
        usuario =>
          usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.nombre_completo
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          usuario.cargo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm]);

  // Formatear fecha
  const formatearFecha = fecha => {
    if (!fecha) return 'No registrada';
    return new Date(fecha).toLocaleString('es-CL');
  };

  // Obtener badge de estado
  const getBadgeEstado = estado => {
    switch (estado) {
      case 'activo':
        return <Badge variant='success'>Activo</Badge>;
      case 'inactivo':
        return <Badge variant='warning'>Inactivo</Badge>;
      case 'suspendido':
        return <Badge variant='destructive'>Suspendido</Badge>;
      default:
        return <Badge variant='outline'>Sin estado</Badge>;
    }
  };

  // Obtener badge de rol
  const getBadgeRol = rol => {
    const nombre = rol?.nombre || 'Sin rol';
    const variants = {
      administrador: 'destructive',
      colaborador: 'primary',
      externo: 'secondary',
      cliente: 'outline',
    };
    return <Badge variant={variants[nombre] || 'outline'}>{nombre}</Badge>;
  };

  // Obtener icono de rol
  const getIconoRol = rol => {
    const nombre = rol?.nombre || '';
    switch (nombre) {
      case 'administrador':
        return '👑';
      case 'colaborador':
        return '👨‍💼';
      case 'externo':
        return '🤝';
      case 'cliente':
        return '👤';
      default:
        return '❓';
    }
  };

  // Cargar usuarios al montar
  useEffect(() => {
    if (isAdmin) {
      cargarUsuarios();
    }
  }, [isAdmin]);

  // Verificar acceso de administrador
  if (!isAdmin) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <Card className='p-8 text-center max-w-md'>
          <Lock className='mx-auto h-12 w-12 text-red-600 mb-4' />
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Acceso Restringido
          </h2>
          <p className='text-gray-600 mb-4'>
            Solo los administradores pueden acceder al panel de usuarios.
          </p>
          <p className='text-sm text-gray-500'>
            Tu rol actual: <strong>{role || 'Sin definir'}</strong>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-3'>
            <Users className='h-8 w-8 text-blue-600' />
            Panel de Usuarios
          </h1>
          <p className='text-gray-600 mt-1'>
            Gestión y monitoreo de usuarios del sistema MTZ
          </p>
        </div>

        <div className='flex gap-3'>
          <Button onClick={cargarUsuarios} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </Button>
          <Button variant='outline'>
            <UserPlus className='h-4 w-4 mr-2' />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='p-6'>
          <div className='flex items-center'>
            <div className='p-3 bg-blue-100 rounded-full'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Total Usuarios
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {usuarios.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center'>
            <div className='p-3 bg-green-100 rounded-full'>
              <Shield className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Activos</p>
              <p className='text-2xl font-bold text-gray-900'>
                {usuarios.filter(u => u.estado === 'activo').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center'>
            <div className='p-3 bg-purple-100 rounded-full'>
              <Settings className='h-6 w-6 text-purple-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Administradores
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {
                  usuarios.filter(u => u.roles?.nombre === 'administrador')
                    .length
                }
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center'>
            <div className='p-3 bg-yellow-100 rounded-full'>
              <Eye className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Conectados Hoy
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {
                  usuarios.filter(u => {
                    const hoy = new Date().toDateString();
                    const ultimoAcceso = u.fecha_ultimo_acceso
                      ? new Date(u.fecha_ultimo_acceso).toDateString()
                      : null;
                    return ultimoAcceso === hoy;
                  }).length
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card className='p-4'>
        <div className='flex gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Buscar por nombre, email o cargo...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          {searchTerm && (
            <Button variant='outline' onClick={() => setSearchTerm('')}>
              Limpiar
            </Button>
          )}
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
          <div className='flex items-center gap-3'>
            <AlertTriangle className='h-5 w-5 text-red-600' />
            <p className='text-red-800'>{error}</p>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <Card>
        <div className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Usuarios del Sistema ({filteredUsuarios.length})
          </h3>

          {loading ? (
            <div className='text-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='text-gray-600 mt-3'>Cargando usuarios...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className='text-center py-8'>
              <Users className='h-12 w-12 text-gray-400 mx-auto mb-3' />
              <p className='text-gray-600'>
                {searchTerm
                  ? 'No se encontraron usuarios que coincidan con la búsqueda'
                  : 'No hay usuarios registrados'}
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredUsuarios.map(usuario => (
                <div
                  key={usuario.id}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    {/* Avatar con icono de rol */}
                    <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl'>
                      {getIconoRol(usuario.roles)}
                    </div>

                    {/* Información del usuario */}
                    <div>
                      <div className='flex items-center gap-3'>
                        <h4 className='font-semibold text-gray-900'>
                          {usuario.nombre_completo || 'Sin nombre'}
                        </h4>
                        {getBadgeRol(usuario.roles)}
                        {getBadgeEstado(usuario.estado)}
                      </div>
                      <p className='text-sm text-gray-600'>{usuario.email}</p>
                      {usuario.cargo && (
                        <p className='text-xs text-gray-500'>{usuario.cargo}</p>
                      )}
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className='text-right text-sm text-gray-500'>
                    <p>Creado: {formatearFecha(usuario.fecha_creacion)}</p>
                    <p>
                      Último acceso:{' '}
                      {formatearFecha(usuario.fecha_ultimo_acceso)}
                    </p>
                    {usuario.telefono && <p>Tel: {usuario.telefono}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Usuario actual */}
      <Card className='p-6 border-blue-200 bg-blue-50'>
        <h3 className='text-lg font-semibold text-blue-900 mb-3'>
          Tu Información
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <p>
              <strong>Nombre:</strong>{' '}
              {userProfile?.nombre_completo || 'No definido'}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Rol:</strong> {role || 'Sin rol'}
            </p>
          </div>
          <div>
            <p>
              <strong>ID:</strong> {user?.id}
            </p>
            <p>
              <strong>Cargo:</strong> {userProfile?.cargo || 'No definido'}
            </p>
            <p>
              <strong>Estado:</strong> {userProfile?.estado || 'Activo'}
            </p>
          </div>
        </div>
      </Card>

      {/* Información del sistema */}
      <Card className='p-4 bg-gray-50'>
        <div className='text-xs text-gray-600 text-center space-y-1'>
          <p>
            <strong>Nota:</strong> Este es un panel básico de visualización de
            usuarios.
          </p>
          <p>
            Para funcionalidades avanzadas de administración (crear, editar,
            eliminar) se requiere implementación adicional.
          </p>
          <p>
            Los usuarios se gestionan actualmente a través de Supabase Auth y la
            tabla usuarios_sistema.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsersPanel;
