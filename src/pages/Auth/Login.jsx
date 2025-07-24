import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { Mail, Lock, Eye, EyeOff, Building, Users, TrendingUp, Calculator } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('admin@mtz.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);

      if (result.success) {
        console.log('✅ Login exitoso:', email);
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        {/* Logo y título */}
        <div className='text-center'>
          <div className='mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-6'>
            <Building className='h-10 w-10 text-white' />
          </div>
          <h2 className='text-3xl font-extrabold text-gray-900 mb-2'>
            MTZ Sistema v3.0
          </h2>
          <p className='text-gray-600'>
            Gestión Empresarial Integral
          </p>
        </div>

        {/* Formulario */}
        <div className='bg-white rounded-xl shadow-xl p-8 border border-gray-100'>
          <form className='space-y-6' onSubmit={handleLogin}>
            {/* Campo de email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Correo Electrónico
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  className='appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200'
                  placeholder='tu@email.com'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Contraseña
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  required
                  className='appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-all duration-200'
                  placeholder='••••••••'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm'>{error}</p>
                </div>
              </div>
            )}

            {/* Botón de login */}
            <div>
              <button
                type='submit'
                disabled={loading}
                className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                {loading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Credenciales de prueba */}
        <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200'>
          <h3 className='text-sm font-medium text-blue-800 mb-3 flex items-center'>
            <Users className='h-4 w-4 mr-2' />
            Credenciales de Prueba:
          </h3>
          <div className='space-y-2 text-sm text-blue-700'>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>Administrador:</span>
              <span>admin@mtz.com / admin123</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>Gerente:</span>
              <span>gerente@mtz.com / gerente123</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>Vendedor:</span>
              <span>vendedor@mtz.com / vendedor123</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-medium'>Cliente:</span>
              <span>cliente@mtz.com / cliente123</span>
            </div>
          </div>
        </div>

        {/* Características del sistema */}
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <TrendingUp className='h-6 w-6 text-green-600 mx-auto mb-2' />
            <p className='text-xs text-gray-600'>Gestión de Ventas</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <Calculator className='h-6 w-6 text-purple-600 mx-auto mb-2' />
            <p className='text-xs text-gray-600'>Control de IVA</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <Users className='h-6 w-6 text-blue-600 mx-auto mb-2' />
            <p className='text-xs text-gray-600'>Gestión de Clientes</p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
            <Building className='h-6 w-6 text-orange-600 mx-auto mb-2' />
            <p className='text-xs text-gray-600'>Recursos Humanos</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
