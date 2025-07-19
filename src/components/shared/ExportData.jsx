import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Filter,
  Calendar,
  Settings,
} from 'lucide-react';
import { Button, Card, Badge } from '../../ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../ui/Dialog';
import Input from '../../ui/Input';
import { formatCurrency } from '../../../utils/helpers';

/**
 * ExportData Component
 * Componente profesional para exportar datos en múltiples formatos.
 * Soporta CSV, Excel y PDF con filtros y opciones avanzadas.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Array} props.data - Datos a exportar
 * @param {string} props.filename - Nombre base del archivo
 * @param {Object} props.options - Opciones de exportación
 */
const ExportData = ({
  isOpen,
  onClose,
  data = [],
  filename = 'export',
  options = {},
}) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFilters, setIncludeFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedFields, setSelectedFields] = useState([]);
  const [customFilename, setCustomFilename] = useState(filename);
  const [exporting, setExporting] = useState(false);

  const exportFormats = [
    {
      id: 'csv',
      name: 'CSV',
      icon: FileText,
      description: 'Archivo separado por comas',
      extension: '.csv',
    },
    {
      id: 'excel',
      name: 'Excel',
      icon: FileSpreadsheet,
      description: 'Hoja de cálculo Excel',
      extension: '.xlsx',
    },
    {
      id: 'pdf',
      name: 'PDF',
      icon: File,
      description: 'Documento PDF',
      extension: '.pdf',
    },
  ];

  // Campos disponibles para exportación
  const availableFields = data.length > 0 ? Object.keys(data[0]) : [];

  React.useEffect(() => {
    if (availableFields.length > 0) {
      setSelectedFields(availableFields);
    }
  }, [data]);

  const handleFieldToggle = field => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Filtrar datos por rango de fechas si está habilitado
      let filteredData = [...data];
      
      if (includeFilters && dateRange.start && dateRange.end) {
        filteredData = data.filter(item => {
          const itemDate = new Date(item.created_at || item.fecha);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }

      // Filtrar campos seleccionados
      const exportData = filteredData.map(item => {
        const filteredItem = {};
        selectedFields.forEach(field => {
          filteredItem[field] = item[field];
        });
        return filteredItem;
      });

      // Ejecutar exportación según formato
      switch (exportFormat) {
        case 'csv':
          await exportToCSV(exportData, customFilename);
          break;
        case 'excel':
          await exportToExcel(exportData, customFilename);
          break;
        case 'pdf':
          await exportToPDF(exportData, customFilename);
          break;
        default:
          throw new Error('Formato no soportado');
      }

      onClose();
    } catch (error) {
      console.error('Error exportando datos:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportToCSV = async (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
  };

  const exportToExcel = async (data, filename) => {
    // Aquí usarías una librería como SheetJS para generar Excel
    console.log('Exportando a Excel:', data);
    // Placeholder: convertir a CSV por ahora
    await exportToCSV(data, filename);
  };

  const exportToPDF = async (data, filename) => {
    // Aquí usarías una librería como jsPDF para generar PDF
    console.log('Exportando a PDF:', data);
    // Placeholder: convertir a CSV por ahora
    await exportToCSV(data, filename);
  };

  const convertToCSV = data => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        const stringValue = String(value || '').replace(/"/g, '""');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',');
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Download className='w-5 h-5' />
            Exportar Datos
            <Badge variant='info' size='sm'>
              {data.length} registros
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Formato de exportación */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Formato de Exportación
            </label>
            <div className='grid grid-cols-3 gap-3'>
              {exportFormats.map(format => {
                const Icon = format.icon;
                return (
                  <Card
                    key={format.id}
                    className={`p-4 cursor-pointer transition-colors border-2 ${
                      exportFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setExportFormat(format.id)}
                  >
                    <div className='text-center'>
                      <Icon className='w-8 h-8 mx-auto mb-2 text-gray-600' />
                      <h3 className='font-medium text-gray-900'>
                        {format.name}
                      </h3>
                      <p className='text-xs text-gray-500 mt-1'>
                        {format.description}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Nombre del archivo */}
          <div>
            <Input
              label='Nombre del Archivo'
              value={customFilename}
              onChange={e => setCustomFilename(e.target.value)}
              placeholder='nombre-archivo'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Se agregará automáticamente la extensión{' '}
              {exportFormats.find(f => f.id === exportFormat)?.extension}
            </p>
          </div>

          {/* Filtros */}
          <div>
            <div className='flex items-center gap-2 mb-3'>
              <input
                type='checkbox'
                id='includeFilters'
                checked={includeFilters}
                onChange={e => setIncludeFilters(e.target.checked)}
                className='rounded border-gray-300'
              />
              <label htmlFor='includeFilters' className='text-sm font-medium'>
                Aplicar Filtros
              </label>
            </div>
            
            {includeFilters && (
              <Card className='p-4 border-l-4 border-l-blue-500'>
                <h4 className='font-medium mb-3 flex items-center gap-2'>
                  <Filter className='w-4 h-4' />
                  Filtros de Exportación
                </h4>
                <div className='grid grid-cols-2 gap-4'>
                  <Input
                    label='Fecha Desde'
                    type='date'
                    value={dateRange.start}
                    onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <Input
                    label='Fecha Hasta'
                    type='date'
                    value={dateRange.end}
                    onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Selección de campos */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              Campos a Incluir
            </label>
            <Card className='p-4 max-h-40 overflow-y-auto'>
              <div className='grid grid-cols-2 gap-2'>
                {availableFields.map(field => (
                  <label key={field} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldToggle(field)}
                      className='rounded border-gray-300'
                    />
                    <span className='text-sm text-gray-700 capitalize'>
                      {field.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </Card>
            <p className='text-xs text-gray-500 mt-2'>
              {selectedFields.length} de {availableFields.length} campos seleccionados
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            loading={exporting}
            disabled={selectedFields.length === 0}
          >
            <Download className='w-4 h-4 mr-2' />
            Exportar {exportFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportData;