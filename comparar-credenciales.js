// Script para comparar credenciales de Supabase
console.log('🔍 Comparando credenciales de Supabase...\n');

// Credenciales que teníamos antes
const credencialesAnteriores = {
  url: 'https://bwgnmastihgndmtbqvkj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I'
};

// Credenciales que tienes en Vercel
const credencialesVercel = {
  url: 'https://bwgnmastihgndmtbqvkj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyNDgyNzksImV4cCI6MjAzNjgyNDI3OX0.g1yKFklbTKzOHuiYV5gHU3ZzjczZJu8FOvQc1CEA2rA'
};

console.log('📋 Comparación de credenciales:');
console.log('');

console.log('🔗 URLs:');
console.log(`   Anteriores: ${credencialesAnteriores.url}`);
console.log(`   Vercel:     ${credencialesVercel.url}`);
console.log(`   ✅ URLs iguales: ${credencialesAnteriores.url === credencialesVercel.url}`);
console.log('');

console.log('🔑 Anon Keys:');
console.log(`   Anteriores: ${credencialesAnteriores.anonKey.substring(0, 50)}...`);
console.log(`   Vercel:     ${credencialesVercel.anonKey.substring(0, 50)}...`);
console.log(`   ❌ Keys diferentes: ${credencialesAnteriores.anonKey !== credencialesVercel.anonKey}`);
console.log('');

// Decodificar JWT para ver información
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

console.log('📊 Información de los JWT:');
console.log('');

const jwtAnterior = decodeJWT(credencialesAnteriores.anonKey);
const jwtVercel = decodeJWT(credencialesVercel.anonKey);

if (jwtAnterior) {
  console.log('🔑 JWT Anterior:');
  console.log(`   - Role: ${jwtAnterior.role}`);
  console.log(`   - Issued at: ${new Date(jwtAnterior.iat * 1000).toLocaleString()}`);
  console.log(`   - Expires at: ${new Date(jwtAnterior.exp * 1000).toLocaleString()}`);
  console.log(`   - Project: ${jwtAnterior.ref}`);
}

if (jwtVercel) {
  console.log('🔑 JWT Vercel:');
  console.log(`   - Role: ${jwtVercel.role}`);
  console.log(`   - Issued at: ${new Date(jwtVercel.iat * 1000).toLocaleString()}`);
  console.log(`   - Expires at: ${new Date(jwtVercel.exp * 1000).toLocaleString()}`);
  console.log(`   - Project: ${jwtVercel.ref}`);
}

console.log('');

// Verificar cuál está activa
const ahora = Math.floor(Date.now() / 1000);

if (jwtAnterior && jwtVercel) {
  console.log('⏰ Estado de expiración:');
  console.log(`   JWT Anterior: ${jwtAnterior.exp > ahora ? '✅ Activo' : '❌ Expirado'}`);
  console.log(`   JWT Vercel:   ${jwtVercel.exp > ahora ? '✅ Activo' : '❌ Expirado'}`);

  if (jwtAnterior.exp > ahora && jwtVercel.exp > ahora) {
    console.log('\n⚠️ AMBAS CLAVES ESTÁN ACTIVAS');
    console.log('Esto puede causar confusión. Recomendación:');
    console.log('1. Usar la clave más reciente (Vercel)');
    console.log('2. Regenerar la clave anterior si es necesario');
  } else if (jwtVercel.exp > ahora) {
    console.log('\n✅ USAR CLAVE DE VERCEL');
    console.log('La clave de Vercel está activa y es la correcta');
  } else if (jwtAnterior.exp > ahora) {
    console.log('\n✅ USAR CLAVE ANTERIOR');
    console.log('La clave anterior está activa, actualizar Vercel');
  } else {
    console.log('\n❌ AMBAS CLAVES EXPIRADAS');
    console.log('Necesitas regenerar las claves en Supabase');
  }
}

console.log('\n🎯 RECOMENDACIÓN:');
console.log('1. Verificar en el dashboard de Supabase cuál es la clave actual');
console.log('2. Usar la clave que esté activa en Supabase');
console.log('3. Actualizar Vercel con la clave correcta');
console.log('4. Probar la conexión con la clave final');
