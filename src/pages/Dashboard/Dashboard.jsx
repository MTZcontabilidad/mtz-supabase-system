import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  Upload,
  Download,
  BarChart3,
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  Star,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';
import ClientesChart from '@/components/charts/ClientesChart';
import CargaMasiva from '@/components/clientes/CargaMasiva';
import ExportData from '@/components/shared/ExportData';
import useAuth from '@/hooks/useAuth';
import useSupabaseAvanzado from '@/hooks/useSupabaseAvanzado';

/**
 * Dashboard Optimizado MTZ
 * Dashboard con análisis ejecutivos avanzados y métricas en tiempo real
 * Integrado con consultas optimizadas de Supabase
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { loading, error, dashboardData, refetch } = useSupabaseAvanzado();

  const [showCargaMasiva, setShowCargaMasiva] = useState(false);
  const [showExportData, setShowExportData] = useState(false);

  // Datos optimizados directos (sin Promise.all ni setInterval)
  const metricasTiempoReal = dashboardData;
  const rankingClientes = { top_clientes: dashboardData?.top_clientes || [] };
  const proyecciones = {
    proyecciones_2025: dashboardData?.proyecciones_2025 || {},
    oportunidades_detectadas: dashboardData?.oportunidades_detectadas || [],
  };
  const ultimaActualizacion = new Date(dashboardData?.timestamp || Date.now());

  // Función para formatear moneda
  const formatCurrency = amount => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Función para formatear números
  const formatNumber = num => {
    return new Intl.NumberFormat('es-CL').format(num || 0);
  };

  // Generar datos para gráficos
  const generateChartData = () => {
    if (!rankingClientes?.top_clientes)
      return { clientesPorCategoria: [], topClientes: [] };

    // Distribución por categoría
    const categorias = {};
    rankingClientes.top_clientes.forEach(cliente => {
      const categoria = cliente.categoria || 'Sin Categoría';
      if (!categorias[categoria]) {
        categorias[categoria] = { count: 0, facturacion: 0 };
      }
      categorias[categoria].count++;
      categorias[categoria].facturacion += cliente.total_facturado;
    });

    const clientesPorCategoria = Object.entries(categorias).map(
      ([categoria, data]) => ({
        name: categoria,
        clientes: data.count,
        facturacion: data.facturacion,
        color:
          categoria === 'VIP'
            ? '#8B5CF6'
            : categoria === 'Premium'
              ? '#3B82F6'
              : categoria === 'Top'
                ? '#10B981'
                : categoria === 'Regular'
                  ? '#F59E0B'
                  : '#6B7280',
      })
    );

    // Top clientes para gráfico
    const topClientes = rankingClientes.top_clientes
      .slice(0, 5)
      .map(cliente => ({
        name:
          cliente.razon_social.length > 20
            ? cliente.razon_social.substring(0, 20) + '...'
            : cliente.razon_social,
        facturacion: cliente.total_facturado,
        participacion: cliente.participacion_pct,
      }));

    return { clientesPorCategoria, topClientes };
  };

  const chartData = generateChartData();

  // Obtener alertas importantes
  const getAlertas = () => {
    if (!rankingClientes?.top_clientes) return [];

    const alertas = [];

    rankingClientes.top_clientes.forEach(cliente => {
      if (cliente.prioridad === 'CRÍTICA') {
        alertas.push({
          tipo: 'critica',
          titulo: 'Cliente Estratégico',
          mensaje: `${cliente.razon_social} requiere atención inmediata`,
          valor: formatCurrency(cliente.total_facturado),
          icon: AlertTriangle,
          color: 'text-red-600',
        });
      } else if (cliente.prioridad === 'ALTA') {
        alertas.push({
          tipo: 'alta',
          titulo: 'Seguimiento VIP',
          mensaje: `${cliente.razon_social} requiere seguimiento especializado`,
          valor: formatCurrency(cliente.total_facturado),
          icon: Star,
          color: 'text-yellow-600',
        });
      }
    });

    return alertas.slice(0, 3); // Mostrar máximo 3 alertas
  };

  const alertas = getAlertas();

  if (loading && !metricasTiempoReal) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
        <span className='ml-3 text-lg'>Cargando análisis ejecutivo...</span>
      </div>
    );
  }

  if (error && !metricasTiempoReal) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            Error al cargar dashboard
          </h2>
          <p className='text-gray-600 mb-4'>{error}</p>
          <Button onClick={refetch}>
            <RefreshCw className='h-4 w-4 mr-2' />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header con información en tiempo real */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <Zap className='h-8 w-8 text-blue-600' />
            Dashboard Ejecutivo MTZ
          </h1>
          <p className='text-gray-600 flex items-center gap-2 mt-1'>
            <span>
              Bienvenido, {user?.user_metadata?.full_name || user?.email}
            </span>
            <Badge variant='outline' className='ml-2'>
              {metricasTiempoReal?.sistema_status?.estado || 'Cargando...'}
            </Badge>
          </p>
          <p className='text-sm text-gray-500 mt-1'>
            Última actualización:{' '}
            {ultimaActualizacion.toLocaleTimeString('es-CL')} | Latencia:{' '}
            {metricasTiempoReal?.sistema_status?.latencia_promedio || 'N/A'}
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button onClick={refetch} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
          <Button onClick={() => setShowCargaMasiva(true)}>
            <Upload className='h-4 w-4 mr-2' />
            Carga Masiva
          </Button>
          <Button variant='outline' onClick={() => setShowExportData(true)}>
            <Download className='h-4 w-4 mr-2' />
            Exportar
          </Button>
        </div>
      </div>

      {/* Alertas importantes */}
      {alertas.length > 0 && (
        <Card className='p-4 border-orange-200 bg-orange-50'>
          <h3 className='text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2'>
            <AlertTriangle className='h-5 w-5' />
            Alertas Importantes
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {alertas.map((alerta, index) => (
              <div
                key={index}
                className='flex items-start gap-3 p-3 bg-white rounded-lg border'
              >
                <alerta.icon className={`h-5 w-5 mt-0.5 ${alerta.color}`} />
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-gray-900'>{alerta.titulo}</p>
                  <p className='text-sm text-gray-600'>{alerta.mensaje}</p>
                  <p className='text-sm font-semibold text-blue-600'>
                    {alerta.valor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Métricas principales en tiempo real */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card className='p-6 border-l-4 border-l-blue-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Clientes Activos
              </p>
              <p className='text-3xl font-bold text-gray-900'>
                {formatNumber(
                  metricasTiempoReal?.kpis_principales?.clientes_activos || 0
                )}
              </p>
              <p className='text-sm text-blue-600 flex items-center gap-1'>
                <Activity className='h-4 w-4' />
                En tiempo real
              </p>
            </div>
            <div className='p-3 bg-blue-100 rounded-full'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6 border-l-4 border-l-green-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Facturación Total
              </p>
              <p className='text-3xl font-bold text-gray-900'>
                {formatCurrency(
                  metricasTiempoReal?.kpis_principales?.facturacion_total || 0
                )}
              </p>
              <p className='text-sm text-green-600'>Portfolio completo</p>
            </div>
            <div className='p-3 bg-green-100 rounded-full'>
              <DollarSign className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6 border-l-4 border-l-yellow-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Ticket Promedio
              </p>
              <p className='text-3xl font-bold text-gray-900'>
                {formatCurrency(
                  metricasTiempoReal?.kpis_principales?.ticket_promedio || 0
                )}
              </p>
              <p className='text-sm text-yellow-600'>Por cliente</p>
            </div>
            <div className='p-3 bg-yellow-100 rounded-full'>
              <FileText className='h-6 w-6 text-yellow-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6 border-l-4 border-l-purple-500'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Score General</p>
              <p className='text-3xl font-bold text-gray-900'>
                {metricasTiempoReal?.salud_cartera?.score_general || 0}/10
              </p>
              <p className='text-sm text-purple-600'>
                {metricasTiempoReal?.salud_cartera?.nivel_diversificacion ||
                  'N/A'}
              </p>
            </div>
            <div className='p-3 bg-purple-100 rounded-full'>
              <Target className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </Card>
      </div>

      {/* Proyecciones 2025 */}
      {proyecciones?.proyecciones_2025 && (
        <Card className='p-6'>
          <h3 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <TrendingUp className='h-6 w-6 text-green-600' />
            Proyecciones Estratégicas 2025
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm text-gray-600'>Facturación Actual</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(
                  proyecciones.proyecciones_2025.facturacion_actual
                )}
              </p>
            </div>
            <div className='text-center p-4 bg-blue-50 rounded-lg'>
              <p className='text-sm text-blue-600'>Proyección Agosto</p>
              <p className='text-2xl font-bold text-blue-700'>
                {formatCurrency(
                  proyecciones.proyecciones_2025.proyeccion_agosto
                )}
              </p>
            </div>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <p className='text-sm text-green-600'>Proyección Q4</p>
              <p className='text-2xl font-bold text-green-700'>
                {formatCurrency(proyecciones.proyecciones_2025.proyeccion_q4)}
              </p>
            </div>
            <div className='text-center p-4 bg-yellow-50 rounded-lg'>
              <p className='text-sm text-yellow-600'>Meta Anual</p>
              <p className='text-2xl font-bold text-yellow-700'>
                {formatCurrency(proyecciones.proyecciones_2025.meta_anual_2025)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Gráficos */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Top Clientes */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Top 5 Clientes
          </h3>
          <ClientesChart
            data={chartData.topClientes}
            type='bar'
            xKey='name'
            yKey='facturacion'
            height={300}
          />
        </Card>

        {/* Distribución por Categoría */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Distribución por Categoría
          </h3>
          <ClientesChart
            data={chartData.clientesPorCategoria}
            type='pie'
            yKey='clientes'
            height={300}
          />
        </Card>
      </div>

      {/* Ranking de clientes */}
      {rankingClientes?.top_clientes && (
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Ranking de Clientes
          </h3>
          <div className='space-y-4'>
            {rankingClientes.top_clientes.slice(0, 8).map(cliente => (
              <div
                key={cliente.id_cliente}
                className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-lg font-bold text-blue-600'>
                      #{cliente.posicion}
                    </span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      {cliente.razon_social}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {cliente.categoria && (
                        <Badge
                          variant={
                            cliente.categoria === 'VIP'
                              ? 'default'
                              : cliente.categoria === 'Premium'
                                ? 'secondary'
                                : cliente.categoria === 'Top'
                                  ? 'success'
                                  : 'outline'
                          }
                          className='mr-2'
                        >
                          {cliente.categoria}
                        </Badge>
                      )}
                      {cliente.participacion_pct}% del total
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold text-gray-900'>
                    {formatCurrency(cliente.total_facturado)}
                  </p>
                  <Badge
                    variant={
                      cliente.prioridad === 'CRÍTICA'
                        ? 'destructive'
                        : cliente.prioridad === 'ALTA'
                          ? 'warning'
                          : cliente.prioridad === 'MEDIA'
                            ? 'secondary'
                            : 'outline'
                    }
                  >
                    {cliente.prioridad}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Oportunidades identificadas */}
      {proyecciones?.oportunidades_detectadas && (
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
            <Target className='h-5 w-5 text-green-600' />
            Oportunidades Identificadas
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {proyecciones.oportunidades_detectadas.map((oportunidad, index) => (
              <div
                key={index}
                className='p-4 bg-green-50 rounded-lg border border-green-200'
              >
                <h4 className='font-semibold text-green-800'>
                  {oportunidad.tipo}
                </h4>
                <p className='text-2xl font-bold text-green-700 my-2'>
                  {formatCurrency(oportunidad.valor_estimado)}
                </p>
                <p className='text-sm text-green-600'>
                  Probabilidad: {oportunidad.probabilidad}
                </p>
                {oportunidad.clientes_objetivo && (
                  <p className='text-sm text-gray-600'>
                    {oportunidad.clientes_objetivo} clientes objetivo
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Componentes modales */}
      <CargaMasiva
        open={showCargaMasiva}
        onOpenChange={setShowCargaMasiva}
        onImport={() => {}} // Implementar según necesidades
        loading={loading}
      />

      <ExportData
        open={showExportData}
        onOpenChange={setShowExportData}
        data={rankingClientes?.top_clientes || []}
        columns={[
          { key: 'posicion', label: 'Posición', format: 'number' },
          { key: 'razon_social', label: 'Razón Social', format: 'text' },
          {
            key: 'total_facturado',
            label: 'Total Facturado',
            format: 'currency',
          },
          {
            key: 'participacion_pct',
            label: 'Participación %',
            format: 'number',
          },
          { key: 'categoria', label: 'Categoría', format: 'text' },
          { key: 'prioridad', label: 'Prioridad', format: 'text' },
        ]}
        filename='ranking-clientes-mtz'
      />
    </div>
  );
};

export default Dashboard;