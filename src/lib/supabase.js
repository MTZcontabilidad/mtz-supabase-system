import { createClient } from '@supabase/supabase-js';

// 🔧 CONFIGURACIÓN SIMPLE Y DIRECTA
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

// Debug simple
console.log('🚀 MTZ Sistema Iniciando...');
console.log('✅ Configuración Supabase aplicada');

// Crear cliente simple
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Utilidades básicas para MTZ
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

  async buscarClientes(termino) {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .or(`razon_social.ilike.%${termino}%,rut.ilike.%${termino}%,email.ilike.%${termino}%`)
      .order('total_facturado', { ascending: false });

    if (error) {
      console.error('Error buscando clientes:', error);
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

export default supabase;
