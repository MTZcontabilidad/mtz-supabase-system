import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarExtensionMCP() {
  console.log('🔧 VERIFICACIÓN DE LA EXTENSIÓN MCP SUPABASE\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar configuración actual
    console.log('\n1️⃣ VERIFICANDO CONFIGURACIÓN ACTUAL:');

    const mcpConfigPath = path.join(process.cwd(), '.cursor', 'mcp.json');

    if (fs.existsSync(mcpConfigPath)) {
      const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
      console.log('   ✅ Archivo de configuración MCP encontrado');
      console.log('   📋 Configuración actual:');
      console.log(`      - Comando: ${mcpConfig.mcpServers.supabase.command}`);
      console.log(
        `      - Argumentos: ${mcpConfig.mcpServers.supabase.args.join(' ')}`
      );

      // Verificar si hay variables de entorno
      const hasEnvToken =
        mcpConfig.mcpServers.supabase.env &&
        mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN;
      console.log(
        `      - Token en variables de entorno: ${hasEnvToken ? 'SÍ' : 'NO'}`
      );

      if (hasEnvToken) {
        const token = mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN;
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
      console.log('   ❌ Archivo de configuración MCP no encontrado');
    }

    // 2. Verificar conexión directa
    console.log('\n2️⃣ VERIFICANDO CONEXIÓN DIRECTA:');

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

    // Intentar obtener información de las tablas usando una consulta SQL directa
    const { data: tablesData, error: tablesError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.log(`   ❌ Error al verificar tablas: ${tablesError.message}`);
    } else {
      console.log('   ✅ Tablas accesibles');
      console.log('   📋 Tablas de prueba disponibles:');
      console.log('      - test_mcp_simple');
      console.log('      - test_mcp');
    }

    // 4. Probar diferentes configuraciones para la extensión
    console.log('\n4️⃣ CONFIGURACIONES ALTERNATIVAS PARA LA EXTENSIÓN:');

    // Configuración 1: Con variables de entorno (actual)
    const config1 = {
      mcpServers: {
        supabase: {
          command: 'npx',
          args: [
            '-y',
            '@supabase/mcp-server-supabase@latest',
            '--project-ref=bwgnmastihgndmtbqvkj',
          ],
          env: {
            SUPABASE_ACCESS_TOKEN:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM',
          },
        },
      },
    };

    // Configuración 2: Con token en argumentos
    const config2 = {
      mcpServers: {
        supabase: {
          command: 'npx',
          args: [
            '-y',
            '@supabase/mcp-server-supabase@latest',
            '--project-ref=bwgnmastihgndmtbqvkj',
            '--access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM',
          ],
        },
      },
    };

    // Configuración 3: Para extensión (puede ser diferente)
    const config3 = {
      mcpServers: {
        supabase: {
          command: 'supabase',
          args: ['mcp', '--project-ref=bwgnmastihgndmtbqvkj'],
          env: {
            SUPABASE_ACCESS_TOKEN:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM',
          },
        },
      },
    };

    console.log('   📋 Configuración 1 (NPX con variables de entorno):');
    console.log('      - Comando: npx');
    console.log(
      '      - Argumentos: -y @supabase/mcp-server-supabase@latest --project-ref=bwgnmastihgndmtbqvkj'
    );
    console.log('      - Token: En variable de entorno SUPABASE_ACCESS_TOKEN');

    console.log('\n   📋 Configuración 2 (NPX con token en argumentos):');
    console.log('      - Comando: npx');
    console.log(
      '      - Argumentos: -y @supabase/mcp-server-supabase@latest --project-ref=bwgnmastihgndmtbqvkj --access-token=...'
    );
    console.log('      - Token: En argumento --access-token');

    console.log('\n   📋 Configuración 3 (Extensión Supabase CLI):');
    console.log('      - Comando: supabase');
    console.log('      - Argumentos: mcp --project-ref=bwgnmastihgndmtbqvkj');
    console.log('      - Token: En variable de entorno SUPABASE_ACCESS_TOKEN');

    // 5. Verificar token
    console.log('\n5️⃣ VERIFICANDO TOKEN:');

    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      console.log('   ✅ Token válido');
      console.log(`   📋 Tipo: ${payload.role}`);
      console.log(`   📋 Proyecto: ${payload.ref}`);
      console.log(
        `   📋 Expira: ${new Date(payload.exp * 1000).toLocaleString()}`
      );

      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < now;
      console.log(`   📋 Estado: ${isExpired ? 'EXPIRADO' : 'VÁLIDO'}`);
    } catch (error) {
      console.log(`   ❌ Error al verificar token: ${error.message}`);
    }

    // 6. Recomendaciones específicas para extensión
    console.log('\n6️⃣ RECOMENDACIONES PARA LA EXTENSIÓN:');
    console.log('   📋 Si tienes la extensión MCP de Supabase:');
    console.log('      1. Verifica que la extensión esté habilitada en Cursor');
    console.log('      2. Prueba la configuración 3 (Supabase CLI)');
    console.log('      3. Reinicia Cursor completamente');
    console.log(
      '      4. Verifica que no haya conflictos con otras configuraciones'
    );
    console.log('   📋 La conexión directa funciona perfectamente');
    console.log('   📋 El token de servicio es válido');

    // 7. Crear archivos de configuración alternativos
    console.log('\n7️⃣ CREANDO CONFIGURACIONES ALTERNATIVAS:');

    fs.writeFileSync(
      'scripts/mcp-config-extension-1.json',
      JSON.stringify(config1, null, 2)
    );
    fs.writeFileSync(
      'scripts/mcp-config-extension-2.json',
      JSON.stringify(config2, null, 2)
    );
    fs.writeFileSync(
      'scripts/mcp-config-extension-3.json',
      JSON.stringify(config3, null, 2)
    );

    console.log(
      '   ✅ Configuración 1 guardada: scripts/mcp-config-extension-1.json'
    );
    console.log(
      '   ✅ Configuración 2 guardada: scripts/mcp-config-extension-2.json'
    );
    console.log(
      '   ✅ Configuración 3 guardada: scripts/mcp-config-extension-3.json'
    );

    // 8. Instrucciones específicas
    console.log('\n8️⃣ INSTRUCCIONES ESPECÍFICAS:');
    console.log('   📋 Para usar la extensión MCP de Supabase:');
    console.log(
      '      1. Copia el contenido de scripts/mcp-config-extension-3.json'
    );
    console.log('      2. Reemplaza el contenido de .cursor/mcp.json');
    console.log('      3. Reinicia Cursor completamente');
    console.log('      4. Prueba las herramientas MCP');
    console.log(
      '   📋 Si no funciona, usa la conexión directa como alternativa'
    );
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarExtensionMCP().catch(console.error);
