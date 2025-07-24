// =====================================================================
// 🔧 FIX PARA COMPATIBILIDAD CON NAVEGADOR - SISTEMA MTZ v3.0
// =====================================================================

/**
 * Polyfill para process en el navegador
 * Esto evita errores cuando el código intenta usar process
 */
if (typeof window !== 'undefined' && typeof process === 'undefined') {
  window.process = {
    env: {
      NODE_ENV: import.meta.env.MODE || 'development',
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    cwd: () => '/',
    exit: (code) => {
      console.warn('process.exit() llamado con código:', code);
    }
  };
}

/**
 * Polyfill para Node.js modules en el navegador
 */
if (typeof window !== 'undefined') {
  // Evitar errores de módulos de Node.js
  window.global = window;

  // Polyfill para fs si es necesario
  if (typeof window.fs === 'undefined') {
    window.fs = {
      existsSync: () => false,
      readFileSync: () => '',
      writeFileSync: () => {}
    };
  }

  // Polyfill para path si es necesario
  if (typeof window.path === 'undefined') {
    window.path = {
      join: (...args) => args.join('/'),
      dirname: (p) => p.split('/').slice(0, -1).join('/'),
      basename: (p) => p.split('/').pop()
    };
  }
}

/**
 * Verificar compatibilidad del navegador
 */
export const checkBrowserCompatibility = () => {
  const issues = [];

  // Verificar que estamos en el navegador
  if (typeof window === 'undefined') {
    issues.push('No se detectó el objeto window (posible SSR)');
  }

  // Verificar que fetch esté disponible
  if (typeof fetch === 'undefined') {
    issues.push('fetch no está disponible');
  }

  // Verificar que localStorage esté disponible
  if (typeof localStorage === 'undefined') {
    issues.push('localStorage no está disponible');
  }

  if (issues.length > 0) {
    console.warn('⚠️ Problemas de compatibilidad detectados:', issues);
    return false;
  }

  console.log('✅ Navegador compatible');
  return true;
};

/**
 * Inicializar fixes del navegador
 */
export const initBrowserFixes = () => {
  console.log('🔧 Inicializando fixes del navegador...');

  // Verificar compatibilidad
  const isCompatible = checkBrowserCompatibility();

  if (!isCompatible) {
    console.warn('⚠️ Algunos fixes no se pudieron aplicar');
  }

  return isCompatible;
};

// Auto-inicializar cuando se importa
if (typeof window !== 'undefined') {
  initBrowserFixes();
}
