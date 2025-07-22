// =====================================================================
// 🔍 VERIFICACIÓN USUARIO ADMINISTRADOR - SISTEMA MTZ v3.0
// =====================================================================
// Script para verificar la configuración del usuario administrador
// Ejecutar con: node scripts/verificar_usuario_admin.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.log('Asegúrate de tener un archivo .env.local con:');
  console.log('VITE_SUPABASE_URL=tu_url_de_supabase');
  console.log('VITE_SUPABASE_ANON_KEY=tu_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarUsuarioAdmin() {
  console.log('🔍 Verificando configuración del usuario administrador...\n');

  try {
    // 1. Verificar si existe en auth.users
    console.log('📋 1. Verificando auth.users...');
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data, created_at')
      .eq('email', 'mtzcontabilidad@gmail.com');

    if (authError) {
      console.log(
        '⚠️  No se puede acceder directamente a auth.users desde el cliente'
      );
      console.log(
        '   Esto es normal - auth.users solo es accesible desde el dashboard de Supabase'
      );
    } else {
      console.log('✅ Usuario encontrado en auth.users:', authUsers);
    }

    // 2. Verificar si existe en usuarios_sistema
    console.log('\n📋 2. Verificando usuarios_sistema...');
    const { data: usuariosSistema, error: usuariosError } = await supabase
      .from('usuarios_sistema')
      .select('*')
      .eq('email', 'mtzcontabilidad@gmail.com');

    if (usuariosError) {
      console.error('❌ Error al consultar usuarios_sistema:', usuariosError);
    } else {
      if (usuariosSistema && usuariosSistema.length > 0) {
        console.log(
          '✅ Usuario encontrado en usuarios_sistema:',
          usuariosSistema[0]
        );
      } else {
        console.log('❌ Usuario NO encontrado en usuarios_sistema');
      }
    }

    // 3. Verificar roles
    console.log('\n📋 3. Verificando roles...');
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('id');

    if (rolesError) {
      console.error('❌ Error al consultar roles:', rolesError);
    } else {
      console.log('✅ Roles disponibles:', roles);
    }

    // 4. Verificar todas las tablas principales
    console.log('\n📋 4. Verificando estructura de tablas...');
    const tablas = [
      'roles',
      'usuarios_sistema',
      'empresas',
      'ventas',
      'cobranzas',
      'servicios',
      'detalles_venta',
      'proyecciones',
      'empleados',
      'nominas',
    ];

    for (const tabla of tablas) {
      const { data, error } = await supabase
        .from(tabla)
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Error en tabla ${tabla}:`, error.message);
      } else {
        console.log(`✅ Tabla ${tabla}: ${data[0]?.count || 0} registros`);
      }
    }

    // 5. Verificar políticas RLS
    console.log('\n📋 5. Verificando políticas RLS...');
    const { data: policies, error: policiesError } =
      await supabase.rpc('get_policies_info');

    if (policiesError) {
      console.log('⚠️  No se pueden verificar políticas RLS desde el cliente');
      console.log(
        '   Verifica manualmente en el dashboard de Supabase > Authentication > Policies'
      );
    } else {
      console.log('✅ Políticas RLS:', policies);
    }

    // 6. Recomendaciones
    console.log('\n📋 6. Recomendaciones:');

    if (!usuariosSistema || usuariosSistema.length === 0) {
      console.log('🔧 ACCIÓN REQUERIDA:');
      console.log('   1. Ve a Supabase Dashboard > Authentication > Users');
      console.log(
        '   2. Crea el usuario: mtzcontabilidad@gmail.com / Alohomora33@'
      );
      console.log(
        '   3. Ejecuta el script database/configurar_admin_principal.sql'
      );
      console.log('   4. Ejecuta el script database/insert_test_data.sql');
    } else {
      console.log('✅ Usuario administrador configurado correctamente');
    }

    console.log('\n📋 7. Próximos pasos:');
    console.log(
      '   1. Verifica que el usuario existe en Authentication > Users'
    );
    console.log('   2. Asegúrate de que el rol sea "admin" en user_metadata');
    console.log('   3. Ejecuta los scripts SQL si no se han ejecutado');
    console.log('   4. Prueba el login en la aplicación');
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar verificación
verificarUsuarioAdmin();
