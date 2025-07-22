import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useToast } from '../../components/ui/Toast.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import ExportData from '../../components/shared/ExportData.jsx';
import {  } from 'lucide-react';
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

const CobranzaPage = () => {
  const [cobranzas, setCobranzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    cliente: '',
    estado: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingCobranza, setEditingCobranza] = useState(null);
  const [formData, setFormData] = useState({
    fecha: '',
    cliente: '',
    descripcion: '',
    monto: '',
    fecha_vencimiento: '',
    estado: 'pendiente',
    metodo_pago: '',
    notas: '',
  });

  const { showToast } = useToast();

  // Cargar cobranzas
  const loadCobranzas = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando cobranzas...');

      const data = await supabase
        .from('ventas_cobranza')
        .select('*')
        .order('fecha', { ascending: false });

      if (data.error) throw data.error;
      setCobranzas(data.data || []);
      console.log('✅ Cobranzas cargadas:', data.data?.length || 0);
    } catch (error) {
      console.error('❌ Error cargando cobranzas:', error);
      showToast('Error al cargar cobranzas: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCobranzas();
  }, [loadCobranzas]);

  // Verificar vencimientos
  const verificarVencimientos = () => {
    const hoy = new Date();
    const vencidas = cobranzas.filter(cobranza => {
      const fechaVencimiento = new Date(cobranza.fecha_vencimiento);
      return fechaVencimiento < hoy && cobranza.estado === 'pendiente';
    });

    if (vencidas.length > 0) {
      showToast(`⚠️ ${vencidas.length} cobranza(s) vencida(s)`, 'warning');
    }
  };

  useEffect(() => {
    verificarVencimientos();
  }, [cobranzas]);

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Guardar cobranza
  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('🔄 Guardando cobranza...');

      const cobranzaData = {
        ...formData,
        monto: parseFloat(formData.monto),
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
      };

      if (editingCobranza) {
        // Actualizar
        const { error } = await supabase
          .from('ventas_cobranza')
          .update(cobranzaData)
          .eq('id', editingCobranza.id);

        if (error) throw error;
        showToast('Cobranza actualizada exitosamente', 'success');
        console.log('✅ Cobranza actualizada');
      } else {
        // Crear nueva
        const { error } = await supabase
          .from('ventas_cobranza')
          .insert([cobranzaData]);

        if (error) throw error;
        showToast('Cobranza creada exitosamente', 'success');
        console.log('✅ Cobranza creada');
      }

      setShowForm(false);
      setEditingCobranza(null);
      setFormData({
        fecha: '',
        cliente: '',
        descripcion: '',
        monto: '',
        fecha_vencimiento: '',
        estado: 'pendiente',
        metodo_pago: '',
        notas: '',
      });

      loadCobranzas();
    } catch (error) {
      console.error('❌ Error guardando cobranza:', error);
      showToast('Error al guardar cobranza: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Editar cobranza
  const handleEdit = cobranza => {
    setEditingCobranza(cobranza);
    setFormData({
      fecha: cobranza.fecha,
      cliente: cobranza.cliente,
      descripcion: cobranza.descripcion,
      monto: cobranza.monto.toString(),
      fecha_vencimiento: cobranza.fecha_vencimiento,
      estado: cobranza.estado,
      metodo_pago: cobranza.metodo_pago || '',
      notas: cobranza.notas || '',
    });
    setShowForm(true);
  };

  // Eliminar cobranza
  const handleDelete = async id => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar esta cobranza?')
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from('ventas_cobranza')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast('Cobranza eliminada exitosamente', 'success');
      loadCobranzas();
    } catch (error) {
      showToast('Error al eliminar cobranza: ' + error.message, 'error');
    }
  };

  // Cambiar estado de pago
  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('ventas_cobranza')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) throw error;

      showToast(`Estado cambiado a ${nuevoEstado}`, 'success');
      loadCobranzas();
    } catch (error) {
      showToast('Error al cambiar estado: ' + error.message, 'error');
    }
  };

  // Aplicar filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Columnas para la tabla
  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: value => new Date(value).toLocaleDateString(),
    },
    { key: 'cliente', label: 'Cliente' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'monto',
      label: 'Monto',
      render: value => `$${parseFloat(value).toLocaleString()}`,
    },
    {
      key: 'fecha_vencimiento',
      label: 'Vencimiento',
      render: value => {
        const fecha = new Date(value);
        const hoy = new Date();
        const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));

        return (
          <div>
            <div>{fecha.toLocaleDateString()}</div>
            {diasRestantes < 0 && (
              <Badge variant='error' size='sm'>
                Vencida
              </Badge>
            )}
            {diasRestantes >= 0 && diasRestantes <= 7 && (
              <Badge variant='warning' size='sm'>
                Próxima a vencer
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'estado',
      label: 'Estado',
      render: value => (
        <Badge
          variant={
            value === 'pagado'
              ? 'success'
              : value === 'pendiente'
                ? 'warning'
                : 'error'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_, cobranza) => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleEdit(cobranza)}
          >
            Editar
          </Button>
          {cobranza.estado === 'pendiente' && (
            <Button
              size='sm'
              variant='success'
              onClick={() => handleStatusChange(cobranza.id, 'pagado')}
            >
              Marcar Pagado
            </Button>
          )}
          <Button
            size='sm'
            variant='destructive'
            onClick={() => handleDelete(cobranza.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  // Datos para exportar
  const exportData = cobranzas.map(cobranza => ({
    Fecha: new Date(cobranza.fecha).toLocaleDateString(),
    Cliente: cobranza.cliente,
    Descripción: cobranza.descripcion,
    Monto: `$${parseFloat(cobranza.monto).toLocaleString()}`,
    'Fecha Vencimiento': new Date(
      cobranza.fecha_vencimiento
    ).toLocaleDateString(),
    Estado: cobranza.estado,
    'Método Pago': cobranza.metodo_pago || 'N/A',
    Notas: cobranza.notas || 'N/A',
  }));

  // Calcular métricas
  const totalCobranzas = cobranzas.length;
  const cobranzasPagadas = cobranzas.filter(c => c.estado === 'pagado').length;
  const cobranzasPendientes = cobranzas.filter(
    c => c.estado === 'pendiente'
  ).length;
  const cobranzasVencidas = cobranzas.filter(c => {
    const fechaVencimiento = new Date(c.fecha_vencimiento);
    return fechaVencimiento < new Date() && c.estado === 'pendiente';
  }).length;
  const montoTotal = cobranzas.reduce((sum, c) => sum + parseFloat(c.monto), 0);
  const montoPagado = cobranzas
    .filter(c => c.estado === 'pagado')
    .reduce((sum, c) => sum + parseFloat(c.monto), 0);
  const montoPendiente = montoTotal - montoPagado;

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Gestión de Cobranza
        </h1>
        <Button onClick={() => setShowForm(true)}>Nueva Cobranza</Button>
      </div>

      {/* Filtros */}
      <Card>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Input
            type='date'
            placeholder='Fecha desde'
            value={filters.fecha_desde}
            onChange={e => handleFilterChange('fecha_desde', e.target.value)}
          />
          <Input
            type='date'
            placeholder='Fecha hasta'
            value={filters.fecha_hasta}
            onChange={e => handleFilterChange('fecha_hasta', e.target.value)}
          />
          <Input
            placeholder='Buscar cliente'
            value={filters.cliente}
            onChange={e => handleFilterChange('cliente', e.target.value)}
          />
          <select
            className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={filters.estado}
            onChange={e => handleFilterChange('estado', e.target.value)}
          >
            <option value=''>Todos los estados</option>
            <option value='pendiente'>Pendiente</option>
            <option value='pagado'>Pagado</option>
            <option value='vencido'>Vencido</option>
          </select>
        </div>
      </Card>

      {/* Métricas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <div className='text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              ${montoTotal.toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Total Cobranzas</div>
          </div>
        </Card>
        <Card>
          <div className='text-center'>
            <div className='text-2xl font-bold text-green-600'>
              ${montoPagado.toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Pagado</div>
          </div>
        </Card>
        <Card>
          <div className='text-center'>
            <div className='text-2xl font-bold text-yellow-600'>
              ${montoPendiente.toLocaleString()}
            </div>
            <div className='text-sm text-gray-600'>Pendiente</div>
          </div>
        </Card>
        <Card>
          <div className='text-center'>
            <div className='text-2xl font-bold text-red-600'>
              {cobranzasVencidas}
            </div>
            <div className='text-sm text-gray-600'>Vencidas</div>
          </div>
        </Card>
      </div>

      {/* Tabla de datos */}
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Lista de Cobranzas</h2>
          <ExportData
            data={exportData}
            filename='cobranzas_export'
            buttonText='Exportar Cobranzas'
          />
        </div>
        <DataTable data={cobranzas} columns={columns} searchable pagination />
      </Card>

      {/* Modal de formulario */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>
              {editingCobranza ? 'Editar Cobranza' : 'Nueva Cobranza'}
            </h2>

            <div className='space-y-4'>
              <Input
                type='date'
                label='Fecha'
                value={formData.fecha}
                onChange={e => handleFormChange('fecha', e.target.value)}
              />

              <Input
                label='Cliente'
                value={formData.cliente}
                onChange={e => handleFormChange('cliente', e.target.value)}
                required
              />

              <Input
                label='Descripción'
                value={formData.descripcion}
                onChange={e => handleFormChange('descripcion', e.target.value)}
                required
              />

              <Input
                type='number'
                label='Monto'
                value={formData.monto}
                onChange={e => handleFormChange('monto', e.target.value)}
                required
              />

              <Input
                type='date'
                label='Fecha de Vencimiento'
                value={formData.fecha_vencimiento}
                onChange={e =>
                  handleFormChange('fecha_vencimiento', e.target.value)
                }
                required
              />

              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.estado}
                onChange={e => handleFormChange('estado', e.target.value)}
              >
                <option value='pendiente'>Pendiente</option>
                <option value='pagado'>Pagado</option>
                <option value='vencido'>Vencido</option>
              </select>

              <Input
                label='Método de Pago'
                value={formData.metodo_pago}
                onChange={e => handleFormChange('metodo_pago', e.target.value)}
                placeholder='Transferencia, efectivo, etc.'
              />

              <textarea
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Notas adicionales...'
                value={formData.notas}
                onChange={e => handleFormChange('notas', e.target.value)}
                rows={3}
              />
            </div>

            <div className='flex gap-2 mt-6'>
              <Button onClick={handleSave} disabled={saving} className='flex-1'>
                {saving ? <LoadingSpinner size='sm' /> : 'Guardar'}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setShowForm(false);
                  setEditingCobranza(null);
                  setFormData({
                    fecha: '',
                    cliente: '',
                    descripcion: '',
                    monto: '',
                    fecha_vencimiento: '',
                    estado: 'pendiente',
                    metodo_pago: '',
                    notas: '',
                  });
                }}
                className='flex-1'
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CobranzaPage;
