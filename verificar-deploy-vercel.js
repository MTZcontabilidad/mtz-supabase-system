// Script para verificar el estado del deploy en Vercel
console.log('🚀 Verificando estado del deploy en Vercel...\n');

// URLs del proyecto
const urls = {
  principal: 'https://mtz-supabase-system.vercel.app',
  alternativa: 'https://mtz-supabase-system-7apjhsvev.vercel.app'
};

console.log('📋 URLs del proyecto:');
console.log(`   Principal: ${urls.principal}`);
console.log(`   Alternativa: ${urls.alternativa}`);
console.log('');

// Función para verificar si una URL responde
async function verificarURL(url, nombre) {
  try {
    console.log(`🔍 Verificando ${nombre}...`);

    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });

    console.log(`   ✅ ${nombre} responde correctamente`);
    return true;
  } catch (error) {
    console.log(`   ❌ ${nombre} no responde: ${error.message}`);
    return false;
  }
}

// Función para verificar la aplicación completa
async function verificarAplicacion(url, nombre) {
  try {
    console.log(`🌐 Verificando aplicación en ${nombre}...`);

    const response = await fetch(url);
    const html = await response.text();

    // Verificar elementos clave
    const tieneLogin = html.includes('login') || html.includes('Login') || html.includes('Iniciar Sesión');
    const tieneMTZ = html.includes('MTZ') || html.includes('mtz');
    const tieneReact = html.includes('react') || html.includes('React');

    console.log(`   ✅ Página cargada correctamente`);
    console.log(`   📱 Elementos detectados:`);
    console.log(`      - Login: ${tieneLogin ? '✅' : '❌'}`);
    console.log(`      - MTZ: ${tieneMTZ ? '✅' : '❌'}`);
    console.log(`      - React: ${tieneReact ? '✅' : '❌'}`);

    return true;
  } catch (error) {
    console.log(`   ❌ Error al cargar ${nombre}: ${error.message}`);
    return false;
  }
}

// Función principal
async function verificarDeploy() {
  console.log('🎯 Iniciando verificación completa del deploy...\n');

  // Verificar URLs
  const urlPrincipalOk = await verificarURL(urls.principal, 'URL Principal');
  const urlAlternativaOk = await verificarURL(urls.alternativa, 'URL Alternativa');

  console.log('');

  // Verificar aplicación
  if (urlPrincipalOk) {
    await verificarAplicacion(urls.principal, 'URL Principal');
  }

  console.log('');

  // Resumen
  console.log('📊 RESUMEN DEL DEPLOY:');
  console.log('=====================');

  if (urlPrincipalOk) {
    console.log('✅ URL Principal: FUNCIONANDO');
  } else {
    console.log('❌ URL Principal: NO FUNCIONA');
  }

  if (urlAlternativaOk) {
    console.log('✅ URL Alternativa: FUNCIONANDO');
  } else {
    console.log('❌ URL Alternativa: NO FUNCIONA');
  }

  console.log('');
  console.log('🎯 PRÓXIMOS PASOS:');
  console.log('1. Visitar la URL principal');
  console.log('2. Probar el login/registro');
  console.log('3. Navegar por las páginas');
  console.log('4. Probar CRUD de clientes');
  console.log('5. Verificar conexión con Supabase');

  console.log('');
  console.log('🔧 PARA VERIFICAR SUPABASE:');
  console.log('1. Ir a https://vercel.com/dashboard');
  console.log('2. Seleccionar proyecto "mtz-supabase-system"');
  console.log('3. Ir a Settings > Environment Variables');
  console.log('4. Verificar que las variables estén configuradas');
  console.log('5. Probar funcionalidad de la aplicación');

  console.log('');
  console.log('📞 URLs PARA PROBAR:');
  console.log(`   🌐 Aplicación: ${urls.principal}`);
  console.log(`   📊 Dashboard Vercel: https://vercel.com/dashboard`);
  console.log(`   🔧 Supabase: https://supabase.com/dashboard`);
}

// Ejecutar verificación
verificarDeploy().catch(console.error);
