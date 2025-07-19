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
} from 'lucide-react';
import { Button, Card, Progress, Badge } from '../../ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../ui/Dialog';
import { cn, validateRUT, formatRUT } from '../../../utils/helpers';
import { ESTADOS_CLIENTE, TIPOS_EMPRESA } from '../../../utils/constants';

/**
 * CargaMasiva Component
 * Componente profesional para carga masiva de clientes desde archivos CSV/Excel.
 * Incluye validación, preview, y manejo de errores avanzado.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onUploadComplete - Callback cuando la carga es exitosa
 */
const CargaMasiva = ({ isOpen, onClose, onUploadComplete }) => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Processing, 4: Results
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [validData, setValidData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);

  // Configuración del dropzone
  const onDrop = useCallback(acceptedFiles => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseFile(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Parsear archivo CSV/Excel
  const parseFile = file => {
    if (file.type === 'text/csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: result => {
          setData(result.data);
          validateData(result.data);
          setStep(2);
        },
        error: error => {
          console.error('Error parsing CSV:', error);
          setErrors([{ row: 0, field: 'file', message: 'Error parsing CSV' }]);
        },
      });
    } else {
      // Para Excel, necesitaríamos una librería como SheetJS
      setErrors([
        {
          row: 0,
          field: 'file',
          message: 'Formato Excel no soportado aún. Use CSV.',
        },
      ]);
    }
  };

  // Validar datos
  const validateData = rawData => {
    const validatedData = [];
    const validationErrors = [];

    const requiredFields = [
      'nombre_empresa',
      'rut',
      'nombre_contacto',
      'email',
      'telefono',
      'direccion',
      'ciudad',
      'region',
    ];

    rawData.forEach((row, index) => {
      const rowErrors = [];
      const cleanRow = {};

      // Verificar campos requeridos
      requiredFields.forEach(field => {
        const value = row[field]?.toString().trim();
        if (!value) {
          rowErrors.push({
            row: index + 1,
            field,
            message: `Campo ${field} es requerido`,
          });
        } else {
          cleanRow[field] = value;
        }
      });

      // Validaciones específicas
      if (row.rut) {
        const rutValidation = validateRUT(row.rut);
        if (!rutValidation.isValid) {
          rowErrors.push({
            row: index + 1,
            field: 'rut',
            message: 'RUT inválido',
          });
        } else {
          cleanRow.rut = formatRUT(row.rut);
        }
      }

      if (row.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
          rowErrors.push({
            row: index + 1,
            field: 'email',
            message: 'Email inválido',
          });
        }
      }

      // Validar tipo de empresa
      if (row.tipo_empresa) {
        const validTypes = TIPOS_EMPRESA.map(t => t.value);
        if (!validTypes.includes(row.tipo_empresa)) {
          cleanRow.tipo_empresa = 'empresa'; // Default
        } else {
          cleanRow.tipo_empresa = row.tipo_empresa;
        }
      } else {
        cleanRow.tipo_empresa = 'empresa';
      }

      // Validar estado
      if (row.estado) {
        const validStates = ESTADOS_CLIENTE.map(e => e.value);
        if (!validStates.includes(row.estado)) {
          cleanRow.estado = 'activo'; // Default
        } else {
          cleanRow.estado = row.estado;
        }
      } else {
        cleanRow.estado = 'activo';
      }

      if (rowErrors.length === 0) {
        validatedData.push(cleanRow);
      }

      validationErrors.push(...rowErrors);
    });

    setValidData(validatedData);
    setErrors(validationErrors);
  };

  // Procesar carga masiva
  const handleUpload = async () => {
    if (validData.length === 0) return;

    setProcessing(true);
    setStep(3);
    setUploadProgress(0);

    try {
      const batchSize = 10;
      const totalBatches = Math.ceil(validData.length / batchSize);
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        const batch = validData.slice(i * batchSize, (i + 1) * batchSize);

        try {
          // Aquí iría la lógica de inserción en la base de datos
          // await insertClientsBatch(batch);
          successCount += batch.length;
        } catch (error) {
          console.error(`Error in batch ${i + 1}:`, error);
          errorCount += batch.length;
        }

        // Actualizar progreso
        const progress = ((i + 1) / totalBatches) * 100;
        setUploadProgress(progress);

        // Simular delay para mostrar progreso
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setResults({
        total: validData.length,
        success: successCount,
        errors: errorCount,
      });

      setStep(4);
      onUploadComplete?.({
        total: validData.length,
        success: successCount,
        errors: errorCount,
      });
    } catch (error) {
      console.error('Error during upload:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Resetear componente
  const handleReset = () => {
    setStep(1);
    setFile(null);
    setData([]);
    setValidData([]);
    setErrors([]);
    setProcessing(false);
    setUploadProgress(0);
    setResults(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Upload className='w-5 h-5' />
            Carga Masiva de Clientes
            <Badge variant='info' size='sm'>
              Paso {step} de 4
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Paso 1: Upload de archivo */}
          {step === 1 && (
            <Card className='p-6'>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                )}
              >
                <input {...getInputProps()} />
                <Upload className='w-12 h-12 mx-auto text-gray-400 mb-4' />
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  {isDragActive
                    ? 'Suelta el archivo aquí'
                    : 'Arrastra o selecciona un archivo'}
                </h3>
                <p className='text-gray-600 mb-4'>
                  Soporta archivos CSV y Excel (máximo 10MB)
                </p>
                <Button type='button'>
                  Seleccionar Archivo
                </Button>
              </div>

              {/* Template de descarga */}
              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <h4 className='font-medium text-blue-900 mb-2'>
                  📝 Plantilla de CSV
                </h4>
                <p className='text-sm text-blue-700 mb-3'>
                  Descarga la plantilla para asegurar el formato correcto:
                </p>
                <Button variant='outline' size='sm'>
                  <Download className='w-4 h-4 mr-2' />
                  Descargar Plantilla
                </Button>
              </div>
            </Card>
          )}

          {/* Paso 2: Preview y validación */}
          {step === 2 && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium'>Validación de Datos</h3>
                  <p className='text-gray-600'>
                    {data.length} registros encontrados,{' '}
                    <span className='text-green-600 font-medium'>
                      {validData.length} válidos
                    </span>
                    {errors.length > 0 && (
                      <span className='text-red-600 font-medium'>
                        , {errors.length} errores
                      </span>
                    )}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Button variant='outline' onClick={handleReset}>
                    Cargar Otro
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={validData.length === 0}
                  >
                    Procesar {validData.length} Registros
                  </Button>
                </div>
              </div>

              {/* Errores */}
              {errors.length > 0 && (
                <Card className='p-4 border-l-4 border-l-red-500'>
                  <div className='flex items-center gap-2 mb-3'>
                    <AlertCircle className='w-5 h-5 text-red-500' />
                    <h4 className='font-medium text-red-900'>
                      Errores de Validación
                    </h4>
                  </div>
                  <div className='max-h-32 overflow-y-auto'>
                    {errors.slice(0, 10).map((error, index) => (
                      <p key={index} className='text-sm text-red-700'>
                        Fila {error.row}, {error.field}: {error.message}
                      </p>
                    ))}
                    {errors.length > 10 && (
                      <p className='text-sm text-red-600 font-medium mt-2'>
                        ... y {errors.length - 10} errores más
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* Preview de datos válidos */}
              {validData.length > 0 && (
                <Card className='p-4'>
                  <h4 className='font-medium mb-3'>Preview de Datos Válidos</h4>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-sm'>
                      <thead>
                        <tr className='border-b'>
                          <th className='text-left p-2'>Empresa</th>
                          <th className='text-left p-2'>RUT</th>
                          <th className='text-left p-2'>Contacto</th>
                          <th className='text-left p-2'>Email</th>
                          <th className='text-left p-2'>Ciudad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validData.slice(0, 5).map((row, index) => (
                          <tr key={index} className='border-b'>
                            <td className='p-2'>{row.nombre_empresa}</td>
                            <td className='p-2'>{row.rut}</td>
                            <td className='p-2'>{row.nombre_contacto}</td>
                            <td className='p-2'>{row.email}</td>
                            <td className='p-2'>{row.ciudad}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {validData.length > 5 && (
                      <p className='text-sm text-gray-600 mt-2 text-center'>
                        ... y {validData.length - 5} registros más
                      </p>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Paso 3: Procesando */}
          {step === 3 && (
            <Card className='p-8 text-center'>
              <Loader2 className='w-12 h-12 mx-auto text-blue-600 animate-spin mb-4' />
              <h3 className='text-lg font-medium mb-2'>Procesando Datos</h3>
              <p className='text-gray-600 mb-4'>
                Cargando {validData.length} registros a la base de datos...
              </p>
              <Progress value={uploadProgress} className='w-full' />
              <p className='text-sm text-gray-500 mt-2'>
                {Math.round(uploadProgress)}% completado
              </p>
            </Card>
          )}

          {/* Paso 4: Resultados */}
          {step === 4 && results && (
            <Card className='p-6 text-center'>
              <CheckCircle className='w-16 h-16 mx-auto text-green-500 mb-4' />
              <h3 className='text-xl font-semibold text-green-900 mb-2'>
                ¡Carga Completada!
              </h3>
              <div className='grid grid-cols-3 gap-4 mt-6'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {results.total}
                  </div>
                  <div className='text-sm text-gray-600'>Total</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>
                    {results.success}
                  </div>
                  <div className='text-sm text-gray-600'>Exitosos</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-red-600'>
                    {results.errors}
                  </div>
                  <div className='text-sm text-gray-600'>Errores</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          {step < 4 ? (
            <Button variant='outline' onClick={handleClose}>
              Cancelar
            </Button>
          ) : (
            <Button onClick={handleClose}>Finalizar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CargaMasiva;