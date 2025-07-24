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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo clientes de Supabase:', error);
        throw error;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const clientesTransformados = (data || []).map(cliente => ({
        id: cliente.id,
        nombre: cliente.nombre || 'Sin nombre',
        ruc: cliente.ruc || 'Sin RUC',
        email: cliente.email || 'Sin email',
        telefono: cliente.telefono || 'Sin teléfono',
        direccion: cliente.direccion || 'Sin dirección',
        estado: cliente.activo ? 'Activo' : 'Inactivo',
        created_at: cliente.created_at
      }));

      console.log('✅ Clientes obtenidos de Supabase:', clientesTransformados.length);
      return clientesTransformados;
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      throw error;
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
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
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
        .select('*, clientes:cliente_id(nombre, ruc)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo ventas de Supabase:', error);
        throw error;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const ventasTransformadas = (data || []).map(venta => ({
        id: venta.id,
        numero_factura: venta.numero_factura || `F${String(venta.id).padStart(3, '0')}-${new Date().getFullYear()}`,
        cliente_id: venta.cliente_id,
        cliente_nombre: venta.clientes?.nombre || 'Cliente no encontrado',
        cliente_ruc: venta.clientes?.ruc || 'Sin RUC',
        monto_total: venta.monto_total || 0,
        fecha_emision: venta.fecha_emision || venta.created_at,
        fecha_vencimiento: venta.fecha_vencimiento || venta.created_at,
        estado: venta.estado || 'Pendiente',
        descripcion: venta.descripcion || 'Sin descripción',
        created_at: venta.created_at
      }));

      console.log('✅ Ventas obtenidas de Supabase:', ventasTransformadas.length);
      return ventasTransformadas;
    } catch (error) {
      console.error('❌ Error obteniendo ventas:', error);
      throw error;
    }
  }

  async crearVenta(venta) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .insert([venta])
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
      const { error } = await supabase
        .from('ventas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
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
        .select('*, clientes:cliente_id(nombre, ruc)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo cobranzas de Supabase:', error);
        throw error;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const cobranzasTransformadas = (data || []).map(cobranza => ({
        id: cobranza.id,
        numero_factura: cobranza.numero_factura || `C${String(cobranza.id).padStart(3, '0')}-${new Date().getFullYear()}`,
        cliente_id: cobranza.cliente_id,
        cliente_nombre: cobranza.clientes?.nombre || 'Cliente no encontrado',
        cliente_ruc: cobranza.clientes?.ruc || 'Sin RUC',
        monto_total: cobranza.monto_total || 0,
        monto_pagado: cobranza.monto_pagado || 0,
        monto_pendiente: cobranza.monto_pendiente || cobranza.monto_total || 0,
        fecha_emision: cobranza.fecha_emision || cobranza.created_at,
        fecha_vencimiento: cobranza.fecha_vencimiento || cobranza.created_at,
        fecha_pago: cobranza.fecha_pago,
        estado: cobranza.estado || 'Pendiente',
        descripcion: cobranza.descripcion || 'Sin descripción',
        created_at: cobranza.created_at
      }));

      console.log('✅ Cobranzas obtenidas de Supabase:', cobranzasTransformadas.length);
      return cobranzasTransformadas;
    } catch (error) {
      console.error('❌ Error obteniendo cobranzas:', error);
      throw error;
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
      const { error } = await supabase
        .from('cobranzas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
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
        console.error('Error obteniendo compras de Supabase:', error);
        throw error;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const comprasTransformadas = (data || []).map(compra => ({
        id: compra.id,
        numero_orden: compra.numero_orden || `O${String(compra.id).padStart(3, '0')}-${new Date().getFullYear()}`,
        proveedor: compra.proveedor || 'Proveedor no especificado',
        monto_total: compra.monto_total || 0,
        fecha_orden: compra.fecha_orden || compra.created_at,
        fecha_entrega: compra.fecha_entrega || compra.created_at,
        estado: compra.estado || 'Pendiente',
        descripcion: compra.descripcion || 'Sin descripción',
        created_at: compra.created_at
      }));

      console.log('✅ Compras obtenidas de Supabase:', comprasTransformadas.length);
      return comprasTransformadas;
    } catch (error) {
      console.error('❌ Error obteniendo compras:', error);
      throw error;
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
      const { error } = await supabase
        .from('compras')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando compra:', error);
      throw error;
    }
  }

  // ========================================
  // EMPLEADOS (RRHH)
  // ========================================

  async getEmpleados() {
    try {
      const { data, error } = await supabase
        .from('rrhh')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo empleados de Supabase:', error);
        throw error;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const empleadosTransformados = (data || []).map(empleado => ({
        id: empleado.id,
        nombre: empleado.nombre || 'Sin nombre',
        apellido: empleado.apellido || 'Sin apellido',
        email: empleado.email || 'Sin email',
        telefono: empleado.telefono || 'Sin teléfono',
        cargo: empleado.cargo || 'Sin cargo',
        salario_base: empleado.salario_base || 0,
        fecha_contratacion: empleado.fecha_contratacion || empleado.created_at,
        estado: empleado.estado || 'Activo',
        created_at: empleado.created_at
      }));

      console.log('✅ Empleados obtenidos de Supabase:', empleadosTransformados.length);
      return empleadosTransformados;
    } catch (error) {
      console.error('❌ Error obteniendo empleados:', error);
      throw error;
    }
  }

  async crearEmpleado(empleado) {
    try {
      const { data, error } = await supabase
        .from('rrhh')
        .insert([empleado])
        .select();

      if (error) throw error;
      return data[0];
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
      const { error } = await supabase
        .from('rrhh')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando empleado:', error);
      throw error;
    }
  }

  // ========================================
  // NÓMINAS
  // ========================================

  async getNominas() {
    try {
      const { data, error } = await supabase
        .from('nominas')
        .select('*, rrhh:empleado_id(nombre, apellido)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo nóminas de Supabase:', error);
        throw error;
      }

      // Transformar datos para que coincidan con la estructura esperada
      const nominasTransformadas = (data || []).map(nomina => ({
        id: nomina.id,
        empleado_id: nomina.empleado_id,
        empleado_nombre: nomina.rrhh ? `${nomina.rrhh.nombre} ${nomina.rrhh.apellido}` : 'Empleado no encontrado',
        salario_base: nomina.salario_base || 0,
        bonificaciones: nomina.bonificaciones || 0,
        descuentos: nomina.descuentos || 0,
        salario_neto: nomina.salario_neto || nomina.liquido_pagable || 0,
        mes: nomina.mes || new Date().getMonth() + 1,
        año: nomina.año || new Date().getFullYear(),
        estado: nomina.estado || 'Pendiente',
        fecha_pago: nomina.fecha_pago,
        created_at: nomina.created_at
      }));

      console.log('✅ Nóminas obtenidas de Supabase:', nominasTransformadas.length);
      return nominasTransformadas;
    } catch (error) {
      console.error('❌ Error obteniendo nóminas:', error);
      throw error;
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
      const { error } = await supabase
        .from('nominas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error eliminando nómina:', error);
      throw error;
    }
  }

  // ========================================
  // ESTADÍSTICAS DASHBOARD
  // ========================================

  async getEstadisticasDashboard() {
    try {
      console.log('📊 Cargando estadísticas del dashboard...');

      // Obtener datos usando Promise.allSettled para manejar errores individuales
      const [clientesResult, ventasResult, cobranzasResult, empleadosResult] = await Promise.allSettled([
        this.getClientes(),
        this.getVentas(),
        this.getCobranzas(),
        this.getEmpleados()
      ]);

      // Procesar resultados
      const clientes = clientesResult.status === 'fulfilled' ? clientesResult.value : [];
      const ventas = ventasResult.status === 'fulfilled' ? ventasResult.value : [];
      const cobranzas = cobranzasResult.status === 'fulfilled' ? cobranzasResult.value : [];
      const empleados = empleadosResult.status === 'fulfilled' ? empleadosResult.value : [];

      // Calcular estadísticas
      const totalClientes = clientes.length;
      const totalVentas = ventas.length;
      const totalCobranzas = cobranzas.length;
      const totalEmpleados = empleados.length;

      // Calcular montos
      const totalVentasMonto = ventas.reduce((sum, venta) => sum + (venta.monto_total || 0), 0);
      const totalCobranzasMonto = cobranzas.reduce((sum, cobranza) => sum + (cobranza.monto_total || 0), 0);

      // Calcular totales de cobranzas
      const totalPagado = cobranzas.reduce((sum, cobranza) => sum + (cobranza.monto_pagado || 0), 0);
      const totalPendiente = cobranzas.reduce((sum, cobranza) => sum + (cobranza.monto_pendiente || 0), 0);

      const estadisticas = {
        totalClientes,
        totalVentas,
        totalCobranzas,
        totalEmpleados,
        totalVentasMonto,
        totalCobranzasMonto,
        totalPagado,
        totalPendiente
      };

      console.log('✅ Estadísticas cargadas exitosamente:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      throw error;
    }
  }

  // ========================================
  // ESTADÍSTICAS RRHH
  // ========================================

  async getEstadisticasRRHH() {
    try {
      console.log('👥 Cargando estadísticas de RRHH...');

      const [empleadosResult, nominasResult] = await Promise.allSettled([
        this.getEmpleados(),
        this.getNominas()
      ]);

      const empleados = empleadosResult.status === 'fulfilled' ? empleadosResult.value : [];
      const nominas = nominasResult.status === 'fulfilled' ? nominasResult.value : [];

      const totalEmpleados = empleados.length;
      const empleadosActivos = empleados.filter(e => e.estado === 'Activo').length;
      const totalNominas = nominas.length;

      // Calcular nómina del mes actual
      const mesActual = new Date().getMonth() + 1;
      const añoActual = new Date().getFullYear();

      const nominasMesActual = nominas.filter(n => {
        const nominaDate = new Date(n.año, n.mes - 1);
        return nominaDate.getMonth() === mesActual - 1 && nominaDate.getFullYear() === añoActual;
      });

      const totalNominaMes = nominasMesActual.reduce((sum, n) => sum + (n.salario_neto || 0), 0);

      const estadisticas = {
        totalEmpleados,
        empleadosActivos,
        totalNominas,
        totalNominaMes,
        nominasMesActual: nominasMesActual.length
      };

      console.log('✅ Estadísticas RRHH cargadas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error cargando estadísticas RRHH:', error);
      throw error;
    }
  }

  // ========================================
  // ESTADÍSTICAS COMPRAS
  // ========================================

  async getEstadisticasCompras() {
    try {
      console.log('🛒 Cargando estadísticas de compras...');

      const compras = await this.getCompras();

      const totalCompras = compras.length;
      const totalMonto = compras.reduce((sum, compra) => sum + (compra.monto_total || 0), 0);
      const comprasPendientes = compras.filter(c => c.estado === 'Pendiente').length;
      const comprasCompletadas = compras.filter(c => c.estado === 'Completada').length;

      const estadisticas = {
        totalCompras,
        totalMonto,
        comprasPendientes,
        comprasCompletadas
      };

      console.log('✅ Estadísticas compras cargadas:', estadisticas);
      return estadisticas;
    } catch (error) {
      console.error('❌ Error cargando estadísticas compras:', error);
      throw error;
    }
  }
}

export const dataService = new DataService();
export default dataService;
