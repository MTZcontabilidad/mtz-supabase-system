// =====================================================================
// 🔐 PÁGINA DE LOGIN - SISTEMA MTZ v3.0
// =====================================================================

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth.js';
import AuthLayout from '@/components/auth/AuthLayout.jsx';
import LoginForm from '@/components/auth/LoginForm.jsx';

/**
 * Página de inicio de sesión
 * Maneja la autenticación y redirección de usuarios
 *
 * @returns {JSX.Element} Página de login
 */
const Login = () => {
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
      title='Iniciar Sesión'
      subtitle='Accede a tu cuenta de MTZ'
      footerText='¿No tienes cuenta?'
      footerLink='/register'
      footerLinkText='Regístrate aquí'
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
