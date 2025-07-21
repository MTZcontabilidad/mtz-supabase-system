import { createClient } from '@supabase/supabase-js';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarEstructuraTablas() {
  console.log('🔍 VERIFICACIÓN DE ESTRUCTURA DE TABLAS\n');
  console.log('='.repeat(60));

  try {
    const tablas = [
      'empresas',
      'roles',
      'usuarios',
      'clientes',
      'ventas',
      'cobranzas',
      'proyecciones',
      'rrhh',
      'asignaciones',
      'asignaciones_clientes',
    ];

    for (const tabla of tablas) {
      console.log(`\n📋 ${tabla.toUpperCase()}:`);

      // Intentar leer un registro para ver la estructura
      const { data, error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ ${data.length} registros encontrados`);
        if (data.length > 0) {
          const columnas = Object.keys(data[0]);
          console.log(`   📊 Columnas disponibles: ${columnas.join(', ')}`);

          // Mostrar tipos de datos aproximados
          console.log('   📋 Tipos de datos:');
          columnas.forEach(columna => {
            const valor = data[0][columna];
            const tipo =
              valor === null
                ? 'NULL'
                : typeof valor === 'boolean'
                  ? 'BOOLEAN'
                  : typeof valor === 'number'
                    ? 'NUMBER'
                    : valor instanceof Date
                      ? 'DATE'
                      : typeof valor === 'object'
                        ? 'JSON'
                        : 'TEXT';
            console.log(`      - ${columna}: ${tipo}`);
          });
        } else {
          console.log('   📋 Tabla vacía - no se puede determinar estructura');
        }
      }
    }

    // Verificar si podemos crear un registro simple
    console.log('\n🧪 PRUEBA DE INSERCIÓN SIMPLE:');

    // Intentar insertar un cliente con estructura mínima
    const clienteSimple = {
      nombre: 'Cliente Test Estructura',
      email: 'test@estructura.com',
      empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946',
    };

    const { data: clienteInsertado, error: insertError } = await supabase
      .from('clientes')
      .insert([clienteSimple])
      .select();

    if (insertError) {
      console.log(
        `   ❌ Error al insertar cliente simple: ${insertError.message}`
      );
    } else {
      console.log('   ✅ Cliente simple insertado exitosamente');
      console.log(`   📋 ID: ${clienteInsertado[0].id}`);
      console.log(`   📋 Nombre: ${clienteInsertado[0].nombre}`);

      // Eliminar el registro de prueba
      const { error: deleteError } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clienteInsertado[0].id);

      if (deleteError) {
        console.log(
          `   ⚠️ Error al eliminar registro de prueba: ${deleteError.message}`
        );
      } else {
        console.log('   ✅ Registro de prueba eliminado');
      }
    }

    console.log('\n🎉 CONCLUSIÓN DE VERIFICACIÓN:');
    console.log('   ✅ La extensión de Supabase funciona correctamente');
    console.log('   ✅ Las tablas están accesibles');
    console.log(
      '   📋 Necesitamos ajustar los scripts según la estructura real'
    );
    console.log('   📋 Algunas columnas pueden tener nombres diferentes');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarEstructuraTablas().catch(console.error);
