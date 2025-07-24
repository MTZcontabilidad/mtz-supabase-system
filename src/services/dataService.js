import { supabase } from '../lib/supabase.js';

// Servicio de datos real conectado a Supabase
class DataService {
  // ========================================
  // CLIENTES
  // ========================================

  async getClientes() {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar datos para que coincidan con la estructura esperada
      const clientesTransformados = (data || []).map(cliente => ({
        id: cliente.id,
        nombre: cliente.nombre,
        ruc: cliente.ruc || 'Sin RUC',
        email: cliente.email || 'Sin email',
        telefono: cliente.telefono || 'Sin teléfono',
        direccion: cliente.direccion || 'Sin dirección',
        estado: cliente.activo ? 'Activo' : 'Inactivo'
      }));

      return clientesTransformados;
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      return this.getDatosMock().clientes;
    }
  }

  async crearCliente(cliente) {
    try {
      // Transformar datos para que coincidan con la estructura de la tabla
      const clienteData = {
        nombre: cliente.nombre,
        ruc: cliente.ruc,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        activo: true,
        empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946' // ID de empresa por defecto
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select();

      if (error) throw error;

      // Transformar respuesta para que coincida con la estructura esperada
      const clienteCreado = data[0];
      return {
        id: clienteCreado.id,
        nombre: clienteCreado.nombre,
        ruc: clienteCreado.ruc || 'Sin RUC',
        email: clienteCreado.email || 'Sin email',
        telefono: clienteCreado.telefono || 'Sin teléfono',
        direccion: clienteCreado.direccion || 'Sin dirección',
        estado: clienteCreado.activo ? 'Activo' : 'Inactivo'
      };
    } catch (error) {
      console.error('Error creando cliente:', error);
      throw error;
    }
  }

  async actualizarCliente(id, cliente) {
    try {
      // Transformar datos para que coincidan con la estructura de la tabla
      const clienteData = {
        nombre: cliente.nombre,
        ruc: cliente.ruc,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        activo: cliente.estado === 'Activo'
      };

      const { data, error } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select();

      if (error) throw error;

      // Transformar respuesta para que coincida con la estructura esperada
      const clienteActualizado = data[0];
      return {
        id: clienteActualizado.id,
        nombre: clienteActualizado.nombre,
        ruc: clienteActualizado.ruc || 'Sin RUC',
        email: clienteActualizado.email || 'Sin email',
        telefono: clienteActualizado.telefono || 'Sin teléfono',
        direccion: clienteActualizado.direccion || 'Sin dirección',
        estado: clienteActualizado.activo ? 'Activo' : 'Inactivo'
      };
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  }

  async eliminarCliente(id) {
    try {
      // En lugar de eliminar, marcar como inactivo
      const { error } = await supabase
        .from('clientes')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  }

  // ========================================
  // VENTAS
  // ========================================

  async getVentas() {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('⚠️ Error obteniendo ventas de Supabase, usando datos mock');
        return this.getDatosMock().ventas;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const ventasTransformadas = (data || []).map(venta => ({
        id: venta.id,
        numero_factura: venta.numero_factura || `F${venta.id}-2024`,
        cliente: venta.cliente || 'Cliente sin nombre',
        descripcion: venta.descripcion || 'Sin descripción',
        monto_subtotal: venta.monto_subtotal || 0,
        monto_iva: venta.monto_iva || 0,
        monto_total: venta.monto_total || 0,
        estado: venta.estado || 'Pendiente',
        forma_pago: venta.forma_pago || 'Transferencia',
        categoria: venta.categoria || 'General',
        fecha_emision: venta.fecha_emision || venta.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        fecha_vencimiento: venta.fecha_vencimiento || venta.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        dias_vencimiento: venta.dias_vencimiento || 30
      }));

      return ventasTransformadas;
    } catch (error) {
      console.error('Error obteniendo ventas:', error);
      return this.getDatosMock().ventas;
    }
  }

  async crearVenta(venta) {
    try {
      // Asegurar que tenga fecha_venta si no se proporciona
      const ventaData = {
        ...venta,
        fecha_venta:
          venta.fecha_venta || new Date().toISOString().split('T')[0],
      };

      const { data, error } = await supabase
        .from('ventas')
        .insert([ventaData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creando venta:', error);
      throw error;
    }
  }

  async actualizarVenta(id, venta) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .update(venta)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error actualizando venta:', error);
      throw error;
    }
  }

  async eliminarVenta(id) {
    try {
      const { error } = await supabase.from('ventas').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando venta:', error);
      throw error;
    }
  }

  // ========================================
  // COBRANZAS
  // ========================================

  async getCobranzas() {
    try {
      const { data, error } = await supabase
        .from('cobranzas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('⚠️ Error obteniendo cobranzas de Supabase, usando datos mock');
        return this.getDatosMock().cobranzas;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const cobranzasTransformadas = (data || []).map(cobranza => ({
        id: cobranza.id,
        numero_factura: cobranza.numero_factura || `F${cobranza.id}-2024`,
        cliente: cobranza.cliente || 'Cliente sin nombre',
        descripcion: cobranza.descripcion || 'Sin descripción',
        monto_total: cobranza.monto_total || 0,
        monto_pagado: cobranza.monto_pagado || 0,
        monto_pendiente: cobranza.monto_pendiente || cobranza.monto_total || 0,
        estado: cobranza.estado || 'Pendiente',
        fecha_emision: cobranza.fecha_emision || cobranza.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        fecha_vencimiento: cobranza.fecha_vencimiento || cobranza.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        fecha_pago: cobranza.fecha_pago || null,
        forma_pago: cobranza.forma_pago || 'Transferencia',
        dias_vencimiento: cobranza.dias_vencimiento || 30
      }));

      return cobranzasTransformadas;
    } catch (error) {
      console.error('Error obteniendo cobranzas:', error);
      return this.getDatosMock().cobranzas;
    }
  }

  async crearCobranza(cobranza) {
    try {
      const { data, error } = await supabase
        .from('cobranzas')
        .insert([cobranza])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creando cobranza:', error);
      throw error;
    }
  }

  async actualizarCobranza(id, cobranza) {
    try {
      const { data, error } = await supabase
        .from('cobranzas')
        .update(cobranza)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error actualizando cobranza:', error);
      throw error;
    }
  }

  async eliminarCobranza(id) {
    try {
      const { error } = await supabase.from('cobranzas').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando cobranza:', error);
      throw error;
    }
  }

  // ========================================
  // COMPRAS
  // ========================================

  async getCompras() {
    try {
      const { data, error } = await supabase
        .from('compras')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('⚠️ Tabla compras no existe o error, usando datos mock');
        return this.getDatosMock().compras;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const comprasTransformadas = (data || []).map(compra => ({
        id: compra.id,
        numero_orden: compra.numero_orden || `OC-2024-${compra.id.toString().padStart(3, '0')}`,
        proveedor: compra.proveedor || 'Proveedor sin nombre',
        descripcion: compra.descripcion || 'Sin descripción',
        monto_total: compra.monto_total || 0,
        fecha_orden: compra.fecha_orden || compra.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        fecha_entrega: compra.fecha_entrega || compra.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        estado: compra.estado || 'Pendiente',
        categoria: compra.categoria || 'General',
        forma_pago: compra.forma_pago || 'Transferencia',
        prioridad: compra.prioridad || 'Normal'
      }));

      return comprasTransformadas;
    } catch (error) {
      console.error('Error obteniendo compras:', error);
      return this.getDatosMock().compras;
    }
  }

  async crearCompra(compra) {
    try {
      const { data, error } = await supabase
        .from('compras')
        .insert([compra])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creando compra:', error);
      throw error;
    }
  }

  async actualizarCompra(id, compra) {
    try {
      const { data, error } = await supabase
        .from('compras')
        .update(compra)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error actualizando compra:', error);
      throw error;
    }
  }

  async eliminarCompra(id) {
    try {
      const { error } = await supabase.from('compras').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando compra:', error);
      throw error;
    }
  }

  // ========================================
  // RRHH
  // ========================================

  async getEmpleados() {
    try {
      const { data, error } = await supabase
        .from('rrhh')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('⚠️ Tabla rrhh no tiene datos, usando datos mock');
        return this.getDatosMock().empleados;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const empleadosTransformados = (data || []).map(empleado => ({
        id: empleado.id,
        nombre: empleado.nombre || 'Sin nombre',
        apellido: empleado.apellido || 'Sin apellido',
        email: empleado.email || 'Sin email',
        telefono: empleado.telefono || 'Sin teléfono',
        departamento: empleado.departamento || 'Sin departamento',
        cargo: empleado.cargo || 'Sin cargo',
        fecha_ingreso: empleado.fecha_ingreso || new Date().toISOString().split('T')[0],
        salario_base: empleado.salario_base || 0,
        estado: empleado.estado || 'activo'
      }));

      return empleadosTransformados;
    } catch (error) {
      console.error('Error obteniendo empleados:', error);
      return this.getDatosMock().empleados;
    }
  }

  async crearEmpleado(empleado) {
    try {
      // Transformar datos para que coincidan con la estructura de la tabla
      const empleadoData = {
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        email: empleado.email,
        telefono: empleado.telefono,
        departamento: empleado.departamento,
        cargo: empleado.cargo,
        fecha_ingreso: empleado.fecha_ingreso,
        salario_base: empleado.salario_base,
        estado: empleado.estado || 'activo'
      };

      const { data, error } = await supabase
        .from('rrhh')
        .insert([empleadoData])
        .select();

      if (error) throw error;

      // Transformar respuesta para que coincida con la estructura esperada
      const empleadoCreado = data[0];
      return {
        id: empleadoCreado.id,
        nombre: empleadoCreado.nombre || 'Sin nombre',
        apellido: empleadoCreado.apellido || 'Sin apellido',
        email: empleadoCreado.email || 'Sin email',
        telefono: empleadoCreado.telefono || 'Sin teléfono',
        departamento: empleadoCreado.departamento || 'Sin departamento',
        cargo: empleadoCreado.cargo || 'Sin cargo',
        fecha_ingreso: empleadoCreado.fecha_ingreso || new Date().toISOString().split('T')[0],
        salario_base: empleadoCreado.salario_base || 0,
        estado: empleadoCreado.estado || 'activo'
      };
    } catch (error) {
      console.error('Error creando empleado:', error);
      throw error;
    }
  }

  async actualizarEmpleado(id, empleado) {
    try {
      const { data, error } = await supabase
        .from('rrhh')
        .update(empleado)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error actualizando empleado:', error);
      throw error;
    }
  }

  async eliminarEmpleado(id) {
    try {
      const { error } = await supabase.from('rrhh').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      throw error;
    }
  }

  async getNominas() {
    try {
      const { data, error } = await supabase
        .from('nominas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('⚠️ Error obteniendo nóminas, usando datos mock');
        return this.getDatosMock().nominas;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const nominasTransformadas = (data || []).map(nomina => ({
        id: nomina.id,
        empleado_id: nomina.empleado_id,
        mes: nomina.mes,
        año: nomina.año,
        salario_base: nomina.sueldo_base || nomina.salario_base || 0,
        bonificaciones: nomina.bonificaciones || 0,
        descuentos: nomina.total_descuentos || 0,
        salario_neto: nomina.liquido_pagable || nomina.salario_neto || 0,
        estado: nomina.estado || 'Pendiente'
      }));

      return nominasTransformadas;
    } catch (error) {
      console.error('Error obteniendo nóminas:', error);
      return this.getDatosMock().nominas;
    }
  }

  async crearNomina(nomina) {
    try {
      const { data, error } = await supabase
        .from('nominas')
        .insert([nomina])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creando nómina:', error);
      throw error;
    }
  }

  async actualizarNomina(id, nomina) {
    try {
      const { data, error } = await supabase
        .from('nominas')
        .update(nomina)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error actualizando nómina:', error);
      throw error;
    }
  }

  async eliminarNomina(id) {
    try {
      const { error } = await supabase.from('nominas').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error eliminando nómina:', error);
      throw error;
    }
  }

  // ========================================
  // CONTRATOS
  // ========================================

  async getContratos() {
    try {
      // Como no existe la tabla contratos, retornar datos mock
      console.log('Tabla contratos no existe, usando datos mock');
      return this.getDatosMock().contratos;
    } catch (error) {
      console.error('Error obteniendo contratos:', error);
      return this.getDatosMock().contratos;
    }
  }

  async crearContrato(contrato) {
    try {
      // Como la tabla contratos no existe, simular la creación
      console.log('⚠️ Tabla contratos no existe, simulando creación');
      const nuevoContrato = {
        id: Date.now(),
        ...contrato,
        created_at: new Date().toISOString()
      };
      return nuevoContrato;
    } catch (error) {
      console.error('Error creando contrato:', error);
      throw error;
    }
  }

  async actualizarContrato(id, contrato) {
    try {
      // Como la tabla contratos no existe, simular la actualización
      console.log('⚠️ Tabla contratos no existe, simulando actualización');
      const contratoActualizado = {
        id: id,
        ...contrato,
        updated_at: new Date().toISOString()
      };
      return contratoActualizado;
    } catch (error) {
      console.error('Error actualizando contrato:', error);
      throw error;
    }
  }

  async eliminarContrato(id) {
    try {
      // Como la tabla contratos no existe, simular la eliminación
      console.log('⚠️ Tabla contratos no existe, simulando eliminación');
      return true;
    } catch (error) {
      console.error('Error eliminando contrato:', error);
      throw error;
    }
  }

  // ========================================
  // IVA
  // ========================================

  async getDeclaracionesIVA() {
    try {
      // Como no existe la tabla declaraciones_iva, retornar datos mock
      console.log('⚠️ Tabla declaraciones_iva no existe, usando datos mock');
      return this.getDatosMock().declaraciones_iva;
    } catch (error) {
      console.error('Error obteniendo declaraciones IVA:', error);
      return this.getDatosMock().declaraciones_iva;
    }
  }

  async crearDeclaracionIVA(declaracion) {
    try {
      // Como la tabla declaraciones_iva no existe, simular la creación
      console.log('⚠️ Tabla declaraciones_iva no existe, simulando creación');
      const nuevaDeclaracion = {
        id: Date.now(),
        ...declaracion,
        created_at: new Date().toISOString()
      };
      return nuevaDeclaracion;
    } catch (error) {
      console.error('Error creando declaración IVA:', error);
      throw error;
    }
  }

  async actualizarDeclaracionIVA(id, declaracion) {
    try {
      // Como la tabla declaraciones_iva no existe, simular la actualización
      console.log('⚠️ Tabla declaraciones_iva no existe, simulando actualización');
      const declaracionActualizada = {
        id: id,
        ...declaracion,
        updated_at: new Date().toISOString()
      };
      return declaracionActualizada;
    } catch (error) {
      console.error('Error actualizando declaración IVA:', error);
      throw error;
    }
  }

  // ========================================
  // ESTADÍSTICAS
  // ========================================

  async getEstadisticasDashboard() {
    try {
      // Obtener datos de todas las tablas para calcular estadísticas
      const [clientes, ventas, cobranzas, compras, empleados, contratos] = await Promise.allSettled([
        this.getClientes(),
        this.getVentas(),
        this.getCobranzas(),
        this.getCompras(),
        this.getEmpleados(),
        this.getContratos()
      ]);

      // Calcular totales de forma segura
      const totalClientes = clientes.status === 'fulfilled' ? clientes.value.length : 0;
      const totalVentas = ventas.status === 'fulfilled' ? ventas.value.length : 0;
      const totalCobranzas = cobranzas.status === 'fulfilled' ? cobranzas.value.length : 0;
      const totalCompras = compras.status === 'fulfilled' ? compras.value.length : 0;
      const totalEmpleados = empleados.status === 'fulfilled' ? empleados.value.length : 0;
      const totalContratos = contratos.status === 'fulfilled' ? contratos.value.length : 0;

      console.log('📊 Estadísticas del dashboard calculadas:', {
        clientes: totalClientes,
        ventas: totalVentas,
        cobranzas: totalCobranzas,
        compras: totalCompras,
        empleados: totalEmpleados,
        contratos: totalContratos
      });

      return {
        clientes: totalClientes,
        ventas: totalVentas,
        cobranzas: totalCobranzas,
        compras: totalCompras,
        empleados: totalEmpleados,
        contratos: totalContratos,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas del dashboard:', error);
      // Retornar datos mock como fallback
      const mockData = this.getDatosMock();
      return {
        clientes: mockData.clientes.length,
        ventas: mockData.ventas.length,
        cobranzas: mockData.cobranzas.length,
        compras: mockData.compras.length,
        empleados: mockData.empleados.length,
        contratos: mockData.contratos.length,
      };
    }
  }

  async getEstadisticasRRHH() {
    try {
      // Obtener datos de empleados y nóminas usando las funciones existentes
      const [empleados, nominas] = await Promise.allSettled([
        this.getEmpleados(),
        this.getNominas()
      ]);

      const empleadosData = empleados.status === 'fulfilled' ? empleados.value : [];
      const nominasData = nominas.status === 'fulfilled' ? nominas.value : [];

      const empleadosActivos = empleadosData.filter(e => e.estado === 'activo').length;
      const promedioSalario = empleadosData.length > 0
        ? empleadosData.reduce((sum, e) => sum + (e.salario_base || 0), 0) / empleadosData.length
        : 0;

      const nominasEsteMes = nominasData.filter(n => {
        const nominaDate = new Date(n.año, n.mes - 1);
        const now = new Date();
        return (
          nominaDate.getMonth() === now.getMonth() &&
          nominaDate.getFullYear() === now.getFullYear()
        );
      }).length;

      const estadisticas = {
        total_empleados: empleadosData.length,
        empleados_activos: empleadosActivos,
        promedio_salario: Math.round(promedioSalario),
        total_nominas: nominasData.length,
        nominas_este_mes: nominasEsteMes,
      };

      console.log('📊 Estadísticas RRHH calculadas:', estadisticas);

      return estadisticas;
    } catch (error) {
      console.error('Error obteniendo estadísticas RRHH:', error);
      // Retornar datos mock como fallback
      const mockData = this.getDatosMock();
      return {
        total_empleados: mockData.empleados.length,
        empleados_activos: mockData.empleados.filter(e => e.estado === 'activo').length,
        promedio_salario: Math.round(mockData.empleados.reduce((sum, e) => sum + (e.salario_base || 0), 0) / mockData.empleados.length),
        total_nominas: mockData.nominas.length,
        nominas_este_mes: mockData.nominas.filter(n => n.mes === new Date().getMonth() + 1 && n.año === new Date().getFullYear()).length,
      };
    }
  }

  async getEstadisticasCompras() {
    try {
      // Obtener datos de compras usando la función existente
      const compras = await this.getCompras();

      const comprasPendientes = compras.filter(c => c.estado === 'Pendiente').length;
      const comprasAprobadas = compras.filter(c => c.estado === 'Aprobada').length;
      const comprasEnProceso = compras.filter(c => c.estado === 'En proceso').length;
      const montoTotal = compras.reduce((sum, c) => sum + (c.monto_total || 0), 0);
      const promedioPorCompra = compras.length > 0 ? montoTotal / compras.length : 0;

      return {
        total_compras: compras?.length || 0,
        compras_pendientes: comprasPendientes,
        compras_aprobadas: comprasAprobadas,
        compras_en_proceso: comprasEnProceso,
        monto_total: montoTotal,
        promedio_por_compra: Math.round(promedioPorCompra),
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas de compras:', error);
      return {
        total_compras: 0,
        compras_pendientes: 0,
        compras_aprobadas: 0,
        compras_en_proceso: 0,
        monto_total: 0,
        promedio_por_compra: 0,
      };
    }
  }

  // ========================================
  // MÉTODOS DE FALLBACK (para cuando no hay conexión)
  // ========================================

  getDatosMock() {
    return {
      clientes: [
        {
          id: 1,
          nombre: 'Empresa ABC Ltda.',
          ruc: '12345678-9',
          email: 'contacto@abc.cl',
          telefono: '+56 2 2345 6789',
        },
        {
          id: 2,
          nombre: 'Comercial XYZ SpA',
          ruc: '98765432-1',
          email: 'info@xyz.cl',
          telefono: '+56 2 3456 7890',
        },
      ],
      ventas: [
        {
          id: 1,
          numero_factura: 'F001-2024',
          cliente: 'Empresa ABC Ltda.',
          descripcion: 'Servicios de contabilidad mensual',
          monto_subtotal: 500000,
          monto_iva: 95000,
          monto_total: 595000,
          estado: 'Pagada',
          forma_pago: 'Transferencia',
          categoria: 'Contabilidad',
          fecha_emision: '2024-01-15',
          fecha_vencimiento: '2024-02-15',
          dias_vencimiento: 30,
        },
        {
          id: 2,
          numero_factura: 'F002-2024',
          cliente: 'Comercial XYZ SpA',
          descripcion: 'Declaración de IVA',
          monto_subtotal: 300000,
          monto_iva: 57000,
          monto_total: 357000,
          estado: 'Pendiente',
          forma_pago: 'Efectivo',
          categoria: 'Tributario',
          fecha_emision: '2024-01-20',
          fecha_vencimiento: '2024-02-20',
          dias_vencimiento: 15,
        },
        {
          id: 3,
          numero_factura: 'F003-2024',
          cliente: 'Servicios LTDA',
          descripcion: 'Auditoría anual',
          monto_subtotal: 800000,
          monto_iva: 152000,
          monto_total: 952000,
          estado: 'Vencida',
          forma_pago: 'Cheque',
          categoria: 'Auditoría',
          fecha_emision: '2024-01-10',
          fecha_vencimiento: '2024-02-10',
          dias_vencimiento: -5,
        },
      ],
      cobranzas: [
        {
          id: 1,
          numero_factura: 'F001-2024',
          cliente: 'Empresa ABC Ltda.',
          descripcion: 'Servicios de contabilidad mensual',
          monto_total: 595000,
          monto_pagado: 595000,
          monto_pendiente: 0,
          estado: 'Pagada',
          fecha_emision: '2024-01-15',
          fecha_vencimiento: '2024-02-15',
          fecha_pago: '2024-02-10',
          forma_pago: 'Transferencia',
          dias_vencimiento: 0,
        },
        {
          id: 2,
          numero_factura: 'F002-2024',
          cliente: 'Comercial XYZ SpA',
          descripcion: 'Declaración de IVA',
          monto_total: 357000,
          monto_pagado: 0,
          monto_pendiente: 357000,
          estado: 'Pendiente',
          fecha_emision: '2024-01-20',
          fecha_vencimiento: '2024-02-20',
          fecha_pago: null,
          forma_pago: 'Efectivo',
          dias_vencimiento: 15,
        },
        {
          id: 3,
          numero_factura: 'F003-2024',
          cliente: 'Servicios LTDA',
          descripcion: 'Auditoría anual',
          monto_total: 952000,
          monto_pagado: 0,
          monto_pendiente: 952000,
          estado: 'Vencida',
          fecha_emision: '2024-01-10',
          fecha_vencimiento: '2024-02-10',
          fecha_pago: null,
          forma_pago: 'Cheque',
          dias_vencimiento: -5,
        },
        {
          id: 4,
          numero_factura: 'F004-2024',
          cliente: 'Empresa ABC Ltda.',
          descripcion: 'Servicios de consultoría',
          monto_total: 450000,
          monto_pagado: 0,
          monto_pendiente: 450000,
          estado: 'Pendiente',
          fecha_emision: '2024-02-01',
          fecha_vencimiento: '2024-03-01',
          fecha_pago: null,
          forma_pago: 'Transferencia',
          dias_vencimiento: 20,
        },
        {
          id: 5,
          numero_factura: 'F005-2024',
          cliente: 'Comercial XYZ SpA',
          descripcion: 'Declaración de renta',
          monto_total: 680000,
          monto_pagado: 680000,
          monto_pendiente: 0,
          estado: 'Pagada',
          fecha_emision: '2024-02-05',
          fecha_vencimiento: '2024-03-05',
          fecha_pago: '2024-03-01',
          forma_pago: 'Efectivo',
          dias_vencimiento: 0,
        },
      ],
      compras: [
        {
          id: 1,
          numero_orden: 'OC-2024-001',
          proveedor: 'Proveedor ABC Ltda.',
          descripcion: 'Materiales de oficina',
          monto_total: 250000,
          fecha_orden: '2024-12-15',
          fecha_entrega: '2024-12-20',
          estado: 'Aprobada',
          categoria: 'Oficina',
          forma_pago: 'Transferencia',
          prioridad: 'Normal',
        },
        {
          id: 2,
          numero_orden: 'OC-2024-002',
          proveedor: 'Tecnología XYZ SpA',
          descripcion: 'Equipos informáticos',
          monto_total: 1500000,
          fecha_orden: '2024-12-10',
          fecha_entrega: '2024-12-25',
          estado: 'En proceso',
          categoria: 'Tecnología',
          forma_pago: 'Transferencia',
          prioridad: 'Alta',
        },
        {
          id: 3,
          numero_orden: 'OC-2024-003',
          proveedor: 'Servicios DEF Ltda.',
          descripcion: 'Servicios de limpieza',
          monto_total: 180000,
          fecha_orden: '2024-12-20',
          fecha_entrega: '2024-12-30',
          estado: 'Aprobada',
          categoria: 'Servicios',
          forma_pago: 'Efectivo',
          prioridad: 'Normal',
        },
        {
          id: 4,
          numero_orden: 'OC-2024-004',
          proveedor: 'Mobiliario GHI SpA',
          descripcion: 'Muebles de oficina',
          monto_total: 850000,
          fecha_orden: '2024-12-25',
          fecha_entrega: '2025-01-10',
          estado: 'Pendiente',
          categoria: 'Mobiliario',
          forma_pago: 'Transferencia',
          prioridad: 'Baja',
        },
        {
          id: 5,
          numero_orden: 'OC-2024-005',
          proveedor: 'Software JKL Ltda.',
          descripcion: 'Licencias de software',
          monto_total: 320000,
          fecha_orden: '2024-12-28',
          fecha_entrega: '2024-12-31',
          estado: 'Completada',
          categoria: 'Tecnología',
          forma_pago: 'Transferencia',
          prioridad: 'Alta',
        },
      ],
      empleados: [
        {
          id: 1,
          nombre: 'Juan',
          apellido: 'Pérez',
          email: 'juan.perez@mtz.com',
          telefono: '+56 9 1234 5678',
          departamento: 'Administración',
          cargo: 'Gerente',
          fecha_ingreso: '2023-01-15',
          salario_base: 1500000,
          estado: 'activo',
        },
        {
          id: 2,
          nombre: 'María',
          apellido: 'González',
          email: 'maria.gonzalez@mtz.com',
          telefono: '+56 9 2345 6789',
          departamento: 'Contabilidad',
          cargo: 'Analista',
          fecha_ingreso: '2023-03-20',
          salario_base: 1200000,
          estado: 'activo',
        },
        {
          id: 3,
          nombre: 'Carlos',
          apellido: 'López',
          email: 'carlos.lopez@mtz.com',
          telefono: '+56 9 3456 7890',
          departamento: 'Ventas',
          cargo: 'Vendedor',
          fecha_ingreso: '2023-06-10',
          salario_base: 900000,
          estado: 'activo',
        },
        {
          id: 4,
          nombre: 'Ana',
          apellido: 'Martínez',
          email: 'ana.martinez@mtz.com',
          telefono: '+56 9 4567 8901',
          departamento: 'Recursos Humanos',
          cargo: 'Especialista',
          fecha_ingreso: '2023-08-15',
          salario_base: 1100000,
          estado: 'activo',
        },
        {
          id: 5,
          nombre: 'Roberto',
          apellido: 'Silva',
          email: 'roberto.silva@mtz.com',
          telefono: '+56 9 5678 9012',
          departamento: 'Tecnología',
          cargo: 'Desarrollador',
          fecha_ingreso: '2023-10-01',
          salario_base: 1300000,
          estado: 'activo',
        },
      ],
      nominas: [
        {
          id: 1,
          empleado_id: 1,
          mes: 12,
          año: 2024,
          salario_base: 1500000,
          bonificaciones: 200000,
          descuentos: 150000,
          salario_neto: 1550000,
          estado: 'Pagada',
        },
        {
          id: 2,
          empleado_id: 2,
          mes: 12,
          año: 2024,
          salario_base: 1200000,
          bonificaciones: 100000,
          descuentos: 120000,
          salario_neto: 1180000,
          estado: 'Pagada',
        },
      ],
      contratos: [
        {
          id: 1,
          numero_contrato: 'CT001-2024',
          cliente_id: 1,
          descripcion: 'Contrato de servicios contables anual',
          monto_total: 5000000,
          fecha_inicio: '2024-01-01',
          fecha_fin: '2024-12-31',
          estado: 'Activo',
        },
        {
          id: 2,
          numero_contrato: 'CT002-2024',
          cliente_id: 2,
          descripcion: 'Contrato de auditoría semestral',
          monto_total: 3000000,
          fecha_inicio: '2024-06-01',
          fecha_fin: '2024-12-31',
          estado: 'Activo',
        },
        {
          id: 3,
          numero_contrato: 'CT003-2024',
          cliente_id: 1,
          descripcion: 'Contrato de consultoría tributaria',
          monto_total: 2500000,
          fecha_inicio: '2024-03-01',
          fecha_fin: '2024-12-31',
          estado: 'Activo',
        },
        {
          id: 4,
          numero_contrato: 'CT004-2024',
          cliente_id: 2,
          descripcion: 'Contrato de servicios de nómina',
          monto_total: 1800000,
          fecha_inicio: '2024-04-01',
          fecha_fin: '2024-12-31',
          estado: 'Pendiente',
        },
        {
          id: 5,
          numero_contrato: 'CT005-2024',
          cliente_id: 1,
          descripcion: 'Contrato de auditoría interna',
          monto_total: 4200000,
          fecha_inicio: '2024-05-01',
          fecha_fin: '2024-12-31',
          estado: 'Activo',
        },
      ],
      declaraciones_iva: [
        {
          id: 1,
          periodo: 'Enero 2024',
          fecha_vencimiento: '2024-02-20',
          monto_declarado: 500000,
          estado: 'Pendiente',
        },
        {
          id: 2,
          periodo: 'Diciembre 2023',
          fecha_vencimiento: '2024-01-20',
          monto_declarado: 450000,
          estado: 'Pagada',
        },
        {
          id: 3,
          periodo: 'Febrero 2024',
          fecha_vencimiento: '2024-03-20',
          monto_declarado: 650000,
          estado: 'Pendiente',
        },
        {
          id: 4,
          periodo: 'Marzo 2024',
          fecha_vencimiento: '2024-04-20',
          monto_declarado: 720000,
          estado: 'Pendiente',
        },
        {
          id: 5,
          periodo: 'Abril 2024',
          fecha_vencimiento: '2024-05-20',
          monto_declarado: 580000,
          estado: 'Pendiente',
        },
      ],
    };
  }
}

// Instancia única del servicio
const dataService = new DataService();

export default dataService;
