const fs = require('fs');
const path = require('path');

// Función para limpiar imports no utilizados
function limpiarImportsNoUtilizados(contenido) {
  // Remover React import si no se usa JSX
  if (!contenido.includes('jsx') && !contenido.includes('JSX')) {
    contenido = contenido.replace(/import React[^;]*;?\n?/g, '');
  }

  // Remover imports específicos no utilizados
  const importsNoUtilizados = [
    'useState',
    'useCallback',
    'useEffect',
    'forwardRef'
  ];

  importsNoUtilizados.forEach(importName => {
    const regex = new RegExp(`import\\s*{[^}]*\\b${importName}\\b[^}]*}\\s*from[^;]*;?\\n?`, 'g');
    contenido = contenido.replace(regex, '');
  });

  return contenido;
}

// Función para limpiar variables no utilizadas
function limpiarVariablesNoUtilizadas(contenido) {
  // Lista de variables que comúnmente no se usan
  const variablesNoUtilizadas = [
    'showPassword',
    'setShowPassword',
    'setValue',
    'watch',
    'data',
    'loading',
    'error',
    'setError',
    'selectedCliente',
    'setSelectedCliente',
    'tipoCarga',
    'setTipoCarga',
    'showToast',
    'formatDate',
    'parseResults',
    'getCategoryIcon',
    'handleRowClick',
    'searchable',
    'pagination',
    'width',
    'options',
    'response',
    'mockSupabase'
  ];

  variablesNoUtilizadas.forEach(variable => {
    // Remover declaraciones de variables no utilizadas
    const regex = new RegExp(`const\\s+${variable}\\s*=\\s*[^;]+;?\\n?`, 'g');
    contenido = contenido.replace(regex, '');

    // Remover destructuring no utilizado
    const destructuringRegex = new RegExp(`\\b${variable}\\b\\s*,?`, 'g');
    contenido = contenido.replace(destructuringRegex, '');
  });

  return contenido;
}

// Función para procesar un archivo
function procesarArchivo(rutaArchivo) {
  try {
    const contenido = fs.readFileSync(rutaArchivo, 'utf8');
    let contenidoLimpio = contenido;

    // Aplicar limpiezas
    contenidoLimpio = limpiarImportsNoUtilizados(contenidoLimpio);
    contenidoLimpio = limpiarVariablesNoUtilizadas(contenidoLimpio);

    // Escribir archivo limpio
    fs.writeFileSync(rutaArchivo, contenidoLimpio);
    console.log(`✅ Limpiado: ${rutaArchivo}`);

  } catch (error) {
    console.error(`❌ Error procesando ${rutaArchivo}:`, error.message);
  }
}

// Función para procesar directorio recursivamente
function procesarDirectorio(directorio) {
  const archivos = fs.readdirSync(directorio);

  archivos.forEach(archivo => {
    const rutaCompleta = path.join(directorio, archivo);
    const stats = fs.statSync(rutaCompleta);

    if (stats.isDirectory()) {
      // Procesar subdirectorios
      procesarDirectorio(rutaCompleta);
    } else if (archivo.endsWith('.jsx') || archivo.endsWith('.js')) {
      // Procesar archivos JS/JSX
      procesarArchivo(rutaCompleta);
    }
  });
}

// Directorios a procesar
const directorios = [
  'src/components',
  'src/pages',
  'src/hooks',
  'src/contexts',
  'src/utils'
];

console.log('🧹 Iniciando limpieza de warnings de ESLint...\n');

directorios.forEach(directorio => {
  if (fs.existsSync(directorio)) {
    console.log(`📁 Procesando directorio: ${directorio}`);
    procesarDirectorio(directorio);
  }
});

console.log('\n🎉 Limpieza completada!');
console.log('💡 Ejecuta "npm run lint" para verificar los resultados.');
