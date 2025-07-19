import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Loader2,
  BarChart3,
  Database,
} from 'lucide-react';
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import Progress from '@/components/ui/Progress.jsx';
import Badge from '@/components/ui/Badge.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog.jsx';
import { cn, validateRUT, formatRUT } from '@/utils/helpers.js';
import { ESTADOS_CLIENTE, TIPOS_EMPRESA } from '@/utils/constants.js';
import { supabase } from '@/lib/supabase.js';

/**
 * CargaMasiva Component
 * Componente profesional para carga masiva de clientes desde archivos CSV/Excel.
 * Incluye validación, preview, procesamiento por lotes y reportes detallados.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onImport - Callback al importar datos
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.open - Si el modal está abierto
 * @param {Function} props.onOpenChange - Callback para cambio de estado del modal
 */
const CargaMasiva = ({
  onImport,
  loading = false,
  open = false,
  onOpenChange,
}) => {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [insertingTestData, setInsertingTestData] = useState(false);

  // Configuración de dropzone
  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles);
    if (acceptedFiles[0]) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/json': ['.json'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  // Procesar archivo para preview
  const processFile = file => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      Papa.parse(file, {
        complete: results => {
          setPreview(results.data.slice(0, 5)); // Mostrar primeras 5 filas
        },
        header: true,
        skipEmptyLines: true,
        error: error => {
          console.error('Error parsing CSV:', error);
        },
      });
    } else if (
      file.type === 'application/json' ||
      file.name.endsWith('.json')
    ) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);
          setPreview(Array.isArray(data) ? data.slice(0, 5) : []);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Validar datos de cliente
  const validateClienteData = (row, index) => {
    const errors = [];

    // Validar campos requeridos
    if (!row.razon_social) {
      errors.push('Razón social es requerida');
    }
    if (!row.rut) {
      errors.push('RUT es requerido');
    } else if (!validateRUT(row.rut)) {
      errors.push('RUT inválido');
    }
    if (!row.id_cliente) {
      errors.push('Código de cliente es requerido');
    }

    // Validar campos opcionales
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push('Email inválido');
    }
    if (row.tipo_empresa && !TIPOS_EMPRESA.includes(row.tipo_empresa)) {
      errors.push('Tipo de empresa inválido');
    }
    if (row.estado && !ESTADOS_CLIENTE.includes(row.estado)) {
      errors.push('Estado inválido');
    }

    // Validar números
    if (row.total_facturado && isNaN(parseFloat(row.total_facturado))) {
      errors.push('Total facturado debe ser un número');
    }
    if (row.numero_facturas && isNaN(parseInt(row.numero_facturas))) {
      errors.push('Número de facturas debe ser un número entero');
    }

    return {
      valid: errors.length === 0,
      errors,
      row: index + 1,
    };
  };

  // Procesar importación
  const handleImport = async () => {
    if (!files[0] || !preview.length) return;

    setProcessing(true);
    setProgress(0);
    const results = [];

    if (files[0].type === 'text/csv' || files[0].name.endsWith('.csv')) {
      Papa.parse(files[0], {
        complete: async parseResults => {
          const data = parseResults.data;

          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            setProgress(((i + 1) / data.length) * 100);

            try {
              // Validar fila
              const validation = validateClienteData(row, i);
              if (!validation.valid) {
                results.push({
                  row: validation.row,
                  status: 'error',
                  data: row,
                  message: validation.errors.join(', '),
                });
                continue;
              }

              // Preparar datos para importación
              const clienteData = {
                id_cliente: row.id_cliente,
                razon_social: row.razon_social,
                rut: formatRUT(row.rut),
                tipo_empresa: row.tipo_empresa || 'SPA',
                rubro: row.rubro || '',
                estado: row.estado || 'Activo',
                telefono: row.telefono || '',
                email: row.email || '',
                direccion_completa: row.direccion_completa || '',
                categoria_cliente: row.categoria_cliente || '',
                clave_sii: row.clave_sii || '',
                rut_representante_legal: row.rut_representante_legal || '',
                clave_sii_representante: row.clave_sii_representante || '',
                clave_unica: row.clave_unica || '',
                certificado_digital: row.certificado_digital || '',
                total_facturado: parseFloat(row.total_facturado) || 0,
                numero_facturas: parseInt(row.numero_facturas) || 0,
                promedio_factura: parseFloat(row.promedio_factura) || 0,
                fecha_registro:
                  row.fecha_registro || new Date().toISOString().split('T')[0],
              };

              // Importar cliente
              await onImport(clienteData);
              results.push({
                row: i + 1,
                status: 'success',
                data: clienteData,
                message: 'Cliente importado exitosamente',
              });
            } catch (error) {
              results.push({
                row: i + 1,
                status: 'error',
                data: row,
                message: error.message || 'Error desconocido',
              });
            }
          }

          setResults(results);
          setShowResults(true);
          setProcessing(false);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  // Datos de prueba para insertar
  const testData = [
    {
      id_cliente: 'CLI001',
      razon_social: 'Empresa Minera del Norte S.A.',
      rut: '76.123.456-7',
      total_facturado: '25000000',
      categoria_cliente: 'VIP',
      estado: 'Activo',
      rubro: 'Minería',
      email: 'contacto@mineranorte.cl',
      telefono: '+56 2 2345 6789',
    },
    {
      id_cliente: 'CLI002',
      razon_social: 'Constructora Sur Ltda.',
      rut: '78.234.567-8',
      total_facturado: '18000000',
      categoria_cliente: 'Premium',
      estado: 'Activo',
      rubro: 'Construcción',
      email: 'info@constructorasur.cl',
      telefono: '+56 2 3456 7890',
    },
    {
      id_cliente: 'CLI003',
      razon_social: 'Tecnología Avanzada SpA.',
      rut: '79.345.678-9',
      total_facturado: '15000000',
      categoria_cliente: 'Premium',
      estado: 'Activo',
      rubro: 'Tecnología',
      email: 'admin@tecavanzada.cl',
      telefono: '+56 2 4567 8901',
    },
    {
      id_cliente: 'CLI004',
      razon_social: 'Comercial Central EIRL',
      rut: '80.456.789-0',
      total_facturado: '12000000',
      categoria_cliente: 'Regular',
      estado: 'Activo',
      rubro: 'Comercio',
      email: 'ventas@comercialcentral.cl',
      telefono: '+56 2 5678 9012',
    },
    {
      id_cliente: 'CLI005',
      razon_social: 'Servicios Financieros Pro S.A.',
      rut: '81.567.890-1',
      total_facturado: '9500000',
      categoria_cliente: 'Regular',
      estado: 'Activo',
      rubro: 'Servicios Financieros',
      email: 'contacto@servfinpro.cl',
      telefono: '+56 2 6789 0123',
    },
    {
      id_cliente: 'CLI006',
      razon_social: 'Logística Express Ltda.',
      rut: '82.678.901-2',
      total_facturado: '8500000',
      categoria_cliente: 'Regular',
      estado: 'Activo',
      rubro: 'Logística',
      email: 'info@logisticaexpress.cl',
      telefono: '+56 2 7890 1234',
    },
    {
      id_cliente: 'CLI007',
      razon_social: 'Consultoría Estratégica Norte',
      rut: '83.789.012-3',
      total_facturado: '6500000',
      categoria_cliente: 'Regular',
      estado: 'Activo',
      rubro: 'Consultoría',
      email: 'admin@consultorianorte.cl',
      telefono: '+56 2 8901 2345',
    },
    {
      id_cliente: 'CLI008',
      razon_social: 'Inmobiliaria Premium S.A.',
      rut: '84.890.123-4',
      total_facturado: '5500000',
      categoria_cliente: 'Regular',
      estado: 'Activo',
      rubro: 'Inmobiliaria',
      email: 'ventas@inmopremium.cl',
      telefono: '+56 2 9012 3456',
    },
  ];

  // Función para insertar datos de prueba
  const insertTestData = async () => {
    setInsertingTestData(true);
    setProgress(0);
    const results = [];

    try {
      console.log('🚀 Insertando datos de prueba desde aplicación web...');

      for (let i = 0; i < testData.length; i++) {
        const cliente = testData[i];
        setProgress(((i + 1) / testData.length) * 100);

        try {
          const { data, error } = await supabase
            .from('clientes_contables')
            .insert(cliente)
            .select();

          if (error) {
            console.error(
              `❌ Error insertando ${cliente.razon_social}:`,
              error
            );
            results.push({
              row: i + 1,
              status: 'error',
              data: cliente,
              message: error.message,
            });
          } else {
            console.log(`✅ Insertado: ${cliente.razon_social}`);
            results.push({
              row: i + 1,
              status: 'success',
              data: cliente,
              message: 'Cliente insertado exitosamente',
            });
          }
        } catch (err) {
          console.error(`❌ Error en ${cliente.razon_social}:`, err);
          results.push({
            row: i + 1,
            status: 'error',
            data: cliente,
            message: err.message,
          });
        }
      }

      setResults(results);
      setShowResults(true);

      // Llamar callback para actualizar la lista
      if (onImport) {
        onImport();
      }
    } catch (err) {
      console.error('❌ Error general:', err);
    } finally {
      setInsertingTestData(false);
      setProgress(0);
    }
  };

  // Descargar plantilla
  const downloadTemplate = () => {
    const template = `id_cliente,razon_social,rut,tipo_empresa,rubro,telefono,email,direccion_completa,categoria_cliente,estado,total_facturado,numero_facturas,promedio_factura
0500,EMPRESA EJEMPLO SPA,12345678-9,SPA,Tecnología,+56912345678,contacto@ejemplo.cl,"Av. Providencia 123, Santiago",Regular,Activo,1000000,10,100000
0501,OTRA EMPRESA LTDA,98765432-1,LTDA,Servicios,+56987654321,info@otra.cl,"Av. Las Condes 456, Santiago",Premium,Activo,5000000,25,200000`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-clientes-mtz.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Limpiar estado
  const handleClose = () => {
    setFiles([]);
    setPreview([]);
    setResults([]);
    setProgress(0);
    setShowResults(false);
    onOpenChange?.(false);
  };

  // Calcular estadísticas de resultados
  const stats = {
    total: results.length,
    success: results.filter(r => r.status === 'success').length,
    error: results.filter(r => r.status === 'error').length,
    warning: results.filter(r => r.status === 'warning').length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Upload className='h-5 w-5' />
            Carga Masiva de Clientes
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Área de carga de archivos */}
          <Card className='p-6'>
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input {...getInputProps()} />
              <Upload className='mx-auto h-12 w-12 text-gray-400 mb-4' />
              {isDragActive ? (
                <p className='text-lg text-blue-600'>
                  Suelta el archivo aquí...
                </p>
              ) : (
                <div>
                  <p className='text-lg mb-2'>
                    Arrastra y suelta tu archivo aquí, o haz clic para
                    seleccionar
                  </p>
                  <p className='text-sm text-gray-500'>
                    CSV, Excel o JSON (máx. 10MB)
                  </p>
                  {files.length > 0 && (
                    <p className='text-sm text-green-600 mt-2'>
                      Archivo seleccionado: {files[0].name}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Preview de datos */}
          {preview.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Vista Previa (Primeras 5 filas)
              </h3>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-200'>
                  <thead>
                    <tr className='bg-gray-50'>
                      {Object.keys(preview[0]).map(key => (
                        <th
                          key={key}
                          className='border border-gray-200 px-3 py-2 text-left text-sm font-medium'
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className='border border-gray-200 px-3 py-2 text-sm'
                          >
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className='mt-4 flex justify-end'>
                <Button onClick={handleImport} disabled={processing || loading}>
                  {processing ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Procesando...
                    </>
                  ) : (
                    'Importar Datos'
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Barra de progreso */}
          {(processing || insertingTestData) && (
            <Card className='p-6'>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>
                    {insertingTestData
                      ? 'Insertando datos de prueba...'
                      : 'Procesando datos...'}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </Card>
          )}

          {/* Resultados */}
          {showResults && (
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Resultados de Importación
              </h3>

              {/* Estadísticas */}
              <div className='grid grid-cols-4 gap-4 mb-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {stats.total}
                  </div>
                  <div className='text-sm text-gray-500'>Total</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {stats.success}
                  </div>
                  <div className='text-sm text-gray-500'>Exitosos</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-red-600'>
                    {stats.error}
                  </div>
                  <div className='text-sm text-gray-500'>Errores</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-yellow-600'>
                    {stats.warning}
                  </div>
                  <div className='text-sm text-gray-500'>Advertencias</div>
                </div>
              </div>

              {/* Lista de resultados */}
              <div className='space-y-2 max-h-64 overflow-y-auto'>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className='flex items-center gap-3 p-2 border rounded'
                  >
                    {result.status === 'success' && (
                      <CheckCircle className='h-4 w-4 text-green-500' />
                    )}
                    {result.status === 'error' && (
                      <AlertCircle className='h-4 w-4 text-red-500' />
                    )}
                    {result.status === 'warning' && (
                      <AlertCircle className='h-4 w-4 text-yellow-500' />
                    )}
                    <span className='text-sm'>
                      Fila {result.row}: {result.message}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Datos de Prueba */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Database className='h-5 w-5' />
              Datos de Prueba
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Inserta 8 clientes de prueba con datos reales para probar el
              sistema.
            </p>
            <Button
              variant='outline'
              onClick={insertTestData}
              disabled={insertingTestData}
              className='mr-2'
            >
              {insertingTestData ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Insertando...
                </>
              ) : (
                <>
                  <Database className='h-4 w-4 mr-2' />
                  Insertar Datos de Prueba
                </>
              )}
            </Button>
          </Card>

          {/* Plantilla */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Download className='h-5 w-5' />
              Plantilla CSV
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Descarga la plantilla para asegurar el formato correcto de tus
              datos.
            </p>
            <Button variant='outline' onClick={downloadTemplate}>
              <Download className='h-4 w-4 mr-2' />
              Descargar Plantilla
            </Button>
          </Card>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            <X className='h-4 w-4 mr-2' />
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CargaMasiva;
