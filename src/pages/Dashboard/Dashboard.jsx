import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService.js';
import {
  Users,
  TrendingUp,
  DollarSign,
  Building,
  RefreshCw,
  Plus,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalVentas: 0,
    totalCobranzas: 0,
    totalEmpleados: 0,
    totalVentasMonto: 0,
    totalCobranzasMonto: 0,
    totalPagado: 0,
    totalPendiente: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const estadisticas = await dataService.getEstadisticasDashboard();
      setStats(estadisticas);
      toast.success('Estadísticas actualizadas');
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      setLoadingActivity(true);

      // Cargar ventas y cobranzas recientes
      const [ventas, cobranzas] = await Promise.allSettled([
        dataService.getVentas(),
        dataService.getCobranzas()
      ]);

      const ventasData = ventas.status === 'fulfilled' ? ventas.value.slice(0, 3) : [];
      const cobranzasData = cobranzas.status === 'fulfilled' ? cobranzas.value.slice(0, 3) : [];

      // Combinar y ordenar por fecha
      const allActivity = [
        ...ventasData.map(venta => ({
          ...venta,
          tipo: 'Venta',
          numero: venta.numero_factura,
          cliente: venta.cliente_nombre,
          monto: venta.monto_total,
          fecha: venta.fecha_emision || venta.created_at,
          estado: venta.estado
        })),
        ...cobranzasData.map(cobranza => ({
          ...cobranza,
          tipo: 'Cobranza',
          numero: cobranza.numero_factura,
          cliente: cobranza.cliente_nombre,
          monto: cobranza.monto_total,
          fecha: cobranza.fecha_emision || cobranza.created_at,
          estado: cobranza.estado
        }))
      ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);

      setRecentActivity(allActivity);
    } catch (error) {
      console.error('Error cargando actividad reciente:', error);
      toast.error('Error al cargar actividad reciente');
    } finally {
      setLoadingActivity(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pagada':
      case 'completada':
        return 'text-green-600 bg-green-100';
      case 'pendiente':
        return 'text-yellow-600 bg-yellow-100';
      case 'vencida':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const quickActions = [
    {
      title: 'Gestionar Clientes',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/clientes')
    },
    {
      title: 'Nueva Venta',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/ventas')
    },
    {
      title: 'Gestionar Cobranzas',
      icon: DollarSign,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/cobranza')
    },
    {
      title: 'Gestionar RRHH',
      icon: Building,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/rrhh')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Dashboard MTZ
            </h1>
            <p className="text-blue-100">
              Bienvenido al sistema de gestión empresarial
            </p>
          </div>
          <Button
            onClick={loadStats}
            disabled={loadingStats}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-blue-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingStats ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClientes}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVentas}</p>
                <p className="text-sm text-green-600 font-medium">
                  {formatCurrency(stats.totalVentasMonto)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cobranzas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCobranzas}</p>
                <p className="text-sm text-purple-600 font-medium">
                  {formatCurrency(stats.totalCobranzasMonto)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Empleados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmpleados}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Summary and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pagado</span>
                <span className="text-green-600 font-semibold">
                  {formatCurrency(stats.totalPagado)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pendiente</span>
                <span className="text-yellow-600 font-semibold">
                  {formatCurrency(stats.totalPendiente)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">Balance</span>
                  <span className={`font-semibold ${
                    stats.totalPagado > stats.totalPendiente ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(stats.totalPagado - stats.totalPendiente)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
              <Button
                onClick={loadRecentActivity}
                disabled={loadingActivity}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 ${loadingActivity ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <div className="space-y-3">
              {loadingActivity ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        {activity.tipo === 'Venta' ? (
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.tipo} {activity.numero}
                        </p>
                        <p className="text-xs text-gray-500">{activity.cliente}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(activity.monto)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.fecha)}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(activity.estado)}`}>
                        {activity.estado}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No hay actividad reciente
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  className={`${action.color} text-white transition-all duration-200 transform hover:scale-105`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {action.title}
                </Button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
