// =====================================================================
// 🔍 VERIFICACIÓN DE ENTORNO - SISTEMA MTZ v3.0
// =====================================================================

import { MTZ_CONFIG } from '@/lib/config.js';

/**
 * Verificar variables de entorno críticas
 */
export const verifyEnvironment = () => {
  const issues = [];
  const warnings = [];

  // Verificar variables críticas de Supabase
  if (!import.meta.env.VITE_SUPABASE_URL) {
    warnings.push(
      '⚠️ VITE_SUPABASE_URL no está configurada (usando valor por defecto)'
    );
  } else {
    console.log('✅ VITE_SUPABASE_URL configurada');
  }

  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    warnings.push(
      '⚠️ VITE_SUPABASE_ANON_KEY no está configurada (usando valor por defecto)'
    );
  } else {
    console.log('✅ VITE_SUPABASE_ANON_KEY configurada');
  }

  // Verificar variables opcionales
  if (!import.meta.env.VITE_GA_TRACKING_ID) {
    warnings.push(
      '⚠️ VITE_GA_TRACKING_ID no está configurada (Analytics deshabilitado)'
    );
  }

  // Verificar entorno
  const environment = import.meta.env.MODE;
  console.log(`🌍 Entorno: ${environment}`);

  // Mostrar información del sistema
  console.log('🚀 MTZ Sistema v3.0 iniciando...');
  console.log(`📅 Fecha: ${new Date().toLocaleString('es-CL')}`);
  console.log(`🔧 Build: ${MTZ_CONFIG.buildDate}`);

  // Mostrar problemas críticos
  if (issues.length > 0) {
    console.error('🚨 PROBLEMAS CRÍTICOS ENCONTRADOS:');
    issues.forEach(issue => console.error(issue));

    if (environment === 'production') {
      throw new Error(
        'Variables de entorno críticas no configuradas en producción'
      );
    }
  }

  // Mostrar advertencias
  if (warnings.length > 0) {
    console.warn('⚠️ ADVERTENCIAS:');
    warnings.forEach(warning => console.warn(warning));
  }

  // Verificar compatibilidad del navegador
  verifyBrowserCompatibility();

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    environment,
  };
};

/**
 * Verificar compatibilidad del navegador
 */
const verifyBrowserCompatibility = () => {
  const issues = [];

  // Verificar soporte para localStorage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (e) {
    issues.push('❌ localStorage no está disponible');
  }

  // Verificar soporte para fetch
  if (!window.fetch) {
    issues.push('❌ fetch API no está disponible');
  }

  // Verificar soporte para Promise
  if (!window.Promise) {
    issues.push('❌ Promise no está disponible');
  }

  // Verificar soporte para async/await
  try {
    // Usar una función async real en lugar de eval
    const testAsync = async () => {};
    testAsync();
  } catch (e) {
    issues.push('❌ async/await no está disponible');
  }

  if (issues.length > 0) {
    console.warn('⚠️ PROBLEMAS DE COMPATIBILIDAD:');
    issues.forEach(issue => console.warn(issue));
  } else {
    console.log('✅ Navegador compatible');
  }
};

/**
 * Obtener información del sistema
 */
export const getSystemInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
    },
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    memory: navigator.deviceMemory,
    cores: navigator.hardwareConcurrency,
  };
};

/**
 * Verificar conectividad
 */
export const checkConnectivity = async () => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return { online: true };
  } catch (error) {
    return { online: false, error: error.message };
  }
};

/**
 * Verificar rendimiento del sistema
 */
export const checkPerformance = () => {
  const performance = window.performance;

  if (!performance) {
    return { available: false, error: 'Performance API no disponible' };
  }

  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');

  return {
    available: true,
    navigation: {
      domContentLoaded:
        navigation?.domContentLoadedEventEnd -
        navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      total: navigation?.loadEventEnd - navigation?.fetchStart,
    },
    paint: {
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')
        ?.startTime,
    },
    memory: performance.memory
      ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        }
      : null,
  };
};

/**
 * Verificar características del navegador
 */
export const checkBrowserFeatures = () => {
  const features = {
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB,
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    geolocation: 'geolocation' in navigator,
    webGL: !!window.WebGLRenderingContext,
    webAudio: !!window.AudioContext,
    webRTC: !!window.RTCPeerConnection,
    webAssembly: typeof WebAssembly === 'object',
    webWorkers: typeof Worker !== 'undefined',
    fetch: !!window.fetch,
    promises: !!window.Promise,
    asyncAwait: (() => {
      try {
        // Usar una función async real en lugar de eval
        const testAsync = async () => {};
        testAsync();
        return true;
      } catch (e) {
        return false;
      }
    })(),
  };

  return features;
};

/**
 * Generar reporte completo del sistema
 */
export const generateSystemReport = async () => {
  const envCheck = verifyEnvironment();
  const systemInfo = getSystemInfo();
  const connectivity = await checkConnectivity();
  const performance = checkPerformance();
  const features = checkBrowserFeatures();

  return {
    timestamp: new Date().toISOString(),
    environment: envCheck,
    system: systemInfo,
    connectivity,
    performance,
    features,
    summary: {
      criticalIssues: envCheck.issues.length,
      warnings: envCheck.warnings.length,
      online: connectivity.online,
      performanceAvailable: performance.available,
      supportedFeatures: Object.values(features).filter(Boolean).length,
      totalFeatures: Object.keys(features).length,
    },
  };
};

export default {
  verifyEnvironment,
  getSystemInfo,
  checkConnectivity,
  checkPerformance,
  checkBrowserFeatures,
  generateSystemReport,
};
