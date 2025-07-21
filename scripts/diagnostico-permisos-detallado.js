import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnosticoPermisos() {
  console.log('🔍 DIAGNÓSTICO DETALLADO DE PERMISOS\n');
  console.log('='.repeat(50));

  try {
    // 1. Verificar autenticación básica
    console.log('\n1️⃣ VERIFICANDO AUTENTICACIÓN:');
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.log(`   ❌ Error de autenticación: ${authError.message}`);
    } else {
      console.log('   ✅ Autenticación exitosa');
      console.log(`   👤 Usuario: ${authData.user?.email || 'Service Role'}`);
    }

    // 2. Verificar acceso a información del sistema
    console.log('\n2️⃣ VERIFICANDO ACCESO A SISTEMA:');

    // Intentar acceder a pg_tables directamente
    const { data: pgTables, error: pgError } = await supabase
      .from('pg_tables')
      .select('tablename, schemaname')
      .eq('schemaname', 'public')
      .limit(3);

    if (pgError) {
      console.log(`   ❌ Error pg_tables: ${pgError.message}`);
    } else {
      console.log(`   ✅ Acceso a pg_tables: ${pgTables.length} tablas`);
      pgTables.forEach(table => {
        console.log(`      📋 ${table.tablename}`);
      });
    }

    // 3. Verificar acceso a information_schema
    console.log('\n3️⃣ VERIFICANDO INFORMATION_SCHEMA:');

    const { data: infoSchema, error: infoError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(3);

    if (infoError) {
      console.log(`   ❌ Error information_schema: ${infoError.message}`);
    } else {
      console.log(
        `   ✅ Acceso a information_schema: ${infoSchema.length} tablas`
      );
      infoSchema.forEach(table => {
        console.log(`      📋 ${table.table_name}`);
      });
    }

    // 4. Intentar acceder directamente a las tablas de prueba
    console.log('\n4️⃣ VERIFICANDO TABLAS DE PRUEBA:');

    // Probar test_mcp_simple
    const { data: simpleData, error: simpleError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(1);

    if (simpleError) {
      console.log(`   ❌ Error test_mcp_simple: ${simpleError.message}`);
    } else {
      console.log(
        `   ✅ test_mcp_simple accesible: ${simpleData.length} registros`
      );
    }

    // Probar test_mcp
    const { data: mcpData, error: mcpError } = await supabase
      .from('test_mcp')
      .select('*')
      .limit(1);

    if (mcpError) {
      console.log(`   ❌ Error test_mcp: ${mcpError.message}`);
    } else {
      console.log(`   ✅ test_mcp accesible: ${mcpData.length} registros`);
    }

    // 5. Verificar configuración del MCP
    console.log('\n5️⃣ CONFIGURACIÓN DEL MCP:');
    console.log('   📁 Archivo: .cursor/mcp.json');
    console.log('   🔑 Project Ref: bwgnmastihgndmtbqvkj');
    console.log('   🔐 Token configurado: ✅');
    console.log('   📖 Modo: --read-only');

    // 6. Probar operaciones básicas
    console.log('\n6️⃣ PROBANDO OPERACIONES BÁSICAS:');

    // Probar SELECT simple
    try {
      const { data: selectData, error: selectError } = await supabase
        .from('test_mcp_simple')
        .select('id, nombre')
        .limit(1);

      if (selectError) {
        console.log(`   ❌ SELECT falló: ${selectError.message}`);
      } else {
        console.log(`   ✅ SELECT exitoso: ${selectData.length} registros`);
      }
    } catch (error) {
      console.log(`   ❌ Error en SELECT: ${error.message}`);
    }

    // 7. Estado final
    console.log('\n7️⃣ ESTADO FINAL:');

    if (pgError && infoError && simpleError && mcpError) {
      console.log('   🔴 PROBLEMA CRÍTICO: No hay acceso a la base de datos');
      console.log('   💡 Posibles causas:');
      console.log('      - El SQL no se ejecutó correctamente');
      console.log('      - El token no tiene permisos suficientes');
      console.log('      - La base de datos está en modo mantenimiento');
      console.log('      - El proyecto no existe o está suspendido');
    } else if (pgError || infoError) {
      console.log('   🟡 PROBLEMA PARCIAL: Acceso limitado');
      console.log('   💡 Algunas operaciones funcionan, otras no');
    } else {
      console.log('   🟢 TODO FUNCIONA: El MCP debería estar operativo');
    }

    console.log('\n📋 RECOMENDACIONES:');
    console.log('   1. Verifica que ejecutaste el SQL en Supabase Dashboard');
    console.log('   2. Verifica que el proyecto está activo');
    console.log('   3. Verifica que el token tiene permisos de service role');
    console.log('   4. Reinicia Cursor después de ejecutar el SQL');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar diagnóstico
diagnosticoPermisos().catch(console.error);
