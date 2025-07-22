import React, { useState, useEffect } from 'react';
import { dataService } from '@/lib/dataService.js';

// Componente de ejemplo que muestra cómo usar el servicio MTZ en React
function ClientesEjemplo() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    email: '',
  });

  // Función para cargar clientes
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await dataService.getClientesData();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar clientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo cliente
  const agregarCliente = async e => {
    e.preventDefault();
    try {
      const clienteCompleto = {
        ...nuevoCliente,
        empresa_id: '8b4d1eb6-6408-4324-929d-4e2cbc12e946', // ID de MTZ Solutions
        activo: true,
      };

      await dataService.crearCliente(clienteCompleto);

      // Limpiar formulario
      setNuevoCliente({ nombre: '', email: '' });

      // Recargar clientes
      await cargarClientes();

      alert('Cliente agregado exitosamente!');
    } catch (err) {
      setError('Error al agregar cliente: ' + err.message);
    }
  };

  // Función para eliminar un cliente
  const eliminarCliente = async id => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await dataService.eliminarCliente(id);
        await cargarClientes();
        alert('Cliente eliminado exitosamente!');
      } catch (err) {
        setError('Error al eliminar cliente: ' + err.message);
      }
    }
  };

  // Cargar clientes cuando el componente se monta
  useEffect(() => {
    cargarClientes();
  }, []);

  if (loading) {
    return (
      <div className='p-4'>
        <h2 className='text-2xl font-bold mb-4'>Cargando clientes...</h2>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>
        🎯 Ejemplo de Uso del Servicio MTZ en React
      </h1>

      {/* Mostrar error si existe */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Formulario para agregar cliente */}
      <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
        <h2 className='text-xl font-semibold mb-4'>➕ Agregar Nuevo Cliente</h2>
        <form onSubmit={agregarCliente} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Nombre:
            </label>
            <input
              type='text'
              value={nuevoCliente.nombre}
              onChange={e =>
                setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Nombre del cliente'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email:
            </label>
            <input
              type='email'
              value={nuevoCliente.email}
              onChange={e =>
                setNuevoCliente({ ...nuevoCliente, email: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='email@ejemplo.com'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors'
          >
            Agregar Cliente
          </button>
        </form>
      </div>

      {/* Lista de clientes */}
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>👥 Lista de Clientes</h2>
          <button
            onClick={cargarClientes}
            className='bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors text-sm'
          >
            🔄 Actualizar
          </button>
        </div>

        {clientes.length === 0 ? (
          <p className='text-gray-500 text-center py-4'>
            No hay clientes registrados
          </p>
        ) : (
          <div className='space-y-3'>
            {clientes.map(cliente => (
              <div
                key={cliente.id}
                className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='font-semibold text-lg'>{cliente.nombre}</h3>
                    <p className='text-gray-600'>{cliente.email}</p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        cliente.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cliente.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <button
                    onClick={() => eliminarCliente(cliente.id)}
                    className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm'
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información del sistema */}
      <div className='mt-6 bg-blue-50 p-4 rounded-lg'>
        <h3 className='font-semibold text-blue-800 mb-2'>
          ℹ️ Información del Sistema:
        </h3>
        <ul className='text-blue-700 text-sm space-y-1'>
          <li>• Total de clientes: {clientes.length}</li>
          <li>• Clientes activos: {clientes.filter(c => c.activo).length}</li>
          <li>• Conexión con Supabase: ✅ Funcionando</li>
          <li>• Servicio MTZ: ✅ Integrado</li>
        </ul>
      </div>
    </div>
  );
}

export default ClientesEjemplo;
