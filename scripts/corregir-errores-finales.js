// =====================================================================
// 🔧 CORRECCIÓN FINAL DE ERRORES - SISTEMA MTZ v3.0
// =====================================================================

import fs from 'fs';
import path from 'path';

console.log('🔧 CORRECCIÓN FINAL DE ERRORES MTZ v3.0');
console.log('='.repeat(50));

// 1. CORREGIR ERRORES DE REACT NO DEFINIDO
function corregirReactNoDefinido() {
  const archivos = [
    'src/components/cobranzas/CobranzaForm.jsx',
    'src/components/compras/CompraForm.jsx',
  ];

  let archivosCorregidos = 0;

  archivos.forEach(archivo => {
    if (!fs.existsSync(archivo)) return;

    try {
      let contenido = fs.readFileSync(archivo, 'utf8');
      let modificado = false;

      // Verificar si ya tiene import de React
      if (!contenido.includes('import React')) {
        // Agregar import de React al inicio
        const importReact = "import React from 'react';\n";
        contenido = importReact + contenido;
        modificado = true;
      }

      if (modificado) {
        fs.writeFileSync(archivo, contenido);
        console.log(`✅ ${archivo} - import React agregado`);
        archivosCorregidos++;
      }
    } catch (error) {
      console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
    }
  });

  return archivosCorregidos;
}

// 2. CORREGIR VARIABLES NO UTILIZADAS
function corregirVariablesNoUtilizadas() {
  const correcciones = [
    {
      archivo: 'src/components/admin/UsuarioForm.jsx',
      variables: ['showPassword', 'setShowPassword', 'setValue'],
      tipo: 'comentar',
    },
    {
      archivo: 'src/components/auth/LoginForm.jsx',
      variables: ['setValue', 'watchedValues'],
      tipo: 'comentar',
    },
    {
      archivo: 'src/components/clientes/CargaMasiva.jsx',
      variables: ['Badge', 'data'],
      tipo: 'comentar',
    },
    {
      archivo: 'src/components/clientes/ClienteForm.jsx',
      variables: ['watchedValues'],
      tipo: 'comentar',
    },
    {
      archivo: 'src/components/compras/CompraForm.jsx',
      variables: ['setValue'],
      tipo: 'comentar',
    },
  ];

  let archivosCorregidos = 0;

  correcciones.forEach(({ archivo, variables, tipo }) => {
    if (!fs.existsSync(archivo)) return;

    try {
      let contenido = fs.readFileSync(archivo, 'utf8');
      let modificado = false;

      variables.forEach(variable => {
        if (tipo === 'comentar') {
          // Comentar variables no utilizadas
          const regex = new RegExp(`(const\\s+\\[?${variable}\\]?\\s*=)`, 'g');
          contenido = contenido.replace(regex, `// $1`);
          modificado = true;
        }
      });

      if (modificado) {
        fs.writeFileSync(archivo, contenido);
        console.log(`✅ ${archivo} - variables comentadas`);
        archivosCorregidos++;
      }
    } catch (error) {
      console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
    }
  });

  return archivosCorregidos;
}

// 3. CORREGIR IMPORTS NO UTILIZADOS
function corregirImportsNoUtilizados() {
  const correcciones = [
    {
      archivo: 'src/components/clientes/CargaMasiva.jsx',
      imports: ['Badge'],
    },
  ];

  let archivosCorregidos = 0;

  correcciones.forEach(({ archivo, imports }) => {
    if (!fs.existsSync(archivo)) return;

    try {
      let contenido = fs.readFileSync(archivo, 'utf8');
      let modificado = false;

      imports.forEach(importName => {
        // Buscar y remover imports específicos
        const importPattern = new RegExp(
          `import\\s+\\{[^}]*\\b${importName}\\b[^}]*\\}\\s+from\\s+['"][^'"]+['"];?\\s*\\n?`,
          'g'
        );
        const matches = contenido.match(importPattern);

        if (matches) {
          matches.forEach(match => {
            const importsInMatch = match
              .match(/\{([^}]*)\}/)[1]
              .split(',')
              .map(i => i.trim());
            const remainingImports = importsInMatch.filter(
              imp => imp !== importName
            );

            if (remainingImports.length === 0) {
              contenido = contenido.replace(match, '');
            } else {
              const newImport = `import { ${remainingImports.join(', ')} } from 'lucide-react';\n`;
              contenido = contenido.replace(match, newImport);
            }
            modificado = true;
          });
        }
      });

      if (modificado) {
        fs.writeFileSync(archivo, contenido);
        console.log(`✅ ${archivo} - imports no utilizados removidos`);
        archivosCorregidos++;
      }
    } catch (error) {
      console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
    }
  });

  return archivosCorregidos;
}

// 4. CORREGIR ERRORES EN mtzService.js
function corregirMtzService() {
  const archivo = 'src/lib/mtzService.js';
  if (!fs.existsSync(archivo)) return false;

  try {
    let contenido = fs.readFileSync(archivo, 'utf8');
    let modificado = false;

    // Buscar líneas específicas con try/catch innecesarios
    const lineas = contenido.split('\n');

    for (let i = 0; i < lineas.length; i++) {
      if (lineas[i].includes('try {') && i + 2 < lineas.length) {
        const tryContent = lineas[i].replace('try {', '').trim();
        const catchLine = lineas[i + 1];
        const throwLine = lineas[i + 2];

        if (catchLine.includes('} catch (') && throwLine.includes('throw')) {
          // Remover try/catch innecesario
          lineas[i] = tryContent;
          lineas.splice(i + 1, 2); // Remover catch y throw
          modificado = true;
          break;
        }
      }
    }

    if (modificado) {
      contenido = lineas.join('\n');
      fs.writeFileSync(archivo, contenido);
      console.log(`✅ ${archivo} - try/catch innecesarios corregidos`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
  }
  return false;
}

// EJECUTAR CORRECCIONES
console.log('🔧 INICIANDO CORRECCIONES FINALES...\n');

const resultados = {
  reactNoDefinido: corregirReactNoDefinido(),
  variablesNoUtilizadas: corregirVariablesNoUtilizadas(),
  importsNoUtilizados: corregirImportsNoUtilizados(),
  mtzService: corregirMtzService(),
};

console.log('\n📊 RESUMEN DE CORRECCIONES FINALES:');
console.log('='.repeat(40));
console.log(
  `✅ React no definido: ${resultados.reactNoDefinido} archivos corregidos`
);
console.log(
  `✅ Variables no utilizadas: ${resultados.variablesNoUtilizadas} archivos corregidos`
);
console.log(
  `✅ Imports no utilizados: ${resultados.importsNoUtilizados} archivos corregidos`
);
console.log(
  `✅ mtzService.js: ${resultados.mtzService ? 'Corregido' : 'Sin cambios'}`
);

console.log('\n🔧 PRÓXIMOS PASOS:');
console.log('1. npm run lint              # Verificar errores restantes');
console.log('2. npm run build             # Verificar build');
console.log('3. npm run dev               # Probar en desarrollo');

console.log('\n🎯 PLAN DE VERIFICACIÓN:');
console.log('1. Verificar que el servidor de desarrollo funcione');
console.log('2. Probar navegación entre páginas');
console.log('3. Verificar funcionalidades principales');
console.log('4. Hacer build para producción');

export {
  corregirReactNoDefinido,
  corregirVariablesNoUtilizadas,
  corregirImportsNoUtilizados,
  corregirMtzService,
};
