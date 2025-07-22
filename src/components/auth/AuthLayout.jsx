import React, { useState, useCallback, useEffect } from 'react';
// =====================================================================
// 🔐 LAYOUT DE AUTENTICACIÓN - SISTEMA MTZ v3.0
// =====================================================================

import { Link } from 'react-router-dom';
import LogoMTZ from '@/components/ui/LogoMTZ.jsx';
import { COMPANY, UI } from '@/utils/constants.js';

/**
 * Layout específico para páginas de autenticación
 * Proporciona un diseño limpio y profesional para login, registro, etc.
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar
 * @param {string} props.title - Título de la página
 * @param {string} props.subtitle - Subtítulo de la página
 * @param {string} props.footerText - Texto del footer
 * @param {string} props.footerLink - Enlace del footer
 * @param {string} props.footerLinkText - Texto del enlace del footer
 * @returns {JSX.Element} Layout de autenticación
 *
 * @example
 * ```jsx
 * <AuthLayout
 *   title="Iniciar Sesión"
 *   subtitle="Accede a tu cuenta de MTZ"
 *   footerText="¿No tienes cuenta?"
 *   footerLink="/register"
 *   footerLinkText="Regístrate aquí"
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
const AuthLayout = ({
  children,
  title = 'Autenticación',
  subtitle = 'Accede al sistema MTZ',
  footerText = '',
  footerLink = '',
  footerLinkText = '',
  showLogo = true,
  showFooter = true,
}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      {/* Fondo decorativo */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl'></div>
      </div>

      <div className='relative sm:mx-auto sm:w-full sm:max-w-md'>
        {/* Logo y branding */}
        {showLogo && (
          <div className='text-center mb-8'>
            <Link to='/' className='inline-block'>
              <LogoMTZ className='h-12 w-auto mx-auto' />
            </Link>
            <h2 className='mt-4 text-2xl font-bold text-gray-900'>
              {COMPANY.name}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>{COMPANY.description}</p>
          </div>
        )}

        {/* Card principal */}
        <div className='bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100'>
          {/* Header del card */}
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h1>
            {subtitle && <p className='text-sm text-gray-600'>{subtitle}</p>}
          </div>

          {/* Contenido principal */}
          <div className='space-y-6'>{children}</div>

          {/* Footer del card */}
          {showFooter && footerText && (
            <div className='mt-8 text-center'>
              <p className='text-sm text-gray-600'>
                {footerText}
                {footerLink && footerLinkText && (
                  <Link
                    to={footerLink}
                    className='font-medium text-blue-600 hover:text-blue-500 ml-1 transition-colors'
                  >
                    {footerLinkText}
                  </Link>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Footer general */}
        <div className='mt-8 text-center'>
          <p className='text-xs text-gray-500'>
            © {new Date().getFullYear()} {COMPANY.name}. Todos los derechos
            reservados.
          </p>
          <div className='mt-2 flex justify-center space-x-4 text-xs text-gray-500'>
            <Link
              to='/terminos'
              className='hover:text-gray-700 transition-colors'
            >
              Términos y Condiciones
            </Link>
            <Link
              to='/privacidad'
              className='hover:text-gray-700 transition-colors'
            >
              Política de Privacidad
            </Link>
            <Link
              to='/soporte'
              className='hover:text-gray-700 transition-colors'
            >
              Soporte
            </Link>
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className='absolute bottom-4 left-4 text-xs text-gray-400'>
        <p>¿Necesitas ayuda? {COMPANY.email}</p>
      </div>

      {/* Versión del sistema */}
      <div className='absolute bottom-4 right-4 text-xs text-gray-400'>
        v{UI.version}
      </div>
    </div>
  );
};

export default AuthLayout;
