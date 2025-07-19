// Script para obtener la clave API de Supabase
// Ejecutar: node get-supabase-key.js

console.log('🔍 OBTENCIÓN DE CLAVE API SUPABASE');
console.log('=====================================');
console.log('');
console.log('Para obtener la clave API correcta:');
console.log('');
console.log('1. Ve a https://supabase.com/dashboard');
console.log('2. Selecciona tu proyecto: mtzcontabilidad');
console.log('3. Ve a Settings → API');
console.log('4. Copia la "anon public" key completa');
console.log('5. Actualiza el archivo .env.local');
console.log('');
console.log('URL del proyecto: https://bwgnmastihgndmtbqvkj.supabase.co');
console.log('');
console.log('La clave debe tener este formato:');
console.log(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.XXXXX...'
);
console.log('');
console.log('⚠️  IMPORTANTE: La clave actual está truncada o es inválida');
console.log('');

// Verificar si existe .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Contenido actual de .env.local:');
  console.log(envContent);
  console.log('');

  // Verificar si la clave está truncada
  const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
  if (keyMatch) {
    const key = keyMatch[1];
    console.log(`🔑 Longitud de la clave actual: ${key.length} caracteres`);
    console.log(`🔑 Inicio de la clave: ${key.substring(0, 50)}...`);

    if (key.length < 200) {
      console.log('❌ La clave parece estar truncada');
    } else {
      console.log('✅ La clave parece tener la longitud correcta');
    }
  }
} else {
  console.log('❌ No se encontró el archivo .env.local');
}

console.log('');
console.log('🚀 PASOS PARA SOLUCIONAR:');
console.log('1. Obtener la clave API completa de Supabase Dashboard');
console.log('2. Actualizar .env.local con la clave correcta');
console.log('3. Reiniciar el servidor de desarrollo');
console.log('4. Verificar que la conexión funcione');
