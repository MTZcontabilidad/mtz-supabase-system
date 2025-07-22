import React, { useState, useCallback, useEffect } from 'react';
import ClientesEjemplo from '../../components/ejemplo/ClientesEjemplo.jsx';

function EjemploPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            🚀 Sistema MTZ - Página de Ejemplo
          </h1>
          <p className='text-lg text-gray-600'>
            Esta página muestra cómo usar el servicio MTZ con React, Supabase y
            Vercel
          </p>
        </div>

        {/* Información del sistema */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>
            📋 Información del Sistema
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='bg-blue-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-blue-800'>🌐 GitHub</h3>
              <p className='text-blue-600 text-sm'>Código guardado</p>
            </div>
            <div className='bg-green-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-green-800'>🚀 Vercel</h3>
              <p className='text-green-600 text-sm'>Listo para publicar</p>
            </div>
            <div className='bg-purple-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-purple-800'>🗄️ Supabase</h3>
              <p className='text-purple-600 text-sm'>Base de datos conectada</p>
            </div>
            <div className='bg-orange-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-orange-800'>⚛️ React</h3>
              <p className='text-orange-600 text-sm'>
                Aplicación web funcionando
              </p>
            </div>
          </div>
        </div>

        {/* Componente de ejemplo */}
        <ClientesEjemplo />

        {/* Instrucciones */}
        <div className='bg-yellow-50 p-6 rounded-lg shadow-md mt-8'>
          <h2 className='text-2xl font-semibold mb-4'>📖 Cómo Funciona</h2>
          <div className='space-y-3 text-gray-700'>
            <p>
              <strong>1. React</strong> - Crea la interfaz web que ves
            </p>
            <p>
              <strong>2. Servicio MTZ</strong> - Conecta React con la base de
              datos
            </p>
            <p>
              <strong>3. Supabase</strong> - Guarda toda la información
            </p>
            <p>
              <strong>4. Vercel</strong> - Publica tu aplicación en internet
            </p>
            <p>
              <strong>5. GitHub</strong> - Guarda todo el código
            </p>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className='bg-indigo-50 p-6 rounded-lg shadow-md mt-8'>
          <h2 className='text-2xl font-semibold mb-4'>🎯 Próximos Pasos</h2>
          <div className='space-y-2 text-gray-700'>
            <p>
              ✅ <strong>Completado:</strong> Integración con Supabase
            </p>
            <p>
              ✅ <strong>Completado:</strong> Servicio MTZ funcionando
            </p>
            <p>
              ✅ <strong>Completado:</strong> Componente de ejemplo
            </p>
            <p>
              🔄 <strong>En progreso:</strong> Crear más componentes
            </p>
            <p>
              ⏳ <strong>Pendiente:</strong> Publicar en Vercel
            </p>
            <p>
              ⏳ <strong>Pendiente:</strong> Agregar más funcionalidades
            </p>
          </div>
        </div>
        {/* NOTA IMPORTANTE:
        // Esta página es solo de ejemplo y demostración.
        // Los datos pueden ser simulados o reales según el componente ClientesEjemplo.
        // No afecta la base de datos principal ni la operación del sistema.
        // Si tienes dudas, consulta a un programador o revisa la documentación interna. */}
      </div>
    </div>
  );
}

export default EjemploPage;
