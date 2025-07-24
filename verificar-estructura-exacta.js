import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con credenciales reales
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener la estructura exacta de una tabla
async function getTableSchema(tableName) {
  try {
    // Intentar obtener información del esquema usando SQL
    const { data, error } = await supabase.rpc('get_table_schema', { table_name: tableName });

    if (error) {
      console.log(`❌ Error obteniendo esquema de ${tableName}:`, error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.log(`❌ Error obteniendo esquema de ${tableName}:`, error.message);
    return null;
  }
}

// Función para obtener datos de ejemplo de una tabla
async function getSampleData(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ Error obteniendo datos de ${tableName}:`, error.message);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.log(`❌ Error obteniendo datos de ${tableName}:`, error.message);
    return null;
  }
}

// Función para insertar un registro de prueba simple
async function insertTestRecord(tableName, testData) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert([testData])
      .select();

    if (error) {
      console.log(`❌ Error insertando en ${tableName}:`, error.message);
      return false;
    }

    console.log(`✅ Registro insertado en ${tableName}:`, data[0]);
    return true;
  } catch (error) {
    console.log(`❌ Error insertando en ${tableName}:`, error.message);
    return false;
  }
}

// Función principal
async function verificarEstructuraExacta() {
  console.log('🔍 Verificando estructura exacta de tablas...\n');

  const tables = ['rrhh', 'cobranzas'];

  for (const table of tables) {
    console.log(`\n📊 TABLA: ${table.toUpperCase()}`);
    console.log('='.repeat(50));

    // Obtener datos de ejemplo
    const sampleData = await getSampleData(table);

    if (sampleData) {
      console.log('📋 Estructura actual:');
      console.log(JSON.stringify(sampleData, null, 2));

      // Intentar insertar un registro de prueba
      console.log(`\n🧪 Probando inserción en ${table}...`);

      if (table === 'rrhh') {
        const testData = {
          nombre: 'Test User',
          email: 'test@example.com',
          departamento: 'Test',
          cargo: 'Test',
          fecha_ingreso: '2024-01-01',
          salario_base: 1000000,
          estado: 'activo'
        };
        await insertTestRecord(table, testData);
      } else if (table === 'cobranzas') {
        const testData = {
          numero_factura: 'TEST-001',
          descripcion: 'Test cobranza',
          monto_total: 100000,
          monto_pagado: 0,
          monto_pendiente: 100000,
          estado: 'Pendiente',
          fecha_emision: '2024-01-01',
          fecha_vencimiento: '2024-02-01',
          forma_pago: 'Transferencia',
          dias_vencimiento: 30
        };
        await insertTestRecord(table, testData);
      }
    } else {
      console.log(`📋 Tabla ${table} está vacía o no existe`);
    }
  }

  console.log('\n🎉 Verificación de estructura completada!');
}

// Ejecutar verificación
verificarEstructuraExacta().catch(console.error);
