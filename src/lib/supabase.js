import { createClient } from '@supabase/supabase-js';

// Configuración Supabase optimizada para producción
const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyNDgyNzksImV4cCI6MjAzNjgyNDI3OX0.g1yKFklbTKzOHuiYV5gHU3ZzjczZJu8FOvQc1CEA2rA';

// Crear cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'mtz-system@1.0.0'
    }
  }
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
};

// Exportar configuración para debug
export const MTZ_CONFIG = {
  url: SUPABASE_URL,
  keyConfigured: !!SUPABASE_ANON_KEY,
  version: '1.0.0'
};

export default supabase;