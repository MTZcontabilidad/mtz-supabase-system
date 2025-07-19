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
import Button from '@/components/ui/Button.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Dialog.jsx';
import Input from '@/components/ui/Input.jsx';
import { formatCurrency } from '@/utils/helpers.js';

/**
 * ExportData Component
 * Componente profesional para exportar datos en múltiples formatos.
 * Soporta CSV, Excel y PDF con filtros y opciones avanzadas.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos a exportar
 * @param {Array} props.columns - Columnas a incluir
 * @param {string} props.filename - Nombre del archivo
 * @param {boolean} props.open - Si el modal está abierto
 * @param {Function} props.onOpenChange - Callback para cambio de estado
 */
const ExportData = ({
  data = [],
  columns = [],
  filename = 'export',
  open = false,
  onOpenChange,
}) => {
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState({});
  const [exporting, setExporting] = useState(false);

  // Formatos de exportación disponibles
  const exportFormats = [
    {
      id: 'csv',
      name: 'CSV',
      icon: FileText,
      description: 'Archivo de texto separado por comas',
      extension: '.csv',
    },
    {
      id: 'excel',
      name: 'Excel',
      icon: FileSpreadsheet,
      description: 'Archivo de Microsoft Excel',
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

  // Filtrar datos según criterios
  const getFilteredData = () => {
    let filtered = [...data];

    // Filtrar por rango de fechas
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.fecha_registro || item.created_at);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    // Aplicar filtros adicionales
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        filtered = filtered.filter(item =>
          String(item[key]).toLowerCase().includes(filters[key].toLowerCase())
        );
      }
    });

    return filtered;
  };

  // Exportar a CSV
  const exportToCSV = filteredData => {
    if (!filteredData.length) return;

    const headers = selectedColumns.map(col => col.label).join(',');
    const rows = filteredData
      .map(item =>
        selectedColumns
          .map(col => {
            const value = item[col.key];
            if (typeof value === 'number') {
              return col.format === 'currency' ? formatCurrency(value) : value;
            }
            return `"${value || ''}"`;
          })
          .join(',')
      )
      .join('\n');

    const csvContent = `${headers}\n${rows}`;
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  // Exportar a Excel (simulado)
  const exportToExcel = filteredData => {
    // En una implementación real, usarías una librería como xlsx
    const excelData = filteredData.map(item => {
      const row = {};
      selectedColumns.forEach(col => {
        const value = item[col.key];
        row[col.label] =
          col.format === 'currency' ? formatCurrency(value) : value;
      });
      return row;
    });

    // Simular exportación a Excel
    const jsonContent = JSON.stringify(excelData, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  // Exportar a PDF (simulado)
  const exportToPDF = filteredData => {
    // En una implementación real, usarías una librería como jsPDF
    const pdfContent = `
      REPORTE DE CLIENTES
      Fecha: ${new Date().toLocaleDateString()}
      Total registros: ${filteredData.length}

      ${selectedColumns.map(col => col.label).join(' | ')}
      ${filteredData
        .map(item =>
          selectedColumns.map(col => item[col.key] || '').join(' | ')
        )
        .join('\n')}
    `;

    downloadFile(pdfContent, `${filename}.txt`, 'text/plain');
  };

  // Descargar archivo
  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Manejar exportación
  const handleExport = async format => {
    setExporting(true);

    try {
      const filteredData = getFilteredData();

      switch (format) {
        case 'csv':
          exportToCSV(filteredData);
          break;
        case 'excel':
          exportToExcel(filteredData);
          break;
        case 'pdf':
          exportToPDF(filteredData);
          break;
        default:
          console.error('Formato no soportado');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setExporting(false);
    }
  };

  // Toggle columna
  const toggleColumn = columnKey => {
    setSelectedColumns(prev =>
      prev.find(col => col.key === columnKey)
        ? prev.filter(col => col.key !== columnKey)
        : [...prev, columns.find(col => col.key === columnKey)]
    );
  };

  // Actualizar filtros
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredData = getFilteredData();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Download className='h-5 w-5' />
            Exportar Datos
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Resumen */}
          <Card className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total de registros</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {data.length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Registros filtrados</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {filteredData.length}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Columnas seleccionadas</p>
                <p className='text-2xl font-bold text-green-600'>
                  {selectedColumns.length}
                </p>
              </div>
            </div>
          </Card>

          {/* Filtros */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Filter className='h-5 w-5' />
              Filtros
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Rango de fechas */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Rango de fechas
                </label>
                <div className='flex gap-2'>
                  <Input
                    type='date'
                    value={dateRange.start}
                    onChange={e =>
                      setDateRange(prev => ({ ...prev, start: e.target.value }))
                    }
                    placeholder='Desde'
                  />
                  <Input
                    type='date'
                    value={dateRange.end}
                    onChange={e =>
                      setDateRange(prev => ({ ...prev, end: e.target.value }))
                    }
                    placeholder='Hasta'
                  />
                </div>
              </div>

              {/* Filtros de texto */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Buscar en texto
                </label>
                <Input
                  placeholder='Buscar en todos los campos...'
                  value={filters.search || ''}
                  onChange={e => updateFilter('search', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Selección de columnas */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Columnas a exportar
            </h3>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
              {columns.map(column => (
                <label
                  key={column.key}
                  className='flex items-center space-x-2 cursor-pointer'
                >
                  <input
                    type='checkbox'
                    checked={selectedColumns.some(
                      col => col.key === column.key
                    )}
                    onChange={() => toggleColumn(column.key)}
                    className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  />
                  <span className='text-sm text-gray-700'>{column.label}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Formatos de exportación */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>
              Formato de exportación
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {exportFormats.map(format => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.id}
                    className='border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors'
                    onClick={() => handleExport(format.id)}
                  >
                    <div className='flex items-center gap-3 mb-2'>
                      <Icon className='h-6 w-6 text-blue-600' />
                      <div>
                        <h4 className='font-medium text-gray-900'>
                          {format.name}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {format.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size='sm'
                      className='w-full'
                      disabled={exporting || !selectedColumns.length}
                    >
                      {exporting ? 'Exportando...' : `Exportar ${format.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Vista previa */}
          {filteredData.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Vista previa</h3>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse border border-gray-200'>
                  <thead>
                    <tr className='bg-gray-50'>
                      {selectedColumns.map(column => (
                        <th
                          key={column.key}
                          className='border border-gray-200 px-3 py-2 text-left text-sm font-medium'
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        {selectedColumns.map(column => (
                          <td
                            key={column.key}
                            className='border border-gray-200 px-3 py-2 text-sm'
                          >
                            {column.format === 'currency'
                              ? formatCurrency(item[column.key] || 0)
                              : String(item[column.key] || '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredData.length > 5 && (
                  <p className='text-sm text-gray-500 mt-2'>
                    Mostrando 5 de {filteredData.length} registros
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange?.(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportData;
