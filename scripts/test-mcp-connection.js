// Script para probar la conexión directa con Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

console.log('🔍 PROBANDO CONEXIÓN DIRECTA CON SUPABASE');
console.log('==========================================');

try {
  // Crear cliente de Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log('✅ Cliente de Supabase creado');
  console.log(`🌐 URL: ${SUPABASE_URL}`);

  // Probar consulta simple
  console.log('\n📊 Probando consulta SQL...');
  const { data, error } = await supabase.rpc('version');

  if (error) {
    console.log('❌ Error en consulta:', error.message);
  } else {
    console.log('✅ Consulta exitosa');
    console.log('📋 Resultado:', data);
  }

  // Listar tablas
  console.log('\n📋 Listando tablas...');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (tablesError) {
    console.log('❌ Error listando tablas:', tablesError.message);
  } else {
    console.log('✅ Tablas encontradas:', tables.length);
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
  }

  // Probar consulta directa
  console.log('\n🔍 Probando consulta directa...');
  const { data: testData, error: testError } = await supabase
    .from('usuarios_sistema')
    .select('*')
    .limit(1);

  if (testError) {
    console.log('❌ Error en consulta de usuarios:', testError.message);
  } else {
    console.log('✅ Consulta de usuarios exitosa');
    console.log('📊 Registros encontrados:', testData.length);
  }
} catch (error) {
  console.log('❌ Error general:', error.message);
}

console.log('\n🎯 DIAGNÓSTICO COMPLETO');
console.log('========================');
console.log('Si todas las pruebas pasaron, el problema está en Cursor MCP');
console.log('Si hay errores, el problema está en las credenciales o la BD');
