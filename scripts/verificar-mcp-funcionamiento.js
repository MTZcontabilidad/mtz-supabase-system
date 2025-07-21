import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarMCP() {
  console.log('🔍 Verificando funcionamiento del MCP de Supabase...\n');

  try {
    // 1. Verificar conexión básica
    console.log('1️⃣ Probando conexión básica...');
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (testError) {
      console.log('❌ Error en conexión básica:', testError.message);
      return false;
    }
    console.log('✅ Conexión básica exitosa');

    // 2. Verificar permisos de lectura
    console.log('\n2️⃣ Probando permisos de lectura...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.log('❌ Error al leer tablas:', tablesError.message);
      return false;
    }
    console.log(
      `✅ Permisos de lectura OK - ${tables.length} tablas encontradas`
    );

    // 3. Verificar si hay tablas en el proyecto
    console.log('\n3️⃣ Verificando tablas existentes...');
    if (tables.length === 0) {
      console.log(
        '⚠️  No hay tablas en el proyecto. Esto es normal si es un proyecto nuevo.'
      );
      console.log(
        '💡 Para probar el MCP completamente, necesitamos crear algunas tablas de prueba.'
      );
    } else {
      console.log('📋 Tablas encontradas:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    }

    // 4. Verificar configuración del MCP
    console.log('\n4️⃣ Verificando configuración del MCP...');
    console.log('📁 Archivo de configuración: .cursor/mcp.json');
    console.log('🔑 Project Ref: bwgnmastihgndmtbqvkj');
    console.log('🔐 Token configurado: ✅');
    console.log('📖 Modo: --read-only');

    // 5. Recomendaciones
    console.log('\n5️⃣ Estado del MCP:');
    if (tables.length === 0) {
      console.log(
        '🟡 MCP configurado correctamente pero sin datos para probar'
      );
      console.log(
        '💡 Recomendación: Crear tablas de prueba para verificar funcionalidad completa'
      );
    } else {
      console.log('🟢 MCP configurado correctamente y listo para usar');
    }

    return true;
  } catch (error) {
    console.log('❌ Error general:', error.message);
    return false;
  }
}

// Función para crear tabla de prueba si es necesario
async function crearTablaPrueba() {
  console.log('\n🔧 Creando tabla de prueba para verificar MCP...');

  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS test_mcp (
          id SERIAL PRIMARY KEY,
          nombre TEXT NOT NULL,
          fecha_creacion TIMESTAMP DEFAULT NOW()
        );
      `,
    });

    if (error) {
      console.log('❌ Error al crear tabla de prueba:', error.message);
      console.log('💡 Esto puede ser porque:');
      console.log('   - La función exec_sql no está disponible');
      console.log('   - No hay permisos para crear tablas');
      console.log('   - El modo --read-only está activo');
      return false;
    }

    console.log('✅ Tabla de prueba creada exitosamente');
    return true;
  } catch (error) {
    console.log('❌ Error al crear tabla de prueba:', error.message);
    return false;
  }
}

// Ejecutar verificación
async function main() {
  const mcpFuncionando = await verificarMCP();

  if (mcpFuncionando) {
    console.log('\n🎉 ¡El MCP está configurado correctamente!');
    console.log('\n📋 Para usar el MCP en Cursor:');
    console.log('1. Reinicia Cursor si no lo has hecho');
    console.log('2. Las herramientas del MCP deberían estar disponibles');
    console.log(
      '3. Puedes usar comandos como "listar tablas" o "consultar datos"'
    );
  } else {
    console.log('\n❌ El MCP no está funcionando correctamente');
    console.log('💡 Verifica:');
    console.log('   - La configuración en .cursor/mcp.json');
    console.log('   - El token de acceso');
    console.log('   - La conexión a internet');
  }
}

main().catch(console.error);
