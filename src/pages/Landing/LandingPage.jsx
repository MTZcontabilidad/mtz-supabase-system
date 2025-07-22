import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Users,
  BarChart3,
  Shield,
  Zap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Building2,
  Calculator,
  Globe,
  Phone,
  Mail,
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { supabase } from '../../lib/supabase.js';

const LandingPage = () => {
  const [clientesCount, setClientesCount] = useState(null);
  const [facturacionTotal, setFacturacionTotal] = useState(null);
  const features = [
    {
      icon: Users,
      title: 'Gestión de Clientes',
      description:
        'Administra toda tu cartera de clientes con información completa y actualizada.',
    },
    {
      icon: BarChart3,
      title: 'Reportes Avanzados',
      description:
        'Genera reportes detallados de facturación, cobranzas y análisis financiero.',
    },
    {
      icon: Calculator,
      title: 'Contabilidad Completa',
      description:
        'Sistema contable integrado con libros de compra, venta y balance general.',
    },
    {
      icon: Shield,
      title: 'Cumplimiento Tributario',
      description:
        'Mantén al día todas las declaraciones y obligaciones tributarias.',
    },
    {
      icon: Zap,
      title: 'Automatización IA',
      description:
        'Inteligencia artificial para optimizar procesos y generar insights.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics en Tiempo Real',
      description: 'Dashboard con métricas y KPIs actualizados en tiempo real.',
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      // Obtener número de clientes
      const { count: clientes, error: clientesError } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true });
      setClientesCount(clientesError ? null : clientes);

      // Obtener facturación total
      const { data: ventas, error: ventasError } = await supabase
        .from('ventas')
        .select('monto_total');
      if (!ventasError && ventas) {
        const total = ventas.reduce(
          (sum, v) => sum + (parseFloat(v.monto_total) || 0),
          0
        );
        setFacturacionTotal(total);
      } else {
        setFacturacionTotal(null);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      number: clientesCount !== null ? clientesCount : '...',
      label: 'Clientes Activos',
    },
    {
      number:
        facturacionTotal !== null
          ? `$${facturacionTotal.toLocaleString('es-CL')}`
          : '...',
      label: 'Facturación Total',
    },
    { number: '15+', label: 'Años de Experiencia' },
    { number: '99.9%', label: 'Uptime del Sistema' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-4'>
            <div className='flex items-center space-x-3'>
              <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl'>
                <LineChart className='w-7 h-7 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold text-gray-900'>
                  MTZ Ouroborus AI
                </h1>
                <p className='text-xs text-gray-600'>Consultores Tributarios</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <Link
                to='/login'
                className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium'
              >
                Iniciar Sesión
              </Link>
              <Link to='/register'>
                <Button
                  size='sm'
                  className='bg-gradient-to-r from-blue-600 to-purple-600'
                >
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='relative py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center'>
            <div className='inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8'>
              <Zap className='w-4 h-4 mr-2' />
              Sistema de Gestión Empresarial con IA
            </div>

            <h1 className='text-5xl md:text-7xl font-bold text-gray-900 mb-6'>
              <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                MTZ Ouroborus AI
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto'>
              La plataforma más avanzada para{' '}
              <strong>consultorías tributarias</strong> con inteligencia
              artificial integrada
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
              <Link to='/register'>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg'
                >
                  Comenzar Gratis
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Button>
              </Link>
              <Link to='/login'>
                <Button
                  variant='outline'
                  size='lg'
                  className='px-8 py-4 text-lg'
                >
                  Ver Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16'>
              {stats.map((stat, index) => (
                <div key={index} className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-gray-600 text-sm md:text-base'>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900 mb-4'>
              Todo lo que necesitas en una plataforma
            </h2>
            <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
              Optimiza tu consultoría tributaria con herramientas avanzadas de
              gestión y IA
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100'
              >
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
                  <feature.icon className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            <div>
              <h2 className='text-4xl font-bold text-gray-900 mb-6'>
                ¿Por qué elegir MTZ Ouroborus AI?
              </h2>
              <p className='text-xl text-gray-600 mb-8'>
                Más de 15 años de experiencia en consultoría tributaria ahora
                potenciados con inteligencia artificial para ofrecerte la mejor
                experiencia.
              </p>

              <div className='space-y-4'>
                {[
                  'Consultas SQL en lenguaje natural',
                  'Automatización de reportes tributarios',
                  'Dashboard interactivo en tiempo real',
                  'Integración completa con SII',
                  'Backup automático en la nube',
                  'Soporte técnico especializado 24/7',
                ].map((benefit, index) => (
                  <div key={index} className='flex items-center'>
                    <CheckCircle className='w-6 h-6 text-green-500 mr-3 flex-shrink-0' />
                    <span className='text-gray-700'>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white'>
              <div className='text-center'>
                <Building2 className='w-16 h-16 mx-auto mb-6 opacity-80' />
                <h3 className='text-2xl font-bold mb-4'>
                  MTZ Consultores Tributarios
                </h3>
                <p className='text-blue-100 mb-6'>
                  Ubicados en Iquique, Tarapacá, atendemos clientes en todo
                  Chile con tecnología de vanguardia.
                </p>
                <div className='space-y-3 text-left'>
                  <div className='flex items-center'>
                    <Globe className='w-5 h-5 mr-3' />
                    <span>Av. Arturo Prat 1234, Iquique</span>
                  </div>
                  <div className='flex items-center'>
                    <Phone className='w-5 h-5 mr-3' />
                    <span>+56 57 2123456</span>
                  </div>
                  <div className='flex items-center'>
                    <Mail className='w-5 h-5 mr-3' />
                    <span>contacto@mtzouroborus.cl</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
          <h2 className='text-4xl font-bold text-white mb-6'>
            ¿Listo para revolucionar tu consultoría?
          </h2>
          <p className='text-xl text-blue-100 mb-8'>
            Únete a más de 135 empresas que ya confían en MTZ Ouroborus AI
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to='/register'>
              <Button
                size='lg'
                variant='outline'
                className='bg-white text-blue-600 px-8 py-4 text-lg border-white hover:bg-blue-50'
              >
                Crear Cuenta Gratis
                <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </Link>
            <Link to='/login'>
              <Button
                size='lg'
                className='bg-blue-700 text-white px-8 py-4 text-lg border border-blue-500 hover:bg-blue-800'
              >
                Acceder al Sistema
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div className='md:col-span-2'>
              <div className='flex items-center space-x-3 mb-4'>
                <div className='bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl'>
                  <LineChart className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-lg font-bold'>MTZ Ouroborus AI</h3>
                  <p className='text-gray-400 text-sm'>
                    Consultores Tributarios
                  </p>
                </div>
              </div>
              <p className='text-gray-400 leading-relaxed'>
                Sistema de gestión empresarial con inteligencia artificial para
                consultorías tributarias modernas.
              </p>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Plataforma</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link to='/login' className='hover:text-white'>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to='/login' className='hover:text-white'>
                    Clientes
                  </Link>
                </li>
                <li>
                  <Link to='/login' className='hover:text-white'>
                    Reportes
                  </Link>
                </li>
                <li>
                  <Link to='/login' className='hover:text-white'>
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Empresa</h4>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <a href='#' className='hover:text-white'>
                    Sobre MTZ
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Contacto
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Soporte
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-white'>
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
            <p>
              &copy; {new Date().getFullYear()} MTZ Consultores Tributarios.
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
