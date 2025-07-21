// =====================================================================
// 🔍 DIAGNÓSTICO DE PÁGINAS - SISTEMA MTZ v3.0 (NODE.JS)
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración básica para Node.js
const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9Wdd';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 INICIANDO DIAGNÓSTICO DE PÁGINAS MTZ v3.0');
console.log('='.repeat(60));

// Verificar configuración
console.log('📋 CONFIGURACIÓN DEL SISTEMA:');
console.log('- Versión: 3.0.0');
console.log('- Entorno: Node.js');
console.log(
  '- Supabase URL:',
  SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'
);
console.log(
  '- Supabase Key:',
  SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'
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

// Verificar archivos de páginas
console.log('\n📄 VERIFICANDO ARCHIVOS DE PÁGINAS:');
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

let paginasExistentes = 0;
for (const pagina of paginas) {
  const existe = fs.existsSync(pagina.archivo);
  console.log(`${existe ? '✅' : '❌'} ${pagina.nombre}: ${pagina.archivo}`);
  if (existe) paginasExistentes++;
}

// Verificar componentes UI
console.log('\n🎨 VERIFICANDO COMPONENTES UI:');
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

let componentesExistentes = 0;
for (const componente of componentes) {
  const existe = fs.existsSync(componente);
  console.log(`${existe ? '✅' : '❌'} ${path.basename(componente)}`);
  if (existe) componentesExistentes++;
}

// Verificar hooks
console.log('\n🔧 VERIFICANDO HOOKS:');
const hooks = [
  'src/hooks/useAuth.js',
  'src/hooks/useUserRole.js',
  'src/hooks/useClientes.js',
  'src/hooks/useVentas.js',
  'src/hooks/useCobranzas.js',
  'src/hooks/useCompras.js',
  'src/hooks/usePermissions.js',
];

let hooksExistentes = 0;
for (const hook of hooks) {
  const existe = fs.existsSync(hook);
  console.log(`${existe ? '✅' : '❌'} ${path.basename(hook)}`);
  if (existe) hooksExistentes++;
}

// Verificar servicios
console.log('\n⚙️ VERIFICANDO SERVICIOS:');
const servicios = [
  'src/lib/supabase.js',
  'src/lib/dataService.js',
  'src/lib/mtzService.js',
  'src/lib/config.js',
];

let serviciosExistentes = 0;
for (const servicio of servicios) {
  const existe = fs.existsSync(servicio);
  console.log(`${existe ? '✅' : '❌'} ${path.basename(servicio)}`);
  if (existe) serviciosExistentes++;
}

// Verificar archivos de configuración
console.log('\n📁 VERIFICANDO ARCHIVOS DE CONFIGURACIÓN:');
const configFiles = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'vercel.json',
  'README.md',
];

let configFilesExistentes = 0;
for (const file of configFiles) {
  const existe = fs.existsSync(file);
  console.log(`${existe ? '✅' : '❌'} ${file}`);
  if (existe) configFilesExistentes++;
}

console.log('\n✅ DIAGNÓSTICO COMPLETADO');
console.log('='.repeat(60));

// Resumen
console.log('\n📊 RESUMEN DEL SISTEMA:');
console.log(`- Páginas configuradas: ${paginasExistentes}/${paginas.length}`);
console.log(`- Componentes UI: ${componentesExistentes}/${componentes.length}`);
console.log(`- Hooks disponibles: ${hooksExistentes}/${hooks.length}`);
console.log(`- Servicios: ${serviciosExistentes}/${servicios.length}`);
console.log(
  `- Archivos de configuración: ${configFilesExistentes}/${configFiles.length}`
);
console.log('- Framework: React + Vite');
console.log('- UI: Tailwind CSS + Radix UI');
console.log('- Base de datos: Supabase');
console.log('- Deploy: Vercel');

// Verificar si hay errores críticos
const erroresCriticos = [];
if (paginasExistentes < paginas.length * 0.8) {
  erroresCriticos.push('Muchas páginas faltan');
}
if (componentesExistentes < componentes.length * 0.8) {
  erroresCriticos.push('Componentes UI incompletos');
}
if (serviciosExistentes < servicios.length) {
  erroresCriticos.push('Servicios faltantes');
}

if (erroresCriticos.length > 0) {
  console.log('\n⚠️ ERRORES CRÍTICOS DETECTADOS:');
  erroresCriticos.forEach(error => console.log(`- ${error}`));
} else {
  console.log('\n🎉 SISTEMA EN BUEN ESTADO');
}

export { paginas, componentes, hooks, servicios };
