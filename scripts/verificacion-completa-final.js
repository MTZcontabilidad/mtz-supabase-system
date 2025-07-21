import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con token anónimo
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verificacionCompletaFinal() {
  console.log('🎯 VERIFICACIÓN COMPLETA FINAL DEL SISTEMA\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar todas las tablas
    console.log('\n1️⃣ VERIFICANDO TABLAS CREADAS:');

    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['test_basic', 'test_mcp', 'test_mcp_simple']);

    if (tablesError) {
      console.log(`   ❌ Error al verificar tablas: ${tablesError.message}`);
    } else {
      console.log(`   ✅ Tablas encontradas: ${tables.length}`);
      tables.forEach(table => {
        console.log(`      📋 ${table.table_name}`);
      });
    }

    // 2. Verificar datos en cada tabla
    console.log('\n2️⃣ VERIFICANDO DATOS EN CADA TABLA:');

    // test_basic
    const { data: basicData, error: basicError } = await supabase
      .from('test_basic')
      .select('*');

    if (basicError) {
      console.log(`   ❌ Error en test_basic: ${basicError.message}`);
    } else {
      console.log(`   ✅ test_basic: ${basicData.length} registros`);
    }

    // test_mcp_simple
    const { data: simpleData, error: simpleError } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (simpleError) {
      console.log(`   ❌ Error en test_mcp_simple: ${simpleError.message}`);
    } else {
      console.log(`   ✅ test_mcp_simple: ${simpleData.length} registros`);
    }

    // test_mcp
    const { data: mcpData, error: mcpError } = await supabase
      .from('test_mcp')
      .select('*');

    if (mcpError) {
      console.log(`   ❌ Error en test_mcp: ${mcpError.message}`);
    } else {
      console.log(`   ✅ test_mcp: ${mcpData.length} registros`);
    }

    // 3. Probar operaciones CRUD completas
    console.log('\n3️⃣ PROBANDO OPERACIONES CRUD COMPLETAS:');

    // INSERT
    const { data: newRecord, error: insertError } = await supabase
      .from('test_mcp_simple')
      .insert({
        nombre: 'Verificación Final',
        descripcion: 'Registro de verificación completa',
      })
      .select()
      .single();

    if (insertError) {
      console.log(`   ❌ Error al insertar: ${insertError.message}`);
    } else {
      console.log(`   ✅ INSERT: ${newRecord.nombre} (ID: ${newRecord.id})`);

      // UPDATE
      const { data: updatedRecord, error: updateError } = await supabase
        .from('test_mcp_simple')
        .update({ descripcion: 'Actualizado en verificación final' })
        .eq('id', newRecord.id)
        .select()
        .single();

      if (updateError) {
        console.log(`   ❌ Error al actualizar: ${updateError.message}`);
      } else {
        console.log(`   ✅ UPDATE: ${updatedRecord.descripcion}`);
      }

      // DELETE
      const { error: deleteError } = await supabase
        .from('test_mcp_simple')
        .delete()
        .eq('id', newRecord.id);

      if (deleteError) {
        console.log(`   ❌ Error al eliminar: ${deleteError.message}`);
      } else {
        console.log(`   ✅ DELETE: Registro ID ${newRecord.id} eliminado`);
      }
    }

    // 4. Estado final del sistema
    console.log('\n4️⃣ ESTADO FINAL DEL SISTEMA:');

    if (basicError || simpleError || mcpError || insertError) {
      console.log('   🔴 SISTEMA CON PROBLEMAS');
      console.log('   💡 Revisar configuración de permisos');
    } else {
      console.log('   🟢 SISTEMA FUNCIONANDO PERFECTAMENTE');
      console.log('   🎉 MCP listo para usar');
      console.log('   📋 Próximos pasos:');
      console.log('      1. Reiniciar Cursor');
      console.log('      2. Usar herramientas del MCP');
      console.log('      3. Crear tablas del sistema MTZ');
    }

    // 5. Resumen de datos disponibles
    console.log('\n5️⃣ RESUMEN DE DATOS DISPONIBLES:');
    console.log(`   📊 test_basic: ${basicData?.length || 0} registros`);
    console.log(`   📊 test_mcp_simple: ${simpleData?.length || 0} registros`);
    console.log(`   📊 test_mcp: ${mcpData?.length || 0} registros`);
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación completa
verificacionCompletaFinal().catch(console.error);
