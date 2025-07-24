import React, { useState, useCallback, useEffect } from 'react';
import dataService from '../../services/dataService.js';

// Hook de Toast simplificado
const useToast = () => {
  const showToast = (message, type = 'info') => {
    console.log(`[${type.toUpperCase()}] ${message}`);
  };
  return { showToast };
};

import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import DataTable from '../../components/shared/DataTable.jsx';
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
  Download,
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
      console.log('🔄 Cargando empleados...');
      const data = await dataService.getEmpleados();
      setEmpleados(data || []);
      console.log('✅ Empleados cargados:', data?.length || 0);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      showToast('Error al cargar empleados', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNominas = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando nóminas...');
      const data = await dataService.getNominas();
      setNominas(data || []);
      console.log('✅ Nóminas cargadas:', data?.length || 0);
    } catch (error) {
      console.error('Error al cargar nóminas:', error);
      showToast('Error al cargar nóminas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEstadisticas = useCallback(async () => {
    try {
      console.log('🔄 Cargando estadísticas RRHH...');
      const stats = await dataService.getEstadisticasRRHH();
      setEstadisticas(
        stats || {
          total_empleados: 0,
          empleados_activos: 0,
          promedio_salario: 0,
          total_nominas: 0,
          nominas_este_mes: 0,
        }
      );
      console.log('✅ Estadísticas RRHH cargadas');
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  useEffect(() => {
    loadEmpleados();
    loadNominas();
    loadEstadisticas();
  }, [loadEmpleados, loadNominas, loadEstadisticas]);

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
    } catch (error) {
      console.error('Error guardando empleado:', error);
      showToast('Error al guardar empleado', 'error');
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
    } catch (error) {
      console.error('Error guardando nómina:', error);
      showToast('Error al guardar nómina', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmpleado = async id => {
    if (
      window.confirm('¿Estás seguro de que quieres eliminar este empleado?')
    ) {
      try {
        await dataService.eliminarEmpleado(id);
        showToast('Empleado eliminado exitosamente', 'success');
        loadEmpleados();
      } catch (error) {
        console.error('Error eliminando empleado:', error);
        showToast('Error al eliminar empleado', 'error');
      }
    }
  };

  const handleDeleteNomina = async id => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nómina?')) {
      try {
        await dataService.eliminarNomina(id);
        showToast('Nómina eliminada exitosamente', 'success');
        loadNominas();
      } catch (error) {
        console.error('Error eliminando nómina:', error);
        showToast('Error al eliminar nómina', 'error');
      }
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
      salario_base: empleado.salario_base || '',
      estado: empleado.estado || 'activo',
    });
    setShowForm(true);
  };

  const handleEditNomina = nomina => {
    setEditingNomina(nomina);
    setNominaFormData({
      empleado_id: nomina.empleado_id || '',
      mes: nomina.mes || '',
      año: nomina.año || '',
      dias_trabajados: nomina.dias_trabajados || '',
      salario_base: nomina.salario_base || '',
      bonificaciones: nomina.bonificaciones || '',
      descuentos: nomina.descuentos || '',
      salario_neto: nomina.salario_neto || '',
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
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      case 'vacaciones':
        return 'warning';
      case 'licencia':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const filteredEmpleados = empleados.filter(empleado => {
    const searchMatch =
      empleado.nombre
        ?.toLowerCase()
        .includes(filters.empleados.search.toLowerCase()) ||
      empleado.apellido
        ?.toLowerCase()
        .includes(filters.empleados.search.toLowerCase()) ||
      empleado.email
        ?.toLowerCase()
        .includes(filters.empleados.search.toLowerCase());
    const departamentoMatch =
      !filters.empleados.departamento ||
      empleado.departamento === filters.empleados.departamento;
    const estadoMatch =
      !filters.empleados.estado || empleado.estado === filters.empleados.estado;
    return searchMatch && departamentoMatch && estadoMatch;
  });

  const filteredNominas = nominas.filter(nomina => {
    const mesMatch =
      !filters.nominas.mes || nomina.mes === parseInt(filters.nominas.mes);
    const añoMatch =
      !filters.nominas.año || nomina.año === parseInt(filters.nominas.año);
    const empleadoMatch =
      !filters.nominas.empleado ||
      nomina.empleado_nombre?.includes(filters.nominas.empleado);
    return mesMatch && añoMatch && empleadoMatch;
  });

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-gradient-to-r from-orange-600 to-red-600 shadow-lg rounded-lg p-6 text-white'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Recursos Humanos</h1>
            <p className='text-orange-100'>Gestión de empleados y nóminas</p>
          </div>
          <div className='flex space-x-2'>
            <Button
              onClick={() => setActiveTab('empleados')}
              variant={activeTab === 'empleados' ? 'primary' : 'secondary'}
              className={activeTab === 'empleados' ? 'bg-white text-orange-600' : 'text-white border-white hover:bg-white hover:text-orange-600'}
            >
              <Users className='w-4 h-4 mr-2' />
              Empleados
            </Button>
            <Button
              onClick={() => setActiveTab('nominas')}
              variant={activeTab === 'nominas' ? 'primary' : 'secondary'}
              className={activeTab === 'nominas' ? 'bg-white text-orange-600' : 'text-white border-white hover:bg-white hover:text-orange-600'}
            >
              <FileText className='w-4 h-4 mr-2' />
              Nóminas
            </Button>
          </div>
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
              <p className='text-lg font-semibold text-gray-900'>
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
              <p className='text-lg font-semibold text-gray-900'>
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
              <p className='text-lg font-semibold text-gray-900'>
                {formatCurrency(estadisticas.promedio_salario)}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className='flex items-center'>
            <FileText className='w-8 h-8 text-purple-600' />
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-600'>Total Nóminas</p>
              <p className='text-lg font-semibold text-gray-900'>
                {estadisticas.total_nominas}
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
              <p className='text-lg font-semibold text-gray-900'>
                {estadisticas.nominas_este_mes}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenido de pestañas */}
      {activeTab === 'empleados' ? (
        <div className='space-y-4'>
          {/* Filtros */}
          <Card>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <Input
                placeholder='Buscar empleados...'
                value={filters.empleados.search}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    empleados: { ...prev.empleados, search: e.target.value },
                  }))
                }
                icon={<Search className='w-4 h-4' />}
              />
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              >
                <option value=''>Todos los departamentos</option>
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.empleados.estado}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    empleados: { ...prev.empleados, estado: e.target.value },
                  }))
                }
              >
                <option value=''>Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* Tabla de empleados */}
          <Card>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>
                Empleados ({filteredEmpleados.length})
              </h2>
              <Button onClick={() => setShowForm(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Nuevo Empleado
              </Button>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Empleado
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Departamento
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Cargo
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Salario
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Estado
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredEmpleados.map(empleado => (
                    <tr key={empleado.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {empleado.nombre} {empleado.apellido}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {empleado.email}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {empleado.departamento}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {empleado.cargo}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatCurrency(empleado.salario_base)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Badge variant={getStatusColor(empleado.estado)}>
                          {empleado.estado}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => handleEditEmpleado(empleado)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => handleDeleteEmpleado(empleado.id)}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Filtros de nóminas */}
          <Card>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.nominas.mes}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    nominas: { ...prev.nominas, mes: e.target.value },
                  }))
                }
              >
                <option value=''>Todos los meses</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.nominas.año}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    nominas: { ...prev.nominas, año: e.target.value },
                  }))
                }
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
              <Input
                placeholder='Buscar por empleado...'
                value={filters.nominas.empleado}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    nominas: { ...prev.nominas, empleado: e.target.value },
                  }))
                }
                icon={<Search className='w-4 h-4' />}
              />
            </div>
          </Card>

          {/* Tabla de nóminas */}
          <Card>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>
                Nóminas ({filteredNominas.length})
              </h2>
              <Button onClick={() => setShowNominaForm(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Nueva Nómina
              </Button>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Empleado
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Período
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Días Trabajados
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Salario Neto
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Estado
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredNominas.map(nomina => (
                    <tr key={nomina.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm font-medium text-gray-900'>
                          {nomina.empleado_nombre}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {nomina.mes}/{nomina.año}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {nomina.dias_trabajados}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatCurrency(nomina.salario_neto)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Badge
                          variant={
                            nomina.estado === 'pagado' ? 'success' : 'warning'
                          }
                        >
                          {nomina.estado}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <Button
                            variant='secondary'
                            size='sm'
                            onClick={() => handleEditNomina(nomina)}
                          >
                            <Edit className='w-4 h-4' />
                          </Button>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => handleDeleteNomina(nomina.id)}
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modal de empleado */}
      {showForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4'>
              {editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado'}
            </h3>
            <div className='space-y-4'>
              <Input
                label='Nombre'
                value={formData.nombre}
                onChange={e =>
                  setFormData(prev => ({ ...prev, nombre: e.target.value }))
                }
              />
              <Input
                label='Apellido'
                value={formData.apellido}
                onChange={e =>
                  setFormData(prev => ({ ...prev, apellido: e.target.value }))
                }
              />
              <Input
                label='Email'
                type='email'
                value={formData.email}
                onChange={e =>
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                label='Teléfono'
                value={formData.telefono}
                onChange={e =>
                  setFormData(prev => ({ ...prev, telefono: e.target.value }))
                }
              />
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.departamento}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    departamento: e.target.value,
                  }))
                }
              >
                <option value=''>Seleccionar departamento</option>
                {departamentos.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.cargo}
                onChange={e =>
                  setFormData(prev => ({ ...prev, cargo: e.target.value }))
                }
              >
                <option value=''>Seleccionar cargo</option>
                {cargos.map(cargo => (
                  <option key={cargo} value={cargo}>
                    {cargo}
                  </option>
                ))}
              </select>
              <Input
                label='Fecha de Ingreso'
                type='date'
                value={formData.fecha_ingreso}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    fecha_ingreso: e.target.value,
                  }))
                }
              />
              <Input
                label='Salario Base'
                type='number'
                value={formData.salario_base}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    salario_base: e.target.value,
                  }))
                }
              />
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={formData.estado}
                onChange={e =>
                  setFormData(prev => ({ ...prev, estado: e.target.value }))
                }
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end space-x-2 mt-6'>
              <Button
                variant='secondary'
                onClick={() => {
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
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEmpleado} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nómina */}
      {showNominaForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h3 className='text-lg font-semibold mb-4'>
              {editingNomina ? 'Editar Nómina' : 'Nueva Nómina'}
            </h3>
            <div className='space-y-4'>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={nominaFormData.empleado_id}
                onChange={e =>
                  setNominaFormData(prev => ({
                    ...prev,
                    empleado_id: e.target.value,
                  }))
                }
              >
                <option value=''>Seleccionar empleado</option>
                {empleados.map(empleado => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre} {empleado.apellido}
                  </option>
                ))}
              </select>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={nominaFormData.mes}
                onChange={e =>
                  setNominaFormData(prev => ({ ...prev, mes: e.target.value }))
                }
              >
                <option value=''>Seleccionar mes</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(mes => (
                  <option key={mes} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>
              <select
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={nominaFormData.año}
                onChange={e =>
                  setNominaFormData(prev => ({ ...prev, año: e.target.value }))
                }
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
              <Input
                label='Días Trabajados'
                type='number'
                value={nominaFormData.dias_trabajados}
                onChange={e =>
                  setNominaFormData(prev => ({
                    ...prev,
                    dias_trabajados: e.target.value,
                  }))
                }
              />
              <Input
                label='Salario Base'
                type='number'
                value={nominaFormData.salario_base}
                onChange={e =>
                  setNominaFormData(prev => ({
                    ...prev,
                    salario_base: e.target.value,
                  }))
                }
              />
              <Input
                label='Bonificaciones'
                type='number'
                value={nominaFormData.bonificaciones}
                onChange={e =>
                  setNominaFormData(prev => ({
                    ...prev,
                    bonificaciones: e.target.value,
                  }))
                }
              />
              <Input
                label='Descuentos'
                type='number'
                value={nominaFormData.descuentos}
                onChange={e =>
                  setNominaFormData(prev => ({
                    ...prev,
                    descuentos: e.target.value,
                  }))
                }
              />
              <Input
                label='Salario Neto'
                type='number'
                value={nominaFormData.salario_neto}
                onChange={e =>
                  setNominaFormData(prev => ({
                    ...prev,
                    salario_neto: e.target.value,
                  }))
                }
                onBlur={calcularSalarioNeto}
              />
            </div>
            <div className='flex justify-end space-x-2 mt-6'>
              <Button
                variant='secondary'
                onClick={() => {
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
                }}
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
