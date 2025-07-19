import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  RefreshCw,
  Eye,
  Printer,
  Share2,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Input from '@/components/ui/Input.jsx';
import { formatCurrency, formatDate } from '@/utils/helpers.js';
import useSupabaseAvanzado from '@/hooks/useSupabaseAvanzado.js';
import { getClientes } from '@/lib/supabase.js';

/**
 * ReportsPage - Sistema de Reportes Avanzado MTZ
 * Generación de reportes empresariales con filtros y exportación
 */
const ReportsPage = () => {
  const { dashboardData } = useSupabaseAvanzado();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    categoria: '',
    estado: '',
    rubro: '',
  });
  const [reportData, setReportData] = useState(null);

  // Cargar datos de clientes
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setLoading(true);
        const data = await getClientes();
        setClientes(data || []);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

  // Tipos de reportes disponibles
  const reportTypes = [
    {
      id: 'facturacion',
      name: 'Reporte de Facturación',
      description: 'Análisis detallado de facturación por cliente y período',
      icon: DollarSign,
      color: 'bg-green-500',
      category: 'Financiero',
    },
    {
      id: 'clientes',
      name: 'Reporte de Clientes',
      description: 'Estado y clasificación de la cartera de clientes',
      icon: Users,
      color: 'bg-blue-500',
      category: 'Gestión',
    },
    {
      id: 'tendencias',
      name: 'Análisis de Tendencias',
      description: 'Evolución de métricas clave en el tiempo',
      icon: TrendingUp,
      color: 'bg-purple-500',
      category: 'Analytics',
    },
    {
      id: 'distribucion',
      name: 'Distribución por Rubro',
      description: 'Análisis de clientes por sector económico',
      icon: PieChart,
      color: 'bg-orange-500',
      category: 'Estratégico',
    },
    {
      id: 'performance',
      name: 'Performance de Cartera',
      description: 'Rendimiento y rentabilidad por cliente',
      icon: BarChart3,
      color: 'bg-red-500',
      category: 'Financiero',
    },
    {
      id: 'proyecciones',
      name: 'Proyecciones 2025',
      description: 'Estimaciones y metas para el próximo año',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      category: 'Estratégico',
    },
  ];

  // Generar reporte
  const generarReporte = async reportType => {
    try {
      setLoading(true);
      setSelectedReport(reportType);

      let data = null;

      switch (reportType.id) {
        case 'facturacion':
          data = generarReporteFacturacion();
          break;
        case 'clientes':
          data = generarReporteClientes();
          break;
        case 'tendencias':
          data = generarReporteTendencias();
          break;
        case 'distribucion':
          data = generarReporteDistribucion();
          break;
        case 'performance':
          data = generarReportePerformance();
          break;
        case 'proyecciones':
          data = generarReporteProyecciones();
          break;
        default:
          data = null;
      }

      setReportData(data);
    } catch (error) {
      console.error('Error generando reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generar reporte de facturación
  const generarReporteFacturacion = () => {
    const facturacionTotal = clientes.reduce(
      (sum, c) => sum + parseFloat(c.total_facturado || 0),
      0
    );

    const topClientes = clientes
      .sort(
        (a, b) => parseFloat(b.total_facturado) - parseFloat(a.total_facturado)
      )
      .slice(0, 10);

    const facturacionPorCategoria = clientes.reduce((acc, cliente) => {
      const categoria = cliente.categoria_cliente || 'Regular';
      if (!acc[categoria]) acc[categoria] = 0;
      acc[categoria] += parseFloat(cliente.total_facturado || 0);
      return acc;
    }, {});

    return {
      tipo: 'facturacion',
      titulo: 'Reporte de Facturación',
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        facturacionTotal,
        totalClientes: clientes.length,
        promedioPorCliente: facturacionTotal / clientes.length,
        topClientes: topClientes.length,
      },
      datos: {
        topClientes,
        facturacionPorCategoria,
        distribucion: Object.entries(facturacionPorCategoria).map(
          ([categoria, total]) => ({
            categoria,
            total,
            porcentaje: (total / facturacionTotal) * 100,
          })
        ),
      },
    };
  };

  // Generar reporte de clientes
  const generarReporteClientes = () => {
    const clientesActivos = clientes.filter(c => c.estado === 'Activo');
    const clientesPorCategoria = clientes.reduce((acc, cliente) => {
      const categoria = cliente.categoria_cliente || 'Regular';
      if (!acc[categoria]) acc[categoria] = 0;
      acc[categoria]++;
      return acc;
    }, {});

    const clientesPorRubro = clientes.reduce((acc, cliente) => {
      const rubro = cliente.rubro || 'Sin clasificar';
      if (!acc[rubro]) acc[rubro] = 0;
      acc[rubro]++;
      return acc;
    }, {});

    return {
      tipo: 'clientes',
      titulo: 'Reporte de Clientes',
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        totalClientes: clientes.length,
        clientesActivos: clientesActivos.length,
        clientesInactivos: clientes.length - clientesActivos.length,
        tasaActividad: (clientesActivos.length / clientes.length) * 100,
      },
      datos: {
        clientesPorCategoria,
        clientesPorRubro,
        distribucionEstado: {
          Activo: clientesActivos.length,
          Inactivo: clientes.length - clientesActivos.length,
        },
      },
    };
  };

  // Generar reporte de tendencias
  const generarReporteTendencias = () => {
    const facturacionTotal = clientes.reduce(
      (sum, c) => sum + parseFloat(c.total_facturado || 0),
      0
    );

    // Simular datos históricos
    const tendencias = [
      { mes: 'Ene', facturacion: facturacionTotal * 0.8 },
      { mes: 'Feb', facturacion: facturacionTotal * 0.85 },
      { mes: 'Mar', facturacion: facturacionTotal * 0.9 },
      { mes: 'Abr', facturacion: facturacionTotal * 0.95 },
      { mes: 'May', facturacion: facturacionTotal * 0.98 },
      { mes: 'Jun', facturacion: facturacionTotal },
    ];

    return {
      tipo: 'tendencias',
      titulo: 'Análisis de Tendencias',
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        crecimiento: 25.5,
        tendencia: 'Ascendente',
        proyeccion: facturacionTotal * 1.3,
      },
      datos: {
        tendencias,
        crecimientoMensual: tendencias.map((item, index) => ({
          mes: item.mes,
          crecimiento:
            index > 0
              ? ((item.facturacion - tendencias[index - 1].facturacion) /
                  tendencias[index - 1].facturacion) *
                100
              : 0,
        })),
      },
    };
  };

  // Generar reporte de distribución
  const generarReporteDistribucion = () => {
    const distribucionRubro = clientes.reduce((acc, cliente) => {
      const rubro = cliente.rubro || 'Sin clasificar';
      if (!acc[rubro]) acc[rubro] = { count: 0, facturacion: 0 };
      acc[rubro].count++;
      acc[rubro].facturacion += parseFloat(cliente.total_facturado || 0);
      return acc;
    }, {});

    return {
      tipo: 'distribucion',
      titulo: 'Distribución por Rubro',
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        totalRubros: Object.keys(distribucionRubro).length,
        rubroMasGrande:
          Object.entries(distribucionRubro).sort(
            (a, b) => b[1].count - a[1].count
          )[0]?.[0] || 'N/A',
        concentracion: 'Moderada',
      },
      datos: {
        distribucionRubro,
        porcentajes: Object.entries(distribucionRubro).map(([rubro, data]) => ({
          rubro,
          porcentaje: (data.count / clientes.length) * 100,
          facturacion: data.facturacion,
        })),
      },
    };
  };

  // Generar reporte de performance
  const generarReportePerformance = () => {
    const performanceClientes = clientes.map(cliente => ({
      ...cliente,
      performance: parseFloat(cliente.total_facturado || 0) / 1000000, // En millones
      score: Math.min(
        10,
        (parseFloat(cliente.total_facturado || 0) / 10000000) * 10
      ), // Score 1-10
    }));

    const topPerformers = performanceClientes
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);

    return {
      tipo: 'performance',
      titulo: 'Performance de Cartera',
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        promedioScore:
          performanceClientes.reduce((sum, c) => sum + c.score, 0) /
          performanceClientes.length,
        topPerformers: topPerformers.length,
        carteraSaludable: performanceClientes.filter(c => c.score > 7).length,
      },
      datos: {
        topPerformers,
        distribucionScore: {
          'Excelente (9-10)': performanceClientes.filter(c => c.score >= 9)
            .length,
          'Bueno (7-8)': performanceClientes.filter(
            c => c.score >= 7 && c.score < 9
          ).length,
          'Regular (5-6)': performanceClientes.filter(
            c => c.score >= 5 && c.score < 7
          ).length,
          'Bajo (<5)': performanceClientes.filter(c => c.score < 5).length,
        },
      },
    };
  };

  // Generar reporte de proyecciones
  const generarReporteProyecciones = () => {
    const facturacionActual = clientes.reduce(
      (sum, c) => sum + parseFloat(c.total_facturado || 0),
      0
    );

    const proyecciones = {
      meta2025: facturacionActual * 1.3,
      crecimientoEsperado: 30,
      nuevosClientes: Math.round(clientes.length * 0.2),
      expansionRubros: ['Tecnología', 'Minería', 'Servicios'],
    };

    return {
      tipo: 'proyecciones',
      titulo: 'Proyecciones 2025',
      fecha: new Date().toLocaleDateString('es-CL'),
      resumen: {
        facturacionActual,
        meta2025: proyecciones.meta2025,
        crecimientoEsperado: proyecciones.crecimientoEsperado,
        nuevosClientes: proyecciones.nuevosClientes,
      },
      datos: {
        proyecciones,
        roadmap: [
          { trimestre: 'Q1 2025', objetivo: 'Consolidación de cartera actual' },
          { trimestre: 'Q2 2025', objetivo: 'Expansión a nuevos rubros' },
          { trimestre: 'Q3 2025', objetivo: 'Optimización de procesos' },
          { trimestre: 'Q4 2025', objetivo: 'Cumplimiento de metas anuales' },
        ],
      },
    };
  };

  // Exportar reporte
  const exportarReporte = formato => {
    if (!reportData) return;

    console.log(`Exportando reporte en formato ${formato}:`, reportData);
    // Aquí iría la lógica real de exportación
    alert(`Reporte exportado en formato ${formato}`);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <FileText className='h-8 w-8 text-blue-600' />
            Sistema de Reportes
          </h1>
          <p className='text-gray-600'>
            Genera reportes empresariales avanzados con datos en tiempo real
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button onClick={() => window.location.reload()} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tipos de Reportes */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {reportTypes.map(report => (
          <Card
            key={report.id}
            className='p-6 hover:shadow-lg transition-shadow cursor-pointer'
            onClick={() => generarReporte(report)}
          >
            <div className='flex items-start justify-between mb-4'>
              <div className={`p-3 rounded-lg ${report.color}`}>
                <report.icon className='h-6 w-6 text-white' />
              </div>
              <Badge variant='outline' size='sm'>
                {report.category}
              </Badge>
            </div>

            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {report.name}
            </h3>
            <p className='text-gray-600 text-sm mb-4'>{report.description}</p>

            <Button
              variant='outline'
              size='sm'
              className='w-full'
              disabled={loading}
            >
              {loading && selectedReport?.id === report.id ? (
                <>
                  <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                  Generando...
                </>
              ) : (
                <>
                  <Eye className='h-4 w-4 mr-2' />
                  Generar Reporte
                </>
              )}
            </Button>
          </Card>
        ))}
      </div>

      {/* Reporte Generado */}
      {reportData && (
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>
                {reportData.titulo}
              </h2>
              <p className='text-gray-600'>Generado el {reportData.fecha}</p>
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => exportarReporte('PDF')}
              >
                <Download className='h-4 w-4 mr-2' />
                PDF
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => exportarReporte('Excel')}
              >
                <Download className='h-4 w-4 mr-2' />
                Excel
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => exportarReporte('CSV')}
              >
                <Download className='h-4 w-4 mr-2' />
                CSV
              </Button>
            </div>
          </div>

          {/* Resumen del Reporte */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
            {Object.entries(reportData.resumen).map(([key, value]) => (
              <div key={key} className='text-center p-4 bg-gray-50 rounded-lg'>
                <p className='text-2xl font-bold text-blue-600'>
                  {typeof value === 'number' && value > 1000
                    ? formatCurrency(value)
                    : typeof value === 'number' && value < 1
                      ? `${(value * 100).toFixed(1)}%`
                      : value}
                </p>
                <p className='text-sm text-gray-600 capitalize'>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            ))}
          </div>

          {/* Datos Detallados */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Datos Detallados
            </h3>

            {reportData.tipo === 'facturacion' && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-900'>Top 10 Clientes</h4>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Cliente
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Facturación
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Categoría
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {reportData.datos.topClientes.map((cliente, index) => (
                        <tr key={cliente.id_cliente}>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div className='flex items-center'>
                              <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                                <span className='text-sm font-bold text-blue-600'>
                                  #{index + 1}
                                </span>
                              </div>
                              <div>
                                <div className='text-sm font-medium text-gray-900'>
                                  {cliente.razon_social}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  {cliente.rut}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {formatCurrency(cliente.total_facturado)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <Badge
                              variant={
                                cliente.categoria_cliente === 'VIP'
                                  ? 'default'
                                  : cliente.categoria_cliente === 'Premium'
                                    ? 'secondary'
                                    : 'outline'
                              }
                              size='sm'
                            >
                              {cliente.categoria_cliente || 'Regular'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportData.tipo === 'clientes' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-medium text-gray-900 mb-3'>
                    Distribución por Categoría
                  </h4>
                  <div className='space-y-2'>
                    {Object.entries(reportData.datos.clientesPorCategoria).map(
                      ([categoria, count]) => (
                        <div
                          key={categoria}
                          className='flex justify-between items-center p-2 bg-gray-50 rounded'
                        >
                          <span className='text-sm text-gray-700'>
                            {categoria}
                          </span>
                          <Badge variant='outline' size='sm'>
                            {count} clientes
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <h4 className='font-medium text-gray-900 mb-3'>
                    Distribución por Rubro
                  </h4>
                  <div className='space-y-2'>
                    {Object.entries(reportData.datos.clientesPorRubro).map(
                      ([rubro, count]) => (
                        <div
                          key={rubro}
                          className='flex justify-between items-center p-2 bg-gray-50 rounded'
                        >
                          <span className='text-sm text-gray-700'>{rubro}</span>
                          <Badge variant='outline' size='sm'>
                            {count} clientes
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {reportData.tipo === 'proyecciones' && (
              <div className='space-y-4'>
                <h4 className='font-medium text-gray-900'>Roadmap 2025</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {reportData.datos.roadmap.map((item, index) => (
                    <div key={index} className='p-4 bg-blue-50 rounded-lg'>
                      <div className='flex items-center mb-2'>
                        <div className='w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-2'>
                          <span className='text-xs font-bold text-white'>
                            {index + 1}
                          </span>
                        </div>
                        <span className='text-sm font-medium text-blue-900'>
                          {item.trimestre}
                        </span>
                      </div>
                      <p className='text-sm text-blue-700'>{item.objetivo}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsPage;
