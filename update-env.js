import fs from 'fs';
import path from 'path';

const envContent = `VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I
VITE_APP_NAME=MTZ Sistema de Gestión
VITE_APP_VERSION=3.0.0`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Archivo .env.local actualizado correctamente');
  console.log('🔑 API Key completa configurada');
  console.log(
    '📏 Longitud de la clave:',
    envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].length,
    'caracteres'
  );
  console.log('');
  console.log('🚀 Ahora reinicia el servidor:');
  console.log('1. Detener servidor (Ctrl+C)');
  console.log('2. Ejecutar: npm run dev');
} catch (error) {
  console.error('❌ Error actualizando .env.local:', error);
}
