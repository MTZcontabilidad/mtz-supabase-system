import React, { useState, useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation.jsx';
import DemoBanner from '../ui/DemoBanner.jsx';
import { Toaster } from 'react-hot-toast';

/**
 * Layout Component
 * Layout principal responsive para el sistema MTZ v3.0.
 * Integra navegación moderna, banner demo y área de contenido principal.
 * Optimizado para dispositivos móviles y desktop con diseño moderno.
 */
const Layout = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Banner de modo demo */}
      <DemoBanner />

      {/* Navegación principal */}
      <Navigation />

      {/* Contenido principal */}
      <main className='p-4 lg:p-8 transition-all duration-300'>
        <div className='max-w-7xl mx-auto'>
          <Outlet />
        </div>
      </main>

      {/* Toaster para notificaciones */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
