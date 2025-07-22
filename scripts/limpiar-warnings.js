// =====================================================================
// 🧹 LIMPIEZA DE WARNINGS - SISTEMA MTZ v3.0
// =====================================================================

import fs from 'fs';
import path from 'path';

console.log('🧹 LIMPIANDO WARNINGS MTZ v3.0');
console.log('='.repeat(50));

// Función para limpiar imports de React no utilizados
function limpiarImportsReact(archivo) {
  if (!fs.existsSync(archivo)) return false;

  try {
    let contenido = fs.readFileSync(archivo, 'utf8');
    let modificado = false;

    // Remover import React no utilizado
    const reactImportPattern = /import React from ['"]react['"];?\s*\n/g;
    if (contenido.match(reactImportPattern)) {
      contenido = contenido.replace(reactImportPattern, '');
      modificado = true;
    }

    if (modificado) {
      fs.writeFileSync(archivo, contenido);
      return true;
    }
  } catch (error) {
    console.error(`Error procesando ${archivo}:`, error.message);
  }
  return false;
}

// Función para limpiar imports de lucide-react no utilizados
function limpiarImportsLucide(archivo) {
  if (!fs.existsSync(archivo)) return false;

  try {
    let contenido = fs.readFileSync(archivo, 'utf8');
    let modificado = false;

    // Buscar imports de lucide-react
    const lucideImports =
      contenido.match(/import \{[^}]*\} from ['"]lucide-react['"];?\s*\n/g) ||
      [];

    lucideImports.forEach(importStatement => {
      const imports = importStatement
        .match(/\{([^}]*)\}/)[1]
        .split(',')
        .map(i => i.trim());
      const importsUtilizados = imports.filter(importName => {
        const regex = new RegExp(`\\b${importName}\\b`, 'g');
        const matches = contenido.match(regex) || [];
        return matches.length > 1; // Más de 1 porque el import cuenta como 1
      });

      if (importsUtilizados.length === 0) {
        contenido = contenido.replace(importStatement, '');
        modificado = true;
      } else if (importsUtilizados.length < imports.length) {
        const newImportStatement = `import { ${importsUtilizados.join(', ')} } from 'lucide-react';\n`;
        contenido = contenido.replace(importStatement, newImportStatement);
        modificado = true;
      }
    });

    if (modificado) {
      fs.writeFileSync(archivo, contenido);
      return true;
    }
  } catch (error) {
    console.error(`Error procesando ${archivo}:`, error.message);
  }
  return false;
}

// Lista de archivos para limpiar
const archivosParaLimpiar = [
  'src/App.jsx',
  'src/components/SystemDiagnostics.jsx',
  'src/components/admin/UsuarioForm.jsx',
  'src/components/auth/LoginForm.jsx',
  'src/components/auth/PasswordResetForm.jsx',
  'src/components/auth/RegisterForm.jsx',
  'src/components/clientes/CargaMasiva.jsx',
  'src/components/clientes/ClienteForm.jsx',
  'src/components/clientes/SearchFilters.jsx',
  'src/components/cobranzas/CobranzaForm.jsx',
  'src/components/compras/CompraForm.jsx',
  'src/components/ejemplo/ClientesEjemplo.jsx',
  'src/components/layout/Sidebar.jsx',
  'src/components/settings/ConfiguracionForm.jsx',
  'src/components/shared/DataTable.jsx',
  'src/components/shared/ExportData.jsx',
  'src/components/shared/FileUpload.jsx',
  'src/components/ui/LogoMTZ.jsx',
  'src/components/ui/Select.jsx',
  'src/components/ui/SetupMessage.jsx',
  'src/components/ui/Skeleton.jsx',
  'src/components/ui/Table.jsx',
  'src/components/ui/TestComponent.jsx',
  'src/components/ui/Toast.jsx',
  'src/contexts/AuthContext.jsx',
  'src/hooks/useAuth.js',
  'src/hooks/useCobranzas.js',
  'src/hooks/useContratos.js',
  'src/hooks/useUserManagement.js',
  'src/lib/dataService.js',
  'src/lib/mtzService.js',
  'src/pages/Admin/UserManagementPage.jsx',
  'src/pages/Auth/Login.jsx',
  'src/pages/Auth/Register.jsx',
  'src/pages/Auth/ResetPassword.jsx',
  'src/pages/CargaMasiva/CargaMasivaPage.jsx',
  'src/pages/Clientes/ClientesPage.jsx',
  'src/pages/Clientes/PortalClientes.jsx',
  'src/pages/Cobranza/CobranzaPage.jsx',
  'src/pages/Compras/ComprasPage.jsx',
  'src/pages/Contratos/ContratosPanel.jsx',
  'src/pages/Dashboard/Dashboard.jsx',
  'src/pages/Ejemplo/EjemploPage.jsx',
  'src/pages/IVA/IVAPage.jsx',
  'src/pages/Landing/LandingPage.jsx',
  'src/pages/RRHH/RRHHPage.jsx',
  'src/pages/Reports/ReportsPage.jsx',
  'src/pages/Settings/SettingsPage.jsx',
  'src/pages/Ventas/VentasPage.jsx',
  'src/utils/helpers.js',
  'src/utils/verifyEnv.js',
  'tests/basic.test.js',
];

console.log('🧹 LIMPIANDO IMPORTS NO UTILIZADOS...\n');

let archivosLimpiados = 0;
let importsReactLimpiados = 0;
let importsLucideLimpiados = 0;

archivosParaLimpiar.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    let archivoModificado = false;

    if (limpiarImportsReact(archivo)) {
      importsReactLimpiados++;
      archivoModificado = true;
    }

    if (limpiarImportsLucide(archivo)) {
      importsLucideLimpiados++;
      archivoModificado = true;
    }

    if (archivoModificado) {
      console.log(`✅ ${archivo}`);
      archivosLimpiados++;
    }
  }
});

console.log('\n📊 RESUMEN DE LIMPIEZA:');
console.log('='.repeat(30));
console.log(`📁 Archivos procesados: ${archivosParaLimpiar.length}`);
console.log(`✅ Archivos modificados: ${archivosLimpiados}`);
console.log(`🧹 Imports React limpiados: ${importsReactLimpiados}`);
console.log(`🎨 Imports Lucide limpiados: ${importsLucideLimpiados}`);

console.log('\n🔧 PRÓXIMOS PASOS:');
console.log('1. npm run lint              # Verificar warnings restantes');
console.log('2. npm run build             # Verificar build');
console.log('3. npm run dev               # Probar en desarrollo');

console.log('\n⚠️ NOTA: Algunos warnings pueden requerir corrección manual');
console.log('   - Variables no utilizadas en funciones específicas');
console.log('   - Dependencias faltantes en useEffect');
console.log('   - Props no utilizadas');

export { limpiarImportsReact, limpiarImportsLucide };
