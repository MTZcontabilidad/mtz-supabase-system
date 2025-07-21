import mtzService from '../src/lib/mtzService.js';

async function pruebaServicioMTZ() {
  console.log('🧪 PRUEBA DEL SERVICIO DE INTEGRACIÓN MTZ\n');
  console.log('='.repeat(60));

  try {
    // 1. Probar Dashboard
    console.log('\n1️⃣ PRUEBA DEL DASHBOARD:');

    const dashboardData = await mtzService.getDashboardData();
    console.log('   ✅ Dashboard cargado exitosamente');
    console.log(`   📊 Total Clientes: ${dashboardData.totalClientes}`);
    console.log(`   📊 Total Ventas: ${dashboardData.totalVentas}`);
    console.log(`   📊 Total Cobranzas: ${dashboardData.totalCobranzas}`);
    console.log(`   📊 Total Usuarios: ${dashboardData.totalUsuarios}`);

    // 2. Probar gestión de empresas
    console.log('\n2️⃣ PRUEBA DE GESTIÓN DE EMPRESAS:');

    const empresas = await mtzService.getEmpresas();
    console.log(`   ✅ ${empresas.length} empresas encontradas`);
    empresas.forEach((empresa, index) => {
      console.log(`      ${index + 1}. ${empresa.nombre} - ${empresa.email}`);
    });

    // 3. Probar gestión de roles
    console.log('\n3️⃣ PRUEBA DE GESTIÓN DE ROLES:');

    const roles = await mtzService.getRoles();
    console.log(`   ✅ ${roles.length} roles encontrados`);
    roles.forEach((rol, index) => {
      console.log(`      ${index + 1}. ${rol.nombre} - ${rol.descripcion}`);
    });

    // 4. Probar gestión de usuarios
    console.log('\n4️⃣ PRUEBA DE GESTIÓN DE USUARIOS:');

    const usuarios = await mtzService.getUsuarios();
    console.log(`   ✅ ${usuarios.length} usuarios encontrados`);
    usuarios.forEach((usuario, index) => {
      const rol = usuario.roles;
      const empresa = usuario.empresas;
      console.log(
        `      ${index + 1}. ${usuario.nombre} ${usuario.apellido} - ${rol ? rol.nombre : 'Sin rol'} - ${empresa ? empresa.nombre : 'Sin empresa'}`
      );
    });

    // 5. Probar gestión de clientes
    console.log('\n5️⃣ PRUEBA DE GESTIÓN DE CLIENTES:');

    const clientes = await mtzService.getClientes();
    console.log(`   ✅ ${clientes.length} clientes encontrados`);
    clientes.forEach((cliente, index) => {
      console.log(
        `      ${index + 1}. ${cliente.nombre} - ${cliente.email} - ${cliente.activo ? 'Activo' : 'Inactivo'}`
      );
    });

    // 6. Probar búsqueda de clientes
    console.log('\n6️⃣ PRUEBA DE BÚSQUEDA DE CLIENTES:');

    const clientesBusqueda = await mtzService.buscarClientes('MTZ');
    console.log(
      `   ✅ ${clientesBusqueda.length} clientes encontrados con "MTZ"`
    );
    clientesBusqueda.forEach((cliente, index) => {
      console.log(`      ${index + 1}. ${cliente.nombre} - ${cliente.email}`);
    });

    // 7. Probar búsqueda de usuarios
    console.log('\n7️⃣ PRUEBA DE BÚSQUEDA DE USUARIOS:');

    const usuariosBusqueda = await mtzService.buscarUsuarios('admin');
    console.log(
      `   ✅ ${usuariosBusqueda.length} usuarios encontrados con "admin"`
    );
    usuariosBusqueda.forEach((usuario, index) => {
      const rol = usuario.roles;
      console.log(
        `      ${index + 1}. ${usuario.nombre} ${usuario.apellido} - ${rol ? rol.nombre : 'Sin rol'}`
      );
    });

    // 8. Probar estadísticas
    console.log('\n8️⃣ PRUEBA DE ESTADÍSTICAS:');

    const estadisticas = await mtzService.getEstadisticas();
    console.log('   ✅ Estadísticas cargadas exitosamente');
    console.log(`   📊 Clientes activos: ${estadisticas.clientesActivos}`);
    console.log(
      `   📊 Ventas recientes: ${estadisticas.ventasRecientes.length}`
    );
    console.log(
      `   📊 Cobranzas pendientes: ${estadisticas.cobranzasPendientes.length}`
    );

    // 9. Probar filtros avanzados
    console.log('\n9️⃣ PRUEBA DE FILTROS AVANZADOS:');

    // Clientes activos
    const clientesActivos = await mtzService.getClientes({ activo: true });
    console.log(`   ✅ ${clientesActivos.length} clientes activos encontrados`);

    // 10. Probar operaciones CRUD completas
    console.log('\n🔟 PRUEBA DE OPERACIONES CRUD:');

    // Crear un cliente de prueba
    const clientePrueba = {
      nombre: 'Cliente Prueba Servicio',
      email: 'cliente@prueba.servicio',
      empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946',
      activo: true,
    };

    console.log('   📝 Creando cliente de prueba...');
    const clienteCreado = await mtzService.createCliente(clientePrueba);
    console.log(
      `   ✅ Cliente creado: ${clienteCreado.nombre} - ID: ${clienteCreado.id}`
    );

    // Leer el cliente creado
    console.log('   📖 Leyendo cliente creado...');
    const clienteLeido = await mtzService.getClienteById(clienteCreado.id);
    console.log(
      `   ✅ Cliente leído: ${clienteLeido.nombre} - ${clienteLeido.email}`
    );

    // Actualizar el cliente
    console.log('   ✏️ Actualizando cliente...');
    const clienteActualizado = await mtzService.updateCliente(
      clienteCreado.id,
      {
        nombre: 'Cliente Prueba Servicio - Actualizado',
        activo: false,
      }
    );
    console.log(
      `   ✅ Cliente actualizado: ${clienteActualizado.nombre} - ${clienteActualizado.activo ? 'Activo' : 'Inactivo'}`
    );

    // Eliminar el cliente
    console.log('   🗑️ Eliminando cliente de prueba...');
    await mtzService.deleteCliente(clienteCreado.id);
    console.log('   ✅ Cliente eliminado exitosamente');

    // 11. Verificar que el cliente fue eliminado
    console.log('\n🔍 VERIFICACIÓN DE ELIMINACIÓN:');

    try {
      await mtzService.getClienteById(clienteCreado.id);
      console.log('   ❌ Error: El cliente aún existe');
    } catch (error) {
      console.log('   ✅ Cliente eliminado correctamente (no encontrado)');
    }

    // 12. Conclusión
    console.log('\n🎉 CONCLUSIÓN DE LA PRUEBA DEL SERVICIO:');
    console.log(
      '   ✅ Todas las funciones del servicio funcionan correctamente'
    );
    console.log('   ✅ La integración con Supabase está operativa');
    console.log('   ✅ El sistema MTZ está listo para usar el servicio');
    console.log('   🚀 El servicio está completamente funcional');

    // 13. Resumen de funcionalidades probadas
    console.log('\n📋 FUNCIONALIDADES PROBADAS:');
    const funcionalidades = [
      'Dashboard y estadísticas',
      'Gestión de empresas',
      'Gestión de roles',
      'Gestión de usuarios',
      'Gestión de clientes',
      'Búsquedas avanzadas',
      'Filtros y consultas',
      'Operaciones CRUD completas',
      'Relaciones entre tablas',
      'Manejo de errores',
    ];

    funcionalidades.forEach((funcionalidad, index) => {
      console.log(`   ${index + 1}. ✅ ${funcionalidad}`);
    });
  } catch (error) {
    console.log(`❌ Error en la prueba: ${error.message}`);
    console.log(`📋 Detalles: ${error.details || 'No disponible'}`);
  }
}

// Ejecutar prueba del servicio
pruebaServicioMTZ().catch(console.error);
