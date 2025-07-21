import { useState, useCallback, useEffect } from 'react';
import { CobranzaService } from '@/lib/dataService';
import useAuth from './useAuth';
import usePermissions from './usePermissions';

/**
 * Hook personalizado para la gestión de cobranzas
 * Proporciona funcionalidades CRUD, filtrado, análisis y seguimiento de vencimientos
 */
export const useCobranzas = () => {
  const [cobranzas, setCobranzas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    cliente: '',
    estado: '',
    monto_min: '',
    monto_max: '',
    vencimiento: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'fecha_vencimiento',
    direction: 'asc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCobranza, setSelectedCobranza] = useState(null);
  const [stats, setStats] = useState(null);

  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  // Verificar permisos
  const canView = hasPermission('cobranzas', 'read');
  const canCreate = hasPermission('cobranzas', 'create');
  const canUpdate = hasPermission('cobranzas', 'update');
  const canDelete = hasPermission('cobranzas', 'delete');

  /**
   * Cargar todas las cobranzas
   */
  const cargarCobranzas = useCallback(async () => {
    if (!canView) {
      setError('No tienes permisos para ver cobranzas');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando cobranzas...');

      const cobranzasData = await CobranzaService.getCobranzas();

      // Procesar datos de cobranzas
      const cobranzasProcesadas = cobranzasData.map(cobranza => ({
        ...cobranza,
        analisis: generarAnalisisCobranza(cobranza),
        estado_display: obtenerEstadoDisplay(cobranza.estado),
        dias_vencimiento: calcularDiasVencimiento(cobranza.fecha_vencimiento),
      }));

      setCobranzas(cobranzasProcesadas);
      console.log('✅ Cobranzas cargadas exitosamente');
    } catch (error) {
      console.error('❌ Error cargando cobranzas:', error);
      setError(`Error cargando cobranzas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [canView]);

  /**
   * Crear nueva cobranza
   */
  const crearCobranza = useCallback(
    async cobranzaData => {
      if (!canCreate) {
        throw new Error('No tienes permisos para crear cobranzas');
      }

      try {
        setLoading(true);
        setError('');

        const nuevaCobranza = await CobranzaService.crearCobranza({
          ...cobranzaData,
          fecha_creacion: new Date().toISOString(),
          usuario_creacion: user?.id,
          estado: cobranzaData.estado || 'pendiente',
        });

        setCobranzas(prev => [nuevaCobranza, ...prev]);
        console.log('✅ Cobranza creada exitosamente');
        return nuevaCobranza;
      } catch (error) {
        console.error('❌ Error creando cobranza:', error);
        setError(`Error creando cobranza: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canCreate, user?.id]
  );

  /**
   * Actualizar cobranza
   */
  const actualizarCobranza = useCallback(
    async (id, cobranzaData) => {
      if (!canUpdate) {
        throw new Error('No tienes permisos para actualizar cobranzas');
      }

      try {
        setLoading(true);
        setError('');

        const cobranzaActualizada = await CobranzaService.actualizarCobranza(
          id,
          {
            ...cobranzaData,
            fecha_modificacion: new Date().toISOString(),
            usuario_modificacion: user?.id,
          }
        );

        setCobranzas(prev =>
          prev.map(cobranza =>
            cobranza.id === id ? cobranzaActualizada : cobranza
          )
        );

        console.log('✅ Cobranza actualizada exitosamente');
        return cobranzaActualizada;
      } catch (error) {
        console.error('❌ Error actualizando cobranza:', error);
        setError(`Error actualizando cobranza: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canUpdate, user?.id]
  );

  /**
   * Eliminar cobranza
   */
  const eliminarCobranza = useCallback(
    async id => {
      if (!canDelete) {
        throw new Error('No tienes permisos para eliminar cobranzas');
      }

      try {
        setLoading(true);
        setError('');

        await CobranzaService.eliminarCobranza(id);

        setCobranzas(prev => prev.filter(cobranza => cobranza.id !== id));
        console.log('✅ Cobranza eliminada exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando cobranza:', error);
        setError(`Error eliminando cobranza: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canDelete]
  );

  /**
   * Cambiar estado de cobranza
   */
  const cambiarEstadoCobranza = useCallback(
    async (id, nuevoEstado) => {
      if (!canUpdate) {
        throw new Error('No tienes permisos para actualizar cobranzas');
      }

      try {
        setLoading(true);
        setError('');

        const cobranzaActualizada = await CobranzaService.actualizarCobranza(
          id,
          {
            estado: nuevoEstado,
            fecha_modificacion: new Date().toISOString(),
            usuario_modificacion: user?.id,
          }
        );

        setCobranzas(prev =>
          prev.map(cobranza =>
            cobranza.id === id ? cobranzaActualizada : cobranza
          )
        );

        console.log('✅ Estado de cobranza actualizado exitosamente');
        return cobranzaActualizada;
      } catch (error) {
        console.error('❌ Error actualizando estado:', error);
        setError(`Error actualizando estado: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canUpdate, user?.id]
  );

  /**
   * Generar análisis de cobranza
   */
  const generarAnalisisCobranza = cobranza => {
    const monto = parseFloat(cobranza.monto || 0);
    const diasVencimiento = calcularDiasVencimiento(cobranza.fecha_vencimiento);
    const esVencida = diasVencimiento < 0;

    return {
      prioridad: calcularPrioridad(cobranza.estado, monto, diasVencimiento),
      riesgo: esVencida ? 'alto' : diasVencimiento <= 7 ? 'medio' : 'bajo',
      dias_vencimiento: diasVencimiento,
      es_vencida: esVencida,
      proxima_vencer: diasVencimiento <= 7 && diasVencimiento >= 0,
    };
  };

  /**
   * Obtener estado display
   */
  const obtenerEstadoDisplay = estado => {
    const estados = {
      pendiente: { label: 'Pendiente', color: 'warning' },
      pagado: { label: 'Pagado', color: 'success' },
      vencido: { label: 'Vencido', color: 'destructive' },
      cancelado: { label: 'Cancelado', color: 'secondary' },
      parcial: { label: 'Pago Parcial', color: 'outline' },
    };
    return estados[estado] || { label: estado, color: 'default' };
  };

  /**
   * Calcular días hasta vencimiento
   */
  const calcularDiasVencimiento = fechaVencimiento => {
    if (!fechaVencimiento) return null;

    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diffTime = vencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * Calcular prioridad
   */
  const calcularPrioridad = (estado, monto, diasVencimiento) => {
    let puntuacion = 0;

    if (estado === 'vencido') puntuacion += 50;
    if (diasVencimiento < 0) puntuacion += 40;
    if (diasVencimiento <= 7 && diasVencimiento >= 0) puntuacion += 30;
    if (monto > 1000000) puntuacion += 20;

    if (puntuacion >= 70) return 'alta';
    if (puntuacion >= 40) return 'media';
    return 'baja';
  };

  /**
   * Verificar vencimientos
   */
  const verificarVencimientos = useCallback(() => {
    const vencidas = cobranzas.filter(
      cobranza =>
        cobranza.analisis?.es_vencida && cobranza.estado === 'pendiente'
    );

    const proximasVencer = cobranzas.filter(
      cobranza =>
        cobranza.analisis?.proxima_vencer && cobranza.estado === 'pendiente'
    );

    return {
      vencidas: vencidas.length,
      proximas_vencer: proximasVencer.length,
      total_pendientes: cobranzas.filter(c => c.estado === 'pendiente').length,
    };
  }, [cobranzas]);

  /**
   * Obtener cobranzas filtradas y ordenadas
   */
  const cobranzasFiltradas = useCallback(() => {
    let filtradas = [...cobranzas];

    // Aplicar filtros
    if (filters.fecha_desde) {
      filtradas = filtradas.filter(
        c => new Date(c.fecha_creacion) >= new Date(filters.fecha_desde)
      );
    }
    if (filters.fecha_hasta) {
      filtradas = filtradas.filter(
        c => new Date(c.fecha_creacion) <= new Date(filters.fecha_hasta)
      );
    }
    if (filters.cliente) {
      filtradas = filtradas.filter(c =>
        c.cliente?.toLowerCase().includes(filters.cliente.toLowerCase())
      );
    }
    if (filters.estado) {
      filtradas = filtradas.filter(c => c.estado === filters.estado);
    }
    if (filters.monto_min) {
      filtradas = filtradas.filter(
        c => parseFloat(c.monto || 0) >= parseFloat(filters.monto_min)
      );
    }
    if (filters.monto_max) {
      filtradas = filtradas.filter(
        c => parseFloat(c.monto || 0) <= parseFloat(filters.monto_max)
      );
    }
    if (filters.vencimiento === 'vencidas') {
      filtradas = filtradas.filter(c => c.analisis?.es_vencida);
    } else if (filters.vencimiento === 'proximas') {
      filtradas = filtradas.filter(c => c.analisis?.proxima_vencer);
    }

    // Aplicar búsqueda
    if (searchTerm) {
      const termino = searchTerm.toLowerCase();
      filtradas = filtradas.filter(
        c =>
          c.cliente?.toLowerCase().includes(termino) ||
          c.descripcion?.toLowerCase().includes(termino) ||
          c.numero_factura?.toLowerCase().includes(termino)
      );
    }

    // Aplicar ordenamiento
    filtradas.sort((a, b) => {
      const aValue = a[sortConfig.key] || 0;
      const bValue = b[sortConfig.key] || 0;

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtradas;
  }, [cobranzas, filters, searchTerm, sortConfig]);

  /**
   * Generar estadísticas
   */
  const generarStats = useCallback(() => {
    const totalCobranzas = cobranzas.length;
    const totalMonto = cobranzas.reduce(
      (sum, c) => sum + parseFloat(c.monto || 0),
      0
    );
    const cobranzasPagadas = cobranzas.filter(
      c => c.estado === 'pagado'
    ).length;
    const cobranzasPendientes = cobranzas.filter(
      c => c.estado === 'pendiente'
    ).length;
    const cobranzasVencidas = cobranzas.filter(
      c => c.estado === 'vencido'
    ).length;
    const montoPromedio = totalCobranzas > 0 ? totalMonto / totalCobranzas : 0;

    const vencimientos = verificarVencimientos();

    const distribucionEstados = {
      pagado: cobranzasPagadas,
      pendiente: cobranzasPendientes,
      vencido: cobranzasVencidas,
    };

    const distribucionMensual = cobranzas.reduce((acc, c) => {
      const mes = new Date(c.fecha_creacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
      });
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalCobranzas,
      totalMonto,
      cobranzasPagadas,
      cobranzasPendientes,
      cobranzasVencidas,
      montoPromedio,
      distribucionEstados,
      distribucionMensual,
      vencimientos,
    });
  }, [cobranzas, verificarVencimientos]);

  // Cargar cobranzas al montar el componente
  useEffect(() => {
    cargarCobranzas();
  }, [cargarCobranzas]);

  // Generar estadísticas cuando cambien las cobranzas
  useEffect(() => {
    if (cobranzas.length > 0) {
      generarStats();
    }
  }, [cobranzas, generarStats]);

  return {
    // Estado
    cobranzas,
    loading,
    error,
    filters,
    sortConfig,
    searchTerm,
    selectedCobranza,
    stats,

    // Permisos
    canView,
    canCreate,
    canUpdate,
    canDelete,

    // Acciones
    cargarCobranzas,
    crearCobranza,
    actualizarCobranza,
    eliminarCobranza,
    cambiarEstadoCobranza,

    // Utilidades
    cobranzasFiltradas: cobranzasFiltradas(),
    verificarVencimientos,
    setFilters,
    setSortConfig,
    setSearchTerm,
    setSelectedCobranza,
    clearError: () => setError(''),
  };
};
