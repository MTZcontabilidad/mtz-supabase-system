import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Input from '@/components/ui/Input.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog.jsx';
import { supabase } from '@/lib/supabase.js';
import { formatCurrency, formatRUT } from '@/utils/helpers.js';

/**
 * CobranzaPage Component
 * Panel simple de cobranza para gestionar pagos pendientes
 */
const CobranzaPage = () => {
  const [cobranzas, setCobranzas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [nuevaCobranza, setNuevaCobranza] = useState({
    cliente_id: '',
    monto: '',
    fecha_vencimiento: '',
    descripcion: '',
    estado: 'Pendiente',
  });

  // Estados de cobranza
  const ESTADOS_COBRANZA = ['Pendiente', 'Pagado', 'Vencido', 'Cancelado'];

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos de cobranza...');

      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes_contables')
        .select('*')
        .order('razon_social');

      if (clientesError) throw clientesError;
      setClientes(clientesData || []);

      // Cargar cobranzas (si existe la tabla)
      try {
        const { data: cobranzasData, error: cobranzasError } = await supabase
          .from('cobranzas')
          .select('*')
          .order('fecha_vencimiento', { ascending: true });

        if (cobranzasError && cobranzasError.code !== 'PGRST116') {
          throw cobranzasError;
        }

        setCobranzas(cobranzasData || []);
      } catch (error) {
        // Si la tabla no existe, crear datos de ejemplo
        console.log(
          '📝 Tabla cobranzas no existe, creando datos de ejemplo...'
        );
        const cobranzasEjemplo = crearCobranzasEjemplo(clientesData || []);
        setCobranzas(cobranzasEjemplo);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear cobranzas de ejemplo basadas en clientes
  const crearCobranzasEjemplo = clientes => {
    const cobranzas = [];
    const estados = ['Pendiente', 'Pagado', 'Vencido'];
    const descripciones = [
      'Servicios de contabilidad mensual',
      'Declaración de IVA',
      'Servicios de auditoría',
      'Asesoría tributaria',
      'Declaración de renta',
    ];

    clientes.forEach((cliente, index) => {
      const monto = Math.floor(
        parseFloat(cliente.total_facturado || 1000000) * 0.1
      );
      const fechaVencimiento = new Date();
      fechaVencimiento.setDate(fechaVencimiento.getDate() + index * 7);

      cobranzas.push({
        id: `COB${String(index + 1).padStart(3, '0')}`,
        cliente_id: cliente.id_cliente,
        cliente_nombre: cliente.razon_social,
        monto: monto,
        fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
        descripcion: descripciones[index % descripciones.length],
        estado: estados[index % estados.length],
        fecha_creacion: new Date().toISOString().split('T')[0],
      });
    });

    return cobranzas;
  };

  // Cargar datos al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar cobranzas
  const cobranzasFiltradas = cobranzas.filter(cobranza => {
    const matchSearch =
      cobranza.cliente_nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      cobranza.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === 'todos' || cobranza.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calcular estadísticas
  const estadisticas = {
    total: cobranzas.length,
    pendientes: cobranzas.filter(c => c.estado === 'Pendiente').length,
    pagadas: cobranzas.filter(c => c.estado === 'Pagado').length,
    vencidas: cobranzas.filter(c => c.estado === 'Vencido').length,
    montoTotal: cobranzas.reduce((sum, c) => sum + parseFloat(c.monto || 0), 0),
    montoPendiente: cobranzas
      .filter(c => c.estado === 'Pendiente')
      .reduce((sum, c) => sum + parseFloat(c.monto || 0), 0),
  };

  // Crear nueva cobranza
  const handleCrearCobranza = async () => {
    try {
      const cliente = clientes.find(
        c => c.id_cliente === nuevaCobranza.cliente_id
      );
      if (!cliente) return;

      const cobranza = {
        id: `COB${String(cobranzas.length + 1).padStart(3, '0')}`,
        cliente_id: nuevaCobranza.cliente_id,
        cliente_nombre: cliente.razon_social,
        monto: parseFloat(nuevaCobranza.monto),
        fecha_vencimiento: nuevaCobranza.fecha_vencimiento,
        descripcion: nuevaCobranza.descripcion,
        estado: nuevaCobranza.estado,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };

      // Intentar insertar en Supabase
      try {
        const { error } = await supabase.from('cobranzas').insert(cobranza);

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
      } catch (error) {
        console.log(
          '📝 Tabla cobranzas no existe, guardando en estado local...'
        );
      }

      setCobranzas([...cobranzas, cobranza]);
      setShowForm(false);
      setNuevaCobranza({
        cliente_id: '',
        monto: '',
        fecha_vencimiento: '',
        descripcion: '',
        estado: 'Pendiente',
      });
    } catch (error) {
      console.error('❌ Error creando cobranza:', error);
    }
  };

  // Cambiar estado de cobranza
  const cambiarEstado = (cobranzaId, nuevoEstado) => {
    setCobranzas(
      cobranzas.map(c =>
        c.id === cobranzaId ? { ...c, estado: nuevoEstado } : c
      )
    );
  };

  // Obtener color del estado
  const getEstadoColor = estado => {
    switch (estado) {
      case 'Pendiente':
        return 'yellow';
      case 'Pagado':
        return 'green';
      case 'Vencido':
        return 'red';
      case 'Cancelado':
        return 'gray';
      default:
        return 'blue';
    }
  };

  // Obtener icono del estado
  const getEstadoIcon = estado => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className='h-4 w-4' />;
      case 'Pagado':
        return <CheckCircle className='h-4 w-4' />;
      case 'Vencido':
        return <AlertTriangle className='h-4 w-4' />;
      case 'Cancelado':
        return <AlertTriangle className='h-4 w-4' />;
      default:
        return <Clock className='h-4 w-4' />;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Panel de Cobranza
          </h1>
          <p className='text-gray-600'>
            Gestión simple de pagos pendientes y vencidos
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          <Button onClick={cargarDatos} disabled={loading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Nueva Cobranza
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-blue-600'>
              {estadisticas.total}
            </p>
            <p className='text-sm text-gray-600'>Total Cobranzas</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-yellow-600'>
              {estadisticas.pendientes}
            </p>
            <p className='text-sm text-gray-600'>Pendientes</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-red-600'>
              {estadisticas.vencidas}
            </p>
            <p className='text-sm text-gray-600'>Vencidas</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600'>
              {formatCurrency(estadisticas.montoPendiente)}
            </p>
            <p className='text-sm text-gray-600'>Monto Pendiente</p>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card className='p-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Buscar por cliente o descripción...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='flex gap-2'>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='todos'>Todos los estados</option>
              {ESTADOS_COBRANZA.map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de cobranzas */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>
          Cobranzas ({cobranzasFiltradas.length})
        </h3>

        {loading ? (
          <div className='text-center py-8'>
            <RefreshCw className='h-8 w-8 mx-auto animate-spin text-blue-500' />
            <p className='mt-2 text-gray-600'>Cargando cobranzas...</p>
          </div>
        ) : cobranzasFiltradas.length === 0 ? (
          <div className='text-center py-8'>
            <DollarSign className='h-12 w-12 mx-auto text-gray-400' />
            <p className='mt-2 text-gray-600'>No hay cobranzas para mostrar</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {cobranzasFiltradas.map(cobranza => (
              <div
                key={cobranza.id}
                className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-900'>
                        {cobranza.cliente_nombre}
                      </h4>
                      <Badge variant={getEstadoColor(cobranza.estado)}>
                        {getEstadoIcon(cobranza.estado)}
                        <span className='ml-1'>{cobranza.estado}</span>
                      </Badge>
                    </div>
                    <p className='text-gray-600 text-sm mb-1'>
                      {cobranza.descripcion}
                    </p>
                    <p className='text-gray-500 text-xs'>
                      Vence: {cobranza.fecha_vencimiento}
                    </p>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='text-right'>
                      <p className='font-semibold text-lg'>
                        {formatCurrency(cobranza.monto)}
                      </p>
                      <p className='text-gray-500 text-xs'>ID: {cobranza.id}</p>
                    </div>

                    {cobranza.estado === 'Pendiente' && (
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          onClick={() => cambiarEstado(cobranza.id, 'Pagado')}
                          className='bg-green-600 hover:bg-green-700'
                        >
                          Pagado
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => cambiarEstado(cobranza.id, 'Vencido')}
                          className='text-red-600 border-red-600 hover:bg-red-50'
                        >
                          Vencido
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Nueva Cobranza */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Nueva Cobranza</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Cliente
              </label>
              <select
                value={nuevaCobranza.cliente_id}
                onChange={e =>
                  setNuevaCobranza({
                    ...nuevaCobranza,
                    cliente_id: e.target.value,
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.razon_social}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Monto
              </label>
              <Input
                type='number'
                placeholder='0'
                value={nuevaCobranza.monto}
                onChange={e =>
                  setNuevaCobranza({ ...nuevaCobranza, monto: e.target.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha de Vencimiento
              </label>
              <Input
                type='date'
                value={nuevaCobranza.fecha_vencimiento}
                onChange={e =>
                  setNuevaCobranza({
                    ...nuevaCobranza,
                    fecha_vencimiento: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <Input
                placeholder='Descripción del servicio'
                value={nuevaCobranza.descripcion}
                onChange={e =>
                  setNuevaCobranza({
                    ...nuevaCobranza,
                    descripcion: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearCobranza}>Crear Cobranza</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CobranzaPage;
