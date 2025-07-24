import React, { useState, useCallback, useEffect } from 'react';
import {
  Download,
  ShoppingCart,
  TrendingUp,
  Users,
  RefreshCw,
  Plus,
  DollarSign,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
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

const CargaMasivaPageSimple = () => {
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVentasForm, setShowVentasForm] = useState(false);
  const [showComprasForm, setShowComprasForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [tipoCarga, setTipoCarga] = useState('ventas');

  const [nuevaVenta, setNuevaVenta] = useState({
    cliente_id: '',
    numero_factura: '',
    fecha_emision: '',
    fecha_vencimiento: '',
    monto_neto: '',
    tipo_servicio: '',
    descripcion: '',
  });

  const [nuevaCompra, setNuevaCompra] = useState({
    cliente_id: '',
    numero_factura: '',
    proveedor: '',
    fecha_compra: '',
    fecha_vencimiento: '',
    monto_neto: '',
    categoria: '',
    descripcion: '',
  });

  const TIPOS_SERVICIO = [
    'Contabilidad',
    'Tributario',
    'Auditoría',
    'Asesoría',
    'Consultoría',
    'Otro',
  ];

  const CATEGORIAS_COMPRA = [
    'Insumos',
    'Servicios',
    'Equipos',
    'Software',
    'Marketing',
    'Transporte',
    'Alimentación',
    'Otros',
  ];

  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos para carga masiva...');

      // Datos de ejemplo
      const clientesEjemplo = [
        { id: 1, nombre: 'Empresa ABC Ltda.', rut: '12345678-9' },
        { id: 2, nombre: 'Comercial XYZ SpA', rut: '98765432-1' },
        { id: 3, nombre: 'Servicios LTDA', rut: '45678912-3' },
      ];

      const ventasEjemplo = [
        {
          id: 1,
          cliente: 'Empresa ABC Ltda.',
          numero_factura: 'F001-2024',
          fecha_emision: '2024-01-15',
          monto_neto: 500000,
          tipo_servicio: 'Contabilidad',
        },
      ];

      const comprasEjemplo = [
        {
          id: 1,
          cliente: 'Empresa ABC Ltda.',
          proveedor: 'Proveedor A',
          numero_factura: 'C001-2024',
          fecha_compra: '2024-01-10',
          monto_neto: 150000,
          categoria: 'Servicios',
        },
      ];

      setClientes(clientesEjemplo);
      setVentas(ventasEjemplo);
      setCompras(comprasEjemplo);

      console.log('✅ Datos cargados exitosamente');
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearVenta = async () => {
    try {
      const nuevaVentaData = {
        id: Date.now(),
        cliente:
          clientes.find(c => c.id == nuevaVenta.cliente_id)?.nombre ||
          'Cliente',
        ...nuevaVenta,
        monto_neto: parseFloat(nuevaVenta.monto_neto) || 0,
      };

      setVentas(prev => [...prev, nuevaVentaData]);
      setShowVentasForm(false);
      setNuevaVenta({
        cliente_id: '',
        numero_factura: '',
        fecha_emision: '',
        fecha_vencimiento: '',
        monto_neto: '',
        tipo_servicio: '',
        descripcion: '',
      });

      console.log('✅ Venta creada exitosamente');
    } catch (error) {
      console.error('❌ Error creando venta:', error);
    }
  };

  const handleCrearCompra = async () => {
    try {
      const nuevaCompraData = {
        id: Date.now(),
        cliente:
          clientes.find(c => c.id == nuevaCompra.cliente_id)?.nombre ||
          'Cliente',
        ...nuevaCompra,
        monto_neto: parseFloat(nuevaCompra.monto_neto) || 0,
      };

      setCompras(prev => [...prev, nuevaCompraData]);
      setShowComprasForm(false);
      setNuevaCompra({
        cliente_id: '',
        numero_factura: '',
        proveedor: '',
        fecha_compra: '',
        fecha_vencimiento: '',
        monto_neto: '',
        categoria: '',
        descripcion: '',
      });

      console.log('✅ Compra creada exitosamente');
    } catch (error) {
      console.error('❌ Error creando compra:', error);
    }
  };

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      setUploadStatus('Procesando archivo...');
      setUploadProgress(0);

      // Simular progreso de carga
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStatus('Archivo procesado exitosamente');
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Carga Masiva de Datos
          </h1>
          <p className='text-gray-600'>
            Gestiona la carga masiva de ventas y compras de clientes
          </p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button onClick={cargarDatos} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Total Clientes
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {clientes.length}
              </p>
            </div>
            <div className='p-3 bg-blue-100 rounded-lg'>
              <Users className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Ventas</p>
              <p className='text-2xl font-bold text-gray-900'>
                {ventas.length}
              </p>
            </div>
            <div className='p-3 bg-green-100 rounded-lg'>
              <TrendingUp className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Compras</p>
              <p className='text-2xl font-bold text-gray-900'>
                {compras.length}
              </p>
            </div>
            <div className='p-3 bg-yellow-100 rounded-lg'>
              <ShoppingCart className='h-6 w-6 text-yellow-600' />
            </div>
          </div>
        </Card>

        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Valor Total</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(
                  ventas.reduce((sum, v) => sum + v.monto_neto, 0)
                )}
              </p>
            </div>
            <div className='p-3 bg-purple-100 rounded-lg'>
              <DollarSign className='h-6 w-6 text-purple-600' />
            </div>
          </div>
        </Card>
      </div>

      {/* Acciones de Carga */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Carga de Ventas */}
        <Card>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Carga de Ventas
              </h3>
              <Badge variant='success'>{ventas.length} registros</Badge>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subir archivo CSV
                </label>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                  <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-600 mb-2'>
                    Arrastra un archivo CSV aquí o haz clic para seleccionar
                  </p>
                  <input
                    type='file'
                    accept='.csv'
                    onChange={handleFileUpload}
                    className='hidden'
                    id='ventas-file'
                  />
                  <label
                    htmlFor='ventas-file'
                    className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                  >
                    Seleccionar archivo
                  </label>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Progreso</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className='text-sm text-gray-600'>{uploadStatus}</p>
                </div>
              )}

              <div className='flex space-x-3'>
                <Button
                  onClick={() => setShowVentasForm(true)}
                  className='flex-1'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Nueva Venta Manual
                </Button>
                <Button variant='outline' className='flex-1'>
                  <Download className='h-4 w-4 mr-2' />
                  Descargar Plantilla
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Carga de Compras */}
        <Card>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Carga de Compras
              </h3>
              <Badge variant='warning'>{compras.length} registros</Badge>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subir archivo CSV
                </label>
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                  <Upload className='h-8 w-8 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-600 mb-2'>
                    Arrastra un archivo CSV aquí o haz clic para seleccionar
                  </p>
                  <input
                    type='file'
                    accept='.csv'
                    onChange={handleFileUpload}
                    className='hidden'
                    id='compras-file'
                  />
                  <label
                    htmlFor='compras-file'
                    className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                  >
                    Seleccionar archivo
                  </label>
                </div>
              </div>

              <div className='flex space-x-3'>
                <Button
                  onClick={() => setShowComprasForm(true)}
                  className='flex-1'
                >
                  <Plus className='h-4 w-4 mr-2' />
                  Nueva Compra Manual
                </Button>
                <Button variant='outline' className='flex-1'>
                  <Download className='h-4 w-4 mr-2' />
                  Descargar Plantilla
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Ventas */}
      <Card>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Ventas Recientes
            </h3>
            <Badge variant='success'>Total: {ventas.length}</Badge>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Cliente
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Factura
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Fecha
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Monto
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Servicio
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {ventas.map(venta => (
                  <tr key={venta.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {venta.cliente}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {venta.numero_factura}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {formatDate(venta.fecha_emision)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatCurrency(venta.monto_neto)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Badge variant='info'>{venta.tipo_servicio}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modal de Nueva Venta */}
      <SimpleModal
        isOpen={showVentasForm}
        onClose={() => setShowVentasForm(false)}
        title='Nueva Venta'
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Cliente *
            </label>
            <select
              value={nuevaVenta.cliente_id}
              onChange={e =>
                setNuevaVenta({ ...nuevaVenta, cliente_id: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Seleccionar cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Número Factura
            </label>
            <Input
              value={nuevaVenta.numero_factura}
              onChange={e =>
                setNuevaVenta({
                  ...nuevaVenta,
                  numero_factura: e.target.value,
                })
              }
              placeholder='Auto-generado si está vacío'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Fecha Emisión *
            </label>
            <Input
              type='date'
              value={nuevaVenta.fecha_emision}
              onChange={e =>
                setNuevaVenta({
                  ...nuevaVenta,
                  fecha_emision: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Monto Neto *
            </label>
            <Input
              type='number'
              value={nuevaVenta.monto_neto}
              onChange={e =>
                setNuevaVenta({ ...nuevaVenta, monto_neto: e.target.value })
              }
              placeholder='0'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Tipo Servicio
            </label>
            <select
              value={nuevaVenta.tipo_servicio}
              onChange={e =>
                setNuevaVenta({ ...nuevaVenta, tipo_servicio: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Seleccionar tipo</option>
              {TIPOS_SERVICIO.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button variant='outline' onClick={() => setShowVentasForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearVenta}>Crear Venta</Button>
          </div>
        </div>
      </SimpleModal>

      {/* Modal de Nueva Compra */}
      <SimpleModal
        isOpen={showComprasForm}
        onClose={() => setShowComprasForm(false)}
        title='Nueva Compra'
      >
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Cliente *
            </label>
            <select
              value={nuevaCompra.cliente_id}
              onChange={e =>
                setNuevaCompra({ ...nuevaCompra, cliente_id: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Seleccionar cliente</option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Proveedor
            </label>
            <Input
              value={nuevaCompra.proveedor}
              onChange={e =>
                setNuevaCompra({ ...nuevaCompra, proveedor: e.target.value })
              }
              placeholder='Nombre del proveedor'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Fecha Compra *
            </label>
            <Input
              type='date'
              value={nuevaCompra.fecha_compra}
              onChange={e =>
                setNuevaCompra({
                  ...nuevaCompra,
                  fecha_compra: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Monto Neto *
            </label>
            <Input
              type='number'
              value={nuevaCompra.monto_neto}
              onChange={e =>
                setNuevaCompra({ ...nuevaCompra, monto_neto: e.target.value })
              }
              placeholder='0'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Categoría
            </label>
            <select
              value={nuevaCompra.categoria}
              onChange={e =>
                setNuevaCompra({ ...nuevaCompra, categoria: e.target.value })
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Seleccionar categoría</option>
              {CATEGORIAS_COMPRA.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button variant='outline' onClick={() => setShowComprasForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearCompra}>Crear Compra</Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
};

export default CargaMasivaPageSimple;
