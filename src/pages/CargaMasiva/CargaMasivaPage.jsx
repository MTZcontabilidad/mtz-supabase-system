import React, { useState, useCallback, useEffect } from 'react';
import {
  Download,
  ShoppingCart,
  TrendingUp,
  Users,
  RefreshCw,
  Plus,
  DollarSign,
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Input from '../../components/ui/Input.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/Dialog.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatCurrency, formatDate } from '../../utils/helpers.js';

/**
 * CargaMasivaPage Component
 * Panel para carga masiva de ventas y compras de clientes
 */
const CargaMasivaPage = () => {
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVentasForm, setShowVentasForm] = useState(false);
  const [showComprasForm, setShowComprasForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [tipoCarga, setTipoCarga] = useState('ventas'); // 'ventas' o 'compras'
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

  // Estados y tipos
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

  // NOTA IMPORTANTE:
  // Esta página ya utiliza supabase para cargar y validar datos de clientes, ventas y compras.
  // Asegúrate de que las tablas 'empresas', 'ventas' y 'compras' existen en Supabase y tienen los campos correctos.
  // Si modificas la estructura de la base de datos, actualiza aquí los nombres de los campos.
  // Si tienes dudas, consulta a un programador o revisa la documentación interna.
  // Cargar datos
  const cargarDatos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando datos para carga masiva...');

      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes_contables')
        .select('*')
        .order('nombre');

      if (clientesError) throw clientesError;
      setClientes(clientesData || []);

      // Cargar ventas existentes
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select(
          `
          *,
          clientes_contables(razon_social)
        `
        )
        .order('fecha_emision', { ascending: false });

      if (!ventasError) {
        setVentas(ventasData || []);
      }

      // Cargar compras existentes
      const { data: comprasData, error: comprasError } = await supabase
        .from('compras')
        .select('*')
        .order('fecha_compra', { ascending: false });

      if (!comprasError) {
        setCompras(comprasData || []);
      }
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carga masiva desde CSV
  const handleCargaMasivaCSV = async (file, tipo) => {
    try {
      setUploadStatus('Leyendo archivo...');
      setUploadProgress(10);

      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');

          // Detectar separador automáticamente
          const primeraLinea = lines[0];
          let separador = ',';
          if (primeraLinea.includes(';')) {
            separador = ';';
          } else if (primeraLinea.includes('\t')) {
            separador = '\t';
          }

          console.log('🔍 Separador detectado:', separador);

          const headers = primeraLinea
            .split(separador)
            .map(h => h.trim().replace(/"/g, ''));

          console.log('📋 Encabezados detectados:', headers);

          setUploadProgress(30);
          setUploadStatus('Procesando datos...');

          const datos = lines
            .slice(1)
            .map((line, index) => {
              const values = line
                .split(separador)
                .map(v => v.trim().replace(/"/g, ''));
              const row = {};

              headers.forEach((header, i) => {
                row[header] = values[i] || '';
              });

              return { ...row, _index: index + 2 }; // +2 porque empezamos en línea 2
            })
            .filter(row => row[headers[0]]); // Filtrar filas vacías

          console.log(`📊 ${datos.length} registros procesados`);

          setUploadProgress(60);
          setUploadStatus('Validando datos...');

          // Validar datos
          const datosValidados = await validarDatos(datos, tipo);

          setUploadProgress(80);
          setUploadStatus('Preparando vista previa...');

          setPreviewData(datosValidados);
          setTipoCarga(tipo);
          setShowPreview(true);
          setUploadProgress(100);
          setUploadStatus('Completado');
        } catch (error) {
          console.error('❌ Error procesando CSV:', error);
          setUploadStatus('Error: ' + error.message);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('❌ Error en carga masiva:', error);
      setUploadStatus('Error: ' + error.message);
    }
  };

  // Validar datos
  const validarDatos = async (datos, tipo) => {
    const validados = [];
    const errores = [];

    for (const dato of datos) {
      const validacion = { ...dato, errores: [] };

      if (tipo === 'ventas') {
        // Detectar formato RCV
        if (dato['Rut cliente'] || dato['Razon Social']) {
          // Formato RCV detectado
          const ventaRCV = mapearVentaDesdeRCV(dato);
          validacion.numero_factura = ventaRCV.numero_factura;
          validacion.fecha_emision = ventaRCV.fecha_emision;
          validacion.monto_neto = ventaRCV.monto_neto;
          validacion.monto_total = ventaRCV.monto_total;
          validacion.cliente_rut = ventaRCV.cliente_rut;
          validacion.cliente_nombre = ventaRCV.cliente_nombre;
          validacion.tipo_documento = ventaRCV.tipo_documento;
          validacion.formato_origen = 'RCV';
        }

        // Validar venta (formato estándar o RCV)
        if (!validacion.numero_factura)
          validacion.errores.push('Número de factura requerido');
        if (!validacion.fecha_emision)
          validacion.errores.push('Fecha de emisión requerida');
        if (!validacion.monto_neto || isNaN(validacion.monto_neto))
          validacion.errores.push('Monto neto inválido');

        // Para formato RCV, buscar cliente por RUT
        if (validacion.cliente_rut) {
          const clienteEncontrado = clientes.find(
            c =>
              c.rut === validacion.cliente_rut ||
              c.rut?.replace(/[.-]/g, '') ===
                validacion.cliente_rut?.replace(/[.-]/g, '')
          );
          if (clienteEncontrado) {
            validacion.cliente_id = clienteEncontrado.id_cliente;
          } else {
            validacion.errores.push(
              `Cliente con RUT ${validacion.cliente_rut} no encontrado`
            );
          }
        } else if (!validacion.cliente_id) {
          validacion.errores.push('Cliente requerido');
        }
      } else {
        // Validar compra
        if (!dato.numero_factura)
          validacion.errores.push('Número de factura requerido');
        if (!dato.proveedor) validacion.errores.push('Proveedor requerido');
        if (!dato.fecha_compra)
          validacion.errores.push('Fecha de compra requerida');
        if (!dato.monto_neto || isNaN(dato.monto_neto))
          validacion.errores.push('Monto neto inválido');
      }

      if (validacion.errores.length === 0) {
        validados.push(validacion);
      } else {
        errores.push(validacion);
      }
    }

    if (errores.length > 0) {
      console.log('⚠️ Datos con errores:', errores);
    }

    return validados;
  };

  // Mapear venta desde formato RCV
  const mapearVentaDesdeRCV = registro => {
    return {
      numero_factura: registro['Folio'] || '',
      cliente_rut: registro['Rut cliente'] || '',
      cliente_nombre: registro['Razon Social'] || '',
      fecha_emision: convertirFecha(registro['Fecha Docto']),
      monto_exento: parseFloat(registro['Monto Exento'] || 0),
      monto_neto: parseFloat(registro['Monto Neto'] || 0),
      monto_iva: parseFloat(registro['Monto IVA'] || 0),
      monto_total: parseFloat(registro['Monto total'] || 0),
      tipo_documento: obtenerTipoDocumento(registro['Tipo Doc']),
      descripcion: `Venta ${registro['Tipo Venta'] || 'Del Giro'}`,
      estado: 'Emitida',
    };
  };

  // Convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD
  const convertirFecha = fecha => {
    if (!fecha) return '';

    // Si ya está en formato YYYY-MM-DD
    if (fecha.includes('-') && fecha.length === 10) {
      return fecha;
    }

    // Convertir de DD/MM/YYYY a YYYY-MM-DD
    if (fecha.includes('/')) {
      const partes = fecha.split('/');
      if (partes.length === 3) {
        return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
      }
    }

    return fecha;
  };

  // Obtener tipo de documento desde código RCV
  const obtenerTipoDocumento = codigo => {
    const tipos = {
      33: 'Factura',
      34: 'Boleta',
      39: 'Boleta Exenta',
      41: 'Guía de Despacho',
      43: 'Liquidación',
      46: 'Factura de Exportación',
      52: 'Guía de Despacho de Exportación',
      56: 'Nota de Débito de Exportación',
      61: 'Nota de Crédito de Exportación',
      110: 'Factura de Consumo',
      111: 'Nota de Débito de Consumo',
      112: 'Nota de Crédito de Consumo',
    };
    return tipos[codigo] || 'Documento';
  };

  // Confirmar carga masiva
  const confirmarCargaMasiva = async () => {
    try {
      setUploadStatus('Insertando datos...');
      setUploadProgress(0);

      const datosParaInsertar = previewData.map(dato => {
        if (tipoCarga === 'ventas') {
          const iva = parseFloat(dato.monto_neto) * 0.19;
          const montoTotal = parseFloat(dato.monto_neto) + iva;

          return {
            cliente_id: parseInt(dato.cliente_id),
            numero_factura: dato.numero_factura,
            fecha_emision: dato.fecha_emision,
            fecha_vencimiento: dato.fecha_vencimiento || dato.fecha_emision,
            monto_neto: parseFloat(dato.monto_neto),
            iva: iva,
            monto_total: montoTotal,
            tipo_servicio: dato.tipo_servicio || 'Contabilidad',
            descripcion: dato.descripcion || '',
            estado: 'Emitida',
          };
        } else {
          const iva = parseFloat(dato.monto_neto) * 0.19;
          const montoTotal = parseFloat(dato.monto_neto) + iva;

          return {
            proveedor_id: parseInt(dato.proveedor_id) || 1,
            fecha_compra: dato.fecha_compra,
            monto_total: montoTotal,
            impuesto_iva: iva,
            metodo_pago: dato.metodo_pago || 'Transferencia',
            estado: 'Pendiente',
            descripcion: dato.descripcion || '',
          };
        }
      });

      setUploadProgress(50);

      // Insertar datos
      const { data, error } = await supabase
        .from(tipoCarga === 'ventas' ? 'ventas' : 'compras')
        .insert(datosParaInsertar)
        .select();

      if (error) throw error;

      setUploadProgress(100);
      setUploadStatus(`✅ ${data.length} registros insertados exitosamente`);

      // Actualizar listas
      if (tipoCarga === 'ventas') {
        setVentas([...data, ...ventas]);
      } else {
        setCompras([...data, ...compras]);
      }

      setShowPreview(false);
      setPreviewData([]);

      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      console.error('❌ Error insertando datos:', error);
      setUploadStatus('Error: ' + error.message);
    }
  };

  // Crear venta individual
  const handleCrearVenta = async () => {
    try {
      if (
        !nuevaVenta.cliente_id ||
        !nuevaVenta.monto_neto ||
        !nuevaVenta.fecha_emision
      ) {
        alert('Por favor completa los campos obligatorios');
        return;
      }

      const iva = parseFloat(nuevaVenta.monto_neto) * 0.19;
      const montoTotal = parseFloat(nuevaVenta.monto_neto) + iva;

      const ventaData = {
        cliente_id: parseInt(nuevaVenta.cliente_id),
        numero_factura: nuevaVenta.numero_factura || generarNumeroFactura(),
        fecha_emision: nuevaVenta.fecha_emision,
        fecha_vencimiento:
          nuevaVenta.fecha_vencimiento || nuevaVenta.fecha_emision,
        monto_neto: parseFloat(nuevaVenta.monto_neto),
        iva: iva,
        monto_total: montoTotal,
        tipo_servicio: nuevaVenta.tipo_servicio,
        descripcion: nuevaVenta.descripcion,
        estado: 'Emitida',
      };

      const { data, error } = await supabase.from('ventas').insert(ventaData)
        .select(`
          *,
          clientes_contables(razon_social)
        `);

      if (error) throw error;

      setVentas([data[0], ...ventas]);
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

      alert('✅ Venta creada exitosamente');
    } catch (error) {
      console.error('❌ Error creando venta:', error);
      alert('Error al crear venta: ' + error.message);
    }
  };

  // Crear compra individual
  const handleCrearCompra = async () => {
    try {
      if (
        !nuevaCompra.proveedor ||
        !nuevaCompra.monto_neto ||
        !nuevaCompra.fecha_compra
      ) {
        alert('Por favor completa los campos obligatorios');
        return;
      }

      const iva = parseFloat(nuevaCompra.monto_neto) * 0.19;
      const montoTotal = parseFloat(nuevaCompra.monto_neto) + iva;

      const compraData = {
        proveedor_id: 1, // Placeholder
        fecha_compra: nuevaCompra.fecha_compra,
        monto_total: montoTotal,
        impuesto_iva: iva,
        metodo_pago: 'Transferencia',
        estado: 'Pendiente',
        descripcion: nuevaCompra.descripcion,
      };

      const { data, error } = await supabase
        .from('compras')
        .insert(compraData)
        .select();

      if (error) throw error;

      setCompras([data[0], ...compras]);
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

      alert('✅ Compra creada exitosamente');
    } catch (error) {
      console.error('❌ Error creando compra:', error);
      alert('Error al crear compra: ' + error.message);
    }
  };

  // Generar número de factura
  const generarNumeroFactura = () => {
    const ultimaVenta = ventas[0];
    if (ultimaVenta && ultimaVenta.numero_factura) {
      const numero = parseInt(ultimaVenta.numero_factura.split('-')[1]) + 1;
      return `FAC-${String(numero).padStart(6, '0')}`;
    }
    return `FAC-${String(ventas.length + 1).padStart(6, '0')}`;
  };

  // Exportar plantilla CSV
  const exportarPlantillaCSV = tipo => {
    let headers, filename;

    if (tipo === 'ventas') {
      headers = [
        'cliente_id',
        'numero_factura',
        'fecha_emision',
        'fecha_vencimiento',
        'monto_neto',
        'tipo_servicio',
        'descripcion',
      ];
      filename = 'plantilla_ventas.csv';
    } else {
      headers = [
        'proveedor_id',
        'numero_factura',
        'fecha_compra',
        'fecha_vencimiento',
        'monto_neto',
        'categoria',
        'descripcion',
      ];
      filename = 'plantilla_compras.csv';
    }

    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cargar datos al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <RefreshCw className='w-8 h-8 animate-spin mx-auto mb-4 text-blue-600' />
          <p className='text-gray-600'>Cargando panel de carga masiva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            📊 Panel de Carga Masiva
          </h1>
          <p className='text-gray-600'>
            Carga ventas y compras de clientes de forma masiva
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            onClick={() => setShowComprasForm(true)}
            variant='outline'
            className='flex items-center gap-2'
          >
            <ShoppingCart className='w-4 h-4' />
            Nueva Compra
          </Button>
          <Button
            onClick={() => setShowVentasForm(true)}
            className='flex items-center gap-2'
          >
            <Plus className='w-4 h-4' />
            Nueva Venta
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
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
            <Users className='w-8 h-8 text-blue-600' />
          </div>
        </Card>
        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Ventas</p>
              <p className='text-2xl font-bold text-green-600'>
                {ventas.length}
              </p>
            </div>
            <TrendingUp className='w-8 h-8 text-green-600' />
          </div>
        </Card>
        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>Total Compras</p>
              <p className='text-2xl font-bold text-red-600'>
                {compras.length}
              </p>
            </div>
            <ShoppingCart className='w-8 h-8 text-red-600' />
          </div>
        </Card>
        <Card>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>
                Monto Total Ventas
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatCurrency(
                  ventas.reduce(
                    (sum, v) => sum + parseFloat(v.monto_total || 0),
                    0
                  )
                )}
              </p>
            </div>
            <DollarSign className='w-8 h-8 text-green-600' />
          </div>
        </Card>
      </div>

      {/* Panel de Carga Masiva */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Carga de Ventas */}
        <Card>
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <TrendingUp className='w-6 h-6 text-green-600' />
              <h3 className='text-lg font-semibold text-gray-900'>
                Carga Masiva de Ventas
              </h3>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Seleccionar Cliente
                </label>
                <select
                  value={selectedCliente}
                  onChange={e => setSelectedCliente(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los clientes</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre || cliente.razon_social}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subir archivo CSV
                </label>
                <input
                  type='file'
                  accept='.csv'
                  onChange={e => {
                    if (e.target.files[0]) {
                      handleCargaMasivaCSV(e.target.files[0], 'ventas');
                    }
                  }}
                  className='w-full'
                />
              </div>

              <div className='flex gap-2'>
                <Button
                  onClick={() => exportarPlantillaCSV('ventas')}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <Download className='w-4 h-4' />
                  Descargar Plantilla
                </Button>
                <Button
                  onClick={() => setShowVentasForm(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='w-4 h-4' />
                  Crear Manual
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Carga de Compras */}
        <Card>
          <div className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <ShoppingCart className='w-6 h-6 text-red-600' />
              <h3 className='text-lg font-semibold text-gray-900'>
                Carga Masiva de Compras
              </h3>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Seleccionar Cliente
                </label>
                <select
                  value={selectedCliente}
                  onChange={e => setSelectedCliente(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value=''>Todos los clientes</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id_cliente} value={cliente.id_cliente}>
                      {cliente.nombre || cliente.razon_social}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subir archivo CSV
                </label>
                <input
                  type='file'
                  accept='.csv'
                  onChange={e => {
                    if (e.target.files[0]) {
                      handleCargaMasivaCSV(e.target.files[0], 'compras');
                    }
                  }}
                  className='w-full'
                />
              </div>

              <div className='flex gap-2'>
                <Button
                  onClick={() => exportarPlantillaCSV('compras')}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <Download className='w-4 h-4' />
                  Descargar Plantilla
                </Button>
                <Button
                  onClick={() => setShowComprasForm(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='w-4 h-4' />
                  Crear Manual
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progreso de Carga */}
      {uploadProgress > 0 && (
        <Card>
          <div className='p-4'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700'>
                {uploadStatus}
              </span>
              <span className='text-sm text-gray-500'>{uploadProgress}%</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      {/* Vista Previa */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>
              Vista Previa - {tipoCarga === 'ventas' ? 'Ventas' : 'Compras'}
            </DialogTitle>
          </DialogHeader>
          <div className='max-h-96 overflow-y-auto'>
            <table className='w-full'>
              <thead className='sticky top-0 bg-gray-50'>
                <tr>
                  <th className='text-left py-2 px-3 font-medium text-gray-900'>
                    #
                  </th>
                  {tipoCarga === 'ventas' ? (
                    <>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Cliente
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Factura
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Fecha
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Monto
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Servicio
                      </th>
                    </>
                  ) : (
                    <>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Proveedor
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Factura
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Fecha
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Monto
                      </th>
                      <th className='text-left py-2 px-3 font-medium text-gray-900'>
                        Categoría
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {previewData.map((item, index) => (
                  <tr key={index} className='border-b border-gray-100'>
                    <td className='py-2 px-3 text-sm text-gray-600'>
                      {index + 1}
                    </td>
                    {tipoCarga === 'ventas' ? (
                      <>
                        <td className='py-2 px-3 text-sm text-gray-900'>
                          {clientes.find(
                            c => c.id_cliente === parseInt(item.cliente_id)
                          )?.nombre ||
                            clientes.find(
                              c => c.id_cliente === parseInt(item.cliente_id)
                            )?.razon_social ||
                            'Cliente no encontrado'}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-900'>
                          {item.numero_factura}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-600'>
                          {item.fecha_emision}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-900'>
                          {formatCurrency(item.monto_neto)}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-600'>
                          {item.tipo_servicio}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className='py-2 px-3 text-sm text-gray-900'>
                          {item.proveedor}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-900'>
                          {item.numero_factura}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-600'>
                          {item.fecha_compra}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-900'>
                          {formatCurrency(item.monto_neto)}
                        </td>
                        <td className='py-2 px-3 text-sm text-gray-600'>
                          {item.categoria}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowPreview(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarCargaMasiva}>
              Confirmar Carga ({previewData.length} registros)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulario de Venta */}
      <Dialog open={showVentasForm} onOpenChange={setShowVentasForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Nueva Venta</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre || cliente.razon_social}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Fecha Vencimiento
              </label>
              <Input
                type='date'
                value={nuevaVenta.fecha_vencimiento}
                onChange={e =>
                  setNuevaVenta({
                    ...nuevaVenta,
                    fecha_vencimiento: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tipo Servicio
              </label>
              <select
                value={nuevaVenta.tipo_servicio}
                onChange={e =>
                  setNuevaVenta({
                    ...nuevaVenta,
                    tipo_servicio: e.target.value,
                  })
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Seleccionar servicio</option>
                {TIPOS_SERVICIO.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <textarea
                value={nuevaVenta.descripcion}
                onChange={e =>
                  setNuevaVenta({ ...nuevaVenta, descripcion: e.target.value })
                }
                placeholder='Descripción de la venta'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
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
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCrearVenta}>Crear Venta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulario de Compra */}
      <Dialog open={showComprasForm} onOpenChange={setShowComprasForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Nueva Compra</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Proveedor *
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Número Factura
              </label>
              <Input
                value={nuevaCompra.numero_factura}
                onChange={e =>
                  setNuevaCompra({
                    ...nuevaCompra,
                    numero_factura: e.target.value,
                  })
                }
                placeholder='Número de factura'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
              <label className='block text-sm font-medium text-gray-700 mb-1'>
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
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción
              </label>
              <textarea
                value={nuevaCompra.descripcion}
                onChange={e =>
                  setNuevaCompra({
                    ...nuevaCompra,
                    descripcion: e.target.value,
                  })
                }
                placeholder='Descripción de la compra'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
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
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCrearCompra}>Crear Compra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CargaMasivaPage;
