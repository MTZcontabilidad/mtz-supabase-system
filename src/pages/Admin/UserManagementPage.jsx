import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Building,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Plus,
  Check,
  X,
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
import { supabase } from '@/lib/supabase.js';
import usePermissions from '@/hooks/usePermissions.js';

/**
 * UserManagementPage Component
 * Gestión completa de usuarios con asignación de clientes
 */
const UserManagementPage = () => {
  const { isAdmin, hasPermission } = usePermissions();

  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Estados de modales
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAssignClients, setShowAssignClients] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Estados de formularios
  const [newUser, setNewUser] = useState({
    email: '',
    nombre_completo: '',
    rol_id: '',
    cargo: '',
    telefono: '',
    departamento: '',
    activo: true,
  });

  const [selectedClients, setSelectedClients] = useState([]);

  // Verificar permisos
  const hasAccess = isAdmin || hasPermission('usuarios', 'read');

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('nombre');

      if (rolesError) throw rolesError;
      setRoles(rolesData || []);

      // Cargar usuarios
      const { data: usuariosData, error: usuariosError } = await supabase
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
        .order('created_at', { ascending: false });

      if (usuariosError) throw usuariosError;
      setUsuarios(usuariosData || []);

      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes_contables')
        .select('id_cliente, razon_social, rut')
        .order('razon_social');

      if (clientesError) throw clientesError;
      setClientes(clientesData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar asignaciones de clientes de un usuario
  const cargarAsignacionesUsuario = async userId => {
    try {
      const { data, error } = await supabase
        .from('asignaciones_clientes')
        .select('cliente_id')
        .eq('usuario_id', userId)
        .eq('activo', true);

      if (error) throw error;
      return data?.map(a => a.cliente_id) || [];
    } catch (error) {
      console.error('Error cargando asignaciones:', error);
      return [];
    }
  };

  // Crear nuevo usuario
  const handleCrearUsuario = async () => {
    try {
      // Primero crear el usuario en auth.users
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: newUser.email,
          password: 'password123', // Contraseña temporal
          email_confirm: true,
        });

      if (authError) throw authError;

      // Luego crear el registro en usuarios_sistema
      const { error: userError } = await supabase
        .from('usuarios_sistema')
        .insert({
          id: authData.user.id,
          email: newUser.email,
          nombre_completo: newUser.nombre_completo,
          rol_id: newUser.rol_id,
          cargo: newUser.cargo,
          telefono: newUser.telefono,
          departamento: newUser.departamento,
          activo: newUser.activo,
        });

      if (userError) throw userError;

      // Asignar clientes si se seleccionaron
      if (selectedClients.length > 0) {
        const currentUser = (await supabase.auth.getUser()).data.user;
        const asignaciones = selectedClients.map(clienteId => ({
          usuario_id: authData.user.id,
          cliente_id: clienteId,
          asignado_por_id: currentUser?.id,
        }));

        const { error: asignError } = await supabase
          .from('asignaciones_clientes')
          .insert(asignaciones);

        if (asignError) console.error('Error asignando clientes:', asignError);
      }

      setShowUserForm(false);
      setNewUser({
        email: '',
        nombre_completo: '',
        rol_id: '',
        cargo: '',
        telefono: '',
        departamento: '',
        activo: true,
      });
      setSelectedClients([]);
      cargarDatos();
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('Error creando usuario: ' + error.message);
    }
  };

  // Asignar clientes a usuario
  const handleAsignarClientes = async () => {
    if (!selectedUser) return;

    try {
      // Obtener asignaciones actuales
      const asignacionesActuales = await cargarAsignacionesUsuario(
        selectedUser.id
      );

      // Desactivar asignaciones que ya no están seleccionadas
      const clientesADesactivar = asignacionesActuales.filter(
        clienteId => !selectedClients.includes(clienteId)
      );

      if (clientesADesactivar.length > 0) {
        const { error: deactivateError } = await supabase
          .from('asignaciones_clientes')
          .update({ activo: false })
          .eq('usuario_id', selectedUser.id)
          .in('cliente_id', clientesADesactivar);

        if (deactivateError) throw deactivateError;
      }

      // Activar o crear nuevas asignaciones
      for (const clienteId of selectedClients) {
        if (!asignacionesActuales.includes(clienteId)) {
          const { error: insertError } = await supabase
            .from('asignaciones_clientes')
            .insert({
              usuario_id: selectedUser.id,
              cliente_id: clienteId,
              asignado_por_id: (await supabase.auth.getUser()).data.user?.id,
            });

          if (insertError && insertError.code !== '23505') {
            // Ignorar duplicados
            throw insertError;
          }
        } else {
          // Reactivar si estaba desactivada
          const { error: activateError } = await supabase
            .from('asignaciones_clientes')
            .update({ activo: true })
            .eq('usuario_id', selectedUser.id)
            .eq('cliente_id', clienteId);

          if (activateError) throw activateError;
        }
      }

      setShowAssignClients(false);
      setSelectedUser(null);
      setSelectedClients([]);
      cargarDatos();
    } catch (error) {
      console.error('Error asignando clientes:', error);
      alert('Error asignando clientes: ' + error.message);
    }
  };

  // Cambiar estado de usuario
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('usuarios_sistema')
        .update({ activo: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      cargarDatos();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error cambiando estado: ' + error.message);
    }
  };

  // Abrir modal de asignación de clientes
  const abrirAsignacionClientes = async usuario => {
    setSelectedUser(usuario);
    const asignaciones = await cargarAsignacionesUsuario(usuario.id);
    setSelectedClients(asignaciones);
    setShowAssignClients(true);
  };

  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchSearch =
      usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole =
      filterRole === 'todos' || usuario.roles?.nombre === filterRole;
    const matchStatus =
      filterStatus === 'todos' ||
      (filterStatus === 'activo' && usuario.activo) ||
      (filterStatus === 'inactivo' && !usuario.activo);

    return matchSearch && matchRole && matchStatus;
  });

  // Cargar datos al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Renderizar acceso restringido si no tiene permisos
  if (!hasAccess) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <Card className='p-8 text-center max-w-md'>
          <Shield className='mx-auto h-12 w-12 text-red-600 mb-4' />
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Acceso Restringido
          </h2>
          <p className='text-gray-600'>
            Solo los administradores pueden gestionar usuarios.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
            <Users className='h-8 w-8 text-blue-600' />
            Gestión de Usuarios
          </h1>
          <p className='text-gray-600'>
            Administra usuarios, roles y asignaciones de clientes
          </p>
        </div>

        <div className='flex gap-2'>
          <Button onClick={cargarDatos} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
          <Button onClick={() => setShowUserForm(true)}>
            <UserPlus className='h-4 w-4 mr-2' />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-blue-600'>
              {usuarios.length}
            </p>
            <p className='text-sm text-gray-600'>Total Usuarios</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600'>
              {usuarios.filter(u => u.activo).length}
            </p>
            <p className='text-sm text-gray-600'>Activos</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-yellow-600'>
              {usuarios.filter(u => u.roles?.nombre === 'colaborador').length}
            </p>
            <p className='text-sm text-gray-600'>Colaboradores</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-purple-600'>
              {usuarios.filter(u => u.roles?.nombre === 'usuario').length}
            </p>
            <p className='text-sm text-gray-600'>Usuarios</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Buscar por email o nombre...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los roles</option>
              {roles.map(rol => (
                <option key={rol.id} value={rol.nombre}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los estados</option>
              <option value='activo'>Activo</option>
              <option value='inactivo'>Inactivo</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de usuarios */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>
          Usuarios ({usuariosFiltrados.length})
        </h3>

        {loading ? (
          <div className='text-center py-8'>
            <RefreshCw className='h-8 w-8 mx-auto animate-spin text-blue-500' />
            <p className='mt-2 text-gray-600'>Cargando usuarios...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className='text-center py-8'>
            <Users className='h-12 w-12 mx-auto text-gray-400' />
            <p className='mt-2 text-gray-600'>No hay usuarios para mostrar</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {usuariosFiltrados.map(usuario => (
              <div
                key={usuario.id}
                className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-900'>
                        {usuario.nombre_completo || 'Sin nombre'}
                      </h4>
                      <Badge
                        variant={usuario.activo ? 'success' : 'destructive'}
                      >
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Badge variant='outline'>
                        {usuario.roles?.nombre || 'Sin rol'}
                      </Badge>
                    </div>

                    <div className='text-sm text-gray-600 space-y-1'>
                      <p>📧 {usuario.email}</p>
                      {usuario.cargo && <p>💼 {usuario.cargo}</p>}
                      {usuario.departamento && <p>🏢 {usuario.departamento}</p>}
                      {usuario.telefono && <p>📞 {usuario.telefono}</p>}
                    </div>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => abrirAsignacionClientes(usuario)}
                      disabled={usuario.roles?.nombre === 'administrador'}
                    >
                      <Building className='h-4 w-4 mr-1' />
                      Asignar Clientes
                    </Button>

                    <Button
                      size='sm'
                      variant={usuario.activo ? 'destructive' : 'success'}
                      onClick={() =>
                        toggleUserStatus(usuario.id, usuario.activo)
                      }
                    >
                      {usuario.activo ? (
                        <>
                          <UserX className='h-4 w-4 mr-1' />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <UserCheck className='h-4 w-4 mr-1' />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Nuevo Usuario */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <Input
                type='email'
                placeholder='usuario@empresa.cl'
                value={newUser.email}
                onChange={e =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nombre Completo
              </label>
              <Input
                placeholder='Nombre y Apellido'
                value={newUser.nombre_completo}
                onChange={e =>
                  setNewUser({ ...newUser, nombre_completo: e.target.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Rol
              </label>
              <select
                value={newUser.rol_id}
                onChange={e =>
                  setNewUser({ ...newUser, rol_id: e.target.value })
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

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cargo
                </label>
                <Input
                  placeholder='Cargo'
                  value={newUser.cargo}
                  onChange={e =>
                    setNewUser({ ...newUser, cargo: e.target.value })
                  }
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Departamento
                </label>
                <Input
                  placeholder='Departamento'
                  value={newUser.departamento}
                  onChange={e =>
                    setNewUser({ ...newUser, departamento: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Teléfono
              </label>
              <Input
                placeholder='+56 9 1234 5678'
                value={newUser.telefono}
                onChange={e =>
                  setNewUser({ ...newUser, telefono: e.target.value })
                }
              />
            </div>

            {newUser.rol_id &&
              roles.find(r => r.id === newUser.rol_id)?.nombre ===
                'usuario' && (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Clientes Asignados
                  </label>
                  <div className='max-h-32 overflow-y-auto border rounded-md p-2'>
                    {clientes.map(cliente => (
                      <label
                        key={cliente.id_cliente}
                        className='flex items-center gap-2 p-1'
                      >
                        <input
                          type='checkbox'
                          checked={selectedClients.includes(cliente.id_cliente)}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedClients([
                                ...selectedClients,
                                cliente.id_cliente,
                              ]);
                            } else {
                              setSelectedClients(
                                selectedClients.filter(
                                  id => id !== cliente.id_cliente
                                )
                              );
                            }
                          }}
                        />
                        <span className='text-sm'>{cliente.razon_social}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowUserForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearUsuario}>Crear Usuario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Asignar Clientes */}
      <Dialog open={showAssignClients} onOpenChange={setShowAssignClients}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              Asignar Clientes a {selectedUser?.nombre_completo}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <p className='text-sm text-gray-600'>
              Selecciona los clientes que puede ver este usuario:
            </p>

            <div className='max-h-64 overflow-y-auto border rounded-md p-2'>
              {clientes.map(cliente => (
                <label
                  key={cliente.id_cliente}
                  className='flex items-center gap-2 p-2 hover:bg-gray-50 rounded'
                >
                  <input
                    type='checkbox'
                    checked={selectedClients.includes(cliente.id_cliente)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedClients([
                          ...selectedClients,
                          cliente.id_cliente,
                        ]);
                      } else {
                        setSelectedClients(
                          selectedClients.filter(
                            id => id !== cliente.id_cliente
                          )
                        );
                      }
                    }}
                  />
                  <div>
                    <p className='font-medium text-sm'>
                      {cliente.razon_social}
                    </p>
                    <p className='text-xs text-gray-500'>{cliente.rut}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowAssignClients(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAsignarClientes}>
              Guardar Asignaciones
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
