import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { LineChart, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya estÃ¡ autenticado
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/app/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error);
      } else if (data.user) {
        // NavegaciÃ³n serÃ¡ manejada por el useEffect
        console.log('Login exitoso');
      }
    } catch (err) {
      setError('Error inesperado durante el login');
      console.error('Error en login:', err);
    } finally {
      setLoading(false);
    }
  };

  // FunciÃ³n para autocompletar credenciales demo
  const fillDemoCredentials = () => {
    setEmail('mtzcontabilidad@gmail.com');
    setPassword('Alohomora33.');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Logo y Título */}
        <div className='flex justify-center'>
          <div className='flex items-center space-x-3'>
            <div className='bg-blue-600 p-3 rounded-lg'>
              <LineChart className='h-8 w-8 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                MTZ Ouroborus AI
              </h1>
              <p className='text-sm text-gray-600'>v3.0 Sistema Empresarial</p>
            </div>
          </div>
        </div>

        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Iniciar Sesión
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Accede a tu sistema de gestión empresarial
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-200'>
          {/* Botón Demo */}
          <div className='mb-6'>
            <Button
              variant='ghost'
              onClick={fillDemoCredentials}
              className='w-full text-sm border border-blue-200 hover:bg-blue-50'
            >
              🚀 Usar Credenciales Demo (Carlos Villagra)
            </Button>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className='rounded-md bg-red-50 p-4 border border-red-200'>
                <div className='flex'>
                  <AlertCircle className='h-5 w-5 text-red-400' />
                  <div className='ml-3'>
                    <p className='text-sm text-red-800'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <div className='mt-1'>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder='tu@email.com'
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Contraseña
              </label>
              <div className='mt-1 relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder='Tu contraseña'
                  disabled={loading}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900'
                >
                  Recordarme
                </label>
              </div>

              <div className='text-sm'>
                <Link
                  to='/reset-password'
                  className='font-medium text-blue-600 hover:text-blue-500'
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type='submit'
                variant='primary'
                className='w-full'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='animate-spin -ml-1 mr-3 h-5 w-5' />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </div>
          </form>

          {/* Enlaces adicionales */}
          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            <div className='mt-6 text-center'>
              <p className='text-sm text-gray-600'>
                Contacta al administrador para obtener acceso o{' '}
                <Link
                  to='/register'
                  className='font-medium text-blue-600 hover:text-blue-500'
                >
                  solicita una demo
                </Link>
              </p>
            </div>
          </div>

          {/* Información del sistema */}
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <div className='text-xs text-gray-500 text-center space-y-1'>
              <p>MTZ Ouroborus AI v3.0</p>
              <p>Sistema de Gestión Empresarial</p>
              <p className='text-blue-600'>Powered by Supabase + React</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
