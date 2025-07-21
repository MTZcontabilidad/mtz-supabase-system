// Script para generar todo el SQL necesario para crear la estructura completa del sistema MTZ
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📝 GENERANDO SQL COMPLETO PARA SISTEMA MTZ');
console.log('==========================================');

// Función para leer archivo SQL
function leerArchivoSQL(nombreArchivo) {
  const rutaArchivo = path.join(
    __dirname,
    '..',
    'database',
    '01_schemas',
    nombreArchivo
  );
  try {
    return fs.readFileSync(rutaArchivo, 'utf8');
  } catch (error) {
    console.log(`❌ No se pudo leer ${nombreArchivo}:`, error.message);
    return null;
  }
}

// Función para generar SQL completo
function generarSQLCompleto() {
  console.log('\n🔍 Leyendo archivos SQL...');

  // Lista de archivos SQL en orden de dependencias
  const archivosSQL = [
    'roles.sql',
    'usuarios.sql',
    'empresas.sql',
    'ventas_cobranza.sql',
    'rrhh.sql',
    'proyecciones.sql',
    'asignaciones.sql',
    'asignaciones_clientes.sql',
    'dashboard_views.sql',
  ];

  let sqlCompleto = `-- =====================================================================
-- 🏗️ SCRIPT COMPLETO DE CREACIÓN - SISTEMA MTZ
-- =====================================================================
--
-- INSTRUCCIONES:
-- 1. Copia todo este contenido
-- 2. Ve a Supabase Dashboard > SQL Editor
-- 3. Pega el contenido y ejecuta
-- 4. Verifica que todas las tablas se crearon correctamente
--
-- =====================================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 🎭 TABLA DE ROLES
-- =====================================================================

`;

  let archivosLeidos = 0;

  for (const archivo of archivosSQL) {
    const sql = leerArchivoSQL(archivo);
    if (sql) {
      sqlCompleto += `-- =====================================================================
-- 📁 ${archivo.toUpperCase()}
-- =====================================================================

${sql}

`;
      archivosLeidos++;
      console.log(`✅ ${archivo} leído`);
    }
  }

  // Agregar datos iniciales
  sqlCompleto += `-- =====================================================================
-- 📊 DATOS INICIALES
-- =====================================================================

-- Insertar roles básicos
INSERT INTO public.roles (nombre, descripcion, permisos) VALUES
('administrador', 'Acceso completo al sistema', '{"all": true}'),
('colaborador', 'Acceso limitado al sistema', '{"read": true, "write": true}'),
('cliente', 'Acceso solo a datos de su empresa', '{"read_own": true}'),
('externo', 'Acceso de solo lectura', '{"read": true}')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar empresa demo
INSERT INTO public.empresas (razon_social, nombre_fantasia, rut, giro, direccion, comuna, ciudad, region, telefono, email, tipo_empresa, estado) VALUES
('MTZ Sistemas Ltda.', 'MTZ', '76.123.456-7', 'Desarrollo de Software', 'Av. Providencia 1234', 'Providencia', 'Santiago', 'Metropolitana', '+56 2 2345 6789', 'contacto@mtz.cl', 'cliente', 'activa')
ON CONFLICT (rut) DO NOTHING;

-- =====================================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================================
--
-- Verificar que todas las tablas se crearon:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
--
`;

  // Guardar archivo SQL completo
  const rutaSalida = path.join(__dirname, 'sql-completo-mtz.sql');
  fs.writeFileSync(rutaSalida, sqlCompleto, 'utf8');

  console.log('\n📊 RESUMEN DE GENERACIÓN');
  console.log('========================');
  console.log(`✅ Archivos leídos: ${archivosLeidos}`);
  console.log(`📁 Archivo generado: ${rutaSalida}`);
  console.log(`📝 Tamaño: ${(sqlCompleto.length / 1024).toFixed(2)} KB`);

  console.log('\n🎯 PRÓXIMOS PASOS:');
  console.log('==================');
  console.log('1. Ve a Supabase Dashboard > SQL Editor');
  console.log('2. Abre el archivo: scripts/sql-completo-mtz.sql');
  console.log('3. Copia todo el contenido');
  console.log('4. Pégalo en el SQL Editor de Supabase');
  console.log('5. Ejecuta el script');
  console.log('6. Verifica que las tablas se crearon');

  return rutaSalida;
}

// Ejecutar
const archivoGenerado = generarSQLCompleto();
console.log(`\n✅ SQL completo generado en: ${archivoGenerado}`);
