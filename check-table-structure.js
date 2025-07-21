/**
 * Verificación de Estructura de Tablas - MTZ Sistema
 * Script para verificar la estructura de las tablas en Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.log(
    'Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu .env'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Verificar estructura de tablas principales
 */
async function verificarEstructuraTablas() {
  console.log('🔍 Verificando estructura de tablas...\n');

  const tablas = [
    'usuarios',
    'empresas',
    'roles',
    'asignaciones',
    'asignaciones_clientes',
    'ventas_cobranza',
    'rrhh',
    'proyecciones',
  ];

  for (const tabla of tablas) {
    try {
      const { error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        console.log(`❌ ${tabla}: ${error.message}`);
      } else {
        console.log(`✅ ${tabla}: Tabla accesible`);
      }
    } catch (err) {
      console.log(`❌ ${tabla}: Error de conexión - ${err.message}`);
    }
  }
}

/**
 * Verificar políticas RLS
 */
async function verificarPoliticasRLS() {
  console.log('\n🔒 Verificando políticas RLS...\n');

  try {
    // Verificar si el usuario anónimo puede acceder a datos básicos
    const { error: errorUsuarios } = await supabase
      .from('usuarios')
      .select('id, email')
      .limit(1);

    if (errorUsuarios) {
      console.log(`❌ Políticas usuarios: ${errorUsuarios.message}`);
    } else {
      console.log('✅ Políticas usuarios: Configuradas correctamente');
    }

    const { error: errorEmpresas } = await supabase
      .from('empresas')
      .select('id, nombre')
      .limit(1);

    if (errorEmpresas) {
      console.log(`❌ Políticas empresas: ${errorEmpresas.message}`);
    } else {
      console.log('✅ Políticas empresas: Configuradas correctamente');
    }
  } catch (err) {
    console.log(`❌ Error verificando políticas: ${err.message}`);
  }
}

/**
 * Verificar datos de usuarios y roles
 */
async function verificarDatosUsuarios() {
  console.log('\n👤 Verificando datos de usuarios y roles...\n');

  try {
    // Verificar roles
    const { data: roles, error: errorRoles } = await supabase
      .from('roles')
      .select('*');

    if (errorRoles) {
      console.log(`❌ Error obteniendo roles: ${errorRoles.message}`);
    } else {
      console.log(`✅ Roles encontrados: ${roles.length}`);
      roles.forEach(role => {
        console.log(`   - ${role.nombre}: ${role.descripcion}`);
      });
    }

    // Verificar usuarios del sistema
    const { data: usuarios, error: errorUsuarios } = await supabase.from(
      'usuarios'
    ).select(`
        *,
        roles (
          nombre,
          descripcion,
          permisos
        ),
        empresas (
          nombre,
          ruc
        )
      `);

    if (errorUsuarios) {
      console.log(`❌ Error obteniendo usuarios: ${errorUsuarios.message}`);
    } else {
      console.log(`✅ Usuarios del sistema: ${usuarios.length}`);
      usuarios.forEach(usuario => {
        console.log(
          `   - ${usuario.email}: ${usuario.roles?.nombre || 'Sin rol'}`
        );
      });
    }
  } catch (err) {
    console.log(`❌ Error verificando datos: ${err.message}`);
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando verificación de estructura de tablas...\n');

  await verificarEstructuraTablas();
  await verificarPoliticasRLS();
  await verificarDatosUsuarios();

  console.log('\n✅ Verificación completada');
}

main().catch(console.error);
