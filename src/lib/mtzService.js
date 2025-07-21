import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Servicio principal del sistema MTZ
export const mtzService = {
  // ========================================
  // GESTIÓN DE EMPRESAS
  // ========================================

  async getEmpresas() {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async getEmpresaById(id) {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createEmpresa(empresa) {
    const { data, error } = await supabase
      .from('empresas')
      .insert([empresa])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateEmpresa(id, datos) {
    const { data, error } = await supabase
      .from('empresas')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteEmpresa(id) {
    const { error } = await supabase.from('empresas').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE ROLES
  // ========================================

  async getRoles() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async getRolById(id) {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createRol(rol) {
    const { data, error } = await supabase.from('roles').insert([rol]).select();

    if (error) throw error;
    return data[0];
  },

  async updateRol(id, datos) {
    const { data, error } = await supabase
      .from('roles')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteRol(id) {
    const { error } = await supabase.from('roles').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE USUARIOS
  // ========================================

  async getUsuarios() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id(nombre, descripcion),
        empresas:empresa_id(nombre)
      `
      )
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async getUsuarioById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id(nombre, descripcion),
        empresas:empresa_id(nombre)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createUsuario(usuario) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateUsuario(id, datos) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteUsuario(id) {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE CLIENTES
  // ========================================

  async getClientes(filtros = {}) {
    let query = supabase.from('clientes').select('*').order('nombre');

    // Aplicar filtros
    if (filtros.activo !== undefined) {
      query = query.eq('activo', filtros.activo);
    }
    if (filtros.empresa_id) {
      query = query.eq('empresa_id', filtros.empresa_id);
    }
    if (filtros.busqueda) {
      query = query.ilike('nombre', `%${filtros.busqueda}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getClienteById(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCliente(cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateCliente(id, datos) {
    const { data, error } = await supabase
      .from('clientes')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteCliente(id) {
    const { error } = await supabase.from('clientes').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE VENTAS
  // ========================================

  async getVentas(filtros = {}) {
    let query = supabase
      .from('ventas')
      .select(
        `
        *,
        clientes:cliente_id(nombre, email),
        usuarios:usuario_id(nombre, apellido)
      `
      )
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filtros.cliente_id) {
      query = query.eq('cliente_id', filtros.cliente_id);
    }
    if (filtros.usuario_id) {
      query = query.eq('usuario_id', filtros.usuario_id);
    }
    if (filtros.fecha_inicio) {
      query = query.gte('created_at', filtros.fecha_inicio);
    }
    if (filtros.fecha_fin) {
      query = query.lte('created_at', filtros.fecha_fin);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getVentaById(id) {
    const { data, error } = await supabase
      .from('ventas')
      .select(
        `
        *,
        clientes:cliente_id(nombre, email),
        usuarios:usuario_id(nombre, apellido)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createVenta(venta) {
    const { data, error } = await supabase
      .from('ventas')
      .insert([venta])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateVenta(id, datos) {
    const { data, error } = await supabase
      .from('ventas')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteVenta(id) {
    const { error } = await supabase.from('ventas').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE COBRANZAS
  // ========================================

  async getCobranzas(filtros = {}) {
    let query = supabase
      .from('cobranzas')
      .select(
        `
        *,
        clientes:cliente_id(nombre, email)
      `
      )
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filtros.cliente_id) {
      query = query.eq('cliente_id', filtros.cliente_id);
    }
    if (filtros.estado) {
      query = query.eq('estado', filtros.estado);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getCobranzaById(id) {
    const { data, error } = await supabase
      .from('cobranzas')
      .select(
        `
        *,
        clientes:cliente_id(nombre, email)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCobranza(cobranza) {
    const { data, error } = await supabase
      .from('cobranzas')
      .insert([cobranza])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateCobranza(id, datos) {
    const { data, error } = await supabase
      .from('cobranzas')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteCobranza(id) {
    const { error } = await supabase.from('cobranzas').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE PROYECCIONES
  // ========================================

  async getProyecciones(filtros = {}) {
    let query = supabase
      .from('proyecciones')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }
    if (filtros.estado) {
      query = query.eq('estado', filtros.estado);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getProyeccionById(id) {
    const { data, error } = await supabase
      .from('proyecciones')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProyeccion(proyeccion) {
    const { data, error } = await supabase
      .from('proyecciones')
      .insert([proyeccion])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateProyeccion(id, datos) {
    const { data, error } = await supabase
      .from('proyecciones')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteProyeccion(id) {
    const { error } = await supabase.from('proyecciones').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE RRHH
  // ========================================

  async getRRHH(filtros = {}) {
    let query = supabase.from('rrhh').select('*').order('nombre');

    // Aplicar filtros
    if (filtros.activo !== undefined) {
      query = query.eq('activo', filtros.activo);
    }
    if (filtros.cargo) {
      query = query.eq('cargo', filtros.cargo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getRRHHById(id) {
    const { data, error } = await supabase
      .from('rrhh')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createRRHH(empleado) {
    const { data, error } = await supabase
      .from('rrhh')
      .insert([empleado])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateRRHH(id, datos) {
    const { data, error } = await supabase
      .from('rrhh')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteRRHH(id) {
    const { error } = await supabase.from('rrhh').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // GESTIÓN DE ASIGNACIONES
  // ========================================

  async getAsignaciones(filtros = {}) {
    let query = supabase
      .from('asignaciones')
      .select(
        `
        *,
        usuarios:usuario_id(nombre, apellido)
      `
      )
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filtros.usuario_id) {
      query = query.eq('usuario_id', filtros.usuario_id);
    }
    if (filtros.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getAsignacionById(id) {
    const { data, error } = await supabase
      .from('asignaciones')
      .select(
        `
        *,
        usuarios:usuario_id(nombre, apellido)
      `
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createAsignacion(asignacion) {
    const { data, error } = await supabase
      .from('asignaciones')
      .insert([asignacion])
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateAsignacion(id, datos) {
    const { data, error } = await supabase
      .from('asignaciones')
      .update(datos)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  async deleteAsignacion(id) {
    const { error } = await supabase.from('asignaciones').delete().eq('id', id);

    if (error) throw error;
    return true;
  },

  // ========================================
  // DASHBOARD Y REPORTES
  // ========================================

  async getDashboardData() {
    try {
      const [clientes, ventas, cobranzas, usuarios] = await Promise.all([
        supabase.from('clientes').select('*', { count: 'exact' }),
        supabase.from('ventas').select('*', { count: 'exact' }),
        supabase.from('cobranzas').select('*', { count: 'exact' }),
        supabase.from('usuarios').select('*', { count: 'exact' }),
      ]);

      return {
        totalClientes: clientes.count || 0,
        totalVentas: ventas.count || 0,
        totalCobranzas: cobranzas.count || 0,
        totalUsuarios: usuarios.count || 0,
      };
    } catch (error) {
      throw error;
    }
  },

  async getVentasPorMes(mes, año) {
    const fechaInicio = new Date(año, mes - 1, 1).toISOString();
    const fechaFin = new Date(año, mes, 0).toISOString();

    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .gte('created_at', fechaInicio)
      .lte('created_at', fechaFin);

    if (error) throw error;
    return data;
  },

  async getCobranzasPorMes(mes, año) {
    const fechaInicio = new Date(año, mes - 1, 1).toISOString();
    const fechaFin = new Date(año, mes, 0).toISOString();

    const { data, error } = await supabase
      .from('cobranzas')
      .select('*')
      .gte('created_at', fechaInicio)
      .lte('created_at', fechaFin);

    if (error) throw error;
    return data;
  },

  // ========================================
  // BÚSQUEDAS Y FILTROS AVANZADOS
  // ========================================

  async buscarClientes(termino) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`nombre.ilike.%${termino}%,email.ilike.%${termino}%`)
      .order('nombre');

    if (error) throw error;
    return data;
  },

  async buscarUsuarios(termino) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id(nombre)
      `
      )
      .or(
        `nombre.ilike.%${termino}%,apellido.ilike.%${termino}%,email.ilike.%${termino}%`
      )
      .order('nombre');

    if (error) throw error;
    return data;
  },

  // ========================================
  // UTILIDADES
  // ========================================

  async getEstadisticas() {
    try {
      const [clientesActivos, ventasRecientes, cobranzasPendientes] =
        await Promise.all([
          supabase
            .from('clientes')
            .select('*', { count: 'exact' })
            .eq('activo', true),
          supabase
            .from('ventas')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase.from('cobranzas').select('*').eq('estado', 'pendiente'),
        ]);

      return {
        clientesActivos: clientesActivos.count || 0,
        ventasRecientes: ventasRecientes.data || [],
        cobranzasPendientes: cobranzasPendientes.data || [],
      };
    } catch (error) {
      throw error;
    }
  },
};

export default mtzService;
