// =====================================================================
// 🔧 SCRIPT DE CONFIGURACIÓN DE ENTORNO - SISTEMA MTZ
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://bwgnmastiHgndmtbqvkj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('🔍 Probando conexión con Supabase...');

  try {
    // Probar conexión básica
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return false;
    }

    console.log('✅ Conexión exitosa con Supabase');
    return true;
  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    return false;
  }
}

async function createEnvFile() {
  console.log('📝 Creando archivo de entorno...');

  const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}
VITE_GA_TRACKING_ID=
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Archivo .env.local creado exitosamente');
    return true;
  } catch (err) {
    console.error('❌ Error creando archivo .env.local:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Configurando entorno del Sistema MTZ...\n');

  // Probar conexión
  const connectionOk = await testSupabaseConnection();

  if (!connectionOk) {
    console.log(
      '\n⚠️ La conexión con Supabase falló. Verificando configuración...'
    );
  }

  // Crear archivo de entorno
  const envCreated = await createEnvFile();

  if (envCreated) {
    console.log('\n📋 Variables de entorno configuradas:');
    console.log(`   VITE_SUPABASE_URL: ${supabaseUrl}`);
    console.log(
      `   VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 20)}...`
    );
    console.log('   VITE_GA_TRACKING_ID: (vacío)');
  }

  console.log('\n🎯 Próximos pasos:');
  console.log('1. Reinicia el servidor de desarrollo: npm run dev');
  console.log('2. Prueba el login con las credenciales de prueba');
  console.log('3. Verifica que la aplicación funcione correctamente');

  console.log('\n✅ Configuración completada');
}

main().catch(console.error);
