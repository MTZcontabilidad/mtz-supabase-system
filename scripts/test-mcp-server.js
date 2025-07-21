import { spawn } from 'child_process';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

console.log('🧪 Probando servidor MCP de Supabase...\n');

// Configurar variables de entorno
const env = {
  ...process.env,
  SUPABASE_ACCESS_TOKEN: token,
};

// Comando para ejecutar el servidor MCP
const args = [
  '-y',
  '@supabase/mcp-server-supabase@latest',
  '--read-only',
  '--project-ref=bwgnmastihgndmtbqvkj',
];

console.log('📋 Comando:', 'npx', args.join(' '));
console.log('🔑 Token configurado:', token.substring(0, 20) + '...');
console.log('='.repeat(60));

// Ejecutar el servidor MCP
const mcpProcess = spawn('npx', args, {
  env,
  stdio: ['pipe', 'pipe', 'pipe'],
});

// Manejar salida estándar
mcpProcess.stdout.on('data', data => {
  console.log('📤 STDOUT:', data.toString());
});

// Manejar errores
mcpProcess.stderr.on('data', data => {
  console.log('❌ STDERR:', data.toString());
});

// Manejar cierre del proceso
mcpProcess.on('close', code => {
  console.log(`\n🏁 Proceso terminado con código: ${code}`);
  if (code === 0) {
    console.log('✅ Servidor MCP funcionando correctamente');
  } else {
    console.log('❌ Error en el servidor MCP');
  }
});

// Manejar errores del proceso
mcpProcess.on('error', error => {
  console.log('💥 Error al ejecutar el servidor MCP:', error.message);
});

// Enviar un mensaje de prueba después de 2 segundos
setTimeout(() => {
  console.log('\n📝 Enviando mensaje de prueba...');
  const testMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    },
  };

  mcpProcess.stdin.write(JSON.stringify(testMessage) + '\n');
}, 2000);

// Terminar después de 10 segundos
setTimeout(() => {
  console.log('\n⏰ Terminando prueba...');
  mcpProcess.kill();
}, 10000);
