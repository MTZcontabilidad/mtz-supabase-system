import React, { useState, useCallback, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Loader2, Check, AlertCircle,  } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/Dialog.jsx';

/**
 * ExportData Component - EXPORTACIÓN FUNCIONAL
 * Permite exportar datos a Excel y PDF
 */
const ExportData = ({
  open,
  onOpenChange,
  data = [],
  columns = [],
  filename = 'export',
  title = 'Exportar Datos',
}) => {
  const [exporting, setExporting] = useState(false);
  const [exportType, setExportType] = useState('excel');
  const [error, setError] = useState('');

  // Función para exportar a Excel
  const exportToExcel = async () => {
    try {
      setExporting(true);
      setError('');

      // Preparar datos para Excel
      const excelData = data.map(row => {
        const excelRow = {};
        columns.forEach(col => {
          let value = row[col.key];

          // Formatear según el tipo
          if (col.format === 'currency' && value) {
            value = new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0,
            }).format(value);
          } else if (col.format === 'number' && value) {
            value = new Intl.NumberFormat('es-CL').format(value);
          } else if (col.format === 'date' && value) {
            value = new Date(value).toLocaleDateString('es-CL');
          }

          excelRow[col.label] = value || '';
        });
        return excelRow;
      });

      // Crear workbook
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Datos');

      // Ajustar ancho de columnas
      const colWidths = columns.map(col => ({
        wch: Math.max(col.label.length, 15),
      }));
      ws['!cols'] = colWidths;

      // Generar archivo
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Descargar archivo
      saveAs(
        blob,
        `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`
      );

      console.log('✅ Excel exportado exitosamente');
    } catch (error) {
      console.error('❌ Error exportando Excel:', error);
      setError(
        'Error exportando a Excel. Asegúrate de tener conexión a internet.'
      );
    } finally {
      setExporting(false);
    }
  };

  // Función para exportar a PDF
  const exportToPDF = async () => {
    try {
      setExporting(true);
      setError('');

      // Importar dinámicamente jsPDF y html2canvas
      const [jsPDF, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const { default: jsPDFDefault } = jsPDF;
      const { default: html2canvasDefault } = html2canvas;

      // Crear elemento temporal para renderizar la tabla
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';

      // Crear tabla HTML
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.fontSize = '12px';

      // Crear header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.label;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f8f9fa';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Crear body
      const tbody = document.createElement('tbody');
      data.forEach((row, index) => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
          const td = document.createElement('td');
          let value = row[col.key];

          // Formatear según el tipo
          if (col.format === 'currency' && value) {
            value = new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              minimumFractionDigits: 0,
            }).format(value);
          } else if (col.format === 'number' && value) {
            value = new Intl.NumberFormat('es-CL').format(value);
          } else if (col.format === 'date' && value) {
            value = new Date(value).toLocaleDateString('es-CL');
          }

          td.textContent = value || '';
          td.style.border = '1px solid #ddd';
          td.style.padding = '6px';
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      // Agregar título
      const titleDiv = document.createElement('div');
      titleDiv.textContent = title;
      titleDiv.style.fontSize = '18px';
      titleDiv.style.fontWeight = 'bold';
      titleDiv.style.marginBottom = '20px';
      titleDiv.style.textAlign = 'center';

      // Agregar fecha
      const dateDiv = document.createElement('div');
      dateDiv.textContent = `Generado el: ${new Date().toLocaleString('es-CL')}`;
      dateDiv.style.fontSize = '10px';
      dateDiv.style.color = '#666';
      dateDiv.style.marginBottom = '10px';
      dateDiv.style.textAlign = 'right';

      tempDiv.appendChild(titleDiv);
      tempDiv.appendChild(dateDiv);
      tempDiv.appendChild(table);
      document.body.appendChild(tempDiv);

      // Convertir a canvas
      const canvas = await html2canvasDefault(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDFDefault('l', 'mm', 'a4');
      const imgWidth = 297; // A4 width in mm
      const pageHeight = 210; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar PDF
      pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);

      // Limpiar
      document.body.removeChild(tempDiv);

      console.log('✅ PDF exportado exitosamente');
    } catch (error) {
      console.error('❌ Error exportando PDF:', error);
      setError(
        'Error exportando a PDF. Asegúrate de tener conexión a internet.'
      );
    } finally {
      setExporting(false);
    }
  };

  // Función para exportar
  const handleExport = async () => {
    if (data.length === 0) {
      setError('No hay datos para exportar');
      return;
    }

    if (exportType === 'excel') {
      await exportToExcel();
    } else {
      await exportToPDF();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Download className='h-5 w-5 text-blue-600' />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Información de datos */}
          <div className='p-4 bg-gray-50 rounded-lg'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700'>
                Registros a exportar:
              </span>
              <span className='text-sm font-bold text-gray-900'>
                {data.length}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-700'>
                Columnas:
              </span>
              <span className='text-sm font-bold text-gray-900'>
                {columns.length}
              </span>
            </div>
          </div>

          {/* Selección de formato */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Formato de exportación
            </label>
            <div className='grid grid-cols-2 gap-3'>
              <button
                type='button'
                onClick={() => setExportType('excel')}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  exportType === 'excel'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileSpreadsheet className='h-6 w-6' />
                <span className='text-sm font-medium'>Excel</span>
              </button>

              <button
                type='button'
                onClick={() => setExportType('pdf')}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  exportType === 'pdf'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className='h-6 w-6' />
                <span className='text-sm font-medium'>PDF</span>
              </button>
            </div>
          </div>

          {/* Vista previa de columnas */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Columnas incluidas
            </label>
            <div className='max-h-32 overflow-y-auto border rounded-md p-2'>
              {columns.map((col, index) => (
                <div key={index} className='flex items-center gap-2 py-1'>
                  <Check className='h-3 w-3 text-green-600' />
                  <span className='text-sm text-gray-700'>{col.label}</span>
                  {col.format && (
                    <Badge variant='outline' className='text-xs'>
                      {col.format}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-center gap-2 text-red-700'>
                <AlertCircle className='h-4 w-4' />
                <span className='text-sm'>{error}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting || data.length === 0}
            className='min-w-[120px]'
          >
            {exporting ? (
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                Exportando...
              </>
            ) : (
              <>
                <Download className='h-4 w-4 mr-2' />
                Exportar {exportType.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportData;
