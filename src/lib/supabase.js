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

// Funciones de utilidad simplificadas
export const getClientes = async () => {
  const { data, error } = await supabase
    .from('clientes_contables')
    .select('*')
    .order('total_facturado', { ascending: false });

  if (error) {
    console.error('Error obteniendo clientes:', error);
    return [];
  }

  return data || [];
};

export const buscarClientes = async termino => {
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
};

// Exportar configuración para debug
export const MTZ_CONFIG = {
  url: SUPABASE_URL,
  keyConfigured: !!SUPABASE_ANON_KEY,
  version: '1.0.0',
};

export default supabase;
