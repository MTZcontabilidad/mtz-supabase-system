import { createClient } from '@supabase/supabase-js';

// 🚨 CONFIGURACIÓN EMERGENCIA - A PRUEBA DE FALLOS
// Ignorar COMPLETAMENTE las variables de entorno y usar configuración directa

console.log('🚨 MTZ EMERGENCIA: Configuración directa iniciada');
console.log('🔧 Ignorando variables de entorno - usando configuración hardcoded');

// Configuración ABSOLUTAMENTE DIRECTA
const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

// Debug emergencia
console.log('✅ URL:', SUPABASE_URL);
console.log('✅ Key configurada:', SUPABASE_ANON_KEY ? 'SÍ' : 'NO');
console.log('✅ Longitud key:', SUPABASE_ANON_KEY.length);

// Crear cliente Supabase CON CONFIGURACIÓN EMERGENCIA
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

// Test inmediato de conexión
console.log('🧪 Probando conexión inmediata...');
supabase.from('clientes_contables').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ MTZ EMERGENCIA: Error conexión:', error);
    } else {
      console.log('✅ MTZ EMERGENCIA: Conexión exitosa!');
    }
  });

// Verificar auth específicamente
supabase.auth.getSession().then(({ data, error }) => {
  console.log('🔐 Estado auth:', data ? 'Sesión encontrada' : 'Sin sesión');
  if (error) console.error('❌ Error auth:', error);
});

/**
 * Utilidades MTZ - VERSIÓN EMERGENCIA
 */
export const supabaseUtils = {
  
  async getClientes() {
    console.log('📊 Obteniendo clientes...');
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .order('total_facturado', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo clientes:', error);
      return [];
    }

    console.log('✅ Clientes obtenidos:', data?.length || 0);
    return data || [];
  },

  async getEstadisticasDashboard() {
    console.log('📈 Obteniendo estadísticas...');
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('total_facturado, estado, numero_facturas');

    if (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
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

    console.log('✅ Estadísticas calculadas:', {
      totalClientes,
      facturacionTotal,
      clientesActivos
    });

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
  version: 'EMERGENCIA-1.0'
};

console.log('🚀 MTZ EMERGENCIA: Cliente Supabase listo con configuración directa');

export default supabase;
