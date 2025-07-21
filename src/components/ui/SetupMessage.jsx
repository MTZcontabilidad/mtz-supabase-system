import { AlertCircle, Database, CheckCircle } from 'lucide-react';

const SetupMessage = ({ isSetupComplete = false }) => {
  if (isSetupComplete) {
    return (
      <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
        <div className='flex items-center'>
          <CheckCircle className='h-5 w-5 text-green-600 mr-2' />
          <h3 className='text-sm font-medium text-green-800'>
            Sistema configurado correctamente
          </h3>
        </div>
        <p className='text-sm text-green-700 mt-1'>
          Todas las tablas de Supabase están creadas y funcionando.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
      <div className='flex items-start'>
        <Database className='h-5 w-5 text-blue-600 mr-2 mt-0.5' />
        <div className='flex-1'>
          <h3 className='text-sm font-medium text-blue-800'>
            Configuración de Base de Datos Pendiente
          </h3>
          <p className='text-sm text-blue-700 mt-1 mb-3'>
            Para que el sistema funcione completamente, necesitas crear las
            tablas en Supabase.
          </p>

          <div className='bg-white border border-blue-200 rounded p-3'>
            <h4 className='text-xs font-semibold text-blue-800 mb-2'>
              Pasos para completar la configuración:
            </h4>
            <ol className='text-xs text-blue-700 space-y-1'>
              <li>
                1. Ve a{' '}
                <a
                  href='https://supabase.com/dashboard'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline'
                >
                  Supabase Dashboard
                </a>
              </li>
              <li>2. Selecciona tu proyecto MTZ</li>
              <li>3. Ve a SQL Editor</li>
              <li>
                4. Copia y pega el contenido de:{' '}
                <code className='bg-blue-100 px-1 rounded'>
                  database/06_deployment/SCRIPT_MAESTRO_COMPLETO.sql
                </code>
              </li>
              <li>5. Ejecuta el script</li>
              <li>6. Recarga esta página</li>
            </ol>
          </div>

          <div className='mt-3 text-xs text-blue-600'>
            <strong>Nota:</strong> El frontend está funcionando, pero las
            páginas no mostrarán datos hasta que se creen las tablas.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupMessage;
