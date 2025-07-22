import React, { useState, useEffect, useCallback } from 'react';
import { dataService } from '../../lib/dataService.js';
import { useToast } from '../../components/ui/Toast.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
import ExportData from '../../components/shared/ExportData.jsx';
import {
  Users,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Calendar,
  TrendingUp,
} from 'lucide-react';
const RRHHPage = () => {
  const { showToast } = useToast();
  const [empleados, setEmpleados] = useState([]);
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);
  const [showNominaForm, setShowNominaForm] = useState(false);
  const [editingNomina, setEditingNomina] = useState(null);
  const [activeTab, setActiveTab] = useState('empleados');
  const [estadisticas, setEstadisticas] = useState({
    total_empleados: 0,
    empleados_activos: 0,
    promedio_salario: 0,
    total_nominas: 0,
    nominas_este_mes: 0,
  });
  const [filters, setFilters] = useState({
    empleados: { search: '', departamento: '', estado: '' },
    nominas: { mes: '', año: '', empleado: '' },
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    departamento: '',
    cargo: '',
    fecha_ingreso: '',
    salario_base: '',
    estado: 'activo',
  });

  const [nominaFormData, setNominaFormData] = useState({
    empleado_id: '',
    mes: '',
    año: '',
    dias_trabajados: '',
    salario_base: '',
    bonificaciones: '',
    descuentos: '',
    salario_neto: '',
  });

  const departamentos = [
    'Administración',
    'Ventas',
    'Compras',
    'Contabilidad',
    'Recursos Humanos',
    'Tecnología',
    'Operaciones',
    'Marketing',
  ];

  const cargos = [
    'Gerente',
    'Supervisor',
    'Analista',
    'Asistente',
    'Coordinador',
    'Especialista',
    'Director',
    'Ejecutivo',
  ];

  const estados = ['activo', 'inactivo', 'vacaciones', 'licencia'];

  const loadEmpleados = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dataService.getRRHHData();
      setEmpleados(data);
    } catch (error) {
      showToast('Error al cargar empleados: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters.empleados, showToast]);

  const loadNominas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dataService.getNominasData();
      setNominas(data);
    } catch (error) {
      showToast('Error al cargar nóminas: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters.nominas, showToast]);

  const loadEstadisticas = useCallback(async () => {
    try {
      const stats = await dataService.getEstadisticasRRHH();
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  useEffect(() => {
    loadEstadisticas();
  }, [loadEstadisticas]);

  useEffect(() => {
    if (activeTab === 'empleados') {
      loadEmpleados();
    } else {
      loadNominas();
    }
  }, [activeTab, loadEmpleados, loadNominas]);

  const handleSaveEmpleado = async () => {
    try {
      setSaving(true);

      if (editingEmpleado) {
        await dataService.actualizarEmpleado(editingEmpleado.id, formData);
        showToast('Empleado actualizado exitosamente', 'success');
      } else {
        await dataService.crearEmpleado(formData);
        showToast('Empleado creado exitosamente', 'success');
      }

      setShowForm(false);
      setEditingEmpleado(null);
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        departamento: '',
        cargo: '',
        fecha_ingreso: '',
        salario_base: '',
        estado: 'activo',
      });
      loadEmpleados();
      loadEstadisticas();
    } catch (error) {
      showToast('Error al guardar empleado: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNomina = async () => {
    try {
      setSaving(true);

      if (editingNomina) {
        await dataService.actualizarNomina(editingNomina.id, nominaFormData);
        showToast('Nómina actualizada exitosamente', 'success');
      } else {
        await dataService.crearNomina(nominaFormData);
        showToast('Nómina creada exitosamente', 'success');
      }

      setShowNominaForm(false);
      setEditingNomina(null);
      setNominaFormData({
        empleado_id: '',
        mes: '',
        año: '',
        dias_trabajados: '',
        salario_base: '',
        bonificaciones: '',
        descuentos: '',
        salario_neto: '',
      });
      loadNominas();
      loadEstadisticas();
    } catch (error) {
      showToast('Error al guardar nómina: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmpleado = async id => {
    if (!window.confirm('¿Está seguro de eliminar este empleado?')) return;

    try {
      await dataService.eliminarEmpleado(id);
      showToast('Empleado eliminado exitosamente', 'success');
      loadEmpleados();
      loadEstadisticas();
    } catch (error) {
      showToast('Error al eliminar empleado: ' + error.message, 'error');
    }
  };

  const handleDeleteNomina = async id => {
    if (!window.confirm('¿Está seguro de eliminar esta nómina?')) return;

    try {
      await dataService.eliminarNomina(id);
      showToast('Nómina eliminada exitosamente', 'success');
      loadNominas();
      loadEstadisticas();
    } catch (error) {
      showToast('Error al eliminar nómina: ' + error.message, 'error');
    }
  };

  const handleEditEmpleado = empleado => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre || '',
      apellido: empleado.apellido || '',
      email: empleado.email || '',
      telefono: empleado.telefono || '',
      departamento: empleado.departamento || '',
      cargo: empleado.cargo || '',
      fecha_ingreso: empleado.fecha_ingreso || '',
      salario_base: empleado.salario_base?.toString() || '',
      estado: empleado.estado || 'activo',
    });
    setShowForm(true);
  };

  const handleEditNomina = nomina => {
    setEditingNomina(nomina);
    setNominaFormData({
      empleado_id: nomina.empleado_id || '',
      mes: nomina.mes?.toString() || '',
      año: nomina.año?.toString() || '',
      dias_trabajados: nomina.dias_trabajados?.toString() || '',
      salario_base: nomina.salario_base?.toString() || '',
      bonificaciones: nomina.bonificaciones?.toString() || '',
      descuentos: nomina.descuentos?.toString() || '',
      salario_neto: nomina.salario_neto?.toString() || '',
    });
    setShowNominaForm(true);
  };

  const calcularSalarioNeto = () => {
    const salarioBase = parseFloat(nominaFormData.salario_base) || 0;
    const bonificaciones = parseFloat(nominaFormData.bonificaciones) || 0;
    const descuentos = parseFloat(nominaFormData.descuentos) || 0;
    const salarioNeto = salarioBase + bonificaciones - descuentos;
    setNominaFormData(prev => ({
      ...prev,
      salario_neto: salarioNeto.toString(),
    }));
  };

  const empleadosColumns = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: item => `${item.nombre} ${item.apellido}`,
    },
    { key: 'email', label: 'Email' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'cargo', label: 'Cargo' },
    {
      key: 'salario_base',
      label: 'Salario Base',
      render: item => `$${item.salario_base?.toLocaleString()}`,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: item => (
        <Badge variant={item.estado === 'activo' ? 'success' : 'warning'}>
          {item.estado}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: item => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleEditEmpleado(item)}
          >
            <Edit className='w-4 h-4' />
          </Button>
          <Button
            size='sm'
            variant='destructive'
            onClick={() => handleDeleteEmpleado(item.id)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      ),
    },
  ];

  const nominasColumns = [
    {
      key: 'empleado',
      label: 'Empleado',
      render: item =>
        item.empleados
          ? `${item.empleados.nombre} ${item.empleados.apellido}`
          : 'N/A',
    },
    {
      key: 'periodo',
      label: 'Período',
      render: item => `${item.mes}/${item.año}`,
    },
    { key: 'dias_trabajados', label: 'Días Trabajados' },
    {
      key: 'salario_neto',
      label: 'Salario Neto',
      render: item => `$${item.salario_neto?.toLocaleString()}`,
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: item => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleEditNomina(item)}
          >
            <Edit className='w-4 h-4' />
          </Button>
          <Button
            size='sm'
            variant='destructive'
            onClick={() => handleDeleteNomina(item.id)}
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Gestión de RRHH</h1>
          <p className='text-gray-600'>Administración de empleados y nóminas</p>
        </div>
        <div className='flex gap-2'>
          <Button onClick={() => setActiveTab('empleados')}>
            <Users className='w-4 h-4 mr-2' />
            Empleados
          </Button>
          <Button onClick={() => setActiveTab('nominas')}>
            <FileText className='w-4 h-4 mr-2' />
            Nóminas
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
        <Card>
          <div className='flex items-center'>
            <Users className='w-8 h-8 text-blue-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Total Empleados
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {estadisticas.total_empleados}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <TrendingUp className='w-8 h-8 text-green-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Empleados Activos
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {estadisticas.empleados_activos}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <DollarSign className='w-8 h-8 text-yellow-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Promedio Salario
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                ${estadisticas.promedio_salario?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <FileText className='w-8 h-8 text-purple-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Total Nóminas</p>
              <p className='text-2xl font-bold text-gray-900'>
                ${estadisticas.total_nominas?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <Calendar className='w-8 h-8 text-red-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>
                Nóminas Este Mes
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {estadisticas.nominas_este_mes}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('empleados')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'empleados'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className='w-4 h-4 inline mr-2' />
            Empleados ({empleados.length})
          </button>
          <button
            onClick={() => setActiveTab('nominas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'nominas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className='w-4 h-4 inline mr-2' />
            Nóminas ({nominas.length})
          </button>
        </nav>
      </div>

      {/* Contenido de Empleados */}
      {activeTab === 'empleados' && (
        <div className='space-y-4'>
          {/* Filtros */}
          <Card>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Buscar
                </label>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <Input
                    placeholder='Buscar empleados...'
                    value={filters.empleados.search}
                    onChange={e =>
                      setFilters(prev => ({
                        ...prev,
                        empleados: {
                          ...prev.empleados,
                          search: e.target.value,
                        },
                      }))
                    }
                    className='pl-10'
                  />
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Departamento
                </label>
                <select
                  value={filters.empleados.departamento}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      empleados: {
                        ...prev.empleados,
                        departamento: e.target.value,
                      },
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los departamentos</option>
                  {departamentos.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Estado
                </label>
                <select
                  value={filters.empleados.estado}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      empleados: { ...prev.empleados, estado: e.target.value },
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los estados</option>
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Tabla de Empleados */}
          <Card>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Lista de Empleados
              </h3>
              <div className='flex gap-2'>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className='w-4 h-4 mr-2' />
                  Nuevo Empleado
                </Button>
                <ExportData data={empleados} filename='empleados' />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <DataTable
                data={empleados}
                columns={empleadosColumns}
                emptyMessage='No hay empleados registrados'
              />
            )}
          </Card>
        </div>
      )}

      {/* Contenido de Nóminas */}
      {activeTab === 'nominas' && (
        <div className='space-y-4'>
          {/* Filtros */}
          <Card>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mes
                </label>
                <select
                  value={filters.nominas.mes}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      nominas: { ...prev.nominas, mes: e.target.value },
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los meses</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                    <option key={mes} value={mes}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Año
                </label>
                <select
                  value={filters.nominas.año}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      nominas: { ...prev.nominas, año: e.target.value },
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los años</option>
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i
                  ).map(año => (
                    <option key={año} value={año}>
                      {año}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Empleado
                </label>
                <select
                  value={filters.nominas.empleado}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      nominas: { ...prev.nominas, empleado: e.target.value },
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los empleados</option>
                  {empleados.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre} {emp.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Tabla de Nóminas */}
          <Card>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Lista de Nóminas
              </h3>
              <div className='flex gap-2'>
                <Button onClick={() => setShowNominaForm(true)}>
                  <Plus className='w-4 h-4 mr-2' />
                  Nueva Nómina
                </Button>
                <ExportData data={nominas} filename='nominas' />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <DataTable
                data={nominas}
                columns={nominasColumns}
                emptyMessage='No hay nóminas registradas'
              />
            )}
          </Card>
        </div>
      )}

      {/* Modal de Empleado */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Nombre *
                </label>
                <Input
                  value={formData.nombre}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, nombre: e.target.value }))
                  }
                  placeholder='Nombre del empleado'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Apellido *
                </label>
                <Input
                  value={formData.apellido}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, apellido: e.target.value }))
                  }
                  placeholder='Apellido del empleado'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email *
                </label>
                <Input
                  type='email'
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  placeholder='email@empresa.com'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Teléfono
                </label>
                <Input
                  value={formData.telefono}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, telefono: e.target.value }))
                  }
                  placeholder='+56 9 1234 5678'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Departamento *
                </label>
                <select
                  value={formData.departamento}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      departamento: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Seleccionar departamento</option>
                  {departamentos.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cargo *
                </label>
                <select
                  value={formData.cargo}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, cargo: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Seleccionar cargo</option>
                  {cargos.map(cargo => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fecha de Ingreso
                </label>
                <Input
                  type='date'
                  value={formData.fecha_ingreso}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      fecha_ingreso: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Salario Base *
                </label>
                <Input
                  type='number'
                  value={formData.salario_base}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      salario_base: e.target.value,
                    }))
                  }
                  placeholder='500000'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, estado: e.target.value }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button variant='outline' onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEmpleado} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nómina */}
      {showNominaForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              {editingNomina ? 'Editar Nómina' : 'Nueva Nómina'}
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Empleado *
                </label>
                <select
                  value={nominaFormData.empleado_id}
                  onChange={e =>
                    setNominaFormData(prev => ({
                      ...prev,
                      empleado_id: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Seleccionar empleado</option>
                  {empleados.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre} {emp.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Mes *
                </label>
                <select
                  value={nominaFormData.mes}
                  onChange={e =>
                    setNominaFormData(prev => ({
                      ...prev,
                      mes: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Seleccionar mes</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                    <option key={mes} value={mes}>
                      {mes}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Año *
                </label>
                <select
                  value={nominaFormData.año}
                  onChange={e =>
                    setNominaFormData(prev => ({
                      ...prev,
                      año: e.target.value,
                    }))
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Seleccionar año</option>
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i
                  ).map(año => (
                    <option key={año} value={año}>
                      {año}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Días Trabajados *
                </label>
                <Input
                  type='number'
                  value={nominaFormData.dias_trabajados}
                  onChange={e =>
                    setNominaFormData(prev => ({
                      ...prev,
                      dias_trabajados: e.target.value,
                    }))
                  }
                  placeholder='22'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Salario Base *
                </label>
                <Input
                  type='number'
                  value={nominaFormData.salario_base}
                  onChange={e => {
                    setNominaFormData(prev => ({
                      ...prev,
                      salario_base: e.target.value,
                    }));
                    setTimeout(calcularSalarioNeto, 100);
                  }}
                  placeholder='500000'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Bonificaciones
                </label>
                <Input
                  type='number'
                  value={nominaFormData.bonificaciones}
                  onChange={e => {
                    setNominaFormData(prev => ({
                      ...prev,
                      bonificaciones: e.target.value,
                    }));
                    setTimeout(calcularSalarioNeto, 100);
                  }}
                  placeholder='0'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Descuentos
                </label>
                <Input
                  type='number'
                  value={nominaFormData.descuentos}
                  onChange={e => {
                    setNominaFormData(prev => ({
                      ...prev,
                      descuentos: e.target.value,
                    }));
                    setTimeout(calcularSalarioNeto, 100);
                  }}
                  placeholder='0'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Salario Neto
                </label>
                <Input
                  type='number'
                  value={nominaFormData.salario_neto}
                  onChange={e =>
                    setNominaFormData(prev => ({
                      ...prev,
                      salario_neto: e.target.value,
                    }))
                  }
                  placeholder='Calculado automáticamente'
                  readOnly
                />
              </div>
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button
                variant='outline'
                onClick={() => setShowNominaForm(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveNomina} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RRHHPage;
