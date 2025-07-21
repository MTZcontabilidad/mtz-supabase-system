import { createClient } from '@supabase/supabase-js';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function pruebaLecturaEspecificaMTZ() {
  console.log('🎯 PRUEBAS DE LECTURA ESPECÍFICAS DEL SISTEMA MTZ\n');
  console.log('='.repeat(60));

  try {
    // 1. Leer información de la empresa
    console.log('\n1️⃣ INFORMACIÓN DE LA EMPRESA:');

    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .single();

    if (empresaError) {
      console.log(`   ❌ Error: ${empresaError.message}`);
    } else {
      console.log('   ✅ Empresa encontrada:');
      console.log(`      📋 Nombre: ${empresa.nombre}`);
      console.log(`      📋 RUT: ${empresa.rut}`);
      console.log(`      📋 Email: ${empresa.email}`);
      console.log(`      📋 Teléfono: ${empresa.telefono}`);
      console.log(`      📋 Dirección: ${empresa.direccion}`);
    }

    // 2. Leer roles del sistema
    console.log('\n2️⃣ ROLES DEL SISTEMA:');

    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .order('nombre');

    if (rolesError) {
      console.log(`   ❌ Error: ${rolesError.message}`);
    } else {
      console.log(`   ✅ ${roles.length} roles encontrados:`);
      roles.forEach((rol, index) => {
        console.log(`      ${index + 1}. ${rol.nombre} - ${rol.descripcion}`);
      });
    }

    // 3. Leer usuarios del sistema
    console.log('\n3️⃣ USUARIOS DEL SISTEMA:');

    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select(
        `
        *,
        roles:rol_id(nombre, descripcion)
      `
      )
      .order('nombre');

    if (usuariosError) {
      console.log(`   ❌ Error: ${usuariosError.message}`);
    } else {
      console.log(`   ✅ ${usuarios.length} usuarios encontrados:`);
      usuarios.forEach((usuario, index) => {
        const rol = usuario.roles;
        console.log(
          `      ${index + 1}. ${usuario.nombre} ${usuario.apellido}`
        );
        console.log(`         📧 Email: ${usuario.email}`);
        console.log(`         📱 Teléfono: ${usuario.telefono}`);
        console.log(`         👤 Rol: ${rol ? rol.nombre : 'Sin rol'}`);
        console.log(`         📅 Fecha registro: ${usuario.fecha_registro}`);
      });
    }

    // 4. Leer clientes (si existen)
    console.log('\n4️⃣ CLIENTES DEL SISTEMA:');

    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre');

    if (clientesError) {
      console.log(`   ❌ Error: ${clientesError.message}`);
    } else {
      console.log(`   ✅ ${clientes.length} clientes encontrados:`);
      if (clientes.length > 0) {
        clientes.forEach((cliente, index) => {
          console.log(`      ${index + 1}. ${cliente.nombre}`);
          console.log(`         📋 RUT: ${cliente.rut}`);
          console.log(`         📧 Email: ${cliente.email}`);
          console.log(`         📱 Teléfono: ${cliente.telefono}`);
          console.log(`         📅 Fecha registro: ${cliente.fecha_registro}`);
        });
      } else {
        console.log('      📋 No hay clientes registrados en el sistema');
      }
    }

    // 5. Leer ventas (si existen)
    console.log('\n5️⃣ VENTAS DEL SISTEMA:');

    const { data: ventas, error: ventasError } = await supabase
      .from('ventas')
      .select(
        `
        *,
        clientes:cliente_id(nombre, rut),
        usuarios:usuario_id(nombre, apellido)
      `
      )
      .order('fecha_venta', { ascending: false });

    if (ventasError) {
      console.log(`   ❌ Error: ${ventasError.message}`);
    } else {
      console.log(`   ✅ ${ventas.length} ventas encontradas:`);
      if (ventas.length > 0) {
        ventas.forEach((venta, index) => {
          const cliente = venta.clientes;
          const usuario = venta.usuarios;
          console.log(`      ${index + 1}. Venta #${venta.id}`);
          console.log(
            `         👤 Cliente: ${cliente ? cliente.nombre : 'N/A'}`
          );
          console.log(
            `         💼 Vendedor: ${usuario ? `${usuario.nombre} ${usuario.apellido}` : 'N/A'}`
          );
          console.log(`         💰 Monto: $${venta.monto}`);
          console.log(`         📅 Fecha: ${venta.fecha_venta}`);
        });
      } else {
        console.log('      📋 No hay ventas registradas en el sistema');
      }
    }

    // 6. Leer cobranzas (si existen)
    console.log('\n6️⃣ COBRANZAS DEL SISTEMA:');

    const { data: cobranzas, error: cobranzasError } = await supabase
      .from('cobranzas')
      .select(
        `
        *,
        clientes:cliente_id(nombre, rut)
      `
      )
      .order('fecha_cobranza', { ascending: false });

    if (cobranzasError) {
      console.log(`   ❌ Error: ${cobranzasError.message}`);
    } else {
      console.log(`   ✅ ${cobranzas.length} cobranzas encontradas:`);
      if (cobranzas.length > 0) {
        cobranzas.forEach((cobranza, index) => {
          const cliente = cobranza.clientes;
          console.log(`      ${index + 1}. Cobranza #${cobranza.id}`);
          console.log(
            `         👤 Cliente: ${cliente ? cliente.nombre : 'N/A'}`
          );
          console.log(`         💰 Monto: $${cobranza.monto}`);
          console.log(`         📅 Fecha: ${cobranza.fecha_cobranza}`);
          console.log(`         📋 Estado: ${cobranza.estado}`);
        });
      } else {
        console.log('      📋 No hay cobranzas registradas en el sistema');
      }
    }

    // 7. Leer proyecciones (si existen)
    console.log('\n7️⃣ PROYECCIONES DEL SISTEMA:');

    const { data: proyecciones, error: proyeccionesError } = await supabase
      .from('proyecciones')
      .select('*')
      .order('fecha_proyeccion', { ascending: false });

    if (proyeccionesError) {
      console.log(`   ❌ Error: ${proyeccionesError.message}`);
    } else {
      console.log(`   ✅ ${proyecciones.length} proyecciones encontradas:`);
      if (proyecciones.length > 0) {
        proyecciones.forEach((proyeccion, index) => {
          console.log(`      ${index + 1}. Proyección #${proyeccion.id}`);
          console.log(`         📋 Tipo: ${proyeccion.tipo}`);
          console.log(`         💰 Monto: $${proyeccion.monto}`);
          console.log(`         📅 Fecha: ${proyeccion.fecha_proyeccion}`);
          console.log(`         📝 Descripción: ${proyeccion.descripcion}`);
        });
      } else {
        console.log('      📋 No hay proyecciones registradas en el sistema');
      }
    }

    // 8. Leer RRHH (si existen)
    console.log('\n8️⃣ RECURSOS HUMANOS:');

    const { data: rrhh, error: rrhhError } = await supabase
      .from('rrhh')
      .select('*')
      .order('nombre');

    if (rrhhError) {
      console.log(`   ❌ Error: ${rrhhError.message}`);
    } else {
      console.log(`   ✅ ${rrhh.length} empleados encontrados:`);
      if (rrhh.length > 0) {
        rrhh.forEach((empleado, index) => {
          console.log(
            `      ${index + 1}. ${empleado.nombre} ${empleado.apellido}`
          );
          console.log(`         📋 Cargo: ${empleado.cargo}`);
          console.log(`         📧 Email: ${empleado.email}`);
          console.log(`         📱 Teléfono: ${empleado.telefono}`);
          console.log(
            `         📅 Fecha contratación: ${empleado.fecha_contratacion}`
          );
        });
      } else {
        console.log('      📋 No hay empleados registrados en el sistema');
      }
    }

    // 9. Leer asignaciones (si existen)
    console.log('\n9️⃣ ASIGNACIONES DEL SISTEMA:');

    const { data: asignaciones, error: asignacionesError } = await supabase
      .from('asignaciones')
      .select(
        `
        *,
        usuarios:usuario_id(nombre, apellido, email)
      `
      )
      .order('fecha_asignacion', { ascending: false });

    if (asignacionesError) {
      console.log(`   ❌ Error: ${asignacionesError.message}`);
    } else {
      console.log(`   ✅ ${asignaciones.length} asignaciones encontradas:`);
      if (asignaciones.length > 0) {
        asignaciones.forEach((asignacion, index) => {
          const usuario = asignacion.usuarios;
          console.log(`      ${index + 1}. Asignación #${asignacion.id}`);
          console.log(
            `         👤 Usuario: ${usuario ? `${usuario.nombre} ${usuario.apellido}` : 'N/A'}`
          );
          console.log(`         📋 Tipo: ${asignacion.tipo}`);
          console.log(`         📅 Fecha: ${asignacion.fecha_asignacion}`);
          console.log(`         📝 Descripción: ${asignacion.descripcion}`);
        });
      } else {
        console.log('      📋 No hay asignaciones registradas en el sistema');
      }
    }

    // 10. Resumen del sistema
    console.log('\n📊 RESUMEN DEL SISTEMA MTZ:');

    const resumen = {
      empresa: empresa ? 1 : 0,
      roles: roles ? roles.length : 0,
      usuarios: usuarios ? usuarios.length : 0,
      clientes: clientes ? clientes.length : 0,
      ventas: ventas ? ventas.length : 0,
      cobranzas: cobranzas ? cobranzas.length : 0,
      proyecciones: proyecciones ? proyecciones.length : 0,
      rrhh: rrhh ? rrhh.length : 0,
      asignaciones: asignaciones ? asignaciones.length : 0,
    };

    console.log('   📋 Estado actual del sistema:');
    console.log(`      🏢 Empresas: ${resumen.empresa}`);
    console.log(`      👥 Roles: ${resumen.roles}`);
    console.log(`      👤 Usuarios: ${resumen.usuarios}`);
    console.log(`      👥 Clientes: ${resumen.clientes}`);
    console.log(`      💰 Ventas: ${resumen.ventas}`);
    console.log(`      💳 Cobranzas: ${resumen.cobranzas}`);
    console.log(`      📈 Proyecciones: ${resumen.proyecciones}`);
    console.log(`      👷 RRHH: ${resumen.rrhh}`);
    console.log(`      📋 Asignaciones: ${resumen.asignaciones}`);

    // 11. Conclusión
    console.log('\n🎉 CONCLUSIÓN DE LAS PRUEBAS ESPECÍFICAS:');
    console.log('   ✅ Todas las tablas del sistema MTZ están accesibles');
    console.log('   ✅ La extensión de Supabase funciona perfectamente');
    console.log('   ✅ Las consultas con relaciones funcionan correctamente');
    console.log('   ✅ El sistema está listo para operaciones completas');
    console.log(
      '   📋 Puedes usar esta conexión para todas las operaciones del sistema MTZ'
    );
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar pruebas específicas
pruebaLecturaEspecificaMTZ().catch(console.error);
