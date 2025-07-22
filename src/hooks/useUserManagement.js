import { useState, useCallback, useEffect } from 'react';
import useAuth from '@/hooks/useAuth.js';

import { dataService } from '@/lib/dataService.js';
import usePermissions from './usePermissions';

/**
 * Hook personalizado para la gestión de usuarios
 * Proporciona funcionalidades CRUD, asignación de roles, permisos y análisis
 */
export const useUserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    rol: 'todos',
    status: 'todos',
    departamento: 'todos',
    fecha_desde: '',
    fecha_hasta: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'fecha_creacion',
    direction: 'desc',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState(null);

  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  // Verificar permisos
  const canView = hasPermission('users', 'read');
  const canCreate = hasPermission('users', 'create');
  const canUpdate = hasPermission('users', 'update');
  const canDelete = hasPermission('users', 'delete');
  const canManageRoles = hasPermission('roles', 'manage');
  const canAssignClients = hasPermission('users', 'assign_clients');

  // Departamentos disponibles
  const departamentos = [
    'Administración',
    'Ventas',
    'Cobranzas',
    'Compras',
    'Contratos',
    'RRHH',
    'Sistemas',
    'Contabilidad',
    'Marketing',
    'Operaciones',
  ];

  // Estados de usuario
  const estadosUsuario = [
    'activo',
    'inactivo',
    'suspendido',
    'pendiente_activacion',
    'bloqueado',
  ];

  /**
   * Cargar todos los usuarios
   */
  const cargarUsuarios = useCallback(async () => {
    if (!canView) {
      setError('No tienes permisos para ver usuarios');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando usuarios...');

      const usuariosData = await dataService.getUsuariosData();

      // Procesar datos de usuarios
      const usuariosProcesados = usuariosData.map(usuario => ({
        ...usuario,
        analisis: generarAnalisisUsuario(usuario),
        estado_display: obtenerEstadoDisplay(usuario.estado),
        dias_ultima_actividad: calcularDiasUltimaActividad(
          usuario.ultima_actividad
        ),
      }));

      setUsuarios(usuariosProcesados);
      console.log('✅ Usuarios cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      setError(`Error cargando usuarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [canView]);

  /**
   * Cargar roles
   */
  const cargarRoles = useCallback(async () => {
    if (!canManageRoles) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando roles...');

      const rolesData = await dataService.getRolesData();
      setRoles(rolesData || []);

      console.log('✅ Roles cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando roles:', error);
      setError(`Error cargando roles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [canManageRoles]);

  /**
   * Cargar clientes
   */
  const cargarClientes = useCallback(async () => {
    if (!canAssignClients) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando clientes...');

      const clientesData = await dataService.getClientesData();
      setClientes(clientesData || []);

      console.log('✅ Clientes cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
      setError(`Error cargando clientes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [canAssignClients]);

  /**
   * Crear nuevo usuario
   */
  const crearUsuario = useCallback(
    async usuarioData => {
      if (!canCreate) {
        throw new Error('No tienes permisos para crear usuarios');
      }

      try {
        setLoading(true);
        setError('');

        const nuevoUsuario = await dataService.crearUsuario({
          ...usuarioData,
          fecha_creacion: new Date().toISOString(),
          usuario_creacion: user?.id,
          estado: usuarioData.estado || 'pendiente_activacion',
        });

        setUsuarios(prev => [nuevoUsuario, ...prev]);
        console.log('✅ Usuario creado exitosamente');
        return nuevoUsuario;
      } catch (error) {
        console.error('❌ Error creando usuario:', error);
        setError(`Error creando usuario: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canCreate, user?.id]
  );

  /**
   * Actualizar usuario
   */
  const actualizarUsuario = useCallback(
    async (id, usuarioData) => {
      if (!canUpdate) {
        throw new Error('No tienes permisos para actualizar usuarios');
      }

      try {
        setLoading(true);
        setError('');

        const usuarioActualizado = await dataService.actualizarUsuario(id, {
          ...usuarioData,
          fecha_modificacion: new Date().toISOString(),
          usuario_modificacion: user?.id,
        });

        setUsuarios(prev =>
          prev.map(usuario =>
            usuario.id === id ? usuarioActualizado : usuario
          )
        );

        console.log('✅ Usuario actualizado exitosamente');
        return usuarioActualizado;
      } catch (error) {
        console.error('❌ Error actualizando usuario:', error);
        setError(`Error actualizando usuario: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canUpdate, user?.id]
  );

  /**
   * Eliminar usuario
   */
  const eliminarUsuario = useCallback(
    async id => {
      if (!canDelete) {
        throw new Error('No tienes permisos para eliminar usuarios');
      }

      try {
        setLoading(true);
        setError('');

        await dataService.eliminarUsuario(id);

        setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
        console.log('✅ Usuario eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando usuario:', error);
        setError(`Error eliminando usuario: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canDelete]
  );

  /**
   * Cambiar estado de usuario
   */
  const cambiarEstadoUsuario = useCallback(
    async (id, nuevoEstado) => {
      if (!canUpdate) {
        throw new Error(
          'No tienes permisos para cambiar el estado de usuarios'
        );
      }

      try {
        setLoading(true);
        setError('');

        const usuarioActualizado = await dataService.actualizarUsuario(id, {
          estado: nuevoEstado,
          fecha_modificacion: new Date().toISOString(),
          usuario_modificacion: user?.id,
        });

        setUsuarios(prev =>
          prev.map(usuario =>
            usuario.id === id ? usuarioActualizado : usuario
          )
        );

        console.log('✅ Estado de usuario cambiado exitosamente');
        return usuarioActualizado;
      } catch (error) {
        console.error('❌ Error cambiando estado de usuario:', error);
        setError(`Error cambiando estado de usuario: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canUpdate, user?.id]
  );

  /**
   * Asignar clientes a usuario
   */
  const asignarClientes = useCallback(
    async (usuarioId, clienteIds) => {
      if (!canAssignClients) {
        throw new Error('No tienes permisos para asignar clientes');
      }

      try {
        setLoading(true);
        setError('');

        await dataService.asignarClientes(usuarioId, clienteIds);

        console.log('✅ Clientes asignados exitosamente');
      } catch (error) {
        console.error('❌ Error asignando clientes:', error);
        setError(`Error asignando clientes: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canAssignClients]
  );

  /**
   * Generar análisis de usuario
   */
  const generarAnalisisUsuario = usuario => {
    const diasUltimaActividad = calcularDiasUltimaActividad(
      usuario.ultima_actividad
    );
    const diasCreacion = calcularDiasCreacion(usuario.fecha_creacion);

    return {
      actividad:
        diasUltimaActividad <= 7
          ? 'alta'
          : diasUltimaActividad <= 30
            ? 'media'
            : 'baja',
      antiguedad:
        diasCreacion <= 30
          ? 'nuevo'
          : diasCreacion <= 365
            ? 'intermedio'
            : 'experimentado',
      riesgo:
        usuario.estado === 'suspendido' || usuario.estado === 'bloqueado'
          ? 'alto'
          : 'bajo',
      dias_ultima_actividad: diasUltimaActividad,
      dias_creacion: diasCreacion,
    };
  };

  /**
   * Obtener estado display
   */
  const obtenerEstadoDisplay = estado => {
    const estados = {
      activo: { label: 'Activo', color: 'success' },
      inactivo: { label: 'Inactivo', color: 'secondary' },
      suspendido: { label: 'Suspendido', color: 'warning' },
      pendiente_activacion: { label: 'Pendiente', color: 'outline' },
      bloqueado: { label: 'Bloqueado', color: 'destructive' },
    };
    return estados[estado] || { label: estado, color: 'default' };
  };

  /**
   * Calcular días desde última actividad
   */
  const calcularDiasUltimaActividad = ultimaActividad => {
    if (!ultimaActividad) return null;

    const hoy = new Date();
    const actividad = new Date(ultimaActividad);
    const diffTime = hoy - actividad;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * Calcular días desde creación
   */
  const calcularDiasCreacion = fechaCreacion => {
    if (!fechaCreacion) return null;

    const hoy = new Date();
    const creacion = new Date(fechaCreacion);
    const diffTime = hoy - creacion;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * Obtener usuarios filtrados y ordenados
   */
  const usuariosFiltrados = useCallback(() => {
    let filtradas = [...usuarios];

    // Aplicar filtros
    if (filters.search) {
      const termino = filters.search.toLowerCase();
      filtradas = filtradas.filter(
        u =>
          u.nombre_completo?.toLowerCase().includes(termino) ||
          u.email?.toLowerCase().includes(termino) ||
          u.cargo?.toLowerCase().includes(termino) ||
          u.departamento?.toLowerCase().includes(termino)
      );
    }
    if (filters.rol !== 'todos') {
      filtradas = filtradas.filter(u => u.rol_id === filters.rol);
    }
    if (filters.status !== 'todos') {
      filtradas = filtradas.filter(u => u.estado === filters.status);
    }
    if (filters.departamento !== 'todos') {
      filtradas = filtradas.filter(
        u => u.departamento === filters.departamento
      );
    }
    if (filters.fecha_desde) {
      filtradas = filtradas.filter(
        u => new Date(u.fecha_creacion) >= new Date(filters.fecha_desde)
      );
    }
    if (filters.fecha_hasta) {
      filtradas = filtradas.filter(
        u => new Date(u.fecha_creacion) <= new Date(filters.fecha_hasta)
      );
    }

    // Aplicar ordenamiento
    filtradas.sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtradas;
  }, [usuarios, filters, sortConfig]);

  /**
   * Generar estadísticas
   */
  const generarStats = useCallback(() => {
    const totalUsuarios = usuarios.length;
    const usuariosActivos = usuarios.filter(u => u.estado === 'activo').length;
    const usuariosInactivos = usuarios.filter(
      u => u.estado === 'inactivo'
    ).length;
    const usuariosSuspendidos = usuarios.filter(
      u => u.estado === 'suspendido'
    ).length;

    const distribucionRoles = usuarios.reduce((acc, u) => {
      const rol = roles.find(r => r.id === u.rol_id)?.nombre || 'Sin rol';
      acc[rol] = (acc[rol] || 0) + 1;
      return acc;
    }, {});

    const distribucionDepartamentos = usuarios.reduce((acc, u) => {
      acc[u.departamento] = (acc[u.departamento] || 0) + 1;
      return acc;
    }, {});

    const distribucionMensual = usuarios.reduce((acc, u) => {
      const mes = new Date(u.fecha_creacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
      });
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {});

    const usuariosInactivosRecientes = usuarios.filter(u => {
      const diasInactividad = calcularDiasUltimaActividad(u.ultima_actividad);
      return diasInactividad > 30 && u.estado === 'activo';
    }).length;

    setStats({
      totalUsuarios,
      usuariosActivos,
      usuariosInactivos,
      usuariosSuspendidos,
      usuariosInactivosRecientes,
      distribucionRoles,
      distribucionDepartamentos,
      distribucionMensual,
    });
  }, [usuarios, roles]);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
    cargarClientes();
  }, [cargarUsuarios, cargarRoles, cargarClientes]);

  // Generar estadísticas cuando cambien los usuarios
  useEffect(() => {
    if (usuarios.length > 0) {
      generarStats();
    }
  }, [usuarios, generarStats]);

  return {
    // Estado
    usuarios,
    roles,
    clientes,
    loading,
    error,
    filters,
    sortConfig,
    selectedUser,
    stats,

    // Permisos
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canManageRoles,
    canAssignClients,

    // Datos estáticos
    departamentos,
    estadosUsuario,

    // Acciones
    cargarUsuarios,
    cargarRoles,
    cargarClientes,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario,
    asignarClientes,

    // Utilidades
    usuariosFiltrados: usuariosFiltrados(),
    setFilters,
    setSortConfig,
    setSelectedUser,
    clearError: () => setError(''),
  };
};
