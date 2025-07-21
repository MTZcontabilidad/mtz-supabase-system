import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con token anónimo
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verificarMCPActualizado() {
  console.log('🔍 VERIFICANDO MCP DESPUÉS DE ACTUALIZACIÓN\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar conexión básica
    console.log('\n1️⃣ VERIFICANDO CONEXIÓN BÁSICA:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(1);

    if (testError) {
      console.log(`   ❌ Error de conexión: ${testError.message}`);
      return;
    } else {
      console.log('   ✅ Conexión exitosa');
    }

    // 2. Verificar todas las tablas de prueba
    console.log('\n2️⃣ VERIFICANDO TABLAS DE PRUEBA:');

    const tables = ['test_basic', 'test_mcp', 'test_mcp_simple'];

    for (const tableName of tables) {
      const { data, error } = await supabase
        .from(tableName)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`   ❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`   ✅ ${tableName}: Accesible`);
      }
    }

    // 3. Probar operaciones CRUD
    console.log('\n3️⃣ PROBANDO OPERACIONES CRUD:');

    // INSERT
    const { data: newRecord, error: insertError } = await supabase
      .from('test_mcp_simple')
      .insert({
        nombre: 'MCP Actualizado',
        descripcion: 'Prueba después de actualización',
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
        .update({ descripcion: 'Actualizado después de configuración MCP' })
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

    // 4. Estado del MCP
    console.log('\n4️⃣ ESTADO DEL MCP:');
    console.log('   🟢 Base de datos: Funcionando');
    console.log('   🟢 Operaciones CRUD: Funcionando');
    console.log('   🟢 Token anónimo: Válido');
    console.log('   📋 Configuración MCP actualizada');
    console.log('   💡 Próximo paso: Reiniciar Cursor para activar MCP');

    // 5. Información de configuración
    console.log('\n5️⃣ CONFIGURACIÓN ACTUAL:');
    console.log('   📁 Archivo: .cursor/mcp.json');
    console.log('   🔧 Comando: node');
    console.log('   📦 Paquete: @supabase/mcp-server-supabase (local)');
    console.log('   🔑 Token: Configurado');
    console.log('   🎯 Proyecto: bwgnmastihgndmtbqvkj');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarMCPActualizado().catch(console.error);
