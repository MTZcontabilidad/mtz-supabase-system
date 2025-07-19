// 🔍 Script de verificación de variables de entorno
export const verifyEnvironment = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
  };

  console.log('🔍 VERIFICACIÓN DE VARIABLES DE ENTORNO:');
  console.log('==========================================');

  Object.entries(envVars).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    const displayValue =
      key.includes('KEY') && value
        ? value.substring(0, 20) + '...'
        : value || 'NO DEFINIDA';

    console.log(`${status} ${key}: ${displayValue}`);
  });

  console.log('==========================================');

  // Verificar configuración crítica
  const criticalChecks = {
    supabaseUrl: !!envVars.VITE_SUPABASE_URL,
    supabaseKey: !!envVars.VITE_SUPABASE_ANON_KEY,
    appName: !!envVars.VITE_APP_NAME,
    environment: !!envVars.NODE_ENV,
  };

  const allCritical = Object.values(criticalChecks).every(Boolean);

  console.log(
    `🎯 CONFIGURACIÓN CRÍTICA: ${allCritical ? '✅ COMPLETA' : '❌ INCOMPLETA'}`
  );

  return {
    envVars,
    criticalChecks,
    allCritical,
  };
};

export default verifyEnvironment;
