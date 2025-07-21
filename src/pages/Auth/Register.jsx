// =====================================================================
// 🔐 PÁGINA DE REGISTRO - SISTEMA MTZ v3.0
// =====================================================================

import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth.js';
import AuthLayout from '@/components/auth/AuthLayout.jsx';
import RegisterForm from '@/components/auth/RegisterForm.jsx';

/**
 * Página de registro de usuarios
 * Maneja el registro de nuevos usuarios con validación y redirección
 *
 * @returns {JSX.Element} Página de registro
 */
const Register = () => {
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
      title='Crear Cuenta'
      subtitle='Únete a MTZ Consultores Tributarios'
      footerText='¿Ya tienes cuenta?'
      footerLink='/login'
      footerLinkText='Inicia sesión aquí'
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
