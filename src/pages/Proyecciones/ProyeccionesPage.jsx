import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  DollarSign,
  Users,
  Zap,
  RefreshCw,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
} from 'lucide-react';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { formatCurrency, formatNumber } from '@/utils/helpers.js';
import useSupabaseAvanzado from '@/hooks/useSupabaseAvanzado.js';
import { getClientes } from '@/lib/supabase.js';

/**
 * ProyeccionesPage - Sistema de Proyecciones y Forecasting MTZ
 * Planificación estratégica, metas y proyecciones empresariales
 */
const ProyeccionesPage = () => {
  const { dashboardData } = useSupabaseAvanzado();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedScenario, setSelectedScenario] = useState('optimista');

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

  // Años disponibles
  const years = [2024, 2025, 2026, 2027];

  // Escenarios disponibles
  const scenarios = [
    {
      id: 'conservador',
      name: 'Conservador',
      growth: 0.15,
      color: 'bg-yellow-500',
    },
    { id: 'realista', name: 'Realista', growth: 0.25, color: 'bg-blue-500' },
    { id: 'optimista', name: 'Optimista', growth: 0.35, color: 'bg-green-500' },
    { id: 'agresivo', name: 'Agresivo', growth: 0.5, color: 'bg-purple-500' },
  ];

  // Calcular datos actuales
  const calcularDatosActuales = () => {
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

  const datosActuales = calcularDatosActuales();

  // Generar proyecciones
  const generarProyecciones = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario);
    const baseGrowth = scenario.growth;

    const proyecciones = years.map(year => {
      const yearsFromNow = year - 2024;
      const growthMultiplier = Math.pow(1 + baseGrowth, yearsFromNow);

      return {
        year,
        facturacion: datosActuales.facturacionTotal * growthMultiplier,
        clientes: Math.round(datosActuales.clientesActivos * growthMultiplier),
        promedioPorCliente:
          (datosActuales.facturacionTotal * growthMultiplier) /
          Math.round(datosActuales.clientesActivos * growthMultiplier),
        nuevosClientes: Math.round(
          datosActuales.clientesActivos * growthMultiplier * 0.2
        ),
        crecimiento: (growthMultiplier - 1) * 100,
      };
    });

    return proyecciones;
  };

  const proyecciones = generarProyecciones();

  // Calcular metas y KPIs
  const calcularMetas = () => {
    const proyeccion2025 = proyecciones.find(p => p.year === 2025);

    return {
      metaFacturacion: proyeccion2025.facturacion,
      metaClientes: proyeccion2025.clientes,
      metaNuevosClientes: proyeccion2025.nuevosClientes,
      metaCrecimiento: proyeccion2025.crecimiento,
      progresoActual:
        (datosActuales.facturacionTotal / proyeccion2025.facturacion) * 100,
    };
  };

  const metas = calcularMetas();

  // Generar roadmap estratégico
  const generarRoadmap = () => {
    return [
      {
        quarter: 'Q1 2025',
        title: 'Consolidación de Cartera',
        description:
          'Optimizar relaciones con clientes existentes y mejorar retención',
        objetivos: [
          'Aumentar tasa de retención al 95%',
          'Implementar programa de fidelización VIP',
          'Optimizar procesos de facturación',
        ],
        status: 'En progreso',
        progress: 75,
      },
      {
        quarter: 'Q2 2025',
        title: 'Expansión de Mercado',
        description: 'Penetrar nuevos sectores y geografías',
        objetivos: [
          'Entrar en 3 nuevos rubros',
          'Abrir oficina en región norte',
          'Desarrollar 50 nuevos prospectos',
        ],
        status: 'Planificado',
        progress: 0,
      },
      {
        quarter: 'Q3 2025',
        title: 'Innovación y Tecnología',
        description: 'Implementar soluciones tecnológicas avanzadas',
        objetivos: [
          'Lanzar plataforma digital',
          'Automatizar procesos críticos',
          'Implementar analytics avanzado',
        ],
        status: 'Planificado',
        progress: 0,
      },
      {
        quarter: 'Q4 2025',
        title: 'Cumplimiento de Metas',
        description: 'Asegurar el cumplimiento de objetivos anuales',
        objetivos: [
          'Alcanzar meta de facturación',
          'Cumplir objetivos de crecimiento',
          'Preparar planificación 2026',
        ],
        status: 'Planificado',
        progress: 0,
      },
    ];
  };

  const roadmap = generarRoadmap();

  // Componente para mostrar métrica de proyección
  const ProyeccionCard = ({ year, data, isCurrent = false }) => {
    const getStatusColor = () => {
      if (isCurrent) return 'border-blue-500 bg-blue-50';
      if (year < 2025) return 'border-gray-300 bg-gray-50';
      return 'border-green-300 bg-green-50';
    };

    return (
      <Card className={`p-6 border-2 ${getStatusColor()}`}>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>{year}</h3>
          {isCurrent && (
            <Badge variant='default' size='sm'>
              Actual
            </Badge>
          )}
        </div>

        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-600'>Facturación</span>
            <span className='text-sm font-semibold text-gray-900'>
              {formatCurrency(data.facturacion)}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-600'>Clientes</span>
            <span className='text-sm font-semibold text-gray-900'>
              {data.clientes}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-600'>Crecimiento</span>
            <span className='text-sm font-semibold text-green-600'>
              +{data.crecimiento.toFixed(1)}%
            </span>
          </div>
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
            <TrendingUp className='h-8 w-8 text-blue-600' />
            Proyecciones y Forecasting
          </h1>
          <p className='text-gray-600'>
            Planificación estratégica, metas y proyecciones empresariales
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' size='sm'>
            <Calendar className='h-4 w-4 mr-2' />
            {selectedYear}
          </Button>
          <Button onClick={() => window.location.reload()} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Selector de Escenario */}
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Escenario de Proyección
          </h3>
          <Badge variant='outline' size='sm'>
            {scenarios.find(s => s.id === selectedScenario)?.name}
          </Badge>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {scenarios.map(scenario => (
            <Button
              key={scenario.id}
              variant={selectedScenario === scenario.id ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedScenario(scenario.id)}
              className='justify-start'
            >
              <div
                className={`w-3 h-3 rounded-full ${scenario.color} mr-2`}
              ></div>
              {scenario.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Proyecciones por Año */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {proyecciones.map(proyeccion => (
          <ProyeccionCard
            key={proyeccion.year}
            year={proyeccion.year}
            data={proyeccion}
            isCurrent={proyeccion.year === 2024}
          />
        ))}
      </div>

      {/* Metas 2025 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>Metas 2025</h3>
            <Badge variant='outline' size='sm'>
              {metas.progresoActual.toFixed(1)}% completado
            </Badge>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between p-3 bg-blue-50 rounded-lg'>
              <div className='flex items-center'>
                <DollarSign className='h-5 w-5 text-blue-600 mr-2' />
                <span className='text-sm font-medium text-blue-900'>
                  Meta de Facturación
                </span>
              </div>
              <span className='text-sm font-semibold text-blue-900'>
                {formatCurrency(metas.metaFacturacion)}
              </span>
            </div>

            <div className='flex items-center justify-between p-3 bg-green-50 rounded-lg'>
              <div className='flex items-center'>
                <Users className='h-5 w-5 text-green-600 mr-2' />
                <span className='text-sm font-medium text-green-900'>
                  Meta de Clientes
                </span>
              </div>
              <span className='text-sm font-semibold text-green-900'>
                {metas.metaClientes}
              </span>
            </div>

            <div className='flex items-center justify-between p-3 bg-purple-50 rounded-lg'>
              <div className='flex items-center'>
                <Zap className='h-5 w-5 text-purple-600 mr-2' />
                <span className='text-sm font-medium text-purple-900'>
                  Nuevos Clientes
                </span>
              </div>
              <span className='text-sm font-semibold text-purple-900'>
                {metas.metaNuevosClientes}
              </span>
            </div>

            <div className='flex items-center justify-between p-3 bg-orange-50 rounded-lg'>
              <div className='flex items-center'>
                <TrendingUp className='h-5 w-5 text-orange-600 mr-2' />
                <span className='text-sm font-medium text-orange-900'>
                  Crecimiento Esperado
                </span>
              </div>
              <span className='text-sm font-semibold text-orange-900'>
                +{metas.metaCrecimiento.toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        {/* Progreso Actual */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Progreso Actual vs Meta
          </h3>

          <div className='space-y-4'>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-gray-600'>Facturación</span>
                <span className='text-gray-900'>
                  {formatCurrency(datosActuales.facturacionTotal)} /{' '}
                  {formatCurrency(metas.metaFacturacion)}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${Math.min(100, (datosActuales.facturacionTotal / metas.metaFacturacion) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-gray-600'>Clientes</span>
                <span className='text-gray-900'>
                  {datosActuales.clientesActivos} / {metas.metaClientes}
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-green-600 h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${Math.min(100, (datosActuales.clientesActivos / metas.metaClientes) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-gray-600'>Crecimiento</span>
                <span className='text-gray-900'>
                  {metas.progresoActual.toFixed(1)}% / 100%
                </span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-purple-600 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${Math.min(100, metas.progresoActual)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className='mt-6 p-4 bg-yellow-50 rounded-lg'>
            <div className='flex items-center'>
              <AlertCircle className='h-5 w-5 text-yellow-600 mr-2' />
              <span className='text-sm font-medium text-yellow-800'>
                {metas.progresoActual < 50
                  ? 'Necesitas acelerar el ritmo'
                  : 'Vas por buen camino'}
              </span>
            </div>
            <p className='text-xs text-yellow-600 mt-1'>
              {metas.progresoActual < 50
                ? 'Considera estrategias más agresivas para alcanzar las metas'
                : 'Mantén el momentum para superar las expectativas'}
            </p>
          </div>
        </Card>
      </div>

      {/* Roadmap Estratégico */}
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Roadmap Estratégico 2025
          </h3>
          <Button variant='outline' size='sm'>
            <Download className='h-4 w-4 mr-2' />
            Exportar Plan
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {roadmap.map((item, index) => (
            <div key={index} className='p-4 border border-gray-200 rounded-lg'>
              <div className='flex items-center justify-between mb-3'>
                <h4 className='font-semibold text-gray-900'>{item.quarter}</h4>
                <Badge
                  variant={
                    item.status === 'Completado'
                      ? 'default'
                      : item.status === 'En progreso'
                        ? 'secondary'
                        : 'outline'
                  }
                  size='sm'
                >
                  {item.status}
                </Badge>
              </div>

              <h5 className='font-medium text-gray-900 mb-2'>{item.title}</h5>
              <p className='text-sm text-gray-600 mb-3'>{item.description}</p>

              <div className='space-y-2'>
                {item.objetivos.map((objetivo, objIndex) => (
                  <div key={objIndex} className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 text-green-500 mr-2' />
                    <span className='text-gray-700'>{objetivo}</span>
                  </div>
                ))}
              </div>

              {item.progress > 0 && (
                <div className='mt-3'>
                  <div className='flex justify-between text-xs text-gray-500 mb-1'>
                    <span>Progreso</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-1'>
                    <div
                      className='bg-blue-600 h-1 rounded-full'
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Análisis de Riesgos y Oportunidades */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <AlertCircle className='h-5 w-5 text-red-600 mr-2' />
            Riesgos Identificados
          </h3>
          <div className='space-y-3'>
            <div className='p-3 bg-red-50 rounded-lg'>
              <h4 className='font-medium text-red-900'>Competencia Agresiva</h4>
              <p className='text-sm text-red-700'>
                Nuevos competidores en el mercado pueden afectar la cuota de
                mercado
              </p>
            </div>
            <div className='p-3 bg-red-50 rounded-lg'>
              <h4 className='font-medium text-red-900'>Cambios Regulatorios</h4>
              <p className='text-sm text-red-700'>
                Modificaciones en normativas pueden impactar operaciones
              </p>
            </div>
            <div className='p-3 bg-red-50 rounded-lg'>
              <h4 className='font-medium text-red-900'>
                Dependencia de Clientes VIP
              </h4>
              <p className='text-sm text-red-700'>
                Alta concentración en pocos clientes principales
              </p>
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
            <Star className='h-5 w-5 text-yellow-600 mr-2' />
            Oportunidades de Crecimiento
          </h3>
          <div className='space-y-3'>
            <div className='p-3 bg-green-50 rounded-lg'>
              <h4 className='font-medium text-green-900'>Expansión Digital</h4>
              <p className='text-sm text-green-700'>
                Plataforma online puede capturar nuevos segmentos de mercado
              </p>
            </div>
            <div className='p-3 bg-green-50 rounded-lg'>
              <h4 className='font-medium text-green-900'>Nuevos Rubros</h4>
              <p className='text-sm text-green-700'>
                Diversificación hacia sectores emergentes con alto potencial
              </p>
            </div>
            <div className='p-3 bg-green-50 rounded-lg'>
              <h4 className='font-medium text-green-900'>
                Expansión Geográfica
              </h4>
              <p className='text-sm text-green-700'>
                Mercados regionales con menor competencia y alto crecimiento
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProyeccionesPage;
