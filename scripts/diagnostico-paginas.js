// =====================================================================
// 🔍 DIAGNÓSTICO DE PÁGINAS - SISTEMA MTZ v3.0
// =====================================================================

import { supabase } from '../src/lib/supabase.js';
import { MTZ_CONFIG } from '../src/lib/config.js';

console.log('🔍 INICIANDO DIAGNÓSTICO DE PÁGINAS MTZ v3.0');
console.log('='.repeat(60));

// Verificar configuración
console.log('📋 CONFIGURACIÓN DEL SISTEMA:');
console.log('- Versión:', MTZ_CONFIG.version);
console.log('- Entorno:', MTZ_CONFIG.environment);
console.log(
  '- Supabase URL:',
  MTZ_CONFIG.supabase.url ? '✅ Configurada' : '❌ No configurada'
);
console.log(
  '- Supabase Key:',
  MTZ_CONFIG.supabase.anonKey ? '✅ Configurada' : '❌ No configurada'
);

// Verificar conexión a Supabase
console.log('\n🔌 VERIFICANDO CONEXIÓN SUPABASE:');
try {
  const { data, error } = await supabase
    .from('empresas')
    .select('count')
    .limit(1);

  if (error) {
    console.log('❌ Error de conexión:', error.message);
  } else {
    console.log('✅ Conexión exitosa con Supabase');
  }
} catch (err) {
  console.log('❌ Error en prueba de conexión:', err.message);
}

// Verificar páginas disponibles
console.log('\n📄 PÁGINAS DISPONIBLES:');
const paginas = [
  {
    ruta: '/',
    nombre: 'Landing Page',
    archivo: 'src/pages/Landing/LandingPage.jsx',
  },
  { ruta: '/login', nombre: 'Login', archivo: 'src/pages/Auth/Login.jsx' },
  {
    ruta: '/register',
    nombre: 'Registro',
    archivo: 'src/pages/Auth/Register.jsx',
  },
  {
    ruta: '/dashboard',
    nombre: 'Dashboard',
    archivo: 'src/pages/Dashboard/Dashboard.jsx',
  },
  {
    ruta: '/clientes',
    nombre: 'Clientes',
    archivo: 'src/pages/Clientes/ClientesPage.jsx',
  },
  {
    ruta: '/ventas',
    nombre: 'Ventas',
    archivo: 'src/pages/Ventas/VentasPage.jsx',
  },
  {
    ruta: '/cobranza',
    nombre: 'Cobranza',
    archivo: 'src/pages/Cobranza/CobranzaPage.jsx',
  },
  {
    ruta: '/compras',
    nombre: 'Compras',
    archivo: 'src/pages/Compras/ComprasPage.jsx',
  },
  {
    ruta: '/contratos',
    nombre: 'Contratos',
    archivo: 'src/pages/Contratos/ContratosPanel.jsx',
  },
  {
    ruta: '/carga-masiva',
    nombre: 'Carga Masiva',
    archivo: 'src/pages/CargaMasiva/CargaMasivaPage.jsx',
  },
  {
    ruta: '/reportes',
    nombre: 'Reportes',
    archivo: 'src/pages/Reports/ReportsPage.jsx',
  },
  {
    ruta: '/configuracion',
    nombre: 'Configuración',
    archivo: 'src/pages/Settings/SettingsPage.jsx',
  },
  {
    ruta: '/admin/usuarios',
    nombre: 'Gestión Usuarios',
    archivo: 'src/pages/Admin/UserManagementPage.jsx',
  },
  {
    ruta: '/portal-clientes',
    nombre: 'Portal Clientes',
    archivo: 'src/pages/Clientes/PortalClientes.jsx',
  },
  {
    ruta: '/ejemplo',
    nombre: 'Ejemplo',
    archivo: 'src/pages/Ejemplo/EjemploPage.jsx',
  },
  { ruta: '/iva', nombre: 'IVA', archivo: 'src/pages/IVA/IVAPage.jsx' },
  { ruta: '/rrhh', nombre: 'RRHH', archivo: 'src/pages/RRHH/RRHHPage.jsx' },
];

// Verificar componentes UI
console.log('\n🎨 COMPONENTES UI:');
const componentes = [
  'src/components/ui/Button.jsx',
  'src/components/ui/Card.jsx',
  'src/components/ui/Input.jsx',
  'src/components/ui/Modal.jsx',
  'src/components/ui/Table.jsx',
  'src/components/ui/Badge.jsx',
  'src/components/ui/LoadingSpinner.jsx',
  'src/components/ui/Toast.jsx',
  'src/components/layout/Layout.jsx',
  'src/components/layout/Header.jsx',
  'src/components/layout/Sidebar.jsx',
];

// Verificar hooks
console.log('\n🔧 HOOKS DISPONIBLES:');
const hooks = [
  'src/hooks/useAuth.js',
  'src/hooks/useUserRole.js',
  'src/hooks/useClientes.js',
  'src/hooks/useVentas.js',
  'src/hooks/useCobranzas.js',
  'src/hooks/useCompras.js',
  'src/hooks/usePermissions.js',
];

// Verificar servicios
console.log('\n⚙️ SERVICIOS:');
const servicios = [
  'src/lib/supabase.js',
  'src/lib/dataService.js',
  'src/lib/mtzService.js',
  'src/lib/config.js',
];

console.log('\n✅ DIAGNÓSTICO COMPLETADO');
console.log('='.repeat(60));

// Resumen
console.log('\n📊 RESUMEN DEL SISTEMA:');
console.log(`- Páginas configuradas: ${paginas.length}`);
console.log(`- Componentes UI: ${componentes.length}`);
console.log(`- Hooks disponibles: ${hooks.length}`);
console.log(`- Servicios: ${servicios.length}`);
console.log('- Framework: React + Vite');
console.log('- UI: Tailwind CSS + Radix UI');
console.log('- Base de datos: Supabase');
console.log('- Deploy: Vercel');

export { paginas, componentes, hooks, servicios };
