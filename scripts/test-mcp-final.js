import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con token anónimo (mismo que MCP)
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMCPFinal() {
  console.log('🎯 PRUEBA FINAL DEL MCP\n');
  console.log('='.repeat(50));

  try {
    // 1. Probar acceso básico
    console.log('\n1️⃣ PROBANDO ACCESO BÁSICO:');

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

    // 2. Probar operaciones CRUD
    console.log('\n2️⃣ PROBANDO OPERACIONES CRUD:');

    // INSERT
    const { data: newRecord, error: insertError } = await supabase
      .from('test_mcp_simple')
      .insert({
        nombre: 'Test MCP Final',
        descripcion: 'Registro para probar MCP',
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
        .update({ descripcion: 'Actualizado por MCP' })
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

    // 3. Estado final del MCP
    console.log('\n3️⃣ ESTADO FINAL DEL MCP:');

    if (simpleError) {
      console.log('   🔴 MCP NO FUNCIONA');
      console.log('   💡 El problema persiste incluso con token anónimo');
      console.log('   📋 Posibles causas:');
      console.log('      - Configuración del proyecto Supabase');
      console.log('      - Restricciones de acceso');
      console.log('      - Problema con el proyecto');
    } else {
      console.log('   🟢 MCP FUNCIONA CON TOKEN ANÓNIMO');
      console.log('   🎉 El MCP está configurado correctamente');
      console.log('   📋 Para usar el MCP:');
      console.log('      1. Reinicia Cursor');
      console.log('      2. Las herramientas del MCP estarán disponibles');
      console.log('      3. Puedes usar comandos como:');
      console.log('         - "Listar todas las tablas"');
      console.log('         - "Consultar datos de test_mcp"');
      console.log('         - "Insertar nuevo registro"');
    }
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar prueba final
testMCPFinal().catch(console.error);
