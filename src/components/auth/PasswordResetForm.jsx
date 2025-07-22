import React, { useState, useCallback, useEffect } from 'react';
// =====================================================================
// 🔐 FORMULARIO DE RECUPERACIÓN DE CONTRASEÑA - SISTEMA MTZ v3.0
// =====================================================================

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { supabase } from '@/lib/supabase.js';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
// Configuración del sistema
const MTZ_CONFIG = {
  validation: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Formato de email inválido',
    },
  },
};

// Esquema de validación para envío de email
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingrese un email válido')
    .transform(email => email.toLowerCase().trim()),
});

// Esquema de validación para nueva contraseña
const passwordSchema = z
  .object({
    newPassword: z
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
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

/**
 * Formulario de recuperación de contraseña
 * Maneja tanto el envío de email como el cambio de contraseña
 *
 * @returns {JSX.Element} Formulario de recuperación de contraseña
 */
const PasswordResetForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRecovery, setIsRecovery] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Detectar si es flujo de recuperación
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('type') === 'recovery' && params.get('access_token')) {
      setIsRecovery(true);
    }
  }, [location.search]);

  // Formulario para envío de email
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // Formulario para nueva contraseña
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  /**
   * Manejar envío de email de recuperación
   * @param {Object} data - Datos del formulario
   */
  const handleEmailSubmit = async data => {
    try {
      setResetError('');
      setResetSuccess('');

      console.log('🔄 Enviando email de recuperación...');

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('❌ Error enviando email:', error);
        setResetError(error.message);
      } else {
        console.log('✅ Email enviado exitosamente');
        setResetSuccess(
          'Se ha enviado un enlace de restablecimiento a tu email. Revisa tu bandeja de entrada.'
        );
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setResetError('Error inesperado. Intente nuevamente.');
    }
  };

  /**
   * Manejar cambio de contraseña
   * @param {Object} data - Datos del formulario
   */
  const handlePasswordSubmit = async data => {
    try {
      setResetError('');
      setResetSuccess('');

      // Obtener el access_token de la URL
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('access_token');

      if (!accessToken) {
        setResetError(
          'Token de recuperación no encontrado. Intenta desde el enlace de tu email.'
        );
        return;
      }

      console.log('🔄 Actualizando contraseña...');

      const { error } = await supabase.auth.updateUser(
        { password: data.newPassword },
        { accessToken }
      );

      if (error) {
        console.error('❌ Error actualizando contraseña:', error);
        setResetError(error.message);
      } else {
        console.log('✅ Contraseña actualizada exitosamente');
        setResetSuccess(
          'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.'
        );

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate('/login', {
            state: {
              message:
                'Contraseña actualizada exitosamente. Por favor, inicia sesión.',
            },
          });
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      setResetError('Error inesperado. Intente nuevamente.');
    }
  };

  /**
   * Limpiar error al cambiar campos
   */
  const handleFieldChange = () => {
    if (resetError) {
      setResetError('');
    }
  };

  // Renderizar formulario de nueva contraseña
  if (isRecovery) {
    return (
      <div className='space-y-6'>
        {/* Información */}
        <div className='text-center'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Establecer nueva contraseña
          </h3>
          <p className='text-sm text-gray-600'>
            Ingresa tu nueva contraseña para tu cuenta.
          </p>
        </div>

        {/* Error */}
        {resetError && (
          <div className='rounded-md bg-red-50 p-4 border border-red-200'>
            <div className='flex'>
              <AlertCircle className='h-5 w-5 text-red-400' />
              <div className='ml-3'>
                <p className='text-sm text-red-700'>{resetError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Éxito */}
        {resetSuccess && (
          <div className='rounded-md bg-green-50 p-4 border border-green-200'>
            <div className='flex'>
              <CheckCircle className='h-5 w-5 text-green-400' />
              <div className='ml-3'>
                <p className='text-sm text-green-700'>{resetSuccess}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulario de nueva contraseña */}
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className='space-y-6'
        >
          {/* Nueva contraseña */}
          <div>
            <label
              htmlFor='newPassword'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Nueva Contraseña
            </label>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Lock className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                id='newPassword'
                type={showPassword ? 'text' : 'password'}
                autoComplete='new-password'
                placeholder='••••••••'
                className={`pl-10 pr-10 ${
                  passwordForm.formState.errors.newPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                {...passwordForm.register('newPassword', {
                  onChange: handleFieldChange,
                })}
                disabled={passwordForm.formState.isSubmitting}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}
                disabled={passwordForm.formState.isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertCircle className='h-4 w-4 mr-1' />
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
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
                className={`pl-10 pr-10 ${
                  passwordForm.formState.errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                {...passwordForm.register('confirmPassword', {
                  onChange: handleFieldChange,
                })}
                disabled={passwordForm.formState.isSubmitting}
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={passwordForm.formState.isSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                )}
              </button>
            </div>
            {passwordForm.formState.errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600 flex items-center'>
                <AlertCircle className='h-4 w-4 mr-1' />
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Botón de envío */}
          <Button
            type='submit'
            variant='primary'
            size='lg'
            loading={passwordForm.formState.isSubmitting}
            disabled={passwordForm.formState.isSubmitting}
            className='w-full'
          >
            {passwordForm.formState.isSubmitting
              ? 'Actualizando...'
              : 'Actualizar Contraseña'}
          </Button>
        </form>

        {/* Volver al login */}
        <div className='text-center'>
          <Link
            to='/login'
            className='inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  // Renderizar formulario de envío de email
  return (
    <div className='space-y-6'>
      {/* Información */}
      <div className='text-center'>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          Restablecer Contraseña
        </h3>
        <p className='text-sm text-gray-600'>
          Ingresa tu email y te enviaremos un enlace para restablecer tu
          contraseña.
        </p>
      </div>

      {/* Error */}
      {resetError && (
        <div className='rounded-md bg-red-50 p-4 border border-red-200'>
          <div className='flex'>
            <AlertCircle className='h-5 w-5 text-red-400' />
            <div className='ml-3'>
              <p className='text-sm text-red-700'>{resetError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Éxito */}
      {resetSuccess && (
        <div className='rounded-md bg-green-50 p-4 border border-green-200'>
          <div className='flex'>
            <CheckCircle className='h-5 w-5 text-green-400' />
            <div className='ml-3'>
              <p className='text-sm text-green-700'>{resetSuccess}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de email */}
      <form
        onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
        className='space-y-6'
      >
        {/* Email */}
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
              className={`pl-10 ${
                emailForm.formState.errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : ''
              }`}
              {...emailForm.register('email', {
                onChange: handleFieldChange,
              })}
              disabled={emailForm.formState.isSubmitting}
            />
          </div>
          {emailForm.formState.errors.email && (
            <p className='mt-1 text-sm text-red-600 flex items-center'>
              <AlertCircle className='h-4 w-4 mr-1' />
              {emailForm.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <Button
          type='submit'
          variant='primary'
          size='lg'
          loading={emailForm.formState.isSubmitting}
          disabled={emailForm.formState.isSubmitting}
          className='w-full'
        >
          {emailForm.formState.isSubmitting
            ? 'Enviando...'
            : 'Enviar Enlace de Restablecimiento'}
        </Button>
      </form>

      {/* Volver al login */}
      <div className='text-center'>
        <Link
          to='/login'
          className='inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors'
        >
          <ArrowLeft className='w-4 h-4 mr-2' />
          Volver al login
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetForm;
