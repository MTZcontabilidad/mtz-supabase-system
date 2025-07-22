import React, { useState, useCallback, useEffect } from 'react';
import { dataService } from '@/lib/dataService.js';
import { useToast } from '../../components/ui/Toast.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import ExportData from '../../components/shared/ExportData.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const ContratosPanel = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    fecha_desde: '',
    fecha_hasta: '',
    cliente: '',
    estado: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingContrato, setEditingContrato] = useState(null);
  const [formData, setFormData] = useState({
    fecha_inicio: '',
    fecha_fin: '',
    cliente: '',
    descripcion: '',
    monto: '',
    estado: 'activo',
    tipo_contrato: '',
    notas: '',
  });

  const { showToast } = useToast();

  // Cargar contratos
  const loadContratos = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando contratos...');

      const data = await dataService.getContratosData();
      setContratos(data || []);
      console.log('✅ Contratos cargados:', data?.length || 0);
    } catch (error) {
      console.error('❌ Error cargando contratos:', error);
      showToast('Error al cargar contratos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadContratos();
  }, [loadContratos]);

  // Manejar cambios en el formulario
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Guardar contrato
  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('🔄 Guardando contrato...');

      const contratoData = {
        ...formData,
        monto: parseFloat(formData.monto),
        fecha_inicio:
          formData.fecha_inicio || new Date().toISOString().split('T')[0],
      };

      if (editingContrato) {
        // Actualizar
        await dataService.actualizarContrato(editingContrato.id, contratoData);
        showToast('Contrato actualizado exitosamente', 'success');
        console.log('✅ Contrato actualizado');
      } else {
        // Crear nuevo
        await dataService.crearContrato(contratoData);
        showToast('Contrato creado exitosamente', 'success');
        console.log('✅ Contrato creado');
      }

      setShowForm(false);
      setEditingContrato(null);
      setFormData({
        fecha_inicio: '',
        fecha_fin: '',
        cliente: '',
        descripcion: '',
        monto: '',
        estado: 'activo',
        tipo_contrato: '',
        notas: '',
      });

      loadContratos();
    } catch (error) {
      console.error('❌ Error guardando contrato:', error);
      showToast('Error al guardar contrato: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Editar contrato
  const handleEdit = contrato => {
    setEditingContrato(contrato);
    setFormData({
      fecha_inicio: contrato.fecha_inicio,
      fecha_fin: contrato.fecha_fin,
      cliente: contrato.cliente,
      descripcion: contrato.descripcion,
      monto: contrato.monto.toString(),
      estado: contrato.estado,
      tipo_contrato: contrato.tipo_contrato || '',
      notas: contrato.notas || '',
    });
    setShowForm(true);
  };

  // Eliminar contrato
  const handleDelete = async id => {
    if (
      !window.confirm('¿Estás seguro de que quieres eliminar este contrato?')
    ) {
      return;
    }

    try {
      await dataService.eliminarContrato(id);
      showToast('Contrato eliminado exitosamente', 'success');
      loadContratos();
    } catch (error) {
      console.error('❌ Error eliminando contrato:', error);
      showToast('Error al eliminar contrato: ' + error.message, 'error');
    }
  };

  // Aplicar filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Columnas para la tabla
  const columns = [
    {
      key: 'fecha_inicio',
      label: 'Fecha Inicio',
      render: value => new Date(value).toLocaleDateString('es-CL'),
    },
    {
      key: 'fecha_fin',
      label: 'Fecha Fin',
      render: value =>
        value ? new Date(value).toLocaleDateString('es-CL') : 'Sin fecha',
    },
    {
      key: 'cliente',
      label: 'Cliente',
    },
    {
      key: 'descripcion',
      label: 'Descripción',
    },
    {
      key: 'monto',
      label: 'Monto',
      render: value =>
        new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(value),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: value => (
        <Badge
          variant={
            value === 'activo'
              ? 'success'
              : value === 'vencido'
                ? 'danger'
                : 'warning'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'tipo_contrato',
      label: 'Tipo',
    },
  ];

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Gestión de Contratos
        </h1>
        <div className='flex gap-2'>
          <Button onClick={() => setShowForm(true)} variant='primary'>
            Nuevo Contrato
          </Button>
          <ExportData data={contratos} filename='contratos' />
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Input
            label='Fecha Desde'
            type='date'
            value={filters.fecha_desde}
            onChange={e => handleFilterChange('fecha_desde', e.target.value)}
          />
          <Input
            label='Fecha Hasta'
            type='date'
            value={filters.fecha_hasta}
            onChange={e => handleFilterChange('fecha_hasta', e.target.value)}
          />
          <Input
            label='Cliente'
            value={filters.cliente}
            onChange={e => handleFilterChange('cliente', e.target.value)}
            placeholder='Buscar por cliente...'
          />
          <select
            className='border border-gray-300 rounded-md px-3 py-2'
            value={filters.estado}
            onChange={e => handleFilterChange('estado', e.target.value)}
          >
            <option value=''>Todos los estados</option>
            <option value='activo'>Activo</option>
            <option value='vencido'>Vencido</option>
            <option value='pendiente'>Pendiente</option>
          </select>
        </div>
      </Card>

      {/* Tabla de contratos */}
      <Card>
        <DataTable
          data={contratos}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </Card>

      {/* Formulario */}
      {showForm && (
        <Card>
          <h2 className='text-xl font-semibold mb-4'>
            {editingContrato ? 'Editar Contrato' : 'Nuevo Contrato'}
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Fecha Inicio'
              type='date'
              value={formData.fecha_inicio}
              onChange={e => handleFormChange('fecha_inicio', e.target.value)}
              required
            />
            <Input
              label='Fecha Fin'
              type='date'
              value={formData.fecha_fin}
              onChange={e => handleFormChange('fecha_fin', e.target.value)}
            />
            <Input
              label='Cliente'
              value={formData.cliente}
              onChange={e => handleFormChange('cliente', e.target.value)}
              required
            />
            <Input
              label='Tipo de Contrato'
              value={formData.tipo_contrato}
              onChange={e => handleFormChange('tipo_contrato', e.target.value)}
            />
            <Input
              label='Monto'
              type='number'
              value={formData.monto}
              onChange={e => handleFormChange('monto', e.target.value)}
              required
            />
            <select
              className='border border-gray-300 rounded-md px-3 py-2'
              value={formData.estado}
              onChange={e => handleFormChange('estado', e.target.value)}
            >
              <option value='activo'>Activo</option>
              <option value='vencido'>Vencido</option>
              <option value='pendiente'>Pendiente</option>
            </select>
            <div className='md:col-span-2'>
              <Input
                label='Descripción'
                value={formData.descripcion}
                onChange={e => handleFormChange('descripcion', e.target.value)}
                required
              />
            </div>
            <div className='md:col-span-2'>
              <Input
                label='Notas'
                value={formData.notas}
                onChange={e => handleFormChange('notas', e.target.value)}
                multiline
                rows={3}
              />
            </div>
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <Button onClick={() => setShowForm(false)} variant='secondary'>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant='primary' disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ContratosPanel;
