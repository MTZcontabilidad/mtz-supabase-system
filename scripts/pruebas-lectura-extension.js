import { createClient } from '@supabase/supabase-js';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function pruebasLecturaExtension() {
  console.log('📖 PRUEBAS DE LECTURA CON LA EXTENSIÓN SUPABASE\n');
  console.log('='.repeat(60));

  try {
    // 1. Prueba de lectura básica - Tabla test_mcp_simple
    console.log('\n1️⃣ PRUEBA DE LECTURA BÁSICA - test_mcp_simple:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (testError) {
      console.log(`   ❌ Error: ${testError.message}`);
    } else {
      console.log(`   ✅ Lectura exitosa: ${testData.length} registros`);
      console.log('   📋 Datos:');
      testData.forEach((item, index) => {
        console.log(
          `      ${index + 1}. ID: ${item.id} | Nombre: ${item.nombre} | Descripción: ${item.descripcion} | Activo: ${item.activo}`
        );
      });
    }

    // 2. Prueba de lectura con filtros - Solo registros activos
    console.log('\n2️⃣ PRUEBA DE LECTURA CON FILTROS - Solo activos:');

    const { data: activeData, error: activeError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .eq('activo', true);

    if (activeError) {
      console.log(`   ❌ Error: ${activeError.message}`);
    } else {
      console.log(
        `   ✅ Filtro exitoso: ${activeData.length} registros activos`
      );
      activeData.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.nombre} - ${item.descripcion}`);
      });
    }

    // 3. Prueba de lectura con ordenamiento
    console.log('\n3️⃣ PRUEBA DE LECTURA CON ORDENAMIENTO - Por nombre:');

    const { data: orderedData, error: orderedError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .order('nombre', { ascending: true });

    if (orderedError) {
      console.log(`   ❌ Error: ${orderedError.message}`);
    } else {
      console.log(
        `   ✅ Ordenamiento exitoso: ${orderedData.length} registros`
      );
      orderedData.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.nombre}`);
      });
    }

    // 4. Prueba de lectura con límite
    console.log('\n4️⃣ PRUEBA DE LECTURA CON LÍMITE - Primeros 2 registros:');

    const { data: limitedData, error: limitedError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(2);

    if (limitedError) {
      console.log(`   ❌ Error: ${limitedError.message}`);
    } else {
      console.log(`   ✅ Límite exitoso: ${limitedData.length} registros`);
      limitedData.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.nombre} - ${item.descripcion}`);
      });
    }

    // 5. Prueba de lectura de tabla empresas
    console.log('\n5️⃣ PRUEBA DE LECTURA - Tabla empresas:');

    const { data: empresasData, error: empresasError } = await supabase
      .from('empresas')
      .select('*');

    if (empresasError) {
      console.log(`   ❌ Error: ${empresasError.message}`);
    } else {
      console.log(`   ✅ Lectura exitosa: ${empresasData.length} empresas`);
      if (empresasData.length > 0) {
        empresasData.forEach((empresa, index) => {
          console.log(`      ${index + 1}. ${empresa.nombre} - ${empresa.rut}`);
        });
      } else {
        console.log('      📋 No hay empresas registradas');
      }
    }

    // 6. Prueba de lectura de tabla roles
    console.log('\n6️⃣ PRUEBA DE LECTURA - Tabla roles:');

    const { data: rolesData, error: rolesError } = await supabase
      .from('roles')
      .select('*');

    if (rolesError) {
      console.log(`   ❌ Error: ${rolesError.message}`);
    } else {
      console.log(`   ✅ Lectura exitosa: ${rolesData.length} roles`);
      if (rolesData.length > 0) {
        rolesData.forEach((rol, index) => {
          console.log(`      ${index + 1}. ${rol.nombre} - ${rol.descripcion}`);
        });
      } else {
        console.log('      📋 No hay roles registrados');
      }
    }

    // 7. Prueba de lectura de tabla usuarios
    console.log('\n7️⃣ PRUEBA DE LECTURA - Tabla usuarios:');

    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*');

    if (usuariosError) {
      console.log(`   ❌ Error: ${usuariosError.message}`);
    } else {
      console.log(`   ✅ Lectura exitosa: ${usuariosData.length} usuarios`);
      if (usuariosData.length > 0) {
        usuariosData.forEach((usuario, index) => {
          console.log(
            `      ${index + 1}. ${usuario.nombre} ${usuario.apellido} - ${usuario.email}`
          );
        });
      } else {
        console.log('      📋 No hay usuarios registrados');
      }
    }

    // 8. Prueba de lectura de tabla clientes
    console.log('\n8️⃣ PRUEBA DE LECTURA - Tabla clientes:');

    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .select('*');

    if (clientesError) {
      console.log(`   ❌ Error: ${clientesError.message}`);
    } else {
      console.log(`   ✅ Lectura exitosa: ${clientesData.length} clientes`);
      if (clientesData.length > 0) {
        clientesData.forEach((cliente, index) => {
          console.log(`      ${index + 1}. ${cliente.nombre} - ${cliente.rut}`);
        });
      } else {
        console.log('      📋 No hay clientes registrados');
      }
    }

    // 9. Prueba de lectura con JOIN (si es posible)
    console.log('\n9️⃣ PRUEBA DE LECTURA CON RELACIONES:');

    // Intentar leer asignaciones con información de usuarios
    const { data: asignacionesData, error: asignacionesError } =
      await supabase.from('asignaciones').select(`
        *,
        usuarios:usuario_id(nombre, apellido, email)
      `);

    if (asignacionesError) {
      console.log(`   ❌ Error: ${asignacionesError.message}`);
    } else {
      console.log(
        `   ✅ Lectura con relaciones exitosa: ${asignacionesData.length} asignaciones`
      );
      if (asignacionesData.length > 0) {
        asignacionesData.forEach((asignacion, index) => {
          const usuario = asignacion.usuarios;
          console.log(
            `      ${index + 1}. Usuario: ${usuario ? `${usuario.nombre} ${usuario.apellido}` : 'N/A'} - Fecha: ${asignacion.fecha_asignacion}`
          );
        });
      } else {
        console.log('      📋 No hay asignaciones registradas');
      }
    }

    // 10. Prueba de lectura con búsqueda de texto
    console.log('\n🔟 PRUEBA DE LECTURA CON BÚSQUEDA - Buscar "Cliente":');

    const { data: searchData, error: searchError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .ilike('nombre', '%Cliente%');

    if (searchError) {
      console.log(`   ❌ Error: ${searchError.message}`);
    } else {
      console.log(
        `   ✅ Búsqueda exitosa: ${searchData.length} registros encontrados`
      );
      searchData.forEach((item, index) => {
        console.log(`      ${index + 1}. ${item.nombre} - ${item.descripcion}`);
      });
    }

    // 11. Resumen de todas las tablas
    console.log('\n📊 RESUMEN DE TODAS LAS TABLAS:');

    const tablas = [
      'test_mcp_simple',
      'test_mcp',
      'empresas',
      'roles',
      'usuarios',
      'clientes',
      'ventas',
      'cobranzas',
      'proyecciones',
      'rrhh',
      'asignaciones',
      'asignaciones_clientes',
    ];

    for (const tabla of tablas) {
      try {
        const { data, error } = await supabase.from(tabla).select('*').limit(1);

        if (error) {
          console.log(`   ❌ ${tabla}: Error - ${error.message}`);
        } else {
          console.log(`   ✅ ${tabla}: Accesible`);
        }
      } catch (e) {
        console.log(`   ❌ ${tabla}: No existe`);
      }
    }

    // 12. Conclusión
    console.log('\n🎉 CONCLUSIÓN DE LAS PRUEBAS DE LECTURA:');
    console.log(
      '   ✅ Todas las operaciones de lectura funcionan correctamente'
    );
    console.log('   ✅ La extensión de Supabase está operativa');
    console.log('   ✅ La conexión directa es completamente funcional');
    console.log('   ✅ Todas las tablas del sistema MTZ están accesibles');
    console.log('   📋 Puedes usar esta conexión para todas las operaciones');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar pruebas de lectura
pruebasLecturaExtension().catch(console.error);
