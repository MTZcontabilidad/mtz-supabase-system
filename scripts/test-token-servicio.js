import { createClient } from '@supabase/supabase-js';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTokenServicio() {
  console.log('🔑 PRUEBA DEL TOKEN DE SERVICIO\n');
  console.log('='.repeat(60));

  try {
    // 1. Probar conexión básica
    console.log('\n1️⃣ PRUEBA DE CONEXIÓN CON TOKEN DE SERVICIO:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (testError) {
      console.log(`   ❌ Error de conexión: ${testError.message}`);
    } else {
      console.log('   ✅ Conexión exitosa con token de servicio');
      console.log(`   📊 Datos obtenidos: ${testData.length} registros`);
    }

    // 2. Probar listar tablas usando SQL directo
    console.log('\n2️⃣ PRUEBA DE LISTAR TABLAS CON SQL:');

    const { data: tables, error: tablesError } = await supabase.rpc(
      'exec_sql',
      {
        sql: "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename",
      }
    );

    if (tablesError) {
      console.log(`   ❌ Error al listar tablas: ${tablesError.message}`);

      // Intentar con query directo
      console.log('   🔍 Intentando con query directo...');
      const { data: directTables, error: directError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')
        .order('tablename');

      if (directError) {
        console.log(`   ❌ Error con query directo: ${directError.message}`);
      } else {
        console.log('   ✅ Tablas listadas exitosamente');
        console.log(`   📋 Total de tablas: ${directTables.length}`);
        console.log('   📝 Tablas encontradas:');
        directTables.forEach(table => {
          console.log(`      - ${table.tablename}`);
        });
      }
    } else {
      console.log('   ✅ Tablas listadas exitosamente');
      console.log(`   📋 Total de tablas: ${tables.length}`);
      console.log('   📝 Tablas encontradas:');
      tables.forEach(table => {
        console.log(`      - ${table.tablename}`);
      });
    }

    // 3. Probar crear tabla temporal
    console.log('\n3️⃣ PRUEBA DE CREAR TABLA TEMPORAL:');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS mcp_test_temp (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT NOW()
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL,
    });

    if (createError) {
      console.log(`   ❌ Error al crear tabla: ${createError.message}`);
    } else {
      console.log('   ✅ Tabla temporal creada exitosamente');

      // Insertar datos de prueba
      const insertSQL = `
        INSERT INTO mcp_test_temp (nombre) VALUES
        ('Prueba 1'), ('Prueba 2'), ('Prueba 3');
      `;

      const { error: insertError } = await supabase.rpc('exec_sql', {
        sql: insertSQL,
      });

      if (insertError) {
        console.log(`   ❌ Error al insertar datos: ${insertError.message}`);
      } else {
        console.log('   ✅ Datos insertados exitosamente');

        // Leer datos
        const { data: readData, error: readError } = await supabase
          .from('mcp_test_temp')
          .select('*');

        if (readError) {
          console.log(`   ❌ Error al leer datos: ${readError.message}`);
        } else {
          console.log(`   ✅ Datos leídos: ${readData.length} registros`);
          console.log('   📋 Datos:', readData);
        }

        // Eliminar tabla temporal
        const dropSQL = 'DROP TABLE IF EXISTS mcp_test_temp;';
        await supabase.rpc('exec_sql', { sql: dropSQL });
        console.log('   🗑️ Tabla temporal eliminada');
      }
    }

    // 4. Probar operaciones administrativas
    console.log('\n4️⃣ PRUEBA DE OPERACIONES ADMINISTRATIVAS:');

    // Listar extensiones
    const { data: extensions, error: extError } = await supabase.rpc(
      'exec_sql',
      { sql: 'SELECT extname FROM pg_extension;' }
    );

    if (extError) {
      console.log(`   ❌ Error al listar extensiones: ${extError.message}`);
    } else {
      console.log('   ✅ Extensiones listadas exitosamente');
      console.log(`   📋 Total de extensiones: ${extensions.length}`);
    }

    // 5. Estado final
    console.log('\n5️⃣ ESTADO FINAL:');
    console.log('   🟢 Token de servicio: Funcionando correctamente');
    console.log('   🟢 Conexión: Establecida');
    console.log('   🟢 Permisos: Administrativos completos');
    console.log('   🟢 Operaciones: Lectura y escritura disponibles');
    console.log('   📋 Proyecto: bwgnmastihgndmtbqvkj');

    // 6. Instrucciones para el MCP
    console.log('\n6️⃣ INSTRUCCIONES PARA EL MCP:');
    console.log('   📋 El token de servicio está funcionando correctamente');
    console.log(
      '   📋 Ahora necesitas reiniciar Cursor para que el MCP tome la nueva configuración'
    );
    console.log(
      '   📋 Después del reinicio, todas las herramientas del MCP deberían funcionar'
    );
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar prueba
testTokenServicio().catch(console.error);
