import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Target,
  Zap,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { formatCurrency, formatNumber } from '@/utils/helpers.js';
import useSupabaseAvanzado from '@/hooks/useSupabaseAvanzado.js';
import { getClientes } from '@/lib/supabase.js';
import ClientesChart from '@/components/charts/ClientesChart.jsx';

/**
 * AnalyticsPage - Sistema de Analytics Avanzado MTZ
 * Análisis profundo con métricas, gráficos y insights empresariales
 */
const AnalyticsPage = () => {
  const { dashboardData } = useSupabaseAvanzado();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('facturacion');

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

  // Períodos disponibles
  const periods = [
    { id: 'week', name: 'Última Semana', days: 7 },
    { id: 'month', name: 'Último Mes', days: 30 },
    { id: 'quarter', name: 'Último Trimestre', days: 90 },
    { id: 'year', name: 'Último Año', days: 365 },
  ];

  // Métricas disponibles
  const metrics = [
    {
      id: 'facturacion',
      name: 'Facturación',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      id: 'clientes',
      name: 'Clientes',
      icon: Activity,
      color: 'text-blue-600',
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: Target,
      color: 'text-purple-600',
    },
    {
      id: 'tendencias',
      name: 'Tendencias',
      icon: BarChart3,
      color: 'text-orange-600',
    },
  ];

  // Calcular métricas principales
  const calcularMetricas = () => {
    const facturacionTotal = clientes.reduce(
      (sum, c) => sum + parseFloat(c.total_facturado || 0),
      0
    );

    const clientesActivos = clientes.filter(c => c.estado === 'Activo');
    const clientesVIP = clientes.filter(c => c.categoria_cliente === 'VIP');
    const clientesPremium = clientes.filter(
      c => c.categoria_cliente === 'Premium'
    );

    return {
      facturacionTotal,
      clientesActivos: clientesActivos.length,
      clientesVIP: clientesVIP.length,
      clientesPremium: clientesPremium.length,
      promedioFacturacion: facturacionTotal / clientes.length,
      tasaActividad: (clientesActivos.length / clientes.length) * 100,
    };
  };

  const metricas = calcularMetricas();

  // Generar datos para gráficos
  const generarDatosGraficos = () => {
    // Distribución por categoría
    const distribucionCategoria = clientes.reduce((acc, cliente) => {
      const categoria = cliente.categoria_cliente || 'Regular';
      if (!acc[categoria]) acc[categoria] = { count: 0, facturacion: 0 };
      acc[categoria].count++;
      acc[categoria].facturacion += parseFloat(cliente.total_facturado || 0);
      return acc;
    }, {});

    // Distribución por rubro
    const distribucionRubro = clientes.reduce((acc, cliente) => {
      const rubro = cliente.rubro || 'Sin clasificar';
      if (!acc[rubro]) acc[rubro] = { count: 0, facturacion: 0 };
      acc[rubro].count++;
      acc[rubro].facturacion += parseFloat(cliente.total_facturado || 0);
      return acc;
    }, {});

    // Top clientes
    const topClientes = clientes
      .sort(
        (a, b) => parseFloat(b.total_facturado) - parseFloat(a.total_facturado)
      )
      .slice(0, 10);

    // Tendencias simuladas
    const tendencias = [
      {
        mes: 'Ene',
        facturacion: metricas.facturacionTotal * 0.8,
        clientes: Math.floor(clientes.length * 0.8),
      },
      {
        mes: 'Feb',
        facturacion: metricas.facturacionTotal * 0.85,
        clientes: Math.floor(clientes.length * 0.85),
      },
      {
        mes: 'Mar',
        facturacion: metricas.facturacionTotal * 0.9,
        clientes: Math.floor(clientes.length * 0.9),
      },
      {
        mes: 'Abr',
        facturacion: metricas.facturacionTotal * 0.95,
        clientes: Math.floor(clientes.length * 0.95),
      },
      {
        mes: 'May',
        facturacion: metricas.facturacionTotal * 0.98,
        clientes: Math.floor(clientes.length * 0.98),
      },
      {
        mes: 'Jun',
        facturacion: metricas.facturacionTotal,
        clientes: clientes.length,
      },
    ];

    return {
      distribucionCategoria,
      distribucionRubro,
      topClientes,
      tendencias,
    };
  };

  const datosGraficos = generarDatosGraficos();

  // Calcular cambios porcentuales
  const calcularCambios = () => {
    const tendencias = datosGraficos.tendencias;
    const ultimo = tendencias[tendencias.length - 1];
    const penultimo = tendencias[tendencias.length - 2];

    return {
      facturacion:
        ((ultimo.facturacion - penultimo.facturacion) / penultimo.facturacion) *
        100,
      clientes:
        ((ultimo.clientes - penultimo.clientes) / penultimo.clientes) * 100,
    };
  };

  const cambios = calcularCambios();

  // Componente para mostrar métrica con cambio
  const MetricCard = ({ title, value, change, icon: Icon, color }) => {
    const getChangeIcon = () => {
      if (change > 0)
        return <ArrowUpRight className='h-4 w-4 text-green-500' />;
      if (change < 0)
        return <ArrowDownRight className='h-4 w-4 text-red-500' />;
      return <Minus className='h-4 w-4 text-gray-500' />;
    };

    const getChangeColor = () => {
      if (change > 0) return 'text-green-600';
      if (change < 0) return 'text-red-600';
      return 'text-gray-600';
    };

    return (
      <Card className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-gray-600'>{title}</p>
            <p className='text-2xl font-bold text-gray-900'>
              {typeof value === 'number' && value > 1000
                ? formatCurrency(value)
                : value}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className='h-6 w-6 text-white' />
          </div>
        </div>
        <div className='mt-4 flex items-center'>
          {getChangeIcon()}
          <span className={`ml-1 text-sm font-medium ${getChangeColor()}`}>
            {change > 0 ? '+' : ''}
            {change.toFixed(1)}%
          </span>
          <span className='ml-2 text-sm text-gray-600'>vs mes anterior</span>
        </div>
      </Card>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
            <BarChart3 className='h-8 w-8 text-blue-600' />
            Analytics Avanzado
          </h1>
          <p className='text-gray-600'>
            Análisis profundo con métricas, gráficos e insights empresariales
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' size='sm'>
            <Calendar className='h-4 w-4 mr-2' />
            {periods.find(p => p.id === selectedPeriod)?.name}
          </Button>
          <Button onClick={() => window.location.reload()} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <MetricCard
          title='Facturación Total'
          value={metricas.facturacionTotal}
          change={cambios.facturacion}
          icon={TrendingUp}
          color='bg-green-500'
        />
        <MetricCard
          title='Clientes Activos'
          value={metricas.clientesActivos}
          change={cambios.clientes}
          icon={Activity}
          color='bg-blue-500'
        />
        <MetricCard
          title='Promedio por Cliente'
          value={metricas.promedioFacturacion}
          change={cambios.facturacion}
          icon={Target}
          color='bg-purple-500'
        />
        <MetricCard
          title='Tasa de Actividad'
          value={`${metricas.tasaActividad.toFixed(1)}%`}
          change={cambios.clientes}
          icon={Zap}
          color='bg-orange-500'
        />
      </div>

      {/* Gráficos y Análisis */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Gráfico de Clientes */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Distribución de Clientes
            </h3>
            <Badge variant='outline' size='sm'>
              {clientes.length} total
            </Badge>
          </div>
          <ClientesChart />
        </Card>

        {/* Top Clientes */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Top 10 Clientes
            </h3>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </Button>
          </div>
          <div className='space-y-3'>
            {datosGraficos.topClientes.slice(0, 10).map((cliente, index) => (
              <div
                key={cliente.id_cliente}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
              >
                <div className='flex items-center'>
                  <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3'>
                    <span className='text-sm font-bold text-blue-600'>
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>
                      {cliente.razon_social}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {cliente.categoria_cliente || 'Regular'}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {formatCurrency(cliente.total_facturado)}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {(
                      (cliente.total_facturado / metricas.facturacionTotal) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Análisis Detallado */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Distribución por Categoría */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Distribución por Categoría
          </h3>
          <div className='space-y-3'>
            {Object.entries(datosGraficos.distribucionCategoria).map(
              ([categoria, data]) => (
                <div
                  key={categoria}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center'>
                    <div className='w-3 h-3 rounded-full bg-blue-500 mr-2'></div>
                    <span className='text-sm text-gray-700'>{categoria}</span>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-900'>
                      {data.count} clientes
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatCurrency(data.facturacion)}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Distribución por Rubro */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Distribución por Rubro
          </h3>
          <div className='space-y-3'>
            {Object.entries(datosGraficos.distribucionRubro).map(
              ([rubro, data]) => (
                <div key={rubro} className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 rounded-full bg-green-500 mr-2'></div>
                    <span className='text-sm text-gray-700'>{rubro}</span>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-gray-900'>
                      {data.count} clientes
                    </p>
                    <p className='text-xs text-gray-500'>
                      {formatCurrency(data.facturacion)}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Insights */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Insights Clave
          </h3>
          <div className='space-y-4'>
            <div className='p-3 bg-green-50 rounded-lg'>
              <div className='flex items-center'>
                <ArrowUpRight className='h-4 w-4 text-green-600 mr-2' />
                <span className='text-sm font-medium text-green-800'>
                  Crecimiento positivo
                </span>
              </div>
              <p className='text-xs text-green-600 mt-1'>
                La facturación ha crecido un {cambios.facturacion.toFixed(1)}%
                este mes
              </p>
            </div>

            <div className='p-3 bg-blue-50 rounded-lg'>
              <div className='flex items-center'>
                <Activity className='h-4 w-4 text-blue-600 mr-2' />
                <span className='text-sm font-medium text-blue-800'>
                  Alta actividad
                </span>
              </div>
              <p className='text-xs text-blue-600 mt-1'>
                {metricas.tasaActividad.toFixed(1)}% de clientes están activos
              </p>
            </div>

            <div className='p-3 bg-purple-50 rounded-lg'>
              <div className='flex items-center'>
                <Target className='h-4 w-4 text-purple-600 mr-2' />
                <span className='text-sm font-medium text-purple-800'>
                  Concentración VIP
                </span>
              </div>
              <p className='text-xs text-purple-600 mt-1'>
                {metricas.clientesVIP} clientes VIP generan alto valor
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tendencias */}
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Tendencias de Facturación
          </h3>
          <div className='flex gap-2'>
            {periods.map(period => (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedPeriod(period.id)}
              >
                {period.name}
              </Button>
            ))}
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Período
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Facturación
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Clientes
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Promedio
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {datosGraficos.tendencias.map((item, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {item.mes}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(item.facturacion)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {item.clientes}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(item.facturacion / item.clientes)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
