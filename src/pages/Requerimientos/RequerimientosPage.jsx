import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
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

/**
 * RequerimientosPage Component
 * Panel simple para gestionar requerimientos de clientes
 */
const RequerimientosPage = () => {
  const [requerimientos, setRequerimientos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [nuevoRequerimiento, setNuevoRequerimiento] = useState({
    cliente_id: '',
    titulo: '',
    descripcion: '',
    prioridad: 'Media',
    estado: 'Pendiente',
    fecha_limite: '',
  });

  // Estados y prioridades
  const ESTADOS_REQUERIMIENTO = [
    'Pendiente',
    'En Proceso',
    'Completado',
    'Cancelado',
  ];
  const PRIORIDADES = ['Baja', 'Media', 'Alta', 'Urgente'];

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos de requerimientos...');

      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes_contables')
        .select('*')
        .order('razon_social');

      if (clientesError) throw clientesError;
      setClientes(clientesData || []);

      // Cargar requerimientos (si existe la tabla)
      try {
        const { data: requerimientosData, error: requerimientosError } =
          await supabase
            .from('requerimientos')
            .select('*')
            .order('fecha_creacion', { ascending: false });

        if (requerimientosError && requerimientosError.code !== 'PGRST116') {
          throw requerimientosError;
        }

        setRequerimientos(requerimientosData || []);
      } catch (error) {
        // Si la tabla no existe, crear datos de ejemplo
        console.log(
          '📝 Tabla requerimientos no existe, creando datos de ejemplo...'
        );
        const requerimientosEjemplo = crearRequerimientosEjemplo(
          clientesData || []
        );
        setRequerimientos(requerimientosEjemplo);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear requerimientos de ejemplo
  const crearRequerimientosEjemplo = clientes => {
    const requerimientos = [];
    const titulos = [
      'Declaración de IVA pendiente',
      'Certificado de retención',
      'Asesoría para cambio de giro',
      'Declaración de renta anual',
      'Certificado de cumplimiento tributario',
      'Asesoría para facturación electrónica',
      'Declaración de F29',
      'Certificado de no retención',
    ];
    const descripciones = [
      'Necesita declaración de IVA del mes anterior',
      'Solicita certificado de retención para licitación',
      'Requiere asesoría para cambio de giro comercial',
      'Declaración de renta anual 2024',
      'Certificado de cumplimiento tributario para banco',
      'Asesoría para implementar facturación electrónica',
      'Declaración F29 pendiente de envío',
      'Certificado de no retención para contratos',
    ];
    const estados = ['Pendiente', 'En Proceso', 'Completado'];
    const prioridades = ['Baja', 'Media', 'Alta', 'Urgente'];

    clientes.forEach((cliente, index) => {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() + index * 3);

      requerimientos.push({
        id: `REQ${String(index + 1).padStart(3, '0')}`,
        cliente_id: cliente.id_cliente,
        cliente_nombre: cliente.razon_social,
        titulo: titulos[index % titulos.length],
        descripcion: descripciones[index % descripciones.length],
        prioridad: prioridades[index % prioridades.length],
        estado: estados[index % estados.length],
        fecha_limite: fechaLimite.toISOString().split('T')[0],
        fecha_creacion: new Date().toISOString().split('T')[0],
        notas: index % 3 === 0 ? 'Requiere documentación adicional' : '',
      });
    });

    return requerimientos;
  };

  // Cargar datos al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrar requerimientos
  const requerimientosFiltrados = requerimientos.filter(req => {
    const matchSearch =
      req.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || req.estado === filterStatus;
    return matchSearch && matchStatus;
  });

  // Calcular estadísticas
  const estadisticas = {
    total: requerimientos.length,
    pendientes: requerimientos.filter(r => r.estado === 'Pendiente').length,
    enProceso: requerimientos.filter(r => r.estado === 'En Proceso').length,
    completados: requerimientos.filter(r => r.estado === 'Completado').length,
    urgentes: requerimientos.filter(r => r.prioridad === 'Urgente').length,
  };

  // Crear nuevo requerimiento
  const handleCrearRequerimiento = async () => {
    try {
      const cliente = clientes.find(
        c => c.id_cliente === nuevoRequerimiento.cliente_id
      );
      if (!cliente) return;

      const requerimiento = {
        id: `REQ${String(requerimientos.length + 1).padStart(3, '0')}`,
        cliente_id: nuevoRequerimiento.cliente_id,
        cliente_nombre: cliente.razon_social,
        titulo: nuevoRequerimiento.titulo,
        descripcion: nuevoRequerimiento.descripcion,
        prioridad: nuevoRequerimiento.prioridad,
        estado: nuevoRequerimiento.estado,
        fecha_limite: nuevoRequerimiento.fecha_limite,
        fecha_creacion: new Date().toISOString().split('T')[0],
        notas: '',
      };

      // Intentar insertar en Supabase
      try {
        const { error } = await supabase
          .from('requerimientos')
          .insert(requerimiento);

        if (error && error.code !== 'PGRST116') {
          throw error;
        }
      } catch (error) {
        console.log(
          '📝 Tabla requerimientos no existe, guardando en estado local...'
        );
      }

      setRequerimientos([requerimiento, ...requerimientos]);
      setShowForm(false);
      setNuevoRequerimiento({
        cliente_id: '',
        titulo: '',
        descripcion: '',
        prioridad: 'Media',
        estado: 'Pendiente',
        fecha_limite: '',
      });
    } catch (error) {
      console.error('❌ Error creando requerimiento:', error);
    }
  };

  // Cambiar estado de requerimiento
  const cambiarEstado = (requerimientoId, nuevoEstado) => {
    setRequerimientos(
      requerimientos.map(r =>
        r.id === requerimientoId ? { ...r, estado: nuevoEstado } : r
      )
    );
  };

  // Obtener color del estado
  const getEstadoColor = estado => {
    switch (estado) {
      case 'Pendiente':
        return 'yellow';
      case 'En Proceso':
        return 'blue';
      case 'Completado':
        return 'green';
      case 'Cancelado':
        return 'gray';
      default:
        return 'blue';
    }
  };

  // Obtener color de prioridad
  const getPrioridadColor = prioridad => {
    switch (prioridad) {
      case 'Baja':
        return 'gray';
      case 'Media':
        return 'blue';
      case 'Alta':
        return 'orange';
      case 'Urgente':
        return 'red';
      default:
        return 'blue';
    }
  };

  // Obtener icono del estado
  const getEstadoIcon = estado => {
    switch (estado) {
      case 'Pendiente':
        return <Clock className='h-4 w-4' />;
      case 'En Proceso':
        return <AlertTriangle className='h-4 w-4' />;
      case 'Completado':
        return <CheckCircle className='h-4 w-4' />;
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
            Panel de Requerimientos
          </h1>
          <p className='text-gray-600'>
            Gestión simple de requerimientos y solicitudes de clientes
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
            Nuevo Requerimiento
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-blue-600'>
              {estadisticas.total}
            </p>
            <p className='text-sm text-gray-600'>Total</p>
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
            <p className='text-2xl font-bold text-blue-600'>
              {estadisticas.enProceso}
            </p>
            <p className='text-sm text-gray-600'>En Proceso</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-green-600'>
              {estadisticas.completados}
            </p>
            <p className='text-sm text-gray-600'>Completados</p>
          </div>
        </Card>
        <Card className='p-4'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-red-600'>
              {estadisticas.urgentes}
            </p>
            <p className='text-sm text-gray-600'>Urgentes</p>
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
                placeholder='Buscar por cliente, título o descripción...'
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
              {ESTADOS_REQUERIMIENTO.map(estado => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de requerimientos */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>
          Requerimientos ({requerimientosFiltrados.length})
        </h3>

        {loading ? (
          <div className='text-center py-8'>
            <RefreshCw className='h-8 w-8 mx-auto animate-spin text-blue-500' />
            <p className='mt-2 text-gray-600'>Cargando requerimientos...</p>
          </div>
        ) : requerimientosFiltrados.length === 0 ? (
          <div className='text-center py-8'>
            <ClipboardList className='h-12 w-12 mx-auto text-gray-400' />
            <p className='mt-2 text-gray-600'>
              No hay requerimientos para mostrar
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {requerimientosFiltrados.map(requerimiento => (
              <div
                key={requerimiento.id}
                className='border rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                      <h4 className='font-semibold text-gray-900'>
                        {requerimiento.titulo}
                      </h4>
                      <Badge variant={getEstadoColor(requerimiento.estado)}>
                        {getEstadoIcon(requerimiento.estado)}
                        <span className='ml-1'>{requerimiento.estado}</span>
                      </Badge>
                      <Badge
                        variant={getPrioridadColor(requerimiento.prioridad)}
                      >
                        {requerimiento.prioridad}
                      </Badge>
                    </div>

                    <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
                      <span className='flex items-center gap-1'>
                        <User className='h-3 w-3' />
                        {requerimiento.cliente_nombre}
                      </span>
                      {requerimiento.fecha_limite && (
                        <span className='flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          Vence: {requerimiento.fecha_limite}
                        </span>
                      )}
                    </div>

                    <p className='text-gray-700 text-sm mb-2'>
                      {requerimiento.descripcion}
                    </p>

                    {requerimiento.notas && (
                      <p className='text-gray-500 text-xs italic'>
                        Notas: {requerimiento.notas}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center gap-2'>
                    {requerimiento.estado === 'Pendiente' && (
                      <div className='flex gap-1'>
                        <Button
                          size='sm'
                          onClick={() =>
                            cambiarEstado(requerimiento.id, 'En Proceso')
                          }
                          className='bg-blue-600 hover:bg-blue-700'
                        >
                          En Proceso
                        </Button>
                        <Button
                          size='sm'
                          onClick={() =>
                            cambiarEstado(requerimiento.id, 'Completado')
                          }
                          className='bg-green-600 hover:bg-green-700'
                        >
                          Completado
                        </Button>
                      </div>
                    )}

                    {requerimiento.estado === 'En Proceso' && (
                      <Button
                        size='sm'
                        onClick={() =>
                          cambiarEstado(requerimiento.id, 'Completado')
                        }
                        className='bg-green-600 hover:bg-green-700'
                      >
                        Completado
                      </Button>
                    )}

                    <p className='text-gray-500 text-xs'>
                      ID: {requerimiento.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal Nuevo Requerimiento */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Nuevo Requerimiento</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Cliente
              </label>
              <select
                value={nuevoRequerimiento.cliente_id}
                onChange={e =>
                  setNuevoRequerimiento({
                    ...nuevoRequerimiento,
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
                Título
              </label>
              <Input
                placeholder='Título del requerimiento'
                value={nuevoRequerimiento.titulo}
                onChange={e =>
                  setNuevoRequerimiento({
                    ...nuevoRequerimiento,
                    titulo: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <textarea
                placeholder='Descripción detallada del requerimiento'
                value={nuevoRequerimiento.descripcion}
                onChange={e =>
                  setNuevoRequerimiento({
                    ...nuevoRequerimiento,
                    descripcion: e.target.value,
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={3}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Prioridad
                </label>
                <select
                  value={nuevoRequerimiento.prioridad}
                  onChange={e =>
                    setNuevoRequerimiento({
                      ...nuevoRequerimiento,
                      prioridad: e.target.value,
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  {PRIORIDADES.map(prioridad => (
                    <option key={prioridad} value={prioridad}>
                      {prioridad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fecha Límite
                </label>
                <Input
                  type='date'
                  value={nuevoRequerimiento.fecha_limite}
                  onChange={e =>
                    setNuevoRequerimiento({
                      ...nuevoRequerimiento,
                      fecha_limite: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearRequerimiento}>
              Crear Requerimiento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequerimientosPage;
