import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTableStructure() {
  console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLA');
  console.log('===================================');

  try {
    // Intentar obtener un registro para ver la estructura
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error obteniendo estructura:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Estructura de la tabla:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('📋 Tabla vacía, verificando columnas...');

      // Intentar insertar un registro mínimo para ver qué columnas existen
      const testRecord = {
        id_cliente: 'TEST001',
        razon_social: 'Test Company',
        rut: '12.345.678-9',
        total_facturado: '1000000',
      };

      const { data: insertData, error: insertError } = await supabase
        .from('clientes_contables')
        .insert(testRecord)
        .select();

      if (insertError) {
        console.error('❌ Error en inserción de prueba:', insertError);

        // Intentar con menos campos
        const minimalRecord = {
          id_cliente: 'TEST002',
          razon_social: 'Test Company 2',
        };

        const { data: minimalData, error: minimalError } = await supabase
          .from('clientes_contables')
          .insert(minimalRecord)
          .select();

        if (minimalError) {
          console.error('❌ Error con registro mínimo:', minimalError);
        } else {
          console.log('✅ Registro mínimo insertado:', minimalData);
        }
      } else {
        console.log('✅ Registro de prueba insertado:', insertData);
      }
    }
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

checkTableStructure();
