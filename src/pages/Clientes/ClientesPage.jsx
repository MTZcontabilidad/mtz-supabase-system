import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      // Usar el script MCP para cargar clientes
      const { SupabaseMCP } = await import('../../../supabase-mcp-complete.js');
      const result = await SupabaseMCP.queryTable('clientes', 50);

      if (result.success) {
        setClientes(result.data || []);
      } else {
        console.error('Error cargando clientes:', result.error);
        setClientes([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Gestión de Clientes
            </h1>
            <button
              onClick={() => navigate('/dashboard')}
              className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-lg font-medium text-gray-900 mb-4'>
            Lista de Clientes ({clientes.length})
          </h2>

          {clientes.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No hay clientes registrados
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Nombre
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      RUC
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Email
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Teléfono
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {cliente.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {cliente.nombre}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {cliente.ruc}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {cliente.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {cliente.telefono}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            cliente.estado === 'activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {cliente.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ClientesPage;
