import React, { useState, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

const PublicRoute = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();

  console.log(
    '🌐 PublicRoute - usuario:',
    !!user,
    'loading:',
    loading,
    'demo:',
    isDemoMode
  );

  // Mostrar loading simple
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Cargando...</p>
          {isDemoMode && (
            <p className='mt-2 text-sm text-blue-600'>🎭 Modo demo activo</p>
          )}
        </div>
      </div>
    );
  }

  // Si hay usuario, redirigir al dashboard
  if (user) {
    console.log('✅ Usuario autenticado, redirigiendo al dashboard');

    // Si estamos en modo demo, redirigir a la página de administración
    if (isDemoMode) {
      return <Navigate to='/admin/usuarios?demo=true' replace />;
    }

    return <Navigate to='/dashboard' replace />;
  }

  // Si no hay usuario, mostrar contenido público
  console.log('ℹ️ No hay usuario, mostrando página pública');
  return children;
};

export default PublicRoute;
