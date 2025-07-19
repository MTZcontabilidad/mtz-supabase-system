import { createClient } from '@supabase/supabase-js';

// Configuración Supabase desde variables de entorno
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Crear cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'mtz-system@1.0.0',
    },
  },
});

/**
 * Utilidades MTZ
 */
export const supabaseUtils = {
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

  async buscarClientes(termino) {
    if (!termino.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .or(
        `razon_social.ilike.%${termino}%,rut.ilike.%${termino}%,id_cliente.ilike.%${termino}%`
      )
      .order('total_facturado', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error buscando clientes:', error);
      return [];
    }

    return data || [];
  },
};

// Exportar configuración para debug
export const MTZ_CONFIG = {
  url: SUPABASE_URL,
  keyConfigured: !!SUPABASE_ANON_KEY,
  version: '1.0.0',
};

export default supabase;
