import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con credenciales reales
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener la estructura de una tabla
async function getTableStructure(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ Error obteniendo estructura de ${tableName}:`, error.message);
      return null;
    }

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`📋 Estructura de ${tableName}:`);
      console.log(`   Columnas: ${columns.join(', ')}`);
      return columns;
    } else {
      console.log(`📋 Tabla ${tableName} está vacía`);
      return [];
    }
  } catch (error) {
    console.log(`❌ Error verificando ${tableName}:`, error.message);
    return null;
  }
}

// Función para obtener datos de una tabla
async function getTableData(tableName, limit = 3) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(limit);

    if (error) {
      console.log(`❌ Error obteniendo datos de ${tableName}:`, error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.log(`❌ Error obteniendo datos de ${tableName}:`, error.message);
    return null;
  }
}

// Función principal
async function verificarEstructura() {
  console.log('🔍 Verificando estructura de tablas en Supabase...\n');

  const tables = [
    'clientes',
    'cobranzas',
    'rrhh',
    'nominas'
  ];

  for (const table of tables) {
    console.log(`\n📊 TABLA: ${table.toUpperCase()}`);
    console.log('='.repeat(50));

    const structure = await getTableStructure(table);
    if (structure) {
      const data = await getTableData(table, 2);
      if (data && data.length > 0) {
        console.log(`📝 Datos de ejemplo:`);
        console.log(JSON.stringify(data[0], null, 2));
      }
    }
  }

  console.log('\n🎉 Verificación de estructura completada!');
}

// Ejecutar verificación
verificarEstructura().catch(console.error);
