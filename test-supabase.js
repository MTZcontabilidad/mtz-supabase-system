import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

console.log('🔍 PRUEBA DIRECTA DE SUPABASE');
console.log('==============================');
console.log('URL:', SUPABASE_URL);
console.log('Key length:', SUPABASE_ANON_KEY.length);
console.log('Key starts with:', SUPABASE_ANON_KEY.substring(0, 50) + '...');
console.log('');

// Crear cliente
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('🔄 Probando conexión...');

    // Probar una consulta simple
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error:', error);
      return false;
    }

    console.log('✅ Conexión exitosa');
    console.log('Data:', data);
    return true;
  } catch (err) {
    console.error('❌ Error en conexión:', err);
    return false;
  }
}

async function testTables() {
  const tables = ['clientes_contables', 'usuarios_sistema', 'roles'];

  for (const table of tables) {
    try {
      console.log(`🔍 Probando tabla: ${table}`);
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        console.error(`❌ Error en ${table}:`, error);
      } else {
        console.log(`✅ ${table} accesible, registros: ${data?.length || 0}`);
      }
    } catch (err) {
      console.error(`❌ Error probando ${table}:`, err);
    }
  }
}

// Ejecutar pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas...\n');

  const connectionOk = await testConnection();

  if (connectionOk) {
    console.log('\n📊 Probando tablas...\n');
    await testTables();
  }

  console.log('\n🏁 Pruebas completadas');
}

runTests();
