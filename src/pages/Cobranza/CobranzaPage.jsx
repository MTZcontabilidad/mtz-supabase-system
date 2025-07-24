import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService.js';
import {
  DollarSign,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  FileText
} from 'lucide-react';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const CobranzaPage = () => {
  const [cobranzas, setCobranzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedCobranza, setSelectedCobranza] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    pagadas: 0,
    pendientes: 0,
    vencidas: 0,
    montoTotal: 0,
    montoPagado: 0,
    montoPendiente: 0
  });

  const cargarCobranzas = async () => {
    try {
      setLoading(true);
      const data = await dataService.getCobranzas();

      if (data && data.length > 0) {
        setCobranzas(data);
        calcularEstadisticas(data);
        console.log('✅ Cobranzas cargadas exitosamente:', data.length);
      } else {
        setCobranzas([]);
        setEstadisticas({
          total: 0,
          pagadas: 0,
          pendientes: 0,
          vencidas: 0,
          montoTotal: 0,
          montoPagado: 0,
          montoPendiente: 0
        });
        console.log('ℹ️ No hay cobranzas en la base de datos');
      }
    } catch (error) {
      console.error('❌ Error cargando cobranzas:', error);
      toast.error('Error al cargar las cobranzas');
      setCobranzas([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (data) => {
    const total = data.length;
    const pagadas = data.filter(c => c.estado?.toLowerCase() === 'pagada').length;
    const pendientes = data.filter(c => c.estado?.toLowerCase() === 'pendiente').length;
    const vencidas = data.filter(c => c.estado?.toLowerCase() === 'vencida').length;

    const montoTotal = data.reduce((sum, c) => sum + (c.monto_total || 0), 0);
    const montoPagado = data.reduce((sum, c) => sum + (c.monto_pagado || 0), 0);
    const montoPendiente = data.reduce((sum, c) => sum + (c.monto_pendiente || 0), 0);

    setEstadisticas({
      total,
      pagadas,
      pendientes,
      vencidas,
      montoTotal,
      montoPagado,
      montoPendiente
    });
  };

  useEffect(() => {
    cargarCobranzas();
  }, []);

  const cobranzasFiltradas = cobranzas.filter(cobranza => {
    if (!cobranza) return false;

    const matchesSearch =
      (cobranza.numero_factura || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cobranza.cliente_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cobranza.cliente_ruc || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'todos' ||
      (cobranza.estado || '').toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pagada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'vencida':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cobranza?')) {
      try {
        await dataService.eliminarCobranza(id);
        toast.success('Cobranza eliminada exitosamente');
        cargarCobranzas();
      } catch (error) {
        console.error('Error eliminando cobranza:', error);
        toast.error('Error al eliminar la cobranza');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Cobranzas</h1>
            <p className="text-purple-100">
              Administra y gestiona todas las cobranzas del sistema
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={cargarCobranzas}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button
              onClick={() => {
                setSelectedCobranza(null);
                setShowModal(true);
              }}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cobranza
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cobranzas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
                <p className="text-sm text-purple-600 font-medium">
                  {formatCurrency(estadisticas.montoTotal)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagadas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pagadas}</p>
                <p className="text-sm text-green-600 font-medium">
                  {formatCurrency(estadisticas.montoPagado)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.pendientes}</p>
                <p className="text-sm text-yellow-600 font-medium">
                  {formatCurrency(estadisticas.montoPendiente)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.vencidas}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar por factura, cliente o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="todos">Todos los estados</option>
                <option value="pagada">Pagadas</option>
                <option value="pendiente">Pendientes</option>
                <option value="vencida">Vencidas</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Cobranzas Table */}
      <Card>
        <div className="p-6">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando cobranzas...</p>
              </div>
            ) : cobranzasFiltradas.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Factura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cobranzasFiltradas.map((cobranza) => (
                    <tr key={cobranza.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {cobranza.numero_factura || 'Sin número'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {cobranza.cliente_nombre || 'Cliente no encontrado'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {cobranza.cliente_ruc || 'Sin RUC'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(cobranza.monto_total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Pagado: {formatCurrency(cobranza.monto_pagado)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cobranza.estado)}`}>
                          {cobranza.estado || 'Sin estado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {formatDate(cobranza.fecha_vencimiento)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCobranza(cobranza);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCobranza(cobranza);
                              setShowModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cobranza.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== 'todos'
                    ? 'No se encontraron cobranzas con los filtros aplicados'
                    : 'No hay cobranzas registradas'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Modal placeholder - You can implement the modal for creating/editing cobranzas */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedCobranza ? 'Editar Cobranza' : 'Nueva Cobranza'}
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad de formulario en desarrollo...
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                  toast.success('Funcionalidad en desarrollo');
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CobranzaPage;
