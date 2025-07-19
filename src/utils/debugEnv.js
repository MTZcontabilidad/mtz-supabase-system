// Debug script para verificar variables de entorno
export const debugEnvironment = () => {
  console.log('🔍 DEBUG: Variables de entorno');
  console.log('================================');

  // Verificar variables de Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log(
    'VITE_SUPABASE_URL:',
    supabaseUrl ? '✅ Configurada' : '❌ No configurada'
  );
  console.log(
    'VITE_SUPABASE_ANON_KEY:',
    supabaseKey ? '✅ Configurada' : '❌ No configurada'
  );

  if (supabaseUrl) {
    console.log('URL completa:', supabaseUrl);
  }

  if (supabaseKey) {
    console.log(
      'Key (primeros 20 chars):',
      supabaseKey.substring(0, 20) + '...'
    );
  }

  // Verificar otras variables
  console.log('VITE_APP_NAME:', import.meta.env.VITE_APP_NAME);
  console.log('VITE_APP_VERSION:', import.meta.env.VITE_APP_VERSION);

  // Verificar modo
  console.log('MODE:', import.meta.env.MODE);
  console.log('DEV:', import.meta.env.DEV);
  console.log('PROD:', import.meta.env.PROD);

  console.log('================================');

  return {
    supabaseUrl,
    supabaseKey,
    hasValidConfig: !!(supabaseUrl && supabaseKey),
  };
};

// Función para verificar conexión a Supabase
export const testSupabaseConnection = async supabase => {
  try {
    console.log('🔍 Probando conexión a Supabase...');

    // Intentar una consulta simple
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conexión:', error);
      return false;
    }

    console.log('✅ Conexión exitosa a Supabase');
    return true;
  } catch (err) {
    console.error('❌ Error en test de conexión:', err);
    return false;
  }
};
