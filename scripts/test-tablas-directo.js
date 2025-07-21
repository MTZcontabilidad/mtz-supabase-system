import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTablasDirecto() {
  console.log('🧪 PROBANDO TABLAS DIRECTAMENTE\n');
  console.log('='.repeat(50));

  try {
    // 1. Probar test_mcp_simple directamente
    console.log('\n1️⃣ PROBANDO test_mcp_simple:');

    const { data: simpleData, error: simpleError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(5);

    if (simpleError) {
      console.log(`   ❌ Error: ${simpleError.message}`);
    } else {
      console.log(`   ✅ Datos encontrados: ${simpleData.length} registros`);
      simpleData.forEach(item => {
        console.log(`      📋 ${item.nombre} (${item.descripcion})`);
      });
    }

    // 2. Probar test_mcp directamente
    console.log('\n2️⃣ PROBANDO test_mcp:');

    const { data: mcpData, error: mcpError } = await supabase
      .from('test_mcp')
      .select('codigo, nombre, email, estado')
      .limit(5);

    if (mcpError) {
      console.log(`   ❌ Error: ${mcpError.message}`);
    } else {
      console.log(`   ✅ Datos encontrados: ${mcpData.length} registros`);
      mcpData.forEach(item => {
        console.log(`      👤 ${item.codigo}: ${item.nombre} (${item.email})`);
      });
    }

    // 3. Probar operaciones CRUD
    console.log('\n3️⃣ PROBANDO OPERACIONES CRUD:');

    // INSERT
    const { data: newRecord, error: insertError } = await supabase
      .from('test_mcp_simple')
      .insert({
        nombre: 'Test desde JavaScript',
        descripcion: 'Registro creado desde el cliente',
      })
      .select()
      .single();

    if (insertError) {
      console.log(`   ❌ Error al insertar: ${insertError.message}`);
    } else {
      console.log(`   ✅ Insertado: ${newRecord.nombre} (ID: ${newRecord.id})`);

      // UPDATE
      const { data: updatedRecord, error: updateError } = await supabase
        .from('test_mcp_simple')
        .update({ descripcion: 'Registro actualizado desde JavaScript' })
        .eq('id', newRecord.id)
        .select()
        .single();

      if (updateError) {
        console.log(`   ❌ Error al actualizar: ${updateError.message}`);
      } else {
        console.log(`   ✅ Actualizado: ${updatedRecord.descripcion}`);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from('test_mcp_simple')
        .delete()
        .eq('id', newRecord.id);

      if (deleteError) {
        console.log(`   ❌ Error al eliminar: ${deleteError.message}`);
      } else {
        console.log(`   ✅ Eliminado: Registro ID ${newRecord.id}`);
      }
    }

    // 4. Probar función de estadísticas
    console.log('\n4️⃣ PROBANDO FUNCIÓN get_test_stats:');

    const { data: stats, error: statsError } =
      await supabase.rpc('get_test_stats');

    if (statsError) {
      console.log(`   ❌ Error: ${statsError.message}`);
    } else {
      console.log(`   ✅ Estadísticas obtenidas:`);
      stats.forEach(stat => {
        console.log(
          `      📊 ${stat.tabla_nombre}: ${stat.total_registros} registros`
        );
      });
    }

    // 5. Estado final
    console.log('\n5️⃣ ESTADO FINAL:');

    if (simpleError && mcpError) {
      console.log('   🔴 PROBLEMA: No se puede acceder a las tablas');
      console.log('   💡 Posibles causas:');
      console.log('      - RLS (Row Level Security) está bloqueando el acceso');
      console.log('      - Las políticas no están configuradas correctamente');
      console.log('      - El token no tiene permisos suficientes');
    } else if (simpleError || mcpError) {
      console.log('   🟡 PROBLEMA PARCIAL: Algunas tablas funcionan');
    } else {
      console.log('   🟢 TODO FUNCIONA: Las tablas están accesibles');
      console.log('   🎉 El MCP debería funcionar correctamente');
    }
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar prueba
testTablasDirecto().catch(console.error);
