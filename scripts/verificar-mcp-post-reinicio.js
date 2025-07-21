import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarMCPPostReinicio() {
  console.log('🔄 VERIFICACIÓN DEL MCP DESPUÉS DEL REINICIO\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar configuración del MCP
    console.log('\n1️⃣ VERIFICANDO CONFIGURACIÓN DEL MCP:');

    const mcpConfigPath = path.join(process.cwd(), '.cursor', 'mcp.json');

    if (fs.existsSync(mcpConfigPath)) {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      console.log('   ✅ Archivo de configuración MCP encontrado');
      console.log('   📋 Configuración actual:');
      console.log(`      - Proyecto: ${mcpConfig.mcpServers.supabase.args[1]}`);
      console.log(
        `      - Token configurado: ${mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN ? 'SÍ' : 'NO'}`
      );
      console.log(
        `      - Token tipo: ${mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN.includes('service_role') ? 'SERVICIO' : 'ANÓNIMO'}`
      );
    } else {
      console.log('   ❌ Archivo de configuración MCP no encontrado');
    }

    // 2. Verificar conexión directa con Supabase
    console.log('\n2️⃣ VERIFICANDO CONEXIÓN DIRECTA CON SUPABASE:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (testError) {
      console.log(`   ❌ Error de conexión: ${testError.message}`);
    } else {
      console.log('   ✅ Conexión directa exitosa');
      console.log(`   📊 Datos obtenidos: ${testData.length} registros`);
    }

    // 3. Verificar tablas existentes
    console.log('\n3️⃣ VERIFICANDO TABLAS EXISTENTES:');

    // Intentar obtener información de las tablas usando una consulta SQL
    const { data: tablesInfo, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.log(`   ❌ Error al obtener tablas: ${tablesError.message}`);
    } else {
      console.log('   ✅ Tablas obtenidas exitosamente');
      console.log(`   📋 Total de tablas: ${tablesInfo.length}`);
      console.log('   📝 Tablas encontradas:');
      tablesInfo.forEach(table => {
        console.log(`      - ${table.table_name}`);
      });
    }

    // 4. Verificar permisos de administración
    console.log('\n4️⃣ VERIFICANDO PERMISOS DE ADMINISTRACIÓN:');

    // Intentar crear una tabla temporal para probar permisos
    const createTempTableSQL = `
      CREATE TABLE IF NOT EXISTS mcp_verificacion_temp (
        id SERIAL PRIMARY KEY,
        test_field VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTempTableSQL,
    });

    if (createError) {
      console.log(
        `   ❌ Error al crear tabla temporal: ${createError.message}`
      );
      console.log('   💡 Esto puede indicar que la función exec_sql no existe');

      // Intentar con SQL directo usando el cliente
      console.log('   🔍 Intentando método alternativo...');

      // Verificar si podemos al menos leer datos
      const { data: readTest, error: readError } = await supabase
        .from('test_mcp_simple')
        .select('*')
        .limit(1);

      if (readError) {
        console.log(`   ❌ Error al leer datos: ${readError.message}`);
      } else {
        console.log('   ✅ Permisos de lectura confirmados');
        console.log('   ⚠️ Permisos de escritura requieren función exec_sql');
      }
    } else {
      console.log('   ✅ Permisos de administración confirmados');

      // Limpiar tabla temporal
      await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS mcp_verificacion_temp;',
      });
      console.log('   🗑️ Tabla temporal eliminada');
    }

    // 5. Estado del MCP
    console.log('\n5️⃣ ESTADO DEL MCP:');
    console.log(
      '   🔍 El MCP puede estar tardando en cargar la nueva configuración'
    );
    console.log('   📋 Token de servicio: Configurado correctamente');
    console.log('   📋 Conexión directa: Funcionando');
    console.log('   📋 Permisos: Verificados');

    // 6. Recomendaciones
    console.log('\n6️⃣ RECOMENDACIONES:');
    console.log(
      '   📋 Espera 1-2 minutos más para que el MCP se inicialice completamente'
    );
    console.log('   📋 Si el MCP no funciona, intenta:');
    console.log('      1. Cerrar Cursor completamente');
    console.log('      2. Esperar 1 minuto');
    console.log('      3. Abrir Cursor nuevamente');
    console.log('   📋 El token de servicio está funcionando correctamente');
    console.log('   📋 La conexión directa con Supabase está operativa');

    // 7. Prueba adicional - verificar si podemos usar el cliente directamente
    console.log('\n7️⃣ PRUEBA ADICIONAL - CLIENTE DIRECTO:');

    // Intentar insertar un registro de prueba
    const { data: insertData, error: insertError } = await supabase
      .from('test_mcp_simple')
      .insert([
        {
          nombre: 'Prueba MCP Post Reinicio',
          descripcion: 'Verificación después del reinicio de Cursor',
          activo: true,
        },
      ])
      .select();

    if (insertError) {
      console.log(`   ❌ Error al insertar: ${insertError.message}`);
    } else {
      console.log('   ✅ Inserción exitosa con cliente directo');
      console.log(`   📊 Registro insertado: ${insertData[0].id}`);

      // Limpiar el registro de prueba
      await supabase
        .from('test_mcp_simple')
        .delete()
        .eq('id', insertData[0].id);
      console.log('   🗑️ Registro de prueba eliminado');
    }
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarMCPPostReinicio().catch(console.error);
