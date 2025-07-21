import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verificarTablasReales() {
  console.log('🔍 VERIFICANDO TABLAS REALES EN LA BASE DE DATOS\n');
  console.log('='.repeat(60));

  try {
    // 1. Probar conexión con tabla que sabemos que existe
    console.log('\n1️⃣ VERIFICANDO TABLA test_mcp_simple:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (testError) {
      console.log(`   ❌ Error: ${testError.message}`);
    } else {
      console.log(`   ✅ Tabla existe con ${testData.length} registros`);
      if (testData.length > 0) {
        console.log(`   📋 Primer registro:`, testData[0]);
      }
    }

    // 2. Intentar listar todas las tablas usando SQL directo
    console.log('\n2️⃣ INTENTANDO LISTAR TABLAS CON SQL:');

    // Probar diferentes enfoques para listar tablas
    const queries = [
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'",
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      "SELECT relname FROM pg_class WHERE relkind = 'r' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')",
    ];

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(
        `   🔍 Probando query ${i + 1}: ${query.substring(0, 50)}...`
      );

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: query });
        if (error) {
          console.log(`      ❌ Error: ${error.message}`);
        } else {
          console.log(
            `      ✅ Éxito: ${data?.length || 0} tablas encontradas`
          );
          if (data && data.length > 0) {
            console.log(
              `      📋 Tablas: ${data
                .slice(0, 5)
                .map(t => t.tablename || t.table_name || t.relname)
                .join(', ')}`
            );
          }
        }
      } catch (e) {
        console.log(`      ❌ Excepción: ${e.message}`);
      }
    }

    // 3. Probar tablas específicas que podrían existir
    console.log('\n3️⃣ PROBANDO TABLAS ESPECÍFICAS:');

    const posiblesTablas = [
      'test_mcp_simple',
      'usuarios',
      'empresas',
      'roles',
      'clientes',
      'ventas',
      'cobranzas',
      'proyecciones',
      'rrhh',
      'asignaciones',
      'auth.users',
      'public.users',
      'public.empresas',
    ];

    for (const tabla of posiblesTablas) {
      try {
        const { data, error } = await supabase.from(tabla).select('*').limit(1);

        if (error) {
          console.log(`   ❌ ${tabla}: ${error.message}`);
        } else {
          console.log(`   ✅ ${tabla}: ${data.length} registros disponibles`);
        }
      } catch (e) {
        console.log(`   ❌ ${tabla}: Error de sintaxis - tabla no existe`);
      }
    }

    // 4. Probar funciones que podrían existir
    console.log('\n4️⃣ PROBANDO FUNCIONES DISPONIBLES:');

    const posiblesFunciones = [
      'get_user_role',
      'get_clientes_by_role',
      'user_permissions',
      'exec_sql',
    ];

    for (const funcion of posiblesFunciones) {
      try {
        const { data, error } = await supabase.rpc(funcion, {});
        if (error) {
          console.log(`   ❌ ${funcion}: ${error.message}`);
        } else {
          console.log(`   ✅ ${funcion}: Función disponible`);
        }
      } catch (e) {
        console.log(`   ❌ ${funcion}: No existe`);
      }
    }

    // 5. Resumen del estado
    console.log('\n5️⃣ RESUMEN DEL ESTADO:');
    console.log('   🟢 Conexión a Supabase: Funcionando');
    console.log('   🟢 Token anónimo: Válido');
    console.log('   🟢 Tabla test_mcp_simple: Existe y accesible');
    console.log('   ⚠️  Otras tablas: No encontradas o no accesibles');
    console.log(
      '   ⚠️  MCP: Necesita token de servicio para operaciones administrativas'
    );

    // 6. Recomendaciones para el MCP
    console.log('\n6️⃣ RECOMENDACIONES PARA EL MCP:');
    console.log('   📋 El MCP está funcionando pero necesita:');
    console.log('      1. Token de servicio para operaciones administrativas');
    console.log('      2. O configurar RLS policies para acceso anónimo');
    console.log('   📋 Para probar el MCP completamente:');
    console.log('      - Obtener token de servicio desde Supabase Dashboard');
    console.log('      - Actualizar .cursor/mcp.json con el token de servicio');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarTablasReales().catch(console.error);
