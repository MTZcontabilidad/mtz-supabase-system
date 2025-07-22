import React, { useState, useCallback, useEffect } from 'react';
// =====================================================================
// 🔐 FORMULARIO DE REGISTRO - SISTEMA MTZ v3.0
// =====================================================================

import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import { MTZ_CONFIG } from '@/lib/config.js';

// Esquema de validación con Zod
const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        'El nombre solo puede contener letras y espacios'
      ),
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
      )
      .regex(
        /^(?=.*[a-z])/,
        'La contraseña debe contener al menos una minúscula'
      )
      .regex(
        /^(?=.*[A-Z])/,
        'La contraseña debe contener al menos una mayúscula'
      )
      .regex(/^(?=.*\d)/, 'La contraseña debe contener al menos un número')
      .regex(
        /^(?=.*[!@#$%^&*])/,
        'La contraseña debe contener al menos un carácter especial'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, 'Debes aceptar los términos y condiciones'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Formulario de registro de usuarios
 * Maneja el registro con validación avanzada y estados de carga
 *
 * @returns {JSX.Element} Formulario de registro
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: signUp, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Configurar react-hook-form con validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  // Observar valores para validación en tiempo real
  const watchedValues = watch();

  /**
   * Manejar el envío del formulario
   * @param {Object} data - Datos del formulario validados
   */
  const onSubmit = async data => {
    try {
      setRegisterError('');
      setRegisterSuccess('');

      console.log('🔄 Iniciando proceso de registro...');

      const result = await signUp(
        {
          email: data.email,
          fullName: data.fullName,
        },
        data.password,
        data.confirmPassword
      );

      if (result.success) {
        console.log('✅ Registro exitoso');
        setRegisterSuccess(
          'Cuenta creada exitosamente. Revisa tu email para confirmar tu cuenta.'
        );

        // Redirigir después de 3 segundos
        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Cuenta creada exitosamente. Por favor, inicia sesión.',
            },
          });
        }, 3000);
      } else {
        console.error('❌ Error en registro:', result.error);
        setRegisterError(result.error || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('❌ Error inesperado en registro:', error);
      setRegisterError('Error inesperado. Intente nuevamente.');
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
    if (registerError) {
      setRegisterError('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Campo de nombre completo */}
      <div>
        <label
          htmlFor='fullName'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Nombre Completo
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <User className='h-5 w-5 text-gray-400' />
          </div>
          <Input
            id='fullName'
            type='text'
            autoComplete='name'
            placeholder='Tu nombre completo'
            className={`pl-10 ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('fullName', {
              onChange: handleFieldChange,
            })}
            onKeyPress={handleKeyPress}
            disabled={isSubmitting || loading}
          />
        </div>
        {errors.fullName && (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <AlertCircle className='h-4 w-4 mr-1' />
            {errors.fullName.message}
          </p>
        )}
      </div>

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
            autoComplete='new-password'
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

        {/* Indicador de fortaleza de contraseña */}
        {watchedValues.password && (
          <div className='mt-2'>
            <div className='flex space-x-1'>
              {[
                watchedValues.password.length >=
                  MTZ_CONFIG.security.password.minLength,
                /[A-Z]/.test(watchedValues.password),
                /[a-z]/.test(watchedValues.password),
                /\d/.test(watchedValues.password),
                /[!@#$%^&*]/.test(watchedValues.password),
              ].map((isValid, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    isValid ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className='text-xs text-gray-500 mt-1'>
              La contraseña debe tener al menos{' '}
              {MTZ_CONFIG.security.password.minLength} caracteres, una
              mayúscula, una minúscula, un número y un carácter especial
            </p>
          </div>
        )}
      </div>

      {/* Campo de confirmar contraseña */}
      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Confirmar Contraseña
        </label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Lock className='h-5 w-5 text-gray-400' />
          </div>
          <Input
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete='new-password'
            placeholder='••••••••'
            className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            {...register('confirmPassword', {
              onChange: handleFieldChange,
            })}
            onKeyPress={handleKeyPress}
            disabled={isSubmitting || loading}
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 pr-3 flex items-center'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting || loading}
          >
            {showConfirmPassword ? (
              <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            ) : (
              <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='mt-1 text-sm text-red-600 flex items-center'>
            <AlertCircle className='h-4 w-4 mr-1' />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Términos y condiciones */}
      <div className='flex items-start'>
        <div className='flex items-center h-5'>
          <input
            id='acceptTerms'
            type='checkbox'
            className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            {...register('acceptTerms')}
            disabled={isSubmitting || loading}
          />
        </div>
        <div className='ml-3 text-sm'>
          <label htmlFor='acceptTerms' className='text-gray-700'>
            Acepto los{' '}
            <Link
              to='/terminos'
              className='text-blue-600 hover:text-blue-500 font-medium'
            >
              términos y condiciones
            </Link>{' '}
            y la{' '}
            <Link
              to='/privacidad'
              className='text-blue-600 hover:text-blue-500 font-medium'
            >
              política de privacidad
            </Link>
          </label>
          {errors.acceptTerms && (
            <p className='mt-1 text-sm text-red-600 flex items-center'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      {/* Error general */}
      {registerError && (
        <div className='rounded-md bg-red-50 p-4 border border-red-200'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-red-400' />
            <div className='ml-3'>
              <p className='text-sm text-red-700'>{registerError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Éxito */}
      {registerSuccess && (
        <div className='rounded-md bg-green-50 p-4 border border-green-200'>
          <div className='flex'>
            <CheckCircle className='h-5 w-5 text-green-400' />
            <div className='ml-3'>
              <p className='text-sm text-green-700'>{registerSuccess}</p>
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
        {isSubmitting || loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </Button>

      {/* Información adicional */}
      <div className='text-center'>
        <p className='text-sm text-gray-600'>
          ¿Ya tienes una cuenta?{' '}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
