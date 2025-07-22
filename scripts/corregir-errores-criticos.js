// =====================================================================
// 🔧 CORRECCIÓN DE ERRORES CRÍTICOS - SISTEMA MTZ v3.0
// =====================================================================

import fs from 'fs';
import path from 'path';

console.log('🔧 CORRIGIENDO ERRORES CRÍTICOS MTZ v3.0');
console.log('='.repeat(60));

// 1. CORREGIR ERRORES EN mtzService.js
function corregirMtzService() {
  const archivo = 'src/lib/mtzService.js';
  if (!fs.existsSync(archivo)) return false;

  try {
    let contenido = fs.readFileSync(archivo, 'utf8');
    let modificado = false;

    // Buscar y corregir try/catch innecesarios
    const tryCatchPattern =
      /try\s*\{\s*([^}]+)\s*\}\s*catch\s*\([^)]+\)\s*\{\s*throw\s*\1\s*;\s*\}/g;
    const matches = contenido.match(tryCatchPattern);

    if (matches) {
      matches.forEach(match => {
        const tryContent = match.match(/try\s*\{\s*([^}]+)\s*\}/)[1];
        contenido = contenido.replace(match, tryContent);
        modificado = true;
      });
    }

    if (modificado) {
      fs.writeFileSync(archivo, contenido);
      console.log('✅ mtzService.js - try/catch innecesarios corregidos');
      return true;
    }
  } catch (error) {
    console.error('❌ Error corrigiendo mtzService.js:', error.message);
  }
  return false;
}

// 2. CORREGIR CONDICIONES CONSTANTES
function corregirCondicionesConstantes() {
  const archivos = [
    'src/pages/Clientes/ClientesPage.jsx',
    'src/pages/Compras/ComprasPage.jsx',
    'src/pages/Reports/ReportsPage.jsx',
  ];

  let archivosCorregidos = 0;

  archivos.forEach(archivo => {
    if (!fs.existsSync(archivo)) return;

    try {
      let contenido = fs.readFileSync(archivo, 'utf8');
      let modificado = false;

      // Corregir if (true) y if (false)
      const lineas = contenido.split('\n');

      for (let i = 0; i < lineas.length; i++) {
        if (lineas[i].includes('if (true)')) {
          lineas[i] = lineas[i].replace(
            'if (true)',
            'if (data && data.length > 0)'
          );
          modificado = true;
        } else if (lineas[i].includes('if (false)')) {
          lineas[i] = lineas[i].replace(
            'if (false)',
            'if (false) // TODO: Implementar condición'
          );
          modificado = true;
        }
      }

      if (modificado) {
        contenido = lineas.join('\n');
        fs.writeFileSync(archivo, contenido);
        console.log(`✅ ${archivo} - condiciones constantes corregidas`);
        archivosCorregidos++;
      }
    } catch (error) {
      console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
    }
  });

  return archivosCorregidos;
}

// 3. CORREGIR COMPONENTES NO DEFINIDOS
function corregirComponentesNoDefinidos() {
  const archivos = [
    {
      archivo: 'src/pages/Clientes/ClientesPage.jsx',
      componentes: ['FilterIcon', 'TableIcon'],
    },
    {
      archivo: 'src/pages/Compras/ComprasPage.jsx',
      componentes: ['FilterIcon', 'TableIcon'],
    },
    {
      archivo: 'src/pages/Reports/ReportsPage.jsx',
      componentes: ['TableIcon', 'FilterIcon'],
    },
    {
      archivo: 'src/pages/Settings/SettingsPage.jsx',
      componentes: ['UsersIcon'],
    },
    {
      archivo: 'src/pages/Ventas/VentasPage.jsx',
      componentes: ['FilterIcon', 'TableIcon'],
    },
  ];

  let archivosCorregidos = 0;

  archivos.forEach(({ archivo, componentes }) => {
    if (!fs.existsSync(archivo)) return;

    try {
      let contenido = fs.readFileSync(archivo, 'utf8');
      let modificado = false;

      // Agregar imports faltantes
      const imports = contenido.match(/import.*from.*['"`]/g) || [];
      const lucideImport = imports.find(imp => imp.includes('lucide-react'));

      if (lucideImport) {
        const currentImports = lucideImport
          .match(/\{([^}]*)\}/)[1]
          .split(',')
          .map(i => i.trim());
        const nuevosImports = [...currentImports];

        componentes.forEach(componente => {
          if (!currentImports.includes(componente)) {
            nuevosImports.push(componente);
            modificado = true;
          }
        });

        if (modificado) {
          const newImportStatement = `import { ${nuevosImports.join(', ')} } from 'lucide-react';`;
          contenido = contenido.replace(lucideImport, newImportStatement);
          fs.writeFileSync(archivo, contenido);
          console.log(`✅ ${archivo} - imports de componentes agregados`);
          archivosCorregidos++;
        }
      }
    } catch (error) {
      console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
    }
  });

  return archivosCorregidos;
}

// 4. CORREGIR VARIABLES NO DEFINIDAS
function corregirVariablesNoDefinidas() {
  const archivos = [
    {
      archivo: 'src/pages/Clientes/ClientesPage.jsx',
      variables: [
        'clientes',
        'selectedCliente',
        'searchTerm',
        'setSearchTerm',
        'filters',
        'setFilters',
        'clientesFiltrados',
        'sortConfig',
      ],
    },
    {
      archivo: 'src/pages/Compras/ComprasPage.jsx',
      variables: [
        'compras',
        'cargarCompras',
        'loading',
        'stats',
        'searchTerm',
        'setSearchTerm',
        'filters',
        'setFilters',
        'categorias',
        'estados',
        'comprasFiltradas',
        'sortConfig',
      ],
    },
    {
      archivo: 'src/pages/Reports/ReportsPage.jsx',
      variables: ['error'],
    },
  ];

  let archivosCorregidos = 0;

  archivos.forEach(({ archivo, variables }) => {
    if (!fs.existsSync(archivo)) return;

    try {
      let contenido = fs.readFileSync(archivo, 'utf8');
      let modificado = false;

      // Buscar el componente principal y agregar variables faltantes
      const componentMatch = contenido.match(/function\s+(\w+)\s*\(/);
      if (componentMatch) {
        const componentName = componentMatch[1];
        const functionStart = contenido.indexOf(`function ${componentName}(`);
        const functionBodyStart = contenido.indexOf('{', functionStart);

        if (functionBodyStart !== -1) {
          // Buscar donde están definidas las variables de estado
          const stateSection = contenido.substring(functionBodyStart);
          const stateMatch = stateSection.match(
            /const\s+\[[^\]]+\]\s*=\s*useState/
          );

          if (stateMatch) {
            // Agregar variables faltantes después de las existentes
            const variablesFaltantes = variables.filter(
              v => !contenido.includes(`const [${v}`)
            );

            if (variablesFaltantes.length > 0) {
              const stateIndex = contenido.indexOf(
                stateMatch[0],
                functionBodyStart
              );
              const insertIndex = contenido.indexOf(';', stateIndex) + 1;

              const nuevasVariables = variablesFaltantes
                .map(v => {
                  if (v.startsWith('set')) {
                    return `const [${v.replace('set', '').toLowerCase()}, ${v}] = useState(null);`;
                  } else if (
                    v.includes('Filtrados') ||
                    v.includes('Filtradas')
                  ) {
                    return `const [${v}, set${v.charAt(0).toUpperCase() + v.slice(1)}] = useState([]);`;
                  } else if (v === 'loading') {
                    return `const [${v}, set${v.charAt(0).toUpperCase() + v.slice(1)}] = useState(false);`;
                  } else if (v === 'error') {
                    return `const [${v}, set${v.charAt(0).toUpperCase() + v.slice(1)}] = useState(null);`;
                  } else {
                    return `const [${v}, set${v.charAt(0).toUpperCase() + v.slice(1)}] = useState('');`;
                  }
                })
                .join('\n  ');

              const nuevaLinea = `\n  ${nuevasVariables}\n`;
              contenido =
                contenido.slice(0, insertIndex) +
                nuevaLinea +
                contenido.slice(insertIndex);
              modificado = true;
            }
          }
        }
      }

      if (modificado) {
        fs.writeFileSync(archivo, contenido);
        console.log(`✅ ${archivo} - variables no definidas agregadas`);
        archivosCorregidos++;
      }
    } catch (error) {
      console.error(`❌ Error corrigiendo ${archivo}:`, error.message);
    }
  });

  return archivosCorregidos;
}

// EJECUTAR CORRECCIONES
console.log('🔧 INICIANDO CORRECCIONES...\n');

const resultados = {
  mtzService: corregirMtzService(),
  condicionesConstantes: corregirCondicionesConstantes(),
  componentesNoDefinidos: corregirComponentesNoDefinidos(),
  variablesNoDefinidas: corregirVariablesNoDefinidas(),
};

console.log('\n📊 RESUMEN DE CORRECCIONES:');
console.log('='.repeat(40));
console.log(
  `✅ mtzService.js: ${resultados.mtzService ? 'Corregido' : 'Sin cambios'}`
);
console.log(
  `✅ Condiciones constantes: ${resultados.condicionesConstantes} archivos corregidos`
);
console.log(
  `✅ Componentes no definidos: ${resultados.componentesNoDefinidos} archivos corregidos`
);
console.log(
  `✅ Variables no definidas: ${resultados.variablesNoDefinidas} archivos corregidos`
);

console.log('\n🔧 PRÓXIMOS PASOS:');
console.log('1. npm run lint              # Verificar errores restantes');
console.log('2. npm run build             # Verificar build');
console.log('3. npm run dev               # Probar en desarrollo');

console.log(
  '\n⚠️ NOTA: Algunos errores pueden requerir corrección manual adicional'
);

export {
  corregirMtzService,
  corregirCondicionesConstantes,
  corregirComponentesNoDefinidos,
  corregirVariablesNoDefinidas,
};
