import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

function Login() {
  const [email, setEmail] = useState('admin@mtz.com');
  const [password, setPassword] = useState('admin123');
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
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            MTZ Sistema de Gestión
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Inicia sesión en tu cuenta
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email' className='sr-only'>
                Correo Electrónico
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Correo Electrónico'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Contraseña
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm'
                placeholder='Contraseña'
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
              {error}
            </div>
          )}

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className='mt-6 bg-blue-50 p-4 rounded-md'>
          <h3 className='text-sm font-medium text-blue-800'>
            Credenciales de Prueba:
          </h3>
          <div className='mt-2 text-sm text-blue-700'>
            <p>Administrador: admin@mtz.com / admin123</p>
            <p>Gerente: gerente@mtz.com / gerente123</p>
            <p>Vendedor: vendedor@mtz.com / vendedor123</p>
            <p>Cliente: cliente@mtz.com / cliente123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
