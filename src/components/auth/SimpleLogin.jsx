import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

function SimpleLogin() {
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
      console.log('🔄 Intentando login con:', email);
      const result = await login(email, password);

      if (result.success) {
        console.log('✅ Login exitoso');
        navigate('/app/dashboard');
      } else {
        console.error('❌ Error en login:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = (testEmail, testPassword) => {
    setEmail(testEmail);
    setPassword(testPassword);
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
          <h3 className='text-sm font-medium text-blue-800 mb-3'>
            Credenciales de Prueba:
          </h3>
          <div className='space-y-2'>
            <button
              onClick={() => handleTestLogin('admin@mtz.com', 'admin123')}
              className='w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 rounded hover:bg-blue-100'
            >
              👑 Administrador: admin@mtz.com / admin123
            </button>
            <button
              onClick={() => handleTestLogin('gerente@mtz.com', 'gerente123')}
              className='w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 rounded hover:bg-blue-100'
            >
              👔 Gerente: gerente@mtz.com / gerente123
            </button>
            <button
              onClick={() => handleTestLogin('vendedor@mtz.com', 'vendedor123')}
              className='w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 rounded hover:bg-blue-100'
            >
              💼 Vendedor: vendedor@mtz.com / vendedor123
            </button>
            <button
              onClick={() => handleTestLogin('cliente@mtz.com', 'cliente123')}
              className='w-full text-left text-sm text-blue-700 hover:text-blue-900 p-2 rounded hover:bg-blue-100'
            >
              👤 Cliente: cliente@mtz.com / cliente123
            </button>
          </div>
        </div>

        <div className='mt-4 text-center text-xs text-gray-500'>
          Sistema MTZ v3.0 - Modo de Prueba
        </div>
      </div>
    </div>
  );
}

export default SimpleLogin;
