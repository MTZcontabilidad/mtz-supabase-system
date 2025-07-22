#!/usr/bin/env node

/**
 * Script inteligente para limpiar imports no utilizados en el proyecto MTZ
 * Solo elimina imports cuando realmente no se necesitan
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para procesar un archivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Solo eliminar import de React si NO se usan hooks ni JSX
    const hasJSX = /<[A-Z][^>]*>/.test(content);
    const hasHooks =
      /useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useDebugValue|useImperativeHandle|useInsertionEffect/.test(
        content
      );
    const hasReactDot = /React\./.test(content);
    const hasLazySuspense = /lazy|Suspense/.test(content);

    const reactImportRegex =
      /import React(?:,?\s*{[^}]*})?\s+from\s+['"]react['"];?\s*\n/g;

    // Solo eliminar si no hay hooks, no hay React., no hay lazy/Suspense, pero hay JSX
    if (hasJSX && !hasHooks && !hasReactDot && !hasLazySuspense) {
      content = content.replace(reactImportRegex, '');
      modified = true;
    }

    // Eliminar imports de iconos no utilizados (patrón común)
    const iconImports = content.match(
      /import\s*{[^}]*}\s+from\s+['"]lucide-react['"];?\s*\n/g
    );
    if (iconImports) {
      iconImports.forEach(importStatement => {
        const icons = importStatement.match(/import\s*{([^}]*)}\s+from/)[1];
        const iconList = icons.split(',').map(icon => icon.trim());

        // Verificar si los iconos se usan en el archivo
        const unusedIcons = iconList.filter(icon => {
          const iconName = icon.replace(/\s+as\s+\w+/, '').trim();
          return (
            !content.includes(`<${iconName}`) &&
            !content.includes(`${iconName}`) &&
            !content.includes(`'${iconName}'`)
          );
        });

        if (unusedIcons.length > 0) {
          const usedIcons = iconList.filter(icon => {
            const iconName = icon.replace(/\s+as\s+\w+/, '').trim();
            return (
              content.includes(`<${iconName}`) ||
              content.includes(`${iconName}`) ||
              content.includes(`'${iconName}'`)
            );
          });

          if (usedIcons.length === 0) {
            content = content.replace(importStatement, '');
          } else {
            const newImport = `import { ${usedIcons.join(', ')} } from 'lucide-react';\n`;
            content = content.replace(importStatement, newImport);
          }
          modified = true;
        }
      });
    }

    // Eliminar imports de componentes no utilizados
    const componentImports = content.match(
      /import\s+(\w+)\s+from\s+['"][^'"]+['"];?\s*\n/g
    );
    if (componentImports) {
      componentImports.forEach(importStatement => {
        const componentName = importStatement.match(/import\s+(\w+)\s+from/)[1];
        if (
          !content.includes(`<${componentName}`) &&
          !content.includes(`${componentName}`)
        ) {
          content = content.replace(importStatement, '');
          modified = true;
        }
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Limpiado: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Función para procesar directorio recursivamente
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith('.') &&
      file !== 'node_modules'
    ) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(filePath);
    }
  });
}

// Procesar archivos
console.log('🧹 Limpiando imports no utilizados (modo inteligente)...\n');

const srcPath = path.join(__dirname, '..', 'src');
processDirectory(srcPath);

console.log('\n✅ Limpieza completada!');
console.log('💡 Ejecuta "npm run lint" para verificar los resultados.');
