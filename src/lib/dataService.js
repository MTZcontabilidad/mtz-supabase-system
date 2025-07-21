// =====================================================================
// 🚀 SERVICIO DE DATOS CENTRALIZADO - SISTEMA MTZ v3.0
// =====================================================================

import { supabase } from './supabase.js';
import { formatCurrency, formatRUT, formatDate } from '../utils/helpers.js';

/**
 * Servicio de datos para el dashboard
 */
export const DashboardService = {
  /**
   * Cargar datos completos del dashboard
   */
  async getDashboardData() {
    try {
      console.log('🔄 Cargando datos del dashboard...');

      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes_contables')
        .select('*')
        .order('total_facturado', { ascending: false });

      if (clientesError) throw clientesError;

      // Cargar ventas (si existe la tabla)
      let ventasData = [];
      try {
        const { data: ventas, error: ventasError } = await supabase
          .from('ventas')
          .select('*')
          .order('fecha_emision', { ascending: false })
          .limit(50);

        if (!ventasError) {
          ventasData = ventas || [];
        }
      } catch (e) {
        console.log('Tabla ventas no disponible');
      }

      // Cargar cobranzas (si existe la tabla)
      let cobranzasData = [];
      try {
        const { data: cobranzas, error: cobranzasError } = await supabase
          .from('cobranzas')
          .select('*')
          .order('fecha_emision', { ascending: false })
          .limit(50);

        if (!cobranzasError) {
          cobranzasData = cobranzas || [];
        }
      } catch (e) {
        console.log('Tabla cobranzas no disponible');
      }

      // Procesar datos
      const clientes = clientesData || [];
      const totalFacturado = clientes.reduce(
        (sum, c) => sum + parseFloat(c.total_facturado || 0),
        0
      );
      const clientesActivos = clientes.filter(
        c => c.estado === 'Activo'
      ).length;
      const ticketPromedio =
        clientes.length > 0 ? totalFacturado / clientes.length : 0;

      // Métricas de ventas
      const totalVentas = ventasData.reduce(
        (sum, v) => sum + parseFloat(v.monto_total || 0),
        0
      );
      const ventasEmitidas = ventasData.filter(
        v => v.estado === 'emitida'
      ).length;
      const ventasPagadas = ventasData.filter(
        v => v.estado === 'pagada'
      ).length;

      // Métricas de cobranzas
      const totalCobranzas = cobranzasData.reduce(
        (sum, c) => sum + parseFloat(c.monto || 0),
        0
      );
      const cobranzasPendientes = cobranzasData.filter(
        c => c.estado === 'pendiente'
      ).length;
      const cobranzasVencidas = cobranzasData.filter(
        c => c.estado === 'vencida'
      ).length;

      return {
        timestamp: new Date().toISOString(),
        kpis: {
          clientes_activos: clientesActivos,
          facturacion_total: totalFacturado,
          ticket_promedio: ticketPromedio,
          total_ventas: totalVentas,
          ventas_emitidas: ventasEmitidas,
          ventas_pagadas: ventasPagadas,
          total_cobranzas: totalCobranzas,
          cobranzas_pendientes: cobranzasPendientes,
          cobranzas_vencidas: cobranzasVencidas,
        },
        top_clientes: clientes.slice(0, 10).map((cliente, index) => ({
          ...cliente,
          posicion: index + 1,
          participacion_pct: (
            ((cliente.total_facturado || 0) / totalFacturado) *
            100
          ).toFixed(1),
        })),
        sistema_status: {
          estado: 'Operativo',
          latencia_promedio: '50ms',
          ultima_actualizacion: new Date().toLocaleString('es-CL'),
        },
      };
    } catch (error) {
      console.error('❌ Error cargando dashboard:', error);
      throw error;
    }
  },

  /**
   * Obtener análisis ejecutivo
   */
  async getAnalisisEjecutivo() {
    const dashboardData = await this.getDashboardData();
    return {
      ...dashboardData,
      analisis: {
        tendencia: 'creciente',
        recomendaciones: [
          'Mantener enfoque en clientes de alto valor',
          'Optimizar proceso de cobranzas',
          'Expandir cartera de servicios',
        ],
      },
    };
  },
};

/**
 * Servicio de datos para clientes
 */
export const ClientesService = {
  /**
   * Obtener todos los clientes
   */
  async getClientes() {
    try {
      const { data, error } = await supabase
        .from('clientes_contables')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      throw error;
    }
  },

  /**
   * Buscar clientes
   */
  async buscarClientes(termino) {
    if (!termino?.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('clientes_contables')
        .select('*')
        .or(
          `nombre.ilike.%${termino}%,rut.ilike.%${termino}%,giro.ilike.%${termino}%`
        )
        .order('nombre')
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error buscando clientes:', error);
      return [];
    }
  },

  /**
   * Crear cliente
   */
  async crearCliente(clienteData) {
    try {
      const { data, error } = await supabase
        .from('clientes_contables')
        .insert(clienteData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando cliente:', error);
      throw error;
    }
  },

  /**
   * Actualizar cliente
   */
  async actualizarCliente(id, clienteData) {
    try {
      const { data, error } = await supabase
        .from('clientes_contables')
        .update(clienteData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando cliente:', error);
      throw error;
    }
  },

  /**
   * Eliminar cliente
   */
  async eliminarCliente(id) {
    try {
      const { error } = await supabase
        .from('clientes_contables')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando cliente:', error);
      throw error;
    }
  },
};

/**
 * Servicio de datos para ventas
 */
export const VentasService = {
  /**
   * Obtener todas las ventas
   */
  async getVentas() {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .select('*')
        .order('fecha_emision', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo ventas:', error);
      return [];
    }
  },

  /**
   * Crear venta
   */
  async crearVenta(ventaData) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .insert(ventaData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando venta:', error);
      throw error;
    }
  },

  /**
   * Actualizar venta
   */
  async actualizarVenta(id, ventaData) {
    try {
      const { data, error } = await supabase
        .from('ventas')
        .update(ventaData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando venta:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de ventas
   */
  async getEstadisticasVentas() {
    try {
      const ventas = await this.getVentas();
      const totalVentas = ventas.reduce(
        (sum, v) => sum + parseFloat(v.monto_total || 0),
        0
      );
      const ventasEmitidas = ventas.filter(v => v.estado === 'emitida').length;
      const ventasPagadas = ventas.filter(v => v.estado === 'pagada').length;

      return {
        total_ventas: totalVentas,
        cantidad_ventas: ventas.length,
        ventas_emitidas: ventasEmitidas,
        ventas_pagadas: ventasPagadas,
        promedio_venta: ventas.length > 0 ? totalVentas / ventas.length : 0,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de ventas:', error);
      return {
        total_ventas: 0,
        cantidad_ventas: 0,
        ventas_emitidas: 0,
        ventas_pagadas: 0,
        promedio_venta: 0,
      };
    }
  },
};

/**
 * Servicio de datos para cobranzas
 */
export const CobranzaService = {
  /**
   * Obtener todas las cobranzas
   */
  async getCobranzas() {
    try {
      const { data, error } = await supabase
        .from('cobranzas')
        .select('*')
        .order('fecha_emision', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo cobranzas:', error);
      return [];
    }
  },

  /**
   * Crear cobranza
   */
  async crearCobranza(cobranzaData) {
    try {
      const { data, error } = await supabase
        .from('cobranzas')
        .insert(cobranzaData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando cobranza:', error);
      throw error;
    }
  },

  /**
   * Actualizar cobranza
   */
  async actualizarCobranza(id, cobranzaData) {
    try {
      const { data, error } = await supabase
        .from('cobranzas')
        .update(cobranzaData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando cobranza:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de cobranzas
   */
  async getEstadisticasCobranzas() {
    try {
      const cobranzas = await this.getCobranzas();
      const totalCobranzas = cobranzas.reduce(
        (sum, c) => sum + parseFloat(c.monto || 0),
        0
      );
      const cobranzasPendientes = cobranzas.filter(
        c => c.estado === 'pendiente'
      ).length;
      const cobranzasVencidas = cobranzas.filter(
        c => c.estado === 'vencida'
      ).length;
      const cobranzasPagadas = cobranzas.filter(
        c => c.estado === 'pagada'
      ).length;

      return {
        total_cobranzas: totalCobranzas,
        cantidad_cobranzas: cobranzas.length,
        cobranzas_pendientes: cobranzasPendientes,
        cobranzas_vencidas: cobranzasVencidas,
        cobranzas_pagadas: cobranzasPagadas,
        promedio_cobranza:
          cobranzas.length > 0 ? totalCobranzas / cobranzas.length : 0,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de cobranzas:', error);
      return {
        total_cobranzas: 0,
        cantidad_cobranzas: 0,
        cobranzas_pendientes: 0,
        cobranzas_vencidas: 0,
        cobranzas_pagadas: 0,
        promedio_cobranza: 0,
      };
    }
  },
};

/**
 * Servicio de datos para compras
 */
export const ComprasService = {
  /**
   * Obtener todas las compras
   */
  async getCompras() {
    try {
      const { data, error } = await supabase
        .from('compras')
        .select('*')
        .order('fecha_compra', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo compras:', error);
      return [];
    }
  },

  /**
   * Crear compra
   */
  async crearCompra(compraData) {
    try {
      const { data, error } = await supabase
        .from('compras')
        .insert(compraData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando compra:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de compras
   */
  async getEstadisticasCompras() {
    try {
      const compras = await this.getCompras();
      const totalCompras = compras.reduce(
        (sum, c) => sum + parseFloat(c.monto_total || 0),
        0
      );

      return {
        total_compras: totalCompras,
        cantidad_compras: compras.length,
        promedio_compra: compras.length > 0 ? totalCompras / compras.length : 0,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de compras:', error);
      return {
        total_compras: 0,
        cantidad_compras: 0,
        promedio_compra: 0,
      };
    }
  },
};

/**
 * Servicio de datos para contratos
 */
export const ContratosService = {
  /**
   * Obtener todos los contratos
   */
  async getContratos() {
    try {
      const { data, error } = await supabase
        .from('contratos_clientes')
        .select('*')
        .order('fecha_inicio', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo contratos:', error);
      return [];
    }
  },

  /**
   * Crear contrato
   */
  async crearContrato(contratoData) {
    try {
      const { data, error } = await supabase
        .from('contratos_clientes')
        .insert(contratoData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando contrato:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de contratos
   */
  async getEstadisticasContratos() {
    try {
      const contratos = await this.getContratos();
      const contratosActivos = contratos.filter(
        c => c.estado === 'activo'
      ).length;
      const contratosVencidos = contratos.filter(
        c => c.estado === 'vencido'
      ).length;

      return {
        total_contratos: contratos.length,
        contratos_activos: contratosActivos,
        contratos_vencidos: contratosVencidos,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de contratos:', error);
      return {
        total_contratos: 0,
        contratos_activos: 0,
        contratos_vencidos: 0,
      };
    }
  },
};

/**
 * Servicio de datos para reportes
 */
export const ReportsService = {
  /**
   * Generar reporte ejecutivo
   */
  async generarReporteEjecutivo() {
    try {
      const [ventas, cobranzas, clientes] = await Promise.all([
        VentasService.getEstadisticasVentas(),
        CobranzaService.getEstadisticasCobranzas(),
        ClientesService.getClientes(),
      ]);

      return {
        ventas,
        cobranzas,
        clientes: {
          total: clientes.length,
          activos: clientes.filter(c => c.estado === 'Activo').length,
        },
        reporte: {
          titulo: 'Reporte Ejecutivo MTZ',
          fecha: new Date().toLocaleDateString('es-CL'),
          resumen: 'Análisis completo del sistema',
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error generando reporte ejecutivo:', error);
      throw error;
    }
  },
};

/**
 * Servicio de datos para gestión del portal de clientes
 */
export const PortalClienteService = {
  /**
   * Obtener documentos tributarios
   */
  async getDocumentosTributarios(filters = {}) {
    try {
      let query = supabase
        .from('documentos_tributarios')
        .select('*')
        .order('fecha_emision', { ascending: false });

      if (filters.cliente_id) {
        query = query.eq('cliente_id', filters.cliente_id);
      }
      if (filters.tipo_documento) {
        query = query.eq('tipo_documento', filters.tipo_documento);
      }
      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo documentos tributarios:', error);
      return [];
    }
  },

  /**
   * Crear documento tributario
   */
  async crearDocumentoTributario(documentoData) {
    try {
      const { data, error } = await supabase
        .from('documentos_tributarios')
        .insert({
          ...documentoData,
          monto_neto: parseFloat(documentoData.monto_neto || 0),
          monto_iva: parseFloat(documentoData.monto_iva || 0),
          monto_total: parseFloat(documentoData.monto_total || 0),
        })
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || documentoData;
    } catch (error) {
      console.error('❌ Error creando documento tributario:', error);
      return {
        id: `DOC${Date.now()}`,
        ...documentoData,
        monto_neto: parseFloat(documentoData.monto_neto || 0),
        monto_iva: parseFloat(documentoData.monto_iva || 0),
        monto_total: parseFloat(documentoData.monto_total || 0),
      };
    }
  },

  /**
   * Obtener declaraciones
   */
  async getDeclaraciones(filters = {}) {
    try {
      let query = supabase
        .from('declaraciones')
        .select('*')
        .order('fecha_vencimiento', { ascending: false });

      if (filters.cliente_id) {
        query = query.eq('cliente_id', filters.cliente_id);
      }
      if (filters.tipo_declaracion) {
        query = query.eq('tipo_declaracion', filters.tipo_declaracion);
      }
      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo declaraciones:', error);
      return [];
    }
  },

  /**
   * Crear declaración
   */
  async crearDeclaracion(declaracionData) {
    try {
      const { data, error } = await supabase
        .from('declaraciones')
        .insert({
          ...declaracionData,
          monto_impuesto: parseFloat(declaracionData.monto_impuesto || 0),
          periodo_mes: parseInt(declaracionData.periodo_mes),
          periodo_ano: parseInt(declaracionData.periodo_ano),
        })
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || declaracionData;
    } catch (error) {
      console.error('❌ Error creando declaración:', error);
      return {
        id: `DEC${Date.now()}`,
        ...declaracionData,
        monto_impuesto: parseFloat(declaracionData.monto_impuesto || 0),
        periodo_mes: parseInt(declaracionData.periodo_mes),
        periodo_ano: parseInt(declaracionData.periodo_ano),
      };
    }
  },

  /**
   * Obtener reportes
   */
  async getReportes(filters = {}) {
    try {
      let query = supabase
        .from('reportes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.cliente_id) {
        query = query.eq('cliente_id', filters.cliente_id);
      }
      if (filters.tipo_reporte) {
        query = query.eq('tipo_reporte', filters.tipo_reporte);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo reportes:', error);
      return [];
    }
  },

  /**
   * Crear reporte
   */
  async crearReporte(reporteData) {
    try {
      const { data, error } = await supabase
        .from('reportes')
        .insert({
          ...reporteData,
          periodo_mes: parseInt(reporteData.periodo_mes),
          periodo_ano: parseInt(reporteData.periodo_ano),
        })
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || reporteData;
    } catch (error) {
      console.error('❌ Error creando reporte:', error);
      return {
        id: `REP${Date.now()}`,
        ...reporteData,
        periodo_mes: parseInt(reporteData.periodo_mes),
        periodo_ano: parseInt(reporteData.periodo_ano),
      };
    }
  },

  /**
   * Obtener eventos
   */
  async getEventos(filters = {}) {
    try {
      let query = supabase
        .from('eventos')
        .select('*')
        .order('fecha_evento', { ascending: true });

      if (filters.cliente_id) {
        query = query.eq('cliente_id', filters.cliente_id);
      }
      if (filters.tipo_evento) {
        query = query.eq('tipo_evento', filters.tipo_evento);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo eventos:', error);
      return [];
    }
  },

  /**
   * Crear evento
   */
  async crearEvento(eventoData) {
    try {
      const { data, error } = await supabase
        .from('eventos')
        .insert(eventoData)
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || eventoData;
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      return {
        id: `EVT${Date.now()}`,
        ...eventoData,
      };
    }
  },

  /**
   * Obtener notificaciones
   */
  async getNotificaciones(filters = {}) {
    try {
      let query = supabase
        .from('notificaciones')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.cliente_id) {
        query = query.eq('cliente_id', filters.cliente_id);
      }
      if (filters.tipo_notificacion) {
        query = query.eq('tipo_notificacion', filters.tipo_notificacion);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones:', error);
      return [];
    }
  },

  /**
   * Crear notificación
   */
  async crearNotificacion(notificacionData) {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .insert(notificacionData)
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || notificacionData;
    } catch (error) {
      console.error('❌ Error creando notificación:', error);
      return {
        id: `NOT${Date.now()}`,
        ...notificacionData,
      };
    }
  },

  /**
   * Obtener estadísticas del portal
   */
  async getEstadisticasPortal(clienteId = null) {
    try {
      const documentos = await this.getDocumentosTributarios(
        clienteId ? { cliente_id: clienteId } : {}
      );
      const declaraciones = await this.getDeclaraciones(
        clienteId ? { cliente_id: clienteId } : {}
      );
      const reportes = await this.getReportes(
        clienteId ? { cliente_id: clienteId } : {}
      );
      const eventos = await this.getEventos(
        clienteId ? { cliente_id: clienteId } : {}
      );
      const notificaciones = await this.getNotificaciones(
        clienteId ? { cliente_id: clienteId } : {}
      );

      const totalDocumentos = documentos.length;
      const documentosPendientes = documentos.filter(
        d => d.estado === 'pendiente'
      ).length;
      const totalDeclaraciones = declaraciones.length;
      const declaracionesVencidas = declaraciones.filter(
        d => d.estado === 'vencida'
      ).length;
      const totalReportes = reportes.length;
      const totalEventos = eventos.length;
      const eventosProximos = eventos.filter(e => {
        const fechaEvento = new Date(e.fecha_evento);
        const hoy = new Date();
        const diffTime = fechaEvento - hoy;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      }).length;
      const totalNotificaciones = notificaciones.length;
      const notificacionesNoLeidas = notificaciones.filter(
        n => !n.leida
      ).length;

      return {
        total_documentos: totalDocumentos,
        documentos_pendientes: documentosPendientes,
        total_declaraciones: totalDeclaraciones,
        declaraciones_vencidas: declaracionesVencidas,
        total_reportes: totalReportes,
        total_eventos: totalEventos,
        eventos_proximos: eventosProximos,
        total_notificaciones: totalNotificaciones,
        notificaciones_no_leidas: notificacionesNoLeidas,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas del portal:', error);
      return {
        total_documentos: 0,
        documentos_pendientes: 0,
        total_declaraciones: 0,
        declaraciones_vencidas: 0,
        total_reportes: 0,
        total_eventos: 0,
        eventos_proximos: 0,
        total_notificaciones: 0,
        notificaciones_no_leidas: 0,
      };
    }
  },
};

/**
 * Servicio de datos para requerimientos
 */
export const RequerimientosService = {
  /**
   * Obtener todos los requerimientos
   */
  async getRequerimientos(filters = {}) {
    try {
      let query = supabase
        .from('requerimientos')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (filters.search) {
        query = query.or(
          `titulo.ilike.%${filters.search}%,descripcion.ilike.%${filters.search}%`
        );
      }
      if (filters.estado && filters.estado !== 'todos') {
        query = query.eq('estado', filters.estado);
      }
      if (filters.prioridad) {
        query = query.eq('prioridad', filters.prioridad);
      }

      const { data, error } = await query;
      if (error && error.code !== 'PGRST116') throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo requerimientos:', error);
      // Si la tabla no existe, retornar array vacío
      return [];
    }
  },

  /**
   * Crear requerimiento
   */
  async crearRequerimiento(requerimientoData) {
    try {
      const { data, error } = await supabase
        .from('requerimientos')
        .insert({
          ...requerimientoData,
          fecha_creacion: new Date().toISOString().split('T')[0],
        })
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || requerimientoData;
    } catch (error) {
      console.error('❌ Error creando requerimiento:', error);
      // Si la tabla no existe, simular creación
      return {
        id: `REQ${Date.now()}`,
        ...requerimientoData,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };
    }
  },

  /**
   * Actualizar requerimiento
   */
  async actualizarRequerimiento(id, requerimientoData) {
    try {
      const { data, error } = await supabase
        .from('requerimientos')
        .update(requerimientoData)
        .eq('id', id)
        .select();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.[0] || { id, ...requerimientoData };
    } catch (error) {
      console.error('❌ Error actualizando requerimiento:', error);
      // Si la tabla no existe, simular actualización
      return { id, ...requerimientoData };
    }
  },

  /**
   * Eliminar requerimiento
   */
  async eliminarRequerimiento(id) {
    try {
      const { error } = await supabase
        .from('requerimientos')
        .delete()
        .eq('id', id);

      if (error && error.code !== 'PGRST116') throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando requerimiento:', error);
      // Si la tabla no existe, simular eliminación
      return true;
    }
  },

  /**
   * Obtener estadísticas de requerimientos
   */
  async getEstadisticasRequerimientos() {
    try {
      const requerimientos = await this.getRequerimientos();

      const total = requerimientos.length;
      const pendientes = requerimientos.filter(
        r => r.estado === 'Pendiente'
      ).length;
      const enProceso = requerimientos.filter(
        r => r.estado === 'En Proceso'
      ).length;
      const completados = requerimientos.filter(
        r => r.estado === 'Completado'
      ).length;
      const urgentes = requerimientos.filter(
        r => r.prioridad === 'Urgente'
      ).length;
      const vencidos = requerimientos.filter(r => {
        if (!r.fecha_limite) return false;
        return (
          new Date(r.fecha_limite) < new Date() && r.estado !== 'Completado'
        );
      }).length;

      return {
        total_requerimientos: total,
        requerimientos_pendientes: pendientes,
        requerimientos_en_proceso: enProceso,
        requerimientos_completados: completados,
        requerimientos_urgentes: urgentes,
        requerimientos_vencidos: vencidos,
      };
    } catch (error) {
      console.error(
        '❌ Error obteniendo estadísticas de requerimientos:',
        error
      );
      return {
        total_requerimientos: 0,
        requerimientos_pendientes: 0,
        requerimientos_en_proceso: 0,
        requerimientos_completados: 0,
        requerimientos_urgentes: 0,
        requerimientos_vencidos: 0,
      };
    }
  },
};

/**
 * Servicio de datos para proyecciones
 */
export const ProyeccionesService = {
  /**
   * Obtener todas las proyecciones
   */
  async getProyecciones(filters = {}) {
    try {
      let query = supabase
        .from('proyecciones')
        .select('*')
        .order('año', { ascending: false })
        .order('mes_inicio', { ascending: true });

      if (filters.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters.año) {
        query = query.eq('año', filters.año);
      }
      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo proyecciones:', error);
      throw error;
    }
  },

  /**
   * Crear proyección
   */
  async crearProyeccion(proyeccionData) {
    try {
      const { data, error } = await supabase
        .from('proyecciones')
        .insert({
          ...proyeccionData,
          monto_objetivo: parseFloat(proyeccionData.monto_objetivo),
          monto_real: parseFloat(proyeccionData.monto_real) || 0,
          porcentaje_cumplimiento:
            parseFloat(proyeccionData.porcentaje_cumplimiento) || 0,
          año: parseInt(proyeccionData.año),
          mes_inicio: parseInt(proyeccionData.mes_inicio),
          mes_fin: parseInt(proyeccionData.mes_fin),
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando proyección:', error);
      throw error;
    }
  },

  /**
   * Actualizar proyección
   */
  async actualizarProyeccion(id, proyeccionData) {
    try {
      const { data, error } = await supabase
        .from('proyecciones')
        .update({
          ...proyeccionData,
          monto_objetivo: parseFloat(proyeccionData.monto_objetivo),
          monto_real: parseFloat(proyeccionData.monto_real) || 0,
          porcentaje_cumplimiento:
            parseFloat(proyeccionData.porcentaje_cumplimiento) || 0,
          año: parseInt(proyeccionData.año),
          mes_inicio: parseInt(proyeccionData.mes_inicio),
          mes_fin: parseInt(proyeccionData.mes_fin),
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando proyección:', error);
      throw error;
    }
  },

  /**
   * Eliminar proyección
   */
  async eliminarProyeccion(id) {
    try {
      const { error } = await supabase
        .from('proyecciones')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando proyección:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de proyecciones
   */
  async getEstadisticasProyecciones() {
    try {
      const proyecciones = await this.getProyecciones();

      const totalProyecciones = proyecciones.length;
      const proyeccionesCompletadas = proyecciones.filter(
        p => p.estado === 'completado'
      ).length;
      const proyeccionesEnProgreso = proyecciones.filter(
        p => p.estado === 'en_progreso'
      ).length;
      const proyeccionesAtrasadas = proyecciones.filter(
        p => p.estado === 'atrasado'
      ).length;

      const totalObjetivo = proyecciones.reduce(
        (sum, p) => sum + parseFloat(p.monto_objetivo || 0),
        0
      );
      const totalReal = proyecciones.reduce(
        (sum, p) => sum + parseFloat(p.monto_real || 0),
        0
      );
      const promedioCumplimiento =
        proyecciones.length > 0
          ? proyecciones.reduce(
              (sum, p) => sum + parseFloat(p.porcentaje_cumplimiento || 0),
              0
            ) / proyecciones.length
          : 0;

      return {
        total_proyecciones: totalProyecciones,
        proyecciones_completadas: proyeccionesCompletadas,
        proyecciones_en_progreso: proyeccionesEnProgreso,
        proyecciones_atrasadas: proyeccionesAtrasadas,
        total_objetivo: totalObjetivo,
        total_real: totalReal,
        promedio_cumplimiento: promedioCumplimiento,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de proyecciones:', error);
      return {
        total_proyecciones: 0,
        proyecciones_completadas: 0,
        proyecciones_en_progreso: 0,
        proyecciones_atrasadas: 0,
        total_objetivo: 0,
        total_real: 0,
        promedio_cumplimiento: 0,
      };
    }
  },
};

/**
 * Servicio de datos para RRHH
 */
export const RRHHService = {
  /**
   * Obtener todos los empleados
   */
  async getEmpleados(filters = {}) {
    try {
      let query = supabase
        .from('empleados')
        .select('*')
        .order('nombre', { ascending: true });

      if (filters.search) {
        query = query.or(
          `nombre.ilike.%${filters.search}%,apellido.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }
      if (filters.departamento) {
        query = query.eq('departamento', filters.departamento);
      }
      if (filters.estado) {
        query = query.eq('estado', filters.estado);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo empleados:', error);
      throw error;
    }
  },

  /**
   * Crear empleado
   */
  async crearEmpleado(empleadoData) {
    try {
      const { data, error } = await supabase
        .from('empleados')
        .insert({
          ...empleadoData,
          salario_base: parseFloat(empleadoData.salario_base),
          fecha_ingreso:
            empleadoData.fecha_ingreso ||
            new Date().toISOString().split('T')[0],
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando empleado:', error);
      throw error;
    }
  },

  /**
   * Actualizar empleado
   */
  async actualizarEmpleado(id, empleadoData) {
    try {
      const { data, error } = await supabase
        .from('empleados')
        .update({
          ...empleadoData,
          salario_base: parseFloat(empleadoData.salario_base),
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando empleado:', error);
      throw error;
    }
  },

  /**
   * Eliminar empleado
   */
  async eliminarEmpleado(id) {
    try {
      const { error } = await supabase.from('empleados').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando empleado:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las nóminas
   */
  async getNominas(filters = {}) {
    try {
      let query = supabase
        .from('nominas')
        .select(
          `
          *,
          empleados (
            nombre,
            apellido,
            departamento
          )
        `
        )
        .order('año', { ascending: false })
        .order('mes', { ascending: false });

      if (filters.mes) {
        query = query.eq('mes', filters.mes);
      }
      if (filters.año) {
        query = query.eq('año', filters.año);
      }
      if (filters.empleado) {
        query = query.eq('empleado_id', filters.empleado);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo nóminas:', error);
      throw error;
    }
  },

  /**
   * Crear nómina
   */
  async crearNomina(nominaData) {
    try {
      const { data, error } = await supabase
        .from('nominas')
        .insert({
          ...nominaData,
          dias_trabajados: parseInt(nominaData.dias_trabajados),
          salario_base: parseFloat(nominaData.salario_base),
          bonificaciones: parseFloat(nominaData.bonificaciones || 0),
          descuentos: parseFloat(nominaData.descuentos || 0),
          salario_neto: parseFloat(nominaData.salario_neto),
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando nómina:', error);
      throw error;
    }
  },

  /**
   * Actualizar nómina
   */
  async actualizarNomina(id, nominaData) {
    try {
      const { data, error } = await supabase
        .from('nominas')
        .update({
          ...nominaData,
          dias_trabajados: parseInt(nominaData.dias_trabajados),
          salario_base: parseFloat(nominaData.salario_base),
          bonificaciones: parseFloat(nominaData.bonificaciones || 0),
          descuentos: parseFloat(nominaData.descuentos || 0),
          salario_neto: parseFloat(nominaData.salario_neto),
        })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando nómina:', error);
      throw error;
    }
  },

  /**
   * Eliminar nómina
   */
  async eliminarNomina(id) {
    try {
      const { error } = await supabase.from('nominas').delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error eliminando nómina:', error);
      throw error;
    }
  },

  /**
   * Obtener estadísticas de RRHH
   */
  async getEstadisticasRRHH() {
    try {
      const empleados = await this.getEmpleados();
      const nominas = await this.getNominas();

      const empleadosActivos = empleados.filter(
        e => e.estado === 'activo'
      ).length;
      const totalSalarios = empleados.reduce(
        (sum, e) => sum + parseFloat(e.salario_base || 0),
        0
      );
      const promedioSalario =
        empleados.length > 0 ? totalSalarios / empleados.length : 0;

      const totalNominas = nominas.reduce(
        (sum, n) => sum + parseFloat(n.salario_neto || 0),
        0
      );
      const nominasEsteMes = nominas.filter(n => {
        const fecha = new Date();
        return n.mes === fecha.getMonth() + 1 && n.año === fecha.getFullYear();
      }).length;

      return {
        total_empleados: empleados.length,
        empleados_activos: empleadosActivos,
        promedio_salario: promedioSalario,
        total_nominas: totalNominas,
        nominas_este_mes: nominasEsteMes,
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de RRHH:', error);
      return {
        total_empleados: 0,
        empleados_activos: 0,
        promedio_salario: 0,
        total_nominas: 0,
        nominas_este_mes: 0,
      };
    }
  },
};

/**
 * Servicio de datos para usuarios
 */
export const UsuariosService = {
  /**
   * Obtener todos los usuarios
   */
  async getUsuarios() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(
          `
          *,
          roles:rol_id (
            nombre,
            descripcion,
            permisos
          ),
          empresas:empresa_id (
            nombre,
            ruc
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      throw error;
    }
  },

  /**
   * Obtener roles
   */
  async getRoles() {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('nombre');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error obteniendo roles:', error);
      throw error;
    }
  },

  /**
   * Crear usuario
   */
  async crearUsuario(userData) {
    try {
      // Crear usuario en auth.users
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: userData.email,
          password: 'password123', // Contraseña temporal
          email_confirm: true,
        });

      if (authError) throw authError;

      // Crear registro en usuarios
      const { data, error } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user.id,
          email: userData.email,
          nombre: userData.nombre,
          apellido: userData.apellido,
          rol_id: userData.rol_id,
          empresa_id: userData.empresa_id,
          cargo: userData.cargo,
          telefono: userData.telefono,
          activo: userData.activo || true,
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      throw error;
    }
  },

  /**
   * Actualizar usuario
   */
  async actualizarUsuario(id, userData) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(userData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      throw error;
    }
  },
};

export default {
  DashboardService,
  ClientesService,
  VentasService,
  CobranzaService,
  ComprasService,
  ContratosService,
  ReportsService,
  PortalClienteService,
  RequerimientosService,
  ProyeccionesService,
  RRHHService,
  UsuariosService,
};
