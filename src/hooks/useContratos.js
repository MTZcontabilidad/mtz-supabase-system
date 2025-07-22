import { useState, useCallback, useEffect } from 'react';
import useAuth from '@/hooks/useAuth.js';

import { ContratosService } from '@/lib/dataService';
import usePermissions from './usePermissions';

/**
 * Hook personalizado para la gestión de contratos
 * Proporciona funcionalidades CRUD, filtrado, análisis y seguimiento de vencimientos
 */
export const useContratos = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    cliente: '',
    estado: '',
    tipo_contrato: '',
    monto_min: '',
    monto_max: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'fecha_inicio',
    direction: 'desc',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [stats, setStats] = useState(null);

  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  // Verificar permisos
  const canView = hasPermission('contratos', 'read');
  const canCreate = hasPermission('contratos', 'create');
  const canUpdate = hasPermission('contratos', 'update');
  const canDelete = hasPermission('contratos', 'delete');

  // Tipos de contratos
  const tiposContrato = [
    'Servicios Profesionales',
    'Consultoría',
    'Desarrollo de Software',
    'Mantenimiento',
    'Licenciamiento',
    'Arrendamiento',
    'Suministros',
    'Capacitación',
    'Marketing',
    'Otros',
  ];

  // Estados de contratos
  const estados = [
    'activo',
    'pendiente',
    'vencido',
    'cancelado',
    'renovado',
    'suspendido',
  ];

  /**
   * Cargar todos los contratos
   */
  const cargarContratos = useCallback(async () => {
    if (!canView) {
      setError('No tienes permisos para ver contratos');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔄 Cargando contratos...');

      const contratosData = await ContratosService.getContratos();

      // Procesar datos de contratos
      const contratosProcesadas = contratosData.map(contrato => ({
        ...contrato,
        analisis: generarAnalisisContrato(contrato),
        estado_display: obtenerEstadoDisplay(contrato.estado),
        dias_vencimiento: calcularDiasVencimiento(contrato.fecha_fin),
        progreso: calcularProgresoContrato(
          contrato.fecha_inicio,
          contrato.fecha_fin
        ),
      }));

      setContratos(contratosProcesadas);
      console.log('✅ Contratos cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando contratos:', error);
      setError(`Error cargando contratos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [canView]);

  /**
   * Crear nuevo contrato
   */
  const crearContrato = useCallback(
    async contratoData => {
      if (!canCreate) {
        throw new Error('No tienes permisos para crear contratos');
      }

      try {
        setLoading(true);
        setError('');

        const nuevoContrato = await ContratosService.crearContrato({
          ...contratoData,
          fecha_creacion: new Date().toISOString(),
          usuario_creacion: user?.id,
          estado: contratoData.estado || 'activo',
        });

        setContratos(prev => [nuevoContrato, ...prev]);
        console.log('✅ Contrato creado exitosamente');
        return nuevoContrato;
      } catch (error) {
        console.error('❌ Error creando contrato:', error);
        setError(`Error creando contrato: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canCreate, user?.id]
  );

  /**
   * Actualizar contrato
   */
  const actualizarContrato = useCallback(
    async (id, contratoData) => {
      if (!canUpdate) {
        throw new Error('No tienes permisos para actualizar contratos');
      }

      try {
        setLoading(true);
        setError('');

        const contratoActualizado = await ContratosService.actualizarContrato(
          id,
          {
            ...contratoData,
            fecha_modificacion: new Date().toISOString(),
            usuario_modificacion: user?.id,
          }
        );

        setContratos(prev =>
          prev.map(contrato =>
            contrato.id === id ? contratoActualizado : contrato
          )
        );

        console.log('✅ Contrato actualizado exitosamente');
        return contratoActualizado;
      } catch (error) {
        console.error('❌ Error actualizando contrato:', error);
        setError(`Error actualizando contrato: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canUpdate, user?.id]
  );

  /**
   * Eliminar contrato
   */
  const eliminarContrato = useCallback(
    async id => {
      if (!canDelete) {
        throw new Error('No tienes permisos para eliminar contratos');
      }

      try {
        setLoading(true);
        setError('');

        await ContratosService.eliminarContrato(id);

        setContratos(prev => prev.filter(contrato => contrato.id !== id));
        console.log('✅ Contrato eliminado exitosamente');
      } catch (error) {
        console.error('❌ Error eliminando contrato:', error);
        setError(`Error eliminando contrato: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canDelete]
  );

  /**
   * Renovar contrato
   */
  const renovarContrato = useCallback(
    async (id, nuevaFechaFin) => {
      if (!canUpdate) {
        throw new Error('No tienes permisos para renovar contratos');
      }

      try {
        setLoading(true);
        setError('');

        const contratoActualizado = await ContratosService.actualizarContrato(
          id,
          {
            fecha_fin: nuevaFechaFin,
            estado: 'renovado',
            fecha_renovacion: new Date().toISOString(),
            usuario_renovacion: user?.id,
            fecha_modificacion: new Date().toISOString(),
            usuario_modificacion: user?.id,
          }
        );

        setContratos(prev =>
          prev.map(contrato =>
            contrato.id === id ? contratoActualizado : contrato
          )
        );

        console.log('✅ Contrato renovado exitosamente');
        return contratoActualizado;
      } catch (error) {
        console.error('❌ Error renovando contrato:', error);
        setError(`Error renovando contrato: ${error.message}`);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [canUpdate, user?.id]
  );

  /**
   * Generar análisis de contrato
   */
  const generarAnalisisContrato = contrato => {
    const monto = parseFloat(contrato.monto || 0);
    const diasVencimiento = calcularDiasVencimiento(contrato.fecha_fin);
    const progreso = calcularProgresoContrato(
      contrato.fecha_inicio,
      contrato.fecha_fin
    );

    return {
      prioridad: calcularPrioridad(contrato.estado, monto, diasVencimiento),
      riesgo:
        diasVencimiento < 30 ? 'alto' : diasVencimiento < 90 ? 'medio' : 'bajo',
      dias_vencimiento: diasVencimiento,
      progreso: progreso,
      requiere_renovacion:
        diasVencimiento <= 30 && contrato.estado === 'activo',
      rentabilidad:
        monto > 10000000 ? 'alta' : monto > 5000000 ? 'media' : 'baja',
    };
  };

  /**
   * Obtener estado display
   */
  const obtenerEstadoDisplay = estado => {
    const estados = {
      activo: { label: 'Activo', color: 'success' },
      pendiente: { label: 'Pendiente', color: 'warning' },
      vencido: { label: 'Vencido', color: 'destructive' },
      cancelado: { label: 'Cancelado', color: 'secondary' },
      renovado: { label: 'Renovado', color: 'outline' },
      suspendido: { label: 'Suspendido', color: 'destructive' },
    };
    return estados[estado] || { label: estado, color: 'default' };
  };

  /**
   * Calcular días hasta vencimiento
   */
  const calcularDiasVencimiento = fechaFin => {
    if (!fechaFin) return null;

    const hoy = new Date();
    const vencimiento = new Date(fechaFin);
    const diffTime = vencimiento - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  /**
   * Calcular progreso del contrato
   */
  const calcularProgresoContrato = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();

    const duracionTotal = fin - inicio;
    const tiempoTranscurrido = hoy - inicio;

    if (duracionTotal <= 0) return 100;

    const progreso = (tiempoTranscurrido / duracionTotal) * 100;
    return Math.min(Math.max(progreso, 0), 100);
  };

  /**
   * Calcular prioridad
   */
  const calcularPrioridad = (estado, monto, diasVencimiento) => {
    let puntuacion = 0;

    if (estado === 'vencido') puntuacion += 50;
    if (diasVencimiento < 0) puntuacion += 40;
    if (diasVencimiento <= 30) puntuacion += 30;
    if (monto > 10000000) puntuacion += 20;

    if (puntuacion >= 70) return 'alta';
    if (puntuacion >= 40) return 'media';
    return 'baja';
  };

  /**
   * Obtener contratos filtrados y ordenados
   */
  const contratosFiltrados = useCallback(() => {
    let filtradas = [...contratos];

    // Aplicar filtros
    if (filters.fecha_desde) {
      filtradas = filtradas.filter(
        c => new Date(c.fecha_inicio) >= new Date(filters.fecha_desde)
      );
    }
    if (filters.fecha_hasta) {
      filtradas = filtradas.filter(
        c => new Date(c.fecha_inicio) <= new Date(filters.fecha_hasta)
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
    if (filters.tipo_contrato) {
      filtradas = filtradas.filter(
        c => c.tipo_contrato === filters.tipo_contrato
      );
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

    // Aplicar búsqueda
    if (searchTerm) {
      const termino = searchTerm.toLowerCase();
      filtradas = filtradas.filter(
        c =>
          c.cliente?.toLowerCase().includes(termino) ||
          c.descripcion?.toLowerCase().includes(termino) ||
          c.tipo_contrato?.toLowerCase().includes(termino)
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
  }, [contratos, filters, searchTerm, sortConfig]);

  /**
   * Generar estadísticas
   */
  const generarStats = useCallback(() => {
    const totalContratos = contratos.length;
    const totalMonto = contratos.reduce(
      (sum, c) => sum + parseFloat(c.monto || 0),
      0
    );
    const contratosActivos = contratos.filter(
      c => c.estado === 'activo'
    ).length;
    const contratosVencidos = contratos.filter(
      c => c.estado === 'vencido'
    ).length;
    const contratosPendientes = contratos.filter(
      c => c.estado === 'pendiente'
    ).length;
    const montoPromedio = totalContratos > 0 ? totalMonto / totalContratos : 0;

    const contratosPorVencer = contratos.filter(
      c => c.analisis?.dias_vencimiento <= 30 && c.estado === 'activo'
    ).length;

    const distribucionEstados = {
      activo: contratosActivos,
      vencido: contratosVencidos,
      pendiente: contratosPendientes,
      cancelado: contratos.filter(c => c.estado === 'cancelado').length,
      renovado: contratos.filter(c => c.estado === 'renovado').length,
    };

    const distribucionTipos = contratos.reduce((acc, c) => {
      acc[c.tipo_contrato] = (acc[c.tipo_contrato] || 0) + 1;
      return acc;
    }, {});

    const distribucionMensual = contratos.reduce((acc, c) => {
      const mes = new Date(c.fecha_inicio).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
      });
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalContratos,
      totalMonto,
      contratosActivos,
      contratosVencidos,
      contratosPendientes,
      contratosPorVencer,
      montoPromedio,
      distribucionEstados,
      distribucionTipos,
      distribucionMensual,
    });
  }, [contratos]);

  // Cargar contratos al montar el componente
  useEffect(() => {
    cargarContratos();
  }, [cargarContratos]);

  // Generar estadísticas cuando cambien los contratos
  useEffect(() => {
    if (contratos.length > 0) {
      generarStats();
    }
  }, [contratos, generarStats]);

  return {
    // Estado
    contratos,
    loading,
    error,
    filters,
    sortConfig,
    searchTerm,
    selectedContrato,
    stats,

    // Permisos
    canView,
    canCreate,
    canUpdate,
    canDelete,

    // Datos estáticos
    tiposContrato,
    estados,

    // Acciones
    cargarContratos,
    crearContrato,
    actualizarContrato,
    eliminarContrato,
    renovarContrato,

    // Utilidades
    contratosFiltrados: contratosFiltrados(),
    setFilters,
    setSortConfig,
    setSearchTerm,
    setSelectedContrato,
    clearError: () => setError(''),
  };
};
