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
import { Card, Button, Input, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';

/**
 * AdminUsersPanel Component - Versión Simplificada
 * Panel administrativo para gestión básica de usuarios del sistema
 * Funciona con el sistema de roles actual sin requerir admin API
 */
const AdminUsersPanel = () => {
  const { user, role } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener usuarios desde la tabla usuarios
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (usuariosError) {
        console.error('Error cargando usuarios:', usuariosError);
        setError('Error al cargar usuarios');
        return;
      }

      setUsers(usuariosData || []);
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Error inesperado al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      const { error } = await supabase
        .from('usuarios')
        .update({ activo: newStatus })
        .eq('id', userId);

      if (error) {
        console.error('Error actualizando usuario:', error);
        return;
      }

      // Actualizar estado local
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, activo: newStatus }
            : user
        )
      );
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(search) ||
      user.nombre_completo?.toLowerCase().includes(search) ||
      user.rol?.toLowerCase().includes(search)
    );
  });

  // Verificar permisos
  if (role !== 'admin') {
    return (
      <div className='text-center py-12'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto'>
          <Shield className='h-12 w-12 text-yellow-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-yellow-900 mb-2'>Acceso Restringido</h3>
          <p className='text-yellow-700'>Solo los administradores pueden acceder a este panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
          <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-red-900 mb-2'>Error</h3>
          <p className='text-red-700 mb-4'>{error}</p>
          <Button onClick={loadUsers} variant='outline'>
            Reintentar
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
          <h1 className='text-2xl font-bold text-gray-900'>Panel de Administración</h1>
          <p className='text-gray-600 mt-1'>
            Gestión de usuarios y configuraciones del sistema
          </p>
        </div>
        <div className='flex gap-3'>
          <Button variant='outline' size='sm'>
            <Settings className='w-4 h-4 mr-2' />
            Configuración
          </Button>
          <Button>
            <UserPlus className='w-4 h-4 mr-2' />
            Invitar Usuario
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-50 rounded-lg'>
              <Users className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Total Usuarios</p>
              <p className='text-xl font-bold text-gray-900'>{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-50 rounded-lg'>
              <Shield className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Activos</p>
              <p className='text-xl font-bold text-gray-900'>
                {users.filter(u => u.activo).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-purple-50 rounded-lg'>
              <Lock className='w-5 h-5 text-purple-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Administradores</p>
              <p className='text-xl font-bold text-gray-900'>
                {users.filter(u => u.rol === 'admin').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-yellow-50 rounded-lg'>
              <Mail className='w-5 h-5 text-yellow-600' />
            </div>
            <div>
              <p className='text-sm text-gray-600'>Pendientes</p>
              <p className='text-xl font-bold text-gray-900'>
                {users.filter(u => !u.activo).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card className='p-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Buscar usuarios por email, nombre o rol...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Usuario
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Rol
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Registro
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredUsers.map((usuario) => (
                <tr key={usuario.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                        {usuario.nombre_completo?.charAt(0) || usuario.email?.charAt(0) || 'U'}
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>
                          {usuario.nombre_completo || 'Sin nombre'}
                        </div>
                        <div className='text-sm text-gray-500'>{usuario.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge 
                      variant={usuario.rol === 'admin' ? 'primary' : 'secondary'}
                      size='sm'
                    >
                      {usuario.rol || 'user'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge 
                      variant={usuario.activo ? 'success' : 'danger'}
                      size='sm'
                    >
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {new Date(usuario.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => console.log('Ver usuario:', usuario.id)}
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleToggleUserStatus(usuario.id, usuario.activo)}
                        className={usuario.activo ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className='text-center py-8'>
            <Users className='w-12 h-12 text-gray-300 mx-auto mb-4' />
            <p className='text-gray-500'>
              {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminUsersPanel;