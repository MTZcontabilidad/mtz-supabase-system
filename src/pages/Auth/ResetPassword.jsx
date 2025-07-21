// =====================================================================
// 🔐 PÁGINA DE RECUPERACIÓN DE CONTRASEÑA - SISTEMA MTZ v3.0
// =====================================================================

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth.js';
import AuthLayout from '@/components/auth/AuthLayout.jsx';
import PasswordResetForm from '@/components/auth/PasswordResetForm.jsx';

/**
 * Página de recuperación de contraseña
 * Maneja el envío de email de recuperación y cambio de contraseña
 *
 * @returns {JSX.Element} Página de recuperación de contraseña
 */
const ResetPassword = () => {
  const { isAuthenticated, loading } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !loading) {
      console.log('🔄 Usuario ya autenticado, redirigiendo...');
    }
  }, [isAuthenticated, loading]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <AuthLayout
      title='Recuperar Contraseña'
      subtitle='Te ayudamos a recuperar tu cuenta'
      footerText='¿Recordaste tu contraseña?'
      footerLink='/login'
      footerLinkText='Inicia sesión aquí'
      showLogo={true}
      showFooter={true}
    >
      <PasswordResetForm />
    </AuthLayout>
  );
};

export default ResetPassword;
