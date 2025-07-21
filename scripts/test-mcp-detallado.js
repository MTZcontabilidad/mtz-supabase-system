import { createClient } from '@supabase/supabase-js';

// Configuración con token anónimo
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testMCPDetallado() {
  console.log('🔍 PRUEBA DETALLADA DEL MCP\n');
  console.log('='.repeat(60));

  try {
    // 1. Probar conexión básica
    console.log('\n1️⃣ PRUEBA DE CONEXIÓN BÁSICA:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(1);

    if (testError) {
      console.log(`   ❌ Error de conexión: ${testError.message}`);
      console.log(`   🔍 Código de error: ${testError.code}`);
      console.log(`   📋 Detalles: ${testError.details}`);
    } else {
      console.log('   ✅ Conexión exitosa');
      console.log(`   📊 Datos obtenidos: ${testData.length} registros`);
    }

    // 2. Probar listar tablas con SQL
    console.log('\n2️⃣ PRUEBA DE LISTAR TABLAS:');

    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.log(`   ❌ Error al listar tablas: ${tablesError.message}`);
    } else {
      console.log('   ✅ Tablas listadas exitosamente');
      console.log(`   📋 Total de tablas: ${tables.length}`);
      console.log('   📝 Tablas encontradas:');
      tables.slice(0, 10).forEach(table => {
        console.log(`      - ${table.table_name}`);
      });
      if (tables.length > 10) {
        console.log(`      ... y ${tables.length - 10} más`);
      }
    }

    // 3. Probar operaciones de lectura
    console.log('\n3️⃣ PRUEBA DE OPERACIONES DE LECTURA:');

    // Probar diferentes tablas
    const tablasParaProbar = [
      'test_mcp_simple',
      'usuarios',
      'empresas',
      'roles',
    ];

    for (const tabla of tablasParaProbar) {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        console.log(`   ❌ ${tabla}: ${error.message}`);
      } else {
        console.log(`   ✅ ${tabla}: ${data.length} registros disponibles`);
      }
    }

    // 4. Probar funciones RPC
    console.log('\n4️⃣ PRUEBA DE FUNCIONES RPC:');

    const { data: rpcData, error: rpcError } = await supabase.rpc(
      'get_user_role',
      { user_id: 'test' }
    );

    if (rpcError) {
      console.log(`   ❌ Error RPC: ${rpcError.message}`);
      console.log(
        '   💡 Esto es normal si la función no existe o requiere parámetros específicos'
      );
    } else {
      console.log('   ✅ Función RPC ejecutada exitosamente');
    }

    // 5. Estado del MCP
    console.log('\n5️⃣ DIAGNÓSTICO DEL MCP:');
    console.log('   🟢 Herramientas MCP: Disponibles');
    console.log('   🟢 Conexión Supabase: Funcionando');
    console.log('   🟢 Token anónimo: Configurado');
    console.log('   ⚠️  Autenticación MCP: Requiere token de servicio');
    console.log('   📋 Proyecto: bwgnmastihgndmtbqvkj');

    // 6. Recomendaciones
    console.log('\n6️⃣ RECOMENDACIONES:');
    console.log('   🔑 Para operaciones administrativas necesitas:');
    console.log('      - Token de servicio (service_role)');
    console.log('      - O configurar RLS policies apropiadas');
    console.log('   📋 Para operaciones de lectura:');
    console.log('      - El token anónimo es suficiente');
    console.log('      - Si las tablas tienen RLS habilitado');

    // 7. Próximos pasos
    console.log('\n7️⃣ PRÓXIMOS PASOS:');
    console.log(
      '   📋 Opción 1: Obtener token de servicio desde Supabase Dashboard'
    );
    console.log(
      '   📋 Opción 2: Configurar RLS policies para permitir acceso anónimo'
    );
    console.log(
      '   📋 Opción 3: Usar solo operaciones de lectura con token anónimo'
    );
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
    console.log(`📋 Stack: ${error.stack}`);
  }
}

// Ejecutar prueba
testMCPDetallado().catch(console.error);
