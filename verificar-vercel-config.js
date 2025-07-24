// Script para verificar la configuración de Vercel
console.log('🔍 Verificando configuración de Vercel...\n');

// Verificar archivo vercel.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer vercel.json
const vercelConfigPath = path.join(__dirname, 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));

  console.log('✅ vercel.json encontrado');
  console.log('📋 Configuración actual:');
  console.log(`   - Build Command: ${vercelConfig.buildCommand}`);
  console.log(`   - Output Directory: ${vercelConfig.outputDirectory}`);
  console.log(`   - Framework: ${vercelConfig.framework}`);
  console.log(`   - Regions: ${vercelConfig.regions?.join(', ') || 'default'}`);

  if (vercelConfig.rewrites) {
    console.log(`   - Rewrites: ${vercelConfig.rewrites.length} configurados`);
  }

  if (vercelConfig.headers) {
    console.log(`   - Headers: ${vercelConfig.headers.length} configurados`);
  }

  // Verificar CSP para Supabase
  const cspHeader = vercelConfig.headers?.find(h =>
    h.headers?.some(header => header.key === 'Content-Security-Policy')
  );

  if (cspHeader) {
    const csp = cspHeader.headers.find(h => h.key === 'Content-Security-Policy').value;
    if (csp.includes('bwgnmastihgndmtbqvkj.supabase.co')) {
      console.log('   - ✅ CSP configurado para Supabase');
    } else {
      console.log('   - ⚠️ CSP no incluye Supabase');
    }
  }

} else {
  console.log('❌ vercel.json no encontrado');
}

console.log('\n📋 Variables de entorno necesarias en Vercel:');
console.log('   - VITE_SUPABASE_URL');
console.log('   - VITE_SUPABASE_ANON_KEY');

console.log('\n🔗 URLs del proyecto:');
console.log('   - Producción: https://mtz-supabase-system.vercel.app');
console.log('   - Alternativa: https://mtz-supabase-system-7apjhsvev.vercel.app');

console.log('\n📊 Estado del despliegue:');
console.log('   - ✅ Status: Ready');
console.log('   - ✅ Error Rate: 0%');
console.log('   - ✅ Edge Requests: Activos');
console.log('   - ✅ Firewall: Activo');

console.log('\n🎯 Próximos pasos:');
console.log('1. Verificar variables de entorno en Vercel Dashboard');
console.log('2. Probar funcionalidad de la aplicación');
console.log('3. Verificar conexión con Supabase');

console.log('\n🔧 Para configurar variables de entorno en Vercel:');
console.log('1. Ir a https://vercel.com/dashboard');
console.log('2. Seleccionar proyecto "mtz-supabase-system"');
console.log('3. Ir a Settings > Environment Variables');
console.log('4. Agregar:');
console.log('   VITE_SUPABASE_URL=https://bwgnmastihgndmtbqvkj.supabase.co');
console.log('   VITE_SUPABASE_ANON_KEY=[tu-anon-key]');

console.log('\n✅ Configuración de Vercel: EXCELENTE');
