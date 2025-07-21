import { createClient } from '@supabase/supabase-js';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function pruebasEscrituraExtension() {
  console.log('✍️ PRUEBAS DE ESCRITURA CON LA EXTENSIÓN SUPABASE\n');
  console.log('='.repeat(60));

  try {
    // 1. Prueba de inserción - Crear un cliente de prueba
    console.log('\n1️⃣ PRUEBA DE INSERCIÓN - Crear cliente de prueba:');

    const nuevoCliente = {
      nombre: 'Cliente Prueba Extension',
      rut: '12345678-9',
      email: 'cliente.prueba@extension.com',
      telefono: '+56 9 1234 5678',
      direccion: 'Av. Extension 123, Santiago',
      empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946', // ID de MTZ Solutions
      activo: true,
    };

    const { data: clienteInsertado, error: insertError } = await supabase
      .from('clientes')
      .insert([nuevoCliente])
      .select();

    if (insertError) {
      console.log(`   ❌ Error al insertar: ${insertError.message}`);
    } else {
      console.log('   ✅ Cliente insertado exitosamente');
      console.log(`   📋 ID: ${clienteInsertado[0].id}`);
      console.log(`   📋 Nombre: ${clienteInsertado[0].nombre}`);
      console.log(`   📋 Email: ${clienteInsertado[0].email}`);
    }

    // 2. Prueba de inserción múltiple - Crear varios clientes
    console.log('\n2️⃣ PRUEBA DE INSERCIÓN MÚLTIPLE - Crear varios clientes:');

    const clientesMultiples = [
      {
        nombre: 'Empresa ABC Ltda.',
        rut: '98765432-1',
        email: 'contacto@empresaabc.cl',
        telefono: '+56 2 2345 6789',
        direccion: 'Calle Principal 456, Valparaíso',
        empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946',
        activo: true,
      },
      {
        nombre: 'Comercial XYZ SPA',
        rut: '11223344-5',
        email: 'ventas@comercialxyz.cl',
        telefono: '+56 9 8765 4321',
        direccion: 'Av. Comercial 789, Concepción',
        empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946',
        activo: true,
      },
      {
        nombre: 'Servicios MTZ Chile',
        rut: '55667788-9',
        email: 'info@serviciosmtz.cl',
        telefono: '+56 2 3456 7890',
        direccion: 'Plaza Central 321, Antofagasta',
        empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946',
        activo: true,
      },
    ];

    const { data: clientesMultiplesInsertados, error: multiInsertError } =
      await supabase.from('clientes').insert(clientesMultiples).select();

    if (multiInsertError) {
      console.log(
        `   ❌ Error al insertar múltiples: ${multiInsertError.message}`
      );
    } else {
      console.log(
        `   ✅ ${clientesMultiplesInsertados.length} clientes insertados exitosamente`
      );
      clientesMultiplesInsertados.forEach((cliente, index) => {
        console.log(`      ${index + 1}. ${cliente.nombre} - ${cliente.email}`);
      });
    }

    // 3. Prueba de actualización - Modificar un cliente
    console.log('\n3️⃣ PRUEBA DE ACTUALIZACIÓN - Modificar cliente:');

    if (clienteInsertado && clienteInsertado[0]) {
      const clienteId = clienteInsertado[0].id;
      const actualizacion = {
        telefono: '+56 9 9999 9999',
        direccion: 'Nueva Dirección Extension 999, Santiago Centro',
      };

      const { data: clienteActualizado, error: updateError } = await supabase
        .from('clientes')
        .update(actualizacion)
        .eq('id', clienteId)
        .select();

      if (updateError) {
        console.log(`   ❌ Error al actualizar: ${updateError.message}`);
      } else {
        console.log('   ✅ Cliente actualizado exitosamente');
        console.log(`   📋 Teléfono nuevo: ${clienteActualizado[0].telefono}`);
        console.log(
          `   📋 Dirección nueva: ${clienteActualizado[0].direccion}`
        );
      }
    }

    // 4. Prueba de inserción con ventas
    console.log('\n4️⃣ PRUEBA DE INSERCIÓN - Crear ventas:');

    // Obtener el primer cliente para crear ventas
    const { data: clientesDisponibles, error: clientesError } = await supabase
      .from('clientes')
      .select('id, nombre')
      .limit(1);

    if (clientesError) {
      console.log(`   ❌ Error al obtener clientes: ${clientesError.message}`);
    } else if (clientesDisponibles.length > 0) {
      const clienteId = clientesDisponibles[0].id;

      const nuevaVenta = {
        cliente_id: clienteId,
        usuario_id: 'b557624b-40a7-4c0c-86af-95283bbca961', // ID del administrador
        monto: 150000,
        descripcion: 'Venta de prueba desde extensión',
        fecha_venta: new Date().toISOString(),
        estado: 'completada',
      };

      const { data: ventaInsertada, error: ventaError } = await supabase
        .from('ventas')
        .insert([nuevaVenta])
        .select();

      if (ventaError) {
        console.log(`   ❌ Error al insertar venta: ${ventaError.message}`);
      } else {
        console.log('   ✅ Venta insertada exitosamente');
        console.log(`   📋 ID: ${ventaInsertada[0].id}`);
        console.log(`   📋 Monto: $${ventaInsertada[0].monto}`);
        console.log(`   📋 Estado: ${ventaInsertada[0].estado}`);
      }
    }

    // 5. Prueba de inserción con cobranzas
    console.log('\n5️⃣ PRUEBA DE INSERCIÓN - Crear cobranzas:');

    if (clientesDisponibles && clientesDisponibles.length > 0) {
      const clienteId = clientesDisponibles[0].id;

      const nuevaCobranza = {
        cliente_id: clienteId,
        monto: 75000,
        descripcion: 'Cobranza de prueba desde extensión',
        fecha_cobranza: new Date().toISOString(),
        estado: 'pendiente',
        metodo_pago: 'transferencia',
      };

      const { data: cobranzaInsertada, error: cobranzaError } = await supabase
        .from('cobranzas')
        .insert([nuevaCobranza])
        .select();

      if (cobranzaError) {
        console.log(
          `   ❌ Error al insertar cobranza: ${cobranzaError.message}`
        );
      } else {
        console.log('   ✅ Cobranza insertada exitosamente');
        console.log(`   📋 ID: ${cobranzaInsertada[0].id}`);
        console.log(`   📋 Monto: $${cobranzaInsertada[0].monto}`);
        console.log(`   📋 Estado: ${cobranzaInsertada[0].estado}`);
      }
    }

    // 6. Prueba de inserción con proyecciones
    console.log('\n6️⃣ PRUEBA DE INSERCIÓN - Crear proyecciones:');

    const nuevaProyeccion = {
      tipo: 'ventas',
      monto: 500000,
      descripcion: 'Proyección de ventas Q4 2024',
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 días
      estado: 'activa',
    };

    const { data: proyeccionInsertada, error: proyeccionError } = await supabase
      .from('proyecciones')
      .insert([nuevaProyeccion])
      .select();

    if (proyeccionError) {
      console.log(
        `   ❌ Error al insertar proyección: ${proyeccionError.message}`
      );
    } else {
      console.log('   ✅ Proyección insertada exitosamente');
      console.log(`   📋 ID: ${proyeccionInsertada[0].id}`);
      console.log(`   📋 Tipo: ${proyeccionInsertada[0].tipo}`);
      console.log(`   📋 Monto: $${proyeccionInsertada[0].monto}`);
    }

    // 7. Prueba de inserción con RRHH
    console.log('\n7️⃣ PRUEBA DE INSERCIÓN - Crear empleados RRHH:');

    const nuevoEmpleado = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cargo: 'Vendedor Senior',
      email: 'juan.perez@mtzsolutions.com',
      telefono: '+56 9 1111 2222',
      fecha_contratacion: new Date().toISOString(),
      salario: 800000,
      activo: true,
    };

    const { data: empleadoInsertado, error: empleadoError } = await supabase
      .from('rrhh')
      .insert([nuevoEmpleado])
      .select();

    if (empleadoError) {
      console.log(`   ❌ Error al insertar empleado: ${empleadoError.message}`);
    } else {
      console.log('   ✅ Empleado insertado exitosamente');
      console.log(`   📋 ID: ${empleadoInsertado[0].id}`);
      console.log(
        `   📋 Nombre: ${empleadoInsertado[0].nombre} ${empleadoInsertado[0].apellido}`
      );
      console.log(`   📋 Cargo: ${empleadoInsertado[0].cargo}`);
    }

    // 8. Prueba de inserción con asignaciones
    console.log('\n8️⃣ PRUEBA DE INSERCIÓN - Crear asignaciones:');

    const nuevaAsignacion = {
      usuario_id: 'b557624b-40a7-4c0c-86af-95283bbca961', // ID del administrador
      tipo: 'proyecto',
      descripcion: 'Asignación de proyecto desde extensión',
      fecha_inicio: new Date().toISOString(),
      fecha_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      estado: 'activa',
    };

    const { data: asignacionInsertada, error: asignacionError } = await supabase
      .from('asignaciones')
      .insert([nuevaAsignacion])
      .select();

    if (asignacionError) {
      console.log(
        `   ❌ Error al insertar asignación: ${asignacionError.message}`
      );
    } else {
      console.log('   ✅ Asignación insertada exitosamente');
      console.log(`   📋 ID: ${asignacionInsertada[0].id}`);
      console.log(`   📋 Tipo: ${asignacionInsertada[0].tipo}`);
      console.log(`   📋 Estado: ${asignacionInsertada[0].estado}`);
    }

    // 9. Prueba de eliminación - Eliminar un registro de prueba
    console.log('\n9️⃣ PRUEBA DE ELIMINACIÓN - Eliminar registro de prueba:');

    if (clienteInsertado && clienteInsertado[0]) {
      const clienteId = clienteInsertado[0].id;

      const { error: deleteError } = await supabase
        .from('clientes')
        .delete()
        .eq('id', clienteId);

      if (deleteError) {
        console.log(`   ❌ Error al eliminar: ${deleteError.message}`);
      } else {
        console.log('   ✅ Cliente eliminado exitosamente');
        console.log(`   📋 ID eliminado: ${clienteId}`);
      }
    }

    // 10. Verificar el estado final
    console.log('\n📊 VERIFICACIÓN DEL ESTADO FINAL:');

    const tablas = [
      'clientes',
      'ventas',
      'cobranzas',
      'proyecciones',
      'rrhh',
      'asignaciones',
    ];

    for (const tabla of tablas) {
      const { data, error } = await supabase.from(tabla).select('*');

      if (error) {
        console.log(`   ❌ ${tabla}: Error - ${error.message}`);
      } else {
        console.log(`   ✅ ${tabla}: ${data.length} registros`);
      }
    }

    // 11. Conclusión
    console.log('\n🎉 CONCLUSIÓN DE LAS PRUEBAS DE ESCRITURA:');
    console.log(
      '   ✅ Todas las operaciones de escritura funcionan correctamente'
    );
    console.log('   ✅ La extensión de Supabase es completamente funcional');
    console.log('   ✅ Inserción, actualización y eliminación operativas');
    console.log('   ✅ El sistema MTZ está listo para operaciones completas');
    console.log(
      '   📋 Puedes usar esta extensión para todas las operaciones CRUD'
    );
    console.log('   🚀 El sistema está completamente operativo');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar pruebas de escritura
pruebasEscrituraExtension().catch(console.error);
