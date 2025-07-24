import React, { useState, useCallback, useEffect } from 'react';
import dataService from '../../services/dataService.js';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Receipt,
  CreditCard,
  Coins,
  Banknote,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import SimpleModal from '../../components/ui/SimpleModal';

// Funciones de utilidad
const formatCurrency = amount => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
};

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('es-CL');
};

const getStatusColor = status => {
  switch (status) {
    case 'Pagada':
      return 'success';
    case 'Pendiente':
      return 'warning';
    case 'Vencida':
      return 'danger';
    default:
      return 'info';
  }
};

const getStatusLabel = status => {
  switch (status) {
    case 'Pagada':
      return 'Pagada';
    case 'Pendiente':
      return 'Pendiente';
    case 'Vencida':
      return 'Vencida';
    default:
      return status;
  }
};

const CobranzaPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cobranzas, setCobranzas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterCliente, setFilterCliente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCobranza, setSelectedCobranza] = useState(null);

  // Cargar datos de cobranza
  const cargarCobranzas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando cobranzas desde Supabase...');

      const data = await dataService.getCobranzas();

      if (data && data.length > 0) {
        setCobranzas(data);
        console.log('✅ Cobranzas cargadas exitosamente:', data.length, 'registros');
      } else {
        console.log('⚠️ No se obtuvieron datos de cobranzas, usando datos mock');
        const mockData = dataService.getDatosMock().cobranzas;
        setCobranzas(mockData);
        console.log('✅ Datos mock de cobranzas cargados:', mockData.length, 'registros');
      }
    } catch (error) {
      console.error('Error cargando cobranzas:', error);
      setError('Error al cargar las cobranzas');
      // Usar datos mock como fallback
      const mockData = dataService.getDatosMock().cobranzas;
      setCobranzas(mockData);
      console.log('⚠️ Usando datos mock como fallback:', mockData.length, 'registros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCobranzas();
  }, [cargarCobranzas]);

  // Filtrar cobranzas
  const cobranzasFiltradas = cobranzas.filter(cobranza => {
    if (!cobranza) return false;

    const matchSearch =
      (cobranza.numero_factura || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (cobranza.cliente || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cobranza.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchEstado = !filterEstado || cobranza.estado === filterEstado;
    const matchCliente = !filterCliente || cobranza.cliente === filterCliente;

    return matchSearch && matchEstado && matchCliente;
  });

  // Calcular estadísticas
  const estadisticas = {
    total_cobranzas: cobranzas.length,
    total_monto: cobranzas.reduce((sum, c) => sum + (c?.monto_total || 0), 0),
    total_pagado: cobranzas.reduce((sum, c) => sum + (c?.monto_pagado || 0), 0),
    total_pendiente: cobranzas.reduce((sum, c) => sum + (c?.monto_pendiente || 0), 0),
    cobranzas_pendientes: cobranzas.filter(c => c?.estado === 'Pendiente').length,
    cobranzas_vencidas: cobranzas.filter(c => c?.estado === 'Vencida').length,
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Gestión de Cobranza
          </h1>
          <p className='text-gray-600'>
            Administra y gestiona todas las cobranzas del sistema
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button onClick={cargarCobranzas} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
          <Button
            onClick={() => {
              setSelectedCobranza(null);
              setShowModal(true);
            }}
          >
            <Plus className='h-4 w-4 mr-2' />
            Nueva Cobranza
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6'>
        <Card>
          <div className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <FileText className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>
                  Total Cobranzas
                </p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.total_cobranzas}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <TrendingUp className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Monto</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(estadisticas.total_monto)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <CheckCircle className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pagado</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(estadisticas.total_pagado)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-yellow-100 rounded-lg'>
                <Clock className='h-6 w-6 text-yellow-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pendiente</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(estadisticas.total_pendiente)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <AlertTriangle className='h-6 w-6 text-orange-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Pendientes</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.cobranzas_pendientes}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-4'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <TrendingDown className='h-6 w-6 text-red-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Vencidas</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {estadisticas.cobranzas_vencidas}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Buscar
              </label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Buscar por factura, cliente...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Estado
              </label>
              <select
                value={filterEstado}
                onChange={e => setFilterEstado(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Todos los estados</option>
                <option value='Pagada'>Pagada</option>
                <option value='Pendiente'>Pendiente</option>
                <option value='Vencida'>Vencida</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Cliente
              </label>
              <select
                value={filterCliente}
                onChange={e => setFilterCliente(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Todos los clientes</option>
                {Array.from(new Set(cobranzas.map(c => c.cliente))).map(
                  cliente => (
                    <option key={cliente} value={cliente}>
                      {cliente}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className='flex items-end'>
              <Button variant='outline' className='w-full'>
                <Filter className='h-4 w-4 mr-2' />
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabla de Cobranzas */}
      <Card>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Factura
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cliente
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Descripción
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Monto Total
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Pendiente
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Estado
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Vencimiento
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {cobranzasFiltradas.map(cobranza => (
                <tr key={cobranza.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {cobranza.numero_factura}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {cobranza.cliente}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                    {cobranza.descripcion}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(cobranza.monto_total)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {formatCurrency(cobranza.monto_pendiente)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Badge variant={getStatusColor(cobranza.estado)}>
                      {getStatusLabel(cobranza.estado)}
                    </Badge>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {formatDate(cobranza.fecha_vencimiento)}
                    {cobranza.dias_vencimiento > 0 && (
                      <span className='ml-2 text-orange-600'>
                        ({cobranza.dias_vencimiento} días)
                      </span>
                    )}
                    {cobranza.dias_vencimiento < 0 && (
                      <span className='ml-2 text-red-600'>
                        (Vencida {Math.abs(cobranza.dias_vencimiento)} días)
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() => {
                          setSelectedCobranza(cobranza);
                          setShowModal(true);
                        }}
                        className='text-blue-600 hover:text-blue-900'
                      >
                        <Eye className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCobranza(cobranza);
                          setShowModal(true);
                        }}
                        className='text-green-600 hover:text-green-900'
                      >
                        <Edit className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              '¿Estás seguro de eliminar esta cobranza?'
                            )
                          ) {
                            setCobranzas(prev =>
                              prev.filter(c => c.id !== cobranza.id)
                            );
                          }
                        }}
                        className='text-red-600 hover:text-red-900'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Cobranza */}
      <SimpleModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCobranza(null);
        }}
        title={selectedCobranza ? 'Editar Cobranza' : 'Nueva Cobranza'}
      >
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Número de Factura
              </label>
              <Input
                type='text'
                placeholder='F001-2024'
                defaultValue={selectedCobranza?.numero_factura || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Cliente
              </label>
              <Input
                type='text'
                placeholder='Nombre del cliente'
                defaultValue={selectedCobranza?.cliente || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Monto Total
              </label>
              <Input
                type='number'
                placeholder='0'
                defaultValue={selectedCobranza?.monto_total || ''}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Estado
              </label>
              <select
                defaultValue={selectedCobranza?.estado || 'Pendiente'}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='Pendiente'>Pendiente</option>
                <option value='Pagada'>Pagada</option>
                <option value='Vencida'>Vencida</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder='Descripción de la cobranza'
              defaultValue={selectedCobranza?.descripcion || ''}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              variant='outline'
              onClick={() => {
                setShowModal(false);
                setSelectedCobranza(null);
              }}
            >
              Cancelar
            </Button>
            <Button>
              {selectedCobranza ? 'Actualizar' : 'Crear'} Cobranza
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
};

export default CobranzaPage;
