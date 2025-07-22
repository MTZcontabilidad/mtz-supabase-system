import React, { useState, useCallback, useEffect } from 'react';
// =====================================================================
// 🔐 FORMULARIO DE LOGIN - SISTEMA MTZ v3.0 (SIN MODO DEMO)
// =====================================================================

import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import useAuth from '@/hooks/useAuth.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import { MTZ_CONFIG } from '@/lib/config.js';

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingrese un email válido')
    .transform(email => email.toLowerCase().trim()),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(
      MTZ_CONFIG.security.password.minLength,
      `La contraseña debe tener al menos ${MTZ_CONFIG.security.password.minLength} caracteres`
    ),
  rememberMe: z.boolean().optional(),
});

/**
 * Formulario de inicio de sesión
 * Maneja la autenticación con validación y estados de carga
 *
 * @returns {JSX.Element} Formulario de login
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Configurar react-hook-form con validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'mtzcontabilidad@gmail.com',
      password: 'Alohomora33@',
      rememberMe: false,
    },
  });

  /**
   * Manejar el envío del formulario
   * @param {Object} data - Datos del formulario validados
   */
  const onSubmit = async data => {
    try {
      setLoginError('');

      console.log('🔄 Iniciando proceso de login...');

      const result = await login(data.email, data.password, {
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        console.log('✅ Login exitoso, redirigiendo...');

        // Redirigir según el rol del usuario
        const userRole = result.user?.user_metadata?.role || 'cliente';

        switch (userRole) {
          case 'admin':
            navigate('/admin/usuarios');
            break;
          case 'colaborador':
            navigate('/dashboard');
            break;
          case 'cliente':
            navigate('/portal-clientes');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        console.error('❌ Error en login:', result.error);
        setLoginError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('❌ Error inesperado en login:', error);
      setLoginError('Error inesperado. Intente nuevamente.');
    }
  };

  /**
   * Manejar error de teclado
   * @param {KeyboardEvent} e - Evento de teclado
   */
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  /**
   * Limpiar error al cambiar campos
   */
  const handleFieldChange = () => {
    if (loginError) {
      setLoginError('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Campo de email */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Correo Electrónico
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Mail className='h-5 w-5 text-gray-400' />
          </div>
          <Input
            id='email'
            type='email'
            autoComplete='email'
            placeholder='tu@email.com'
            className={`pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('email', {
              onChange: handleFieldChange,
            })}
            onKeyPress={handleKeyPress}
            disabled={isSubmitting || loading}
          />
        </div>
        {errors.email && (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <AlertCircle className='h-4 w-4 mr-1' />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Campo de contraseña */}
      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Contraseña
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Lock className='h-5 w-5 text-gray-400' />
          </div>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='current-password'
            placeholder='••••••••'
            className={`pl-10 pr-10 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('password', {
              onChange: handleFieldChange,
            })}
            onKeyPress={handleKeyPress}
            disabled={isSubmitting || loading}
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting || loading}
          >
            {showPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.password && (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <AlertCircle className='h-4 w-4 mr-1' />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Opciones adicionales */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='rememberMe'
            type='checkbox'
            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            {...register('rememberMe')}
            disabled={isSubmitting || loading}
          />
          <label
            htmlFor='rememberMe'
            className='ml-2 block text-sm text-gray-700'
          >
            Recordar sesión
          </label>
        </div>

        <div className='text-sm'>
          <Link
            to='/reset-password'
            className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      {/* Error general */}
      {loginError && (
        <div className='rounded-md bg-red-50 p-4 border border-red-200'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-red-400' />
            <div className='ml-3'>
              <p className='text-sm text-red-700'>{loginError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botón de envío */}
      <Button
        type='submit'
        variant='primary'
        size='lg'
        loading={isSubmitting || loading}
        disabled={isSubmitting || loading}
        className='w-full'
      >
        {isSubmitting || loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Información adicional */}
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          ¿No tienes una cuenta?{' '}
          <Link
            to='/register'
            className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
          >
            Regístrate aquí
          </Link>
        </p>
      </div>

      {/* Información de seguridad */}
      <div className='text-center'>
        <p className='text-xs text-gray-500'>
          Al iniciar sesión, aceptas nuestros{' '}
          <Link to='/terminos' className='text-blue-600 hover:text-blue-500'>
            términos y condiciones
          </Link>
        </p>
      </div>

      {/* Información de credenciales de prueba */}
      <div className='text-center mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
        <p className='text-sm text-blue-700'>
          <strong>💡 Credenciales de Prueba:</strong>
        </p>
        <div className='mt-2 text-xs text-blue-600 space-y-1'>
          <p>
            <strong>Admin:</strong> mtzcontabilidad@gmail.com / Alohomora33@
          </p>
          <p>
            <strong>Gerente:</strong> gerente@mtz.cl / password123
          </p>
          <p>
            <strong>Analista:</strong> analista@mtz.cl / password123
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
