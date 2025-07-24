import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase usando variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  console.error('Asegúrate de crear un archivo .env.local con las credenciales');
  throw new Error('Configuración de Supabase incompleta');
}

// Configuración optimizada del cliente
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'MTZ-Sistema-v3.0'
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);

export default supabase;
