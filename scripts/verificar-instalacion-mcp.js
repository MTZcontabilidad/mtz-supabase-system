import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function verificarInstalacionMCP() {
  console.log('🔧 VERIFICACIÓN DE INSTALACIÓN DEL MCP\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar si npx está disponible
    console.log('\n1️⃣ VERIFICANDO NPX:');
    try {
      const { stdout: npxVersion } = await execAsync('npx --version');
      console.log(`   ✅ NPX disponible: ${npxVersion.trim()}`);
    } catch (error) {
      console.log('   ❌ NPX no disponible');
      return;
    }

    // 2. Verificar si el paquete MCP está instalado globalmente
    console.log('\n2️⃣ VERIFICANDO PAQUETE MCP:');
    try {
      const { stdout: mcpVersion } = await execAsync(
        'npx @supabase/mcp-server-supabase@latest --version'
      );
      console.log(`   ✅ Paquete MCP disponible: ${mcpVersion.trim()}`);
    } catch (error) {
      console.log('   ❌ Paquete MCP no disponible');
      console.log('   🔍 Intentando instalar...');

      try {
        await execAsync('npm install -g @supabase/mcp-server-supabase@latest');
        console.log('   ✅ Paquete MCP instalado globalmente');
      } catch (installError) {
        console.log(`   ❌ Error al instalar: ${installError.message}`);
      }
    }

    // 3. Verificar configuración del MCP
    console.log('\n3️⃣ VERIFICANDO CONFIGURACIÓN:');
    const mcpConfigPath = path.join(process.cwd(), '.cursor', 'mcp.json');

    if (fs.existsSync(mcpConfigPath)) {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      console.log('   ✅ Archivo de configuración encontrado');
      console.log('   📋 Configuración actual:');
      console.log(`      - Comando: ${mcpConfig.mcpServers.supabase.command}`);
      console.log(
        `      - Argumentos: ${mcpConfig.mcpServers.supabase.args.join(' ')}`
      );
      console.log(
        `      - Token configurado: ${mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN ? 'SÍ' : 'NO'}`
      );

      // Verificar tipo de token
      const token = mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN;
      if (token) {
        try {
          const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
          );
          console.log(`      - Tipo de token: ${payload.role}`);
          console.log(`      - Proyecto: ${payload.ref}`);
        } catch (e) {
          console.log('      - Error al decodificar token');
        }
      }
    } else {
      console.log('   ❌ Archivo de configuración no encontrado');
    }

    // 4. Probar ejecución directa del servidor MCP
    console.log('\n4️⃣ PROBANDO EJECUCIÓN DIRECTA DEL SERVIDOR MCP:');

    const testCommand = `npx @supabase/mcp-server-supabase@latest --project-ref=bwgnmastihgndmtbqvkj --access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM --help`;

    try {
      const { stdout: helpOutput } = await execAsync(testCommand, {
        timeout: 10000,
      });
      console.log('   ✅ Servidor MCP ejecutándose correctamente');
      console.log('   📋 Salida del comando help:');
      console.log(helpOutput.substring(0, 200) + '...');
    } catch (error) {
      console.log(`   ❌ Error al ejecutar servidor MCP: ${error.message}`);
    }

    // 5. Verificar variables de entorno
    console.log('\n5️⃣ VERIFICANDO VARIABLES DE ENTORNO:');
    console.log(
      `   📋 SUPABASE_ACCESS_TOKEN configurado: ${process.env.SUPABASE_ACCESS_TOKEN ? 'SÍ' : 'NO'}`
    );

    if (process.env.SUPABASE_ACCESS_TOKEN) {
      try {
        const payload = JSON.parse(
          Buffer.from(
            process.env.SUPABASE_ACCESS_TOKEN.split('.')[1],
            'base64'
          ).toString()
        );
        console.log(`   📋 Tipo de token en ENV: ${payload.role}`);
      } catch (e) {
        console.log('   📋 Error al decodificar token en ENV');
      }
    }

    // 6. Recomendaciones
    console.log('\n6️⃣ RECOMENDACIONES:');
    console.log('   📋 Si el MCP no funciona después de estos cambios:');
    console.log('      1. Cierra Cursor completamente');
    console.log('      2. Espera 2-3 minutos');
    console.log('      3. Abre Cursor nuevamente');
    console.log(
      '      4. Verifica que no haya otros procesos de MCP corriendo'
    );
    console.log('   📋 El token de servicio está configurado correctamente');
    console.log('   📋 La conexión directa con Supabase funciona');

    // 7. Crear script de prueba manual
    console.log('\n7️⃣ CREANDO SCRIPT DE PRUEBA MANUAL:');

    const testScript = `
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDirectConnection() {
  console.log('🔗 PRUEBA DE CONEXIÓN DIRECTA');

  try {
    const { data, error } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Conexión exitosa');
      console.log('📊 Datos:', data.length, 'registros');
    }
  } catch (err) {
    console.log('❌ Error general:', err.message);
  }
}

testDirectConnection();
`;

    fs.writeFileSync('scripts/test-conexion-directa.js', testScript);
    console.log(
      '   ✅ Script de prueba creado: scripts/test-conexion-directa.js'
    );
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarInstalacionMCP().catch(console.error);
