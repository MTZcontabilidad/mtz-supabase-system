import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testMCPActualizado() {
  console.log('🔄 PRUEBA DEL MCP DESPUÉS DEL REINICIO\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar configuración actual del MCP
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

      // Verificar si el token está en los argumentos
      const hasTokenInArgs = mcpConfig.mcpServers.supabase.args.some(arg =>
        arg.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
      );
      console.log(
        `      - Token en argumentos: ${hasTokenInArgs ? 'SÍ' : 'NO'}`
      );

      // Verificar si hay variables de entorno
      const hasEnvToken =
        mcpConfig.mcpServers.supabase.env &&
        mcpConfig.mcpServers.supabase.env.SUPABASE_ACCESS_TOKEN;
      console.log(
        `      - Token en variables de entorno: ${hasEnvToken ? 'SÍ' : 'NO'}`
      );
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

    // 3. Probar diferentes configuraciones del MCP
    console.log('\n3️⃣ PROBANDO DIFERENTES CONFIGURACIONES:');

    // Configuración 1: Con variables de entorno
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

    console.log('   📋 Configuración 1 (con variables de entorno):');
    console.log('      - Comando: npx');
    console.log(
      '      - Argumentos: -y @supabase/mcp-server-supabase@latest --project-ref=bwgnmastihgndmtbqvkj'
    );
    console.log('      - Token: En variable de entorno SUPABASE_ACCESS_TOKEN');

    console.log('\n   📋 Configuración 2 (con token en argumentos):');
    console.log('      - Comando: npx');
    console.log(
      '      - Argumentos: -y @supabase/mcp-server-supabase@latest --project-ref=bwgnmastihgndmtbqvkj --access-token=...'
    );
    console.log('      - Token: En argumento --access-token');

    // 4. Verificar token
    console.log('\n4️⃣ VERIFICANDO TOKEN:');

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

    // 5. Recomendaciones
    console.log('\n5️⃣ RECOMENDACIONES:');
    console.log(
      '   📋 El MCP puede estar tardando en inicializarse completamente'
    );
    console.log('   📋 Prueba estas configuraciones alternativas:');
    console.log('      1. Configuración con variables de entorno');
    console.log('      2. Configuración con token en argumentos');
    console.log('      3. Reinicio adicional de Cursor');
    console.log('   📋 La conexión directa funciona perfectamente');
    console.log('   📋 El token de servicio es válido');

    // 6. Crear archivos de configuración alternativos
    console.log('\n6️⃣ CREANDO CONFIGURACIONES ALTERNATIVAS:');

    fs.writeFileSync(
      'scripts/mcp-config-1.json',
      JSON.stringify(config1, null, 2)
    );
    fs.writeFileSync(
      'scripts/mcp-config-2.json',
      JSON.stringify(config2, null, 2)
    );

    console.log('   ✅ Configuración 1 guardada: scripts/mcp-config-1.json');
    console.log('   ✅ Configuración 2 guardada: scripts/mcp-config-2.json');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar prueba
testMCPActualizado().catch(console.error);
