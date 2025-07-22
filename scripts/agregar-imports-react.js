#!/usr/bin/env node

/**
 * Script para agregar imports de React faltantes en archivos JSX
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

    // Verificar si ya tiene import de React
    const hasReactImport = /import\s+React/.test(content);
    const hasJSX = /<[A-Z][^>]*>/.test(content);
    const hasHooks =
      /useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useDebugValue|useImperativeHandle|useInsertionEffect/.test(
        content
      );

    // Si no tiene import de React pero usa JSX o hooks, agregarlo
    if (!hasReactImport && (hasJSX || hasHooks)) {
      const reactImport =
        "import React, { useState, useCallback, useEffect } from 'react';\n";
      content = reactImport + content;
      modified = true;
      console.log(`✅ Agregado import de React: ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
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
    } else if (file.endsWith('.jsx')) {
      processFile(filePath);
    }
  });
}

// Procesar archivos
console.log('🔧 Agregando imports de React faltantes...\n');
processDirectory(path.join(__dirname, '../src'));
console.log('\n✅ Proceso completado');
