import React, { useState, useCallback, useEffect } from 'react';
// =====================================================================
// 🎭 BANNER DE MODO DEMO - SISTEMA MTZ v3.0
// =====================================================================

import { AlertTriangle, X } from 'lucide-react';
import useAuth from '@/hooks/useAuth.js';

/**
 * Banner que se muestra cuando la aplicación está en modo demo
 * Proporciona información clara sobre el estado demo
 *
 * @returns {JSX.Element|null} Banner de demo o null si no está en modo demo
 */
const DemoBanner = () => {
  const { isDemoMode, disableDemoMode } = useAuth();

  if (!isDemoMode) {
    return null;
  }

  const handleCloseDemo = () => {
    disableDemoMode();
  };

  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 shadow-lg'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <AlertTriangle className='h-5 w-5 text-yellow-200' />
          <div>
            <p className='font-medium'>🎭 Modo Demo Activo</p>
            <p className='text-sm text-blue-100'>
              Estás usando la aplicación en modo demostración. Los datos
              mostrados son de ejemplo.
            </p>
          </div>
        </div>

        <button
          onClick={handleCloseDemo}
          className='flex items-center space-x-2 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-sm'
          title='Salir del modo demo'
        >
          <span>Salir Demo</span>
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
