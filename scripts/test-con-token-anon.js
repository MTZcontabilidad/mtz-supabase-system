import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con token anónimo
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';

// Token anónimo real del proyecto
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConTokenAnon() {
  console.log('🔍 PROBANDO CON TOKEN ANÓNIMO\n');
  console.log('='.repeat(50));

  // Verificar si el token fue reemplazado
  if (supabaseAnonKey === 'REEMPLAZA_CON_TU_TOKEN_ANONIMO') {
    console.log('❌ ERROR: No has reemplazado el token anónimo');
    console.log('📋 INSTRUCCIONES:');
    console.log('   1. Ve a Supabase Dashboard > Settings > API');
    console.log('   2. Copia el token "anon public"');
    console.log('   3. Reemplaza la línea 8 en este archivo');
    console.log('   4. Ejecuta este script nuevamente');
    return;
  }

  try {
    // 1. Probar acceso a test_mcp_simple
    console.log('\n1️⃣ PROBANDO test_mcp_simple:');

    const { data: simpleData, error: simpleError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(3);

    if (simpleError) {
      console.log(`   ❌ Error: ${simpleError.message}`);
    } else {
      console.log(`   ✅ Datos encontrados: ${simpleData.length} registros`);
      simpleData.forEach(item => {
        console.log(`      📋 ${item.nombre} (${item.descripcion})`);
      });
    }

    // 2. Probar acceso a test_mcp
    console.log('\n2️⃣ PROBANDO test_mcp:');

    const { data: mcpData, error: mcpError } = await supabase
      .from('test_mcp')
      .select('codigo, nombre, email')
      .limit(3);

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
        nombre: 'Test Token Anon',
        descripcion: 'Registro desde token anónimo',
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
        .update({ descripcion: 'Actualizado desde token anónimo' })
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

    // 4. Estado final
    console.log('\n4️⃣ ESTADO FINAL:');

    if (simpleError && mcpError) {
      console.log('   🔴 Token anónimo tampoco funciona');
      console.log('   💡 El problema es de configuración del proyecto');
      console.log('   📋 Posibles soluciones:');
      console.log('      - Verificar que RLS esté deshabilitado');
      console.log(
        '      - Verificar que las políticas permitan acceso anónimo'
      );
      console.log('      - Verificar que el proyecto esté activo');
    } else if (simpleError || mcpError) {
      console.log('   🟡 Token anónimo funciona parcialmente');
      console.log('   💡 Algunas tablas son accesibles');
    } else {
      console.log('   🟢 Token anónimo funciona perfectamente');
      console.log('   💡 El problema es específico del service role');
      console.log('   📋 Para el MCP:');
      console.log('      - Usa el token anónimo en lugar del service role');
      console.log('      - O verifica la configuración del service role');
    }
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar prueba
testConTokenAnon().catch(console.error);
