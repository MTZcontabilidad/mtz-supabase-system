// =====================================================================
// 🔍 ANÁLISIS DE ERRORES - SISTEMA MTZ v3.0
// =====================================================================

import fs from 'fs';
import path from 'path';

console.log('🔍 INICIANDO ANÁLISIS DE ERRORES MTZ v3.0');
console.log('='.repeat(60));

// Lista de páginas para analizar
const paginasParaAnalizar = [
  {
    nombre: 'Landing Page',
    archivo: 'src/pages/Landing/LandingPage.jsx',
    ruta: '/',
    prioridad: 'alta',
  },
  {
    nombre: 'Login',
    archivo: 'src/pages/Auth/Login.jsx',
    ruta: '/login',
    prioridad: 'alta',
  },
  {
    nombre: 'Register',
    archivo: 'src/pages/Auth/Register.jsx',
    ruta: '/register',
    prioridad: 'alta',
  },
  {
    nombre: 'Reset Password',
    archivo: 'src/pages/Auth/ResetPassword.jsx',
    ruta: '/reset-password',
    prioridad: 'media',
  },
  {
    nombre: 'Dashboard',
    archivo: 'src/pages/Dashboard/Dashboard.jsx',
    ruta: '/dashboard',
    prioridad: 'alta',
  },
  {
    nombre: 'Clientes',
    archivo: 'src/pages/Clientes/ClientesPage.jsx',
    ruta: '/clientes',
    prioridad: 'alta',
  },
  {
    nombre: 'Ventas',
    archivo: 'src/pages/Ventas/VentasPage.jsx',
    ruta: '/ventas',
    prioridad: 'alta',
  },
  {
    nombre: 'Cobranza',
    archivo: 'src/pages/Cobranza/CobranzaPage.jsx',
    ruta: '/cobranza',
    prioridad: 'alta',
  },
  {
    nombre: 'Compras',
    archivo: 'src/pages/Compras/ComprasPage.jsx',
    ruta: '/compras',
    prioridad: 'alta',
  },
  {
    nombre: 'Contratos',
    archivo: 'src/pages/Contratos/ContratosPanel.jsx',
    ruta: '/contratos',
    prioridad: 'media',
  },
  {
    nombre: 'Carga Masiva',
    archivo: 'src/pages/CargaMasiva/CargaMasivaPage.jsx',
    ruta: '/carga-masiva',
    prioridad: 'media',
  },
  {
    nombre: 'Reportes',
    archivo: 'src/pages/Reports/ReportsPage.jsx',
    ruta: '/reportes',
    prioridad: 'media',
  },
  {
    nombre: 'Configuración',
    archivo: 'src/pages/Settings/SettingsPage.jsx',
    ruta: '/configuracion',
    prioridad: 'baja',
  },
  {
    nombre: 'Gestión Usuarios',
    archivo: 'src/pages/Admin/UserManagementPage.jsx',
    ruta: '/admin/usuarios',
    prioridad: 'media',
  },
  {
    nombre: 'Portal Clientes',
    archivo: 'src/pages/Clientes/PortalClientes.jsx',
    ruta: '/portal-clientes',
    prioridad: 'media',
  },
  {
    nombre: 'Ejemplo',
    archivo: 'src/pages/Ejemplo/EjemploPage.jsx',
    ruta: '/ejemplo',
    prioridad: 'baja',
  },
  {
    nombre: 'IVA',
    archivo: 'src/pages/IVA/IVAPage.jsx',
    ruta: '/iva',
    prioridad: 'media',
  },
  {
    nombre: 'RRHH',
    archivo: 'src/pages/RRHH/RRHHPage.jsx',
    ruta: '/rrhh',
    prioridad: 'media',
  },
];

// Tipos de errores comunes
const tiposErrores = {
  sintaxis: {
    descripcion: 'Errores de sintaxis JSX/JavaScript',
    ejemplos: [
      'JSX tags no cerrados',
      'Imports faltantes',
      'Variables no definidas',
    ],
  },
  importacion: {
    descripcion: 'Problemas con imports/exports',
    ejemplos: [
      'Componentes no encontrados',
      'Hooks no importados',
      'Servicios faltantes',
    ],
  },
  hooks: {
    descripcion: 'Errores en el uso de hooks',
    ejemplos: [
      'useState mal usado',
      'useEffect sin dependencias',
      'Hooks en loops',
    ],
  },
  props: {
    descripcion: 'Problemas con props',
    ejemplos: [
      'Props requeridas faltantes',
      'Tipos incorrectos',
      'Props no pasadas',
    ],
  },
  renderizado: {
    descripcion: 'Errores de renderizado',
    ejemplos: [
      'Componentes que retornan undefined',
      'JSX mal formado',
      'Expresiones condicionales',
    ],
  },
};

// Función para analizar un archivo
function analizarArchivo(archivo) {
  const errores = [];

  if (!fs.existsSync(archivo)) {
    errores.push({
      tipo: 'archivo',
      severidad: 'alta',
      mensaje: `Archivo no encontrado: ${archivo}`,
      solucion: 'Crear el archivo o verificar la ruta',
    });
    return errores;
  }

  try {
    const contenido = fs.readFileSync(archivo, 'utf8');

    // Verificar imports
    const imports = contenido.match(/import.*from.*['"`]/g) || [];
    const importsReact = imports.filter(imp => imp.includes('react'));
    const importsHooks = imports.filter(imp => imp.includes('use'));

    if (importsReact.length === 0) {
      errores.push({
        tipo: 'importacion',
        severidad: 'alta',
        mensaje: 'No se encontraron imports de React',
        solucion: 'Agregar: import React from "react"',
      });
    }

    // Verificar JSX
    const jsxTags = contenido.match(/<[A-Z][a-zA-Z]*/g) || [];
    const jsxClosingTags = contenido.match(/<\/[A-Z][a-zA-Z]*>/g) || [];

    if (jsxTags.length > jsxClosingTags.length) {
      errores.push({
        tipo: 'sintaxis',
        severidad: 'alta',
        mensaje: 'Posibles tags JSX no cerrados',
        solucion: 'Verificar que todos los tags JSX estén cerrados',
      });
    }

    // Verificar hooks
    const hooksUsados = contenido.match(/use[A-Z][a-zA-Z]*/g) || [];
    const hooksImportados = importsHooks
      .map(imp => {
        const match = imp.match(/use[A-Z][a-zA-Z]*/);
        return match ? match[0] : null;
      })
      .filter(Boolean);

    hooksUsados.forEach(hook => {
      if (!hooksImportados.includes(hook)) {
        errores.push({
          tipo: 'hooks',
          severidad: 'media',
          mensaje: `Hook ${hook} usado pero no importado`,
          solucion: `Importar: import { ${hook} } from 'react'`,
        });
      }
    });

    // Verificar return statement
    if (!contenido.includes('return (') && !contenido.includes('return(')) {
      errores.push({
        tipo: 'renderizado',
        severidad: 'alta',
        mensaje: 'No se encontró return statement',
        solucion: 'Agregar return statement con JSX',
      });
    }

    // Verificar export
    if (
      !contenido.includes('export default') &&
      !contenido.includes('export {')
    ) {
      errores.push({
        tipo: 'importacion',
        severidad: 'alta',
        mensaje: 'No se encontró export statement',
        solucion: 'Agregar: export default NombreComponente',
      });
    }
  } catch (error) {
    errores.push({
      tipo: 'archivo',
      severidad: 'alta',
      mensaje: `Error leyendo archivo: ${error.message}`,
      solucion: 'Verificar permisos y codificación del archivo',
    });
  }

  return errores;
}

// Analizar todas las páginas
console.log('📄 ANALIZANDO PÁGINAS:');
console.log('');

let totalErrores = 0;
const resumenErrores = {
  alta: 0,
  media: 0,
  baja: 0,
};

paginasParaAnalizar.forEach((pagina, index) => {
  console.log(`${index + 1}. ${pagina.nombre} (${pagina.prioridad})`);
  console.log(`   Archivo: ${pagina.archivo}`);
  console.log(`   Ruta: ${pagina.ruta}`);

  const errores = analizarArchivo(pagina.archivo);

  if (errores.length === 0) {
    console.log('   ✅ Sin errores detectados');
  } else {
    console.log(`   ❌ ${errores.length} errores encontrados:`);
    errores.forEach(error => {
      console.log(`      - ${error.tipo.toUpperCase()}: ${error.mensaje}`);
      console.log(`        Solución: ${error.solucion}`);
      totalErrores++;

      if (error.severidad === 'alta') resumenErrores.alta++;
      else if (error.severidad === 'media') resumenErrores.media++;
      else resumenErrores.baja++;
    });
  }
  console.log('');
});

// Generar plan de corrección
console.log('🎯 PLAN DE CORRECCIÓN:');
console.log('');

const paginasConErrores = paginasParaAnalizar.filter(pagina => {
  const errores = analizarArchivo(pagina.archivo);
  return errores.length > 0;
});

if (paginasConErrores.length === 0) {
  console.log('✅ No se encontraron errores críticos');
} else {
  console.log('📋 ORDEN DE CORRECCIÓN (por prioridad):');

  // Ordenar por prioridad
  const ordenPrioridad = { alta: 1, media: 2, baja: 3 };
  paginasConErrores
    .sort((a, b) => ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad])
    .forEach((pagina, index) => {
      console.log(`${index + 1}. ${pagina.nombre} (${pagina.prioridad})`);
      console.log(`   Archivo: ${pagina.archivo}`);
      console.log(`   Ruta: ${pagina.ruta}`);
    });
}

console.log('\n📊 RESUMEN DE ANÁLISIS:');
console.log(`- Páginas analizadas: ${paginasParaAnalizar.length}`);
console.log(`- Páginas con errores: ${paginasConErrores.length}`);
console.log(`- Total de errores: ${totalErrores}`);
console.log(`  - Alta severidad: ${resumenErrores.alta}`);
console.log(`  - Media severidad: ${resumenErrores.media}`);
console.log(`  - Baja severidad: ${resumenErrores.baja}`);

console.log('\n🔧 COMANDOS PARA CORRECCIÓN:');
console.log('1. npm run lint              # Verificar errores de linting');
console.log('2. npm run build             # Verificar build');
console.log('3. npm run dev               # Probar en desarrollo');

export { paginasParaAnalizar, tiposErrores, analizarArchivo };
