import { createClient } from '@supabase/supabase-js';

// =====================================================================
// 🚀 CLIENTE SUPABASE UNIFICADO - SISTEMA MTZ v3.0
// =====================================================================

import { MTZ_CONFIG } from './config.js';

// Configuración desde configuración global
const SUPABASE_URL =
  MTZ_CONFIG.supabase.url || 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  MTZ_CONFIG.supabase.anonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9Wdd';

// Validación de configuración
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '⚠️ ADVERTENCIA: Variables de entorno de Supabase no configuradas'
  );
  console.warn('Usando valores por defecto para desarrollo');
}

// Cliente Supabase optimizado
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'mtz-auth-token',
  },
  global: {
    headers: {
      'X-Client-Info': 'mtz-system@3.0.0',
    },
  },
});

// =====================================================================
// 🔧 FUNCIONES DE UTILIDAD UNIFICADAS
// =====================================================================

/**
 * Verificar conexión con Supabase
 */
export const testConnection = async () => {
  try {
    console.log('🔍 Verificando conexión con Supabase...');

    const { data, error } = await supabase
      .from('empresas')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Conexión exitosa con Supabase');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error en prueba de conexión:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Obtener clientes/empresas con mapeo de compatibilidad
 */
export const getClientes = async () => {
  try {
    console.log('🔄 Cargando clientes desde Supabase...');

    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('❌ Error obteniendo empresas:', error);
      throw error;
    }

    // Mapeo de compatibilidad para mantener consistencia
    const clientesProcesados = (data || []).map((cliente, index) => ({
      ...cliente,
      id_cliente: cliente.id,
      razon_social: cliente.nombre,
      categoria_cliente: cliente.categoria_cliente || 'Regular',
      estado: cliente.estado || 'activo',
      posicion: index + 1,
      total_facturado: parseFloat(cliente.total_facturado || 0),
    }));

    console.log(
      `✅ ${clientesProcesados.length} empresas cargadas exitosamente`
    );
    return clientesProcesados;
  } catch (err) {
    console.error('❌ Error en getClientes:', err);
    throw err;
  }
};

/**
 * Búsqueda inteligente de clientes
 */
export const buscarClientes = async termino => {
  if (!termino?.trim()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .or(
        `nombre.ilike.%${termino}%,ruc.ilike.%${termino}%,giro.ilike.%${termino}%`
      )
      .order('id', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error buscando clientes:', error);
      return [];
    }

    // Mapeo de compatibilidad
    const resultadosProcesados = (data || []).map(cliente => ({
      ...cliente,
      id_cliente: cliente.id,
      razon_social: cliente.nombre,
      categoria_cliente: cliente.categoria_cliente || 'Regular',
      estado: cliente.estado || 'activo',
    }));

    return resultadosProcesados;
  } catch (err) {
    console.error('Error en búsqueda:', err);
    return [];
  }
};

/**
 * Verificar estado del sistema
 */
export const getSystemStatus = async () => {
  try {
    const connectionTest = await testConnection();
    const clientes = await getClientes();

    const clientesActivos = clientes.filter(c => c.estado === 'activo');
    const facturacionTotal = clientesActivos.reduce(
      (sum, c) => sum + c.total_facturado,
      0
    );

    return {
      timestamp: new Date().toISOString(),
      connection: connectionTest.success,
      kpis: {
        clientes_activos: clientesActivos.length,
        facturacion_total: Math.round(facturacionTotal),
        ticket_promedio:
          clientesActivos.length > 0
            ? Math.round(facturacionTotal / clientesActivos.length)
            : 0,
      },
      top_clientes: clientesActivos
        .sort((a, b) => b.total_facturado - a.total_facturado)
        .slice(0, 10),
      proyecciones_2025: {
        facturacion_actual: facturacionTotal,
        meta_anual_2025: Math.round(facturacionTotal * 1.3),
      },
    };
  } catch (err) {
    console.error('Error obteniendo estado del sistema:', err);
    return {
      timestamp: new Date().toISOString(),
      connection: false,
      error: err.message,
    };
  }
};

// =====================================================================
// 📊 CONFIGURACIÓN Y EXPORTACIONES
// =====================================================================

// Configuración específica de Supabase
export const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  keyConfigured: !!SUPABASE_ANON_KEY,
  keyLength: SUPABASE_ANON_KEY?.length || 0,
  version: MTZ_CONFIG.version,
  environment: MTZ_CONFIG.environment,
};

// Exportar configuración para debug
console.log('🔍 CONFIGURACIÓN SUPABASE:', {
  url: SUPABASE_URL ? '✅ Configurada' : '❌ No configurada',
  key: SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada',
  keyLength: SUPABASE_ANON_KEY?.length || 0,
  version: SUPABASE_CONFIG.version,
});

export default supabase;
