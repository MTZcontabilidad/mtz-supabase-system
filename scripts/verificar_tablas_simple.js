const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Verificando configuración de Supabase...');
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada');
console.log('Key:', supabaseKey ? '✅ Configurada' : '❌ No configurada');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTablas() {
  try {
    console.log('\n📋 Verificando tablas principales...');

    // Verificar usuarios_sistema
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios_sistema')
      .select('*');

    if (usuariosError) {
      console.log('❌ Error en usuarios_sistema:', usuariosError.message);
    } else {
      console.log('✅ usuarios_sistema:', usuarios?.length || 0, 'registros');
      if (usuarios && usuarios.length > 0) {
        usuarios.forEach(user => {
          console.log(
            `   - ${user.email} (${user.nombre_completo}) - Rol ID: ${user.rol_id}`
          );
        });
      }
    }

    // Verificar roles
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*');

    if (rolesError) {
      console.log('❌ Error en roles:', rolesError.message);
    } else {
      console.log('✅ roles:', roles?.length || 0, 'registros');
      if (roles && roles.length > 0) {
        roles.forEach(role => {
          console.log(`   - ${role.nombre} (ID: ${role.id})`);
        });
      }
    }

    // Verificar empresas
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('*');

    if (empresasError) {
      console.log('❌ Error en empresas:', empresasError.message);
    } else {
      console.log('✅ empresas:', empresas?.length || 0, 'registros');
    }

    // Verificar ventas
    const { data: ventas, error: ventasError } = await supabase
      .from('ventas')
      .select('*');

    if (ventasError) {
      console.log('❌ Error en ventas:', ventasError.message);
    } else {
      console.log('✅ ventas:', ventas?.length || 0, 'registros');
    }

    console.log('\n📋 Buscando usuario administrador específico...');

    const { data: adminUser, error: adminError } = await supabase
      .from('usuarios_sistema')
      .select('*')
      .eq('email', 'mtzcontabilidad@gmail.com');

    if (adminError) {
      console.log('❌ Error al buscar admin:', adminError.message);
    } else if (adminUser && adminUser.length > 0) {
      console.log('✅ Usuario administrador encontrado:', adminUser[0]);
    } else {
      console.log('❌ Usuario administrador NO encontrado');
      console.log(
        '🔧 Necesitas ejecutar los scripts SQL para crear el usuario'
      );
    }
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verificarTablas();
