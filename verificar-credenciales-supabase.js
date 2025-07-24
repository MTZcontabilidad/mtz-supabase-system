// Script para verificar las credenciales de Supabase
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Verificando credenciales de Supabase...\n');

// Credenciales proporcionadas
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyNDgyNzksImV4cCI6MjAzNjgyNDI3OX0.g1yKFklbTKzOHuiYV5gHU3ZzjczZJu8FOvQc1CEA2rA';

console.log('📋 Credenciales a verificar:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 50)}...`);
console.log('');

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
      'x-application-name': 'MTZ-Sistema-v3.0-Verificacion'
    }
  }
});

async function verificarConexion() {
  try {
    console.log('🔗 Probando conexión con Supabase...');

    // Probar conexión básica
    const { data, error } = await supabase.from('clientes').select('count').limit(1);

    if (error) {
      console.log('❌ Error de conexión:');
      console.log(`   Código: ${error.code}`);
      console.log(`   Mensaje: ${error.message}`);
      console.log(`   Detalles: ${error.details}`);

      if (error.code === 'PGRST116') {
        console.log('⚠️ La tabla "clientes" no existe, pero la conexión funciona');
        return true;
      }

      return false;
    }

    console.log('✅ Conexión exitosa con Supabase');
    console.log(`   Datos recibidos: ${JSON.stringify(data)}`);
    return true;

  } catch (err) {
    console.log('❌ Error inesperado:');
    console.log(`   ${err.message}`);
    return false;
  }
}

async function verificarTablas() {
  console.log('\n📊 Verificando tablas disponibles...');

  const tablas = ['clientes', 'rrhh', 'nominas', 'cobranzas', 'ventas', 'compras'];

  for (const tabla of tablas) {
    try {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`   ❌ ${tabla}: No existe`);
        } else {
          console.log(`   ⚠️ ${tabla}: Error - ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${tabla}: Existe (${data.length} registros de muestra)`);
      }
    } catch (err) {
      console.log(`   ❌ ${tabla}: Error - ${err.message}`);
    }
  }
}

async function verificarAutenticacion() {
  console.log('\n🔐 Verificando autenticación...');

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log(`   ⚠️ Error de autenticación: ${error.message}`);
    } else {
      console.log('   ✅ Autenticación configurada correctamente');
      console.log(`   Estado de sesión: ${data.session ? 'Activa' : 'Sin sesión'}`);
    }
  } catch (err) {
    console.log(`   ❌ Error de autenticación: ${err.message}`);
  }
}

async function main() {
  console.log('🚀 Iniciando verificación completa...\n');

  // Verificar conexión
  const conexionExitosa = await verificarConexion();

  if (conexionExitosa) {
    // Verificar tablas
    await verificarTablas();

    // Verificar autenticación
    await verificarAutenticacion();

    console.log('\n🎉 VERIFICACIÓN COMPLETADA');
    console.log('✅ Las credenciales de Supabase son válidas');
    console.log('✅ La conexión funciona correctamente');
    console.log('✅ Vercel puede usar estas variables de entorno');

    console.log('\n📋 Resumen para Vercel:');
    console.log('   VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co');
    console.log('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyNDgyNzksImV4cCI6MjAzNjgyNDI3OX0.g1yKFklbTKzOHuiYV5gHU3ZzjczZJu8FOvQc1CEA2rA');

  } else {
    console.log('\n❌ VERIFICACIÓN FALLIDA');
    console.log('Las credenciales no son válidas o hay un problema de conexión');
  }
}

main().catch(console.error);
