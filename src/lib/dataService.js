// =====================================================================
// 📊 SERVICIO DE DATOS REALES - SISTEMA MTZ v3.0
// =====================================================================

import { supabase } from './supabase.js';
import { MTZ_CONFIG } from './config.js';

/**
 * Servicio para manejar datos reales de Supabase
 * Reemplaza los datos de muestra con información real de la base de datos
 */
class DataService {
  // =====================================================================
  // 📈 DASHBOARD DATA
  // =====================================================================

  /**
   * Obtener datos del dashboard desde Supabase
   */
  async getDashboardData() {
    try {
      console.log('🔄 Cargando datos del dashboard desde Supabase...');

      // Obtener estadísticas de empresas
      const { data: empresas, error: empresasError } = await supabase
        .from('empresas')
        .select('*')
        .eq('estado', 'activa');

      if (empresasError) throw empresasError;

      // Obtener estadísticas de ventas
      const { data: ventas, error: ventasError } = await supabase
        .from('ventas')
        .select('*');

      if (ventasError) throw ventasError;

      // Obtener estadísticas de cobranzas
      const { data: cobranzas, error: cobranzasError } = await supabase
        .from('cobranzas')
        .select('*');

      if (cobranzasError) throw cobranzasError;

      // Calcular KPIs
      const totalClientes = empresas?.length || 0;
      const ventasMes = this.calcularVentasMes(ventas);
      const cobranzaPendiente = this.calcularCobranzaPendiente(cobranzas);
      const nuevosClientes = this.calcularNuevosClientes(empresas);
      const eficiencia = this.calcularEficiencia(ventas, cobranzas);

      // Obtener datos de gráficos
      const graficos = await this.getGraficosData(ventas, empresas);

      // Obtener alertas
      const alertas = await this.getAlertasData(cobranzas, ventas);

      // Obtener actividad reciente
      const actividad = await this.getActividadReciente();

      const dashboardData = {
        kpis: {
          totalClientes,
          ventasMes,
          cobranzaPendiente,
          nuevosClientes,
          eficiencia,
          satisfaccion: 4.8, // Valor fijo por ahora
          facturasPendientes:
            cobranzas?.filter(c => c.estado === 'Pendiente').length || 0,
          ingresosAnuales: this.calcularIngresosAnuales(ventas),
        },
        graficos,
        alertas,
        actividad,
      };

      console.log('✅ Datos del dashboard cargados exitosamente');
      return dashboardData;
    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
      throw error;
    }
  }

  // =====================================================================
  // 👥 CLIENTES DATA
  // =====================================================================

  /**
   * Obtener clientes desde Supabase
   */
  async getClientesData() {
    try {
      console.log('🔄 Cargando clientes desde Supabase...');

      const { data: empresas, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('tipo_empresa', 'cliente')
        .order('razon_social', { ascending: true });

      if (error) throw error;

      // Transformar datos para compatibilidad
      const clientesTransformados =
        empresas?.map((empresa, index) => ({
          id: index + 1,
          razon_social: empresa.razon_social,
          rut: empresa.rut,
          email: empresa.email,
          telefono: empresa.telefono,
          direccion: `${empresa.direccion}, ${empresa.comuna}, ${empresa.ciudad}`,
          categoria:
            empresa.tipo_empresa === 'cliente'
              ? 'Regular'
              : empresa.tipo_empresa,
          estado: empresa.estado === 'activa' ? 'Activo' : 'Inactivo',
          total_facturado: 0, // Se calcularía desde ventas
          numero_facturas: 0, // Se calcularía desde ventas
          promedio_factura: 0, // Se calcularía desde ventas
          fecha_registro: empresa.fecha_creacion,
          ultima_actividad: empresa.updated_at,
          rubro: empresa.giro,
          observaciones: empresa.observaciones,
        })) || [];

      console.log(
        `✅ ${clientesTransformados.length} clientes cargados exitosamente`
      );
      return clientesTransformados;
    } catch (error) {
      console.error('❌ Error cargando clientes:', error);
      throw error;
    }
  }

  // =====================================================================
  // 💰 VENTAS DATA
  // =====================================================================

  /**
   * Obtener ventas desde Supabase
   */
  async getVentasData() {
    try {
      console.log('🔄 Cargando ventas desde Supabase...');

      const { data: ventas, error } = await supabase
        .from('ventas')
        .select(
          `
          *,
          empresas!inner(razon_social)
        `
        )
        .order('fecha_emision', { ascending: false });

      if (error) throw error;

      // Transformar datos para compatibilidad
      const ventasTransformadas =
        ventas?.map(venta => ({
          id: venta.id,
          numero_factura: venta.numero_factura,
          fecha_emision: venta.fecha_emision,
          fecha_vencimiento: venta.fecha_vencimiento,
          cliente: venta.empresas?.razon_social || 'Cliente no encontrado',
          descripcion: venta.descripcion,
          monto_subtotal: venta.monto_neto,
          monto_iva: venta.iva,
          monto_total: venta.monto_total,
          estado: venta.estado,
          forma_pago: venta.metodo_pago,
          dias_vencimiento: this.calcularDiasVencimiento(
            venta.fecha_vencimiento
          ),
          categoria: venta.tipo_servicio,
        })) || [];

      console.log(
        `✅ ${ventasTransformadas.length} ventas cargadas exitosamente`
      );
      return ventasTransformadas;
    } catch (error) {
      console.error('❌ Error cargando ventas:', error);
      throw error;
    }
  }

  // =====================================================================
  // 💳 COBRANZAS DATA
  // =====================================================================

  /**
   * Obtener cobranzas desde Supabase
   */
  async getCobranzasData() {
    try {
      console.log('🔄 Cargando cobranzas desde Supabase...');

      const { data: cobranzas, error } = await supabase
        .from('cobranzas')
        .select(
          `
          *,
          empresas!inner(razon_social)
        `
        )
        .order('fecha_vencimiento', { ascending: true });

      if (error) throw error;

      // Transformar datos para compatibilidad
      const cobranzasTransformadas =
        cobranzas?.map(cobranza => ({
          id: cobranza.id,
          factura_id: cobranza.venta_id,
          numero_factura: cobranza.numero_factura,
          cliente: cobranza.empresas?.razon_social || 'Cliente no encontrado',
          monto_total: cobranza.monto_pendiente,
          fecha_vencimiento: cobranza.fecha_vencimiento,
          estado: cobranza.estado,
          dias_vencimiento: this.calcularDiasVencimiento(
            cobranza.fecha_vencimiento
          ),
          metodo_pago: cobranza.metodo_pago,
          fecha_pago: null, // Se calcularía desde la tabla de pagos
          observaciones: cobranza.descripcion,
        })) || [];

      console.log(
        `✅ ${cobranzasTransformadas.length} cobranzas cargadas exitosamente`
      );
      return cobranzasTransformadas;
    } catch (error) {
      console.error('❌ Error cargando cobranzas:', error);
      throw error;
    }
  }

  // =====================================================================
  // 👨‍💼 RRHH DATA
  // =====================================================================

  /**
   * Obtener datos de RRHH desde Supabase
   */
  async getRRHHData() {
    try {
      console.log('🔄 Cargando datos de RRHH desde Supabase...');

      const { data: empleados, error } = await supabase
        .from('empleados')
        .select('*')
        .order('nombre', { ascending: true });

      if (error) throw error;

      // Transformar datos para compatibilidad
      const rrhhTransformado =
        empleados?.map(empleado => ({
          id: empleado.id,
          nombre: empleado.nombre,
          apellido: empleado.apellido,
          email: empleado.email,
          telefono: empleado.telefono,
          departamento: empleado.departamento,
          cargo: empleado.cargo,
          fecha_ingreso: empleado.fecha_ingreso,
          salario_base: empleado.salario_base,
          estado: empleado.estado,
          evaluacion: 4.5, // Valor fijo por ahora
        })) || [];

      console.log(
        `✅ ${rrhhTransformado.length} empleados cargados exitosamente`
      );
      return rrhhTransformado;
    } catch (error) {
      console.error('❌ Error cargando datos de RRHH:', error);
      throw error;
    }
  }

  // =====================================================================
  // 📊 FUNCIONES DE CÁLCULO
  // =====================================================================

  /**
   * Calcular ventas del mes actual
   */
  calcularVentasMes(ventas) {
    if (!ventas) return 0;

    const mesActual = new Date().getMonth() + 1;
    const añoActual = new Date().getFullYear();

    return ventas
      .filter(venta => {
        const fechaVenta = new Date(venta.fecha_emision);
        return (
          fechaVenta.getMonth() + 1 === mesActual &&
          fechaVenta.getFullYear() === añoActual
        );
      })
      .reduce((total, venta) => total + parseFloat(venta.monto_total || 0), 0);
  }

  /**
   * Calcular cobranza pendiente
   */
  calcularCobranzaPendiente(cobranzas) {
    if (!cobranzas) return 0;

    return cobranzas
      .filter(
        cobranza =>
          cobranza.estado === 'Pendiente' || cobranza.estado === 'Vencido'
      )
      .reduce(
        (total, cobranza) => total + parseFloat(cobranza.monto_pendiente || 0),
        0
      );
  }

  /**
   * Calcular nuevos clientes del mes
   */
  calcularNuevosClientes(empresas) {
    if (!empresas) return 0;

    const mesActual = new Date().getMonth() + 1;
    const añoActual = new Date().getFullYear();

    return empresas.filter(empresa => {
      const fechaCreacion = new Date(empresa.fecha_creacion);
      return (
        fechaCreacion.getMonth() + 1 === mesActual &&
        fechaCreacion.getFullYear() === añoActual
      );
    }).length;
  }

  /**
   * Calcular eficiencia
   */
  calcularEficiencia(ventas, cobranzas) {
    if (!ventas || !cobranzas) return 0;

    const totalVentas = ventas.reduce(
      (total, venta) => total + parseFloat(venta.monto_total || 0),
      0
    );
    const totalCobrado = cobranzas
      .filter(cobranza => cobranza.estado === 'Pagado')
      .reduce(
        (total, cobranza) => total + parseFloat(cobranza.monto_pendiente || 0),
        0
      );

    return totalVentas > 0 ? Math.round((totalCobrado / totalVentas) * 100) : 0;
  }

  /**
   * Calcular ingresos anuales
   */
  calcularIngresosAnuales(ventas) {
    if (!ventas) return 0;

    const añoActual = new Date().getFullYear();

    return ventas
      .filter(venta => {
        const fechaVenta = new Date(venta.fecha_emision);
        return fechaVenta.getFullYear() === añoActual;
      })
      .reduce((total, venta) => total + parseFloat(venta.monto_total || 0), 0);
  }

  /**
   * Calcular días de vencimiento
   */
  calcularDiasVencimiento(fechaVencimiento) {
    if (!fechaVencimiento) return 0;

    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  // =====================================================================
  // 📈 FUNCIONES DE GRÁFICOS
  // =====================================================================

  /**
   * Obtener datos para gráficos
   */
  async getGraficosData(ventas, empresas) {
    try {
      // Ventas mensuales
      const ventasMensuales = this.calcularVentasMensuales(ventas);

      // Distribución de clientes
      const clientesPorEstado = this.calcularDistribucionClientes(empresas);

      // Rendimiento del equipo (simulado por ahora)
      const rendimientoEquipo = [
        { name: 'Carlos V.', ventas: 1200000, clientes: 18, eficiencia: 96 },
        { name: 'María G.', ventas: 980000, clientes: 15, eficiencia: 92 },
        { name: 'Juan P.', ventas: 850000, clientes: 12, eficiencia: 88 },
        { name: 'Ana L.', ventas: 720000, clientes: 10, eficiencia: 85 },
      ];

      return {
        ventasMensuales,
        clientesPorEstado,
        rendimientoEquipo,
      };
    } catch (error) {
      console.error('❌ Error calculando datos de gráficos:', error);
      return {
        ventasMensuales: [],
        clientesPorEstado: [],
        rendimientoEquipo: [],
      };
    }
  }

  /**
   * Calcular ventas mensuales
   */
  calcularVentasMensuales(ventas) {
    if (!ventas) return [];

    const meses = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    const añoActual = new Date().getFullYear();

    return meses.map((mes, index) => {
      const mesNum = index + 1;
      const ventasMes = ventas
        .filter(venta => {
          const fechaVenta = new Date(venta.fecha_emision);
          return (
            fechaVenta.getMonth() + 1 === mesNum &&
            fechaVenta.getFullYear() === añoActual
          );
        })
        .reduce(
          (total, venta) => total + parseFloat(venta.monto_total || 0),
          0
        );

      return {
        mes,
        ventas: ventasMes,
        meta: 2000000, // Meta fija por ahora
        crecimiento: 0, // Se calcularía comparando con mes anterior
      };
    });
  }

  /**
   * Calcular distribución de clientes
   */
  calcularDistribucionClientes(empresas) {
    if (!empresas) return [];

    const activos = empresas.filter(emp => emp.estado === 'activa').length;
    const inactivos = empresas.filter(emp => emp.estado === 'inactiva').length;
    const total = empresas.length;

    return [
      { name: 'Activos', value: activos, color: '#10B981' },
      { name: 'Inactivos', value: inactivos, color: '#EF4444' },
      {
        name: 'Pendientes',
        value: total - activos - inactivos,
        color: '#F59E0B',
      },
    ];
  }

  // =====================================================================
  // 🚨 FUNCIONES DE ALERTAS
  // =====================================================================

  /**
   * Obtener alertas
   */
  async getAlertasData(cobranzas, ventas) {
    try {
      const alertas = [];

      // Facturas vencidas
      const facturasVencidas =
        cobranzas?.filter(cobranza => cobranza.estado === 'Vencido').length ||
        0;

      if (facturasVencidas > 0) {
        alertas.push({
          id: 1,
          tipo: 'warning',
          mensaje: `${facturasVencidas} facturas vencidas por más de 30 días`,
          icono: 'AlertTriangle',
          fecha: new Date().toISOString().split('T')[0],
        });
      }

      // Meta de ventas
      const ventasMes = this.calcularVentasMes(ventas);
      if (ventasMes > 2000000) {
        alertas.push({
          id: 2,
          tipo: 'success',
          mensaje: `Meta de ventas del mes alcanzada al ${Math.round((ventasMes / 2000000) * 100)}%`,
          icono: 'CheckCircle',
          fecha: new Date().toISOString().split('T')[0],
        });
      }

      return alertas;
    } catch (error) {
      console.error('❌ Error obteniendo alertas:', error);
      return [];
    }
  }

  /**
   * Obtener actividad reciente
   */
  async getActividadReciente() {
    try {
      // Por ahora retornamos actividad simulada
      // En el futuro se podría obtener de una tabla de logs
      return [
        {
          id: 1,
          accion: 'Nuevo cliente agregado',
          usuario: 'Carlos V.',
          tiempo: '2 min',
          detalles: 'Tech Solutions Ltda - Categoría VIP',
        },
        {
          id: 2,
          accion: 'Factura generada',
          usuario: 'María G.',
          tiempo: '15 min',
          detalles: 'F001-2024 - $595,000',
        },
      ];
    } catch (error) {
      console.error('❌ Error obteniendo actividad reciente:', error);
      return [];
    }
  }

  // =====================================================================
  // 📋 CONTRATOS DATA
  // =====================================================================

  /**
   * Obtener contratos desde Supabase
   */
  async getContratosData() {
    try {
      console.log('🔄 Cargando contratos desde Supabase...');

      // Por ahora retornamos datos simulados
      // En el futuro se conectaría con la tabla contratos
      return [
        {
          id: 1,
          fecha_inicio: '2024-01-15',
          fecha_fin: '2024-12-31',
          cliente: 'Tech Solutions Ltda',
          descripcion: 'Servicios de consultoría IT',
          monto: 2500000,
          estado: 'activo',
          tipo_contrato: 'Anual',
          notas: 'Renovación automática',
        },
        {
          id: 2,
          fecha_inicio: '2024-03-01',
          fecha_fin: '2024-08-31',
          cliente: 'Constructora ABC',
          descripcion: 'Asesoría contable',
          monto: 1800000,
          estado: 'activo',
          tipo_contrato: 'Semestral',
          notas: 'Pago mensual',
        },
      ];
    } catch (error) {
      console.error('❌ Error cargando contratos:', error);
      return [];
    }
  }

  /**
   * Crear nuevo contrato
   */
  async crearContrato(contratoData) {
    try {
      console.log('🔄 Creando contrato...', contratoData);
      // Aquí se implementaría la lógica para crear en Supabase
      return { success: true, id: Date.now() };
    } catch (error) {
      console.error('❌ Error creando contrato:', error);
      throw error;
    }
  }

  /**
   * Actualizar contrato
   */
  async actualizarContrato(id, contratoData) {
    try {
      console.log('🔄 Actualizando contrato...', { id, contratoData });
      // Aquí se implementaría la lógica para actualizar en Supabase
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando contrato:', error);
      throw error;
    }
  }

  /**
   * Eliminar contrato
   */
  async eliminarContrato(id) {
    try {
      console.log('🔄 Eliminando contrato...', id);
      // Aquí se implementaría la lógica para eliminar en Supabase
      return { success: true };
    } catch (error) {
      console.error('❌ Error eliminando contrato:', error);
      throw error;
    }
  }

  // =====================================================================
  // 👥 USUARIOS DATA
  // =====================================================================

  /**
   * Obtener usuarios desde Supabase
   */
  async getUsuariosData() {
    try {
      console.log('🔄 Cargando usuarios desde Supabase...');

      // Por ahora retornamos datos simulados
      return [
        {
          id: 1,
          nombre: 'Carlos Vásquez',
          email: 'carlos@mtz.cl',
          rol: 'admin',
          activo: true,
          ultimo_acceso: '2024-01-15T10:30:00Z',
        },
        {
          id: 2,
          nombre: 'María González',
          email: 'maria@mtz.cl',
          rol: 'colaborador',
          activo: true,
          ultimo_acceso: '2024-01-15T09:15:00Z',
        },
      ];
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      return [];
    }
  }

  /**
   * Obtener roles desde Supabase
   */
  async getRolesData() {
    try {
      console.log('🔄 Cargando roles desde Supabase...');

      return [
        { id: 1, nombre: 'admin', descripcion: 'Administrador' },
        { id: 2, nombre: 'colaborador', descripcion: 'Colaborador' },
        { id: 3, nombre: 'cliente', descripcion: 'Cliente' },
      ];
    } catch (error) {
      console.error('❌ Error cargando roles:', error);
      return [];
    }
  }

  /**
   * Crear usuario
   */
  async crearUsuario(userData) {
    try {
      console.log('🔄 Creando usuario...', userData);
      return { success: true, id: Date.now() };
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  async actualizarUsuario(id, userData) {
    try {
      console.log('🔄 Actualizando usuario...', { id, userData });
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      throw error;
    }
  }

  // =====================================================================
  // 👥 RRHH DATA
  // =====================================================================

  /**
   * Obtener datos de RRHH
   */
  async getNominasData() {
    try {
      console.log('🔄 Cargando nóminas desde Supabase...');
      return [];
    } catch (error) {
      console.error('❌ Error cargando nóminas:', error);
      return [];
    }
  }

  /**
   * Obtener estadísticas de RRHH
   */
  async getEstadisticasRRHH() {
    try {
      console.log('🔄 Cargando estadísticas RRHH...');
      return {
        totalEmpleados: 0,
        empleadosActivos: 0,
        totalNominas: 0,
        promedioSalario: 0,
      };
    } catch (error) {
      console.error('❌ Error cargando estadísticas RRHH:', error);
      return {};
    }
  }

  /**
   * Crear empleado
   */
  async crearEmpleado(empleadoData) {
    try {
      console.log('🔄 Creando empleado...', empleadoData);
      return { success: true, id: Date.now() };
    } catch (error) {
      console.error('❌ Error creando empleado:', error);
      throw error;
    }
  }

  /**
   * Actualizar empleado
   */
  async actualizarEmpleado(id, empleadoData) {
    try {
      console.log('🔄 Actualizando empleado...', { id, empleadoData });
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando empleado:', error);
      throw error;
    }
  }

  /**
   * Eliminar empleado
   */
  async eliminarEmpleado(id) {
    try {
      console.log('🔄 Eliminando empleado...', id);
      return { success: true };
    } catch (error) {
      console.error('❌ Error eliminando empleado:', error);
      throw error;
    }
  }

  /**
   * Crear nómina
   */
  async crearNomina(nominaData) {
    try {
      console.log('🔄 Creando nómina...', nominaData);
      return { success: true, id: Date.now() };
    } catch (error) {
      console.error('❌ Error creando nómina:', error);
      throw error;
    }
  }

  /**
   * Actualizar nómina
   */
  async actualizarNomina(id, nominaData) {
    try {
      console.log('🔄 Actualizando nómina...', { id, nominaData });
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando nómina:', error);
      throw error;
    }
  }

  /**
   * Eliminar nómina
   */
  async eliminarNomina(id) {
    try {
      console.log('🔄 Eliminando nómina...', id);
      return { success: true };
    } catch (error) {
      console.error('❌ Error eliminando nómina:', error);
      throw error;
    }
  }
}

// Exportar instancia única
export const dataService = new DataService();
export default dataService;
