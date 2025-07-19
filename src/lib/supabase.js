import { createClient } from '@supabase/supabase-js';
import { debugEnvironment } from '@/utils/debugEnv';

// Debug de variables de entorno
const envDebug = debugEnvironment();

// Configuración del proyecto Supabase MTZ
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Debug de configuración
console.log('🔧 Configuración Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key configurada:', !!supabaseKey);
console.log('Variables de entorno válidas:', envDebug.hasValidConfig);

/**
 * Utilidades centralizadas para MTZ
 * Todas las operaciones de base de datos deben pasar por estas funciones
 */
export const supabaseUtils = {
  // =====================================================================
  // CLIENTES
  // =====================================================================

  /**
   * Obtener todos los clientes
   * @returns {Promise<Array>} Lista de clientes ordenados por facturación
   */
  async getClientes() {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .order('total_facturado', { ascending: false });

    if (error) {
      console.error('Error obteniendo clientes:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Buscar clientes por término
   * @param {string} termino - Término de búsqueda
   * @returns {Promise<Array>} Lista de clientes que coinciden
   */
  async buscarClientes(termino) {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .or(
        `razon_social.ilike.%${termino}%,rut.ilike.%${termino}%,email.ilike.%${termino}%`
      )
      .order('total_facturado', { ascending: false });

    if (error) {
      console.error('Error buscando clientes:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Obtener cliente por ID
   * @param {string} idCliente - ID del cliente
   * @returns {Promise<Object|null>} Cliente encontrado o null
   */
  async getClientePorId(idCliente) {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .eq('id_cliente', idCliente)
      .single();

    if (error) {
      console.error('Error obteniendo cliente:', error);
      return null;
    }

    return data;
  },

  /**
   * Crear nuevo cliente
   * @param {Object} cliente - Datos del cliente
   * @returns {Promise<Object>} Cliente creado
   */
  async crearCliente(cliente) {
    const { data, error } = await supabase
      .from('clientes_contables')
      .insert([cliente])
      .select();

    if (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }

    return data[0];
  },

  /**
   * Actualizar cliente
   * @param {string} idCliente - ID del cliente
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Cliente actualizado
   */
  async actualizarCliente(idCliente, updates) {
    const { data, error } = await supabase
      .from('clientes_contables')
      .update(updates)
      .eq('id_cliente', idCliente)
      .select();

    if (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }

    return data[0];
  },

  // =====================================================================
  // USUARIOS
  // =====================================================================

  /**
   * Obtener perfil de usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object|null>} Perfil del usuario
   */
  async getUserProfile(userId) {
    const { data, error } = await supabase
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
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error obteniendo perfil de usuario:', error);
      return null;
    }

    return data;
  },

  /**
   * Crear perfil de usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Perfil creado
   */
  async createUserProfile(userData) {
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .insert([userData])
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
      .single();

    if (error) {
      console.error('Error creando perfil de usuario:', error);
      throw error;
    }

    return data;
  },

  /**
   * Actualizar perfil de usuario
   * @param {string} userId - ID del usuario
   * @param {Object} updates - Datos a actualizar
   * @returns {Promise<Object>} Perfil actualizado
   */
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('usuarios_sistema')
      .update(updates)
      .eq('id', userId)
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
      .single();

    if (error) {
      console.error('Error actualizando perfil de usuario:', error);
      throw error;
    }

    return data;
  },

  // =====================================================================
  // ESTADÍSTICAS
  // =====================================================================

  /**
   * Obtener estadísticas del dashboard
   * @returns {Promise<Object>} Estadísticas calculadas
   */
  async getEstadisticasDashboard() {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('total_facturado, estado, numero_facturas');

    if (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalClientes: 0,
        facturacionTotal: 0,
        clientesActivos: 0,
        promedioFacturacion: 0,
      };
    }

    const totalClientes = data.length;
    const facturacionTotal = data.reduce(
      (sum, cliente) => sum + parseFloat(cliente.total_facturado || 0),
      0
    );
    const clientesActivos = data.filter(
      cliente => cliente.estado === 'Activo'
    ).length;
    const promedioFacturacion =
      totalClientes > 0 ? facturacionTotal / totalClientes : 0;

    return {
      totalClientes,
      facturacionTotal,
      clientesActivos,
      promedioFacturacion,
    };
  },
};

export default supabase;
