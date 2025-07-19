import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LineChart, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app/dashboard';

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn({ email, password });
      if (error) {
        setError(error.message || 'Error al iniciar sesión');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (user) {
    return null; // No renderizar nada si ya está autenticado
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4'>
            <LineChart className='h-8 w-8 text-white' />
          </div>
          <h2 className='text-3xl font-bold text-gray-900'>Iniciar Sesión</h2>
          <p className='mt-2 text-sm text-gray-600'>
            Accede a tu panel de control MTZ
          </p>
        </div>

        {/* Formulario */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3'>
              <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
              <p className='text-sm text-red-700'>{error}</p>
            </div>
          )}

          <div className='space-y-4'>
            <Input
              label='Correo Electrónico'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='tu@email.com'
              required
              autoComplete='email'
            />

            <div className='relative'>
              <Input
                label='Contraseña'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                required
                autoComplete='current-password'
              />
              <button
                type='button'
                className='absolute right-3 top-9 text-gray-400 hover:text-gray-600'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            loading={loading}
            disabled={!email || !password}
            className='w-full'
            size='lg'
          >
            {loading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>

          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              ¿No tienes cuenta?{' '}
              <Link
                to='/register'
                className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className='text-center text-xs text-gray-500 space-y-2'>
          <p>Sistema MTZ Ouroborus AI</p>
          <p>Plataforma segura de gestión empresarial</p>
        </div>
      </div>
    </div>
  );
};

export default Login;