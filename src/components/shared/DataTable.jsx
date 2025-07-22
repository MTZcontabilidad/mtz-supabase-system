import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Download,  } from 'lucide-react';
import Table from '../ui/Table.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Badge from '../ui/Badge.jsx';
import { cn, formatCurrency, formatDate } from '../../utils/helpers.js';

/**
 * DataTable Component
 * Tabla de datos profesional con búsqueda, paginación y filtros.
 * Optimizada para sistemas empresariales multi-tenant.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos a mostrar
 * @param {Array} props.columns - Configuración de columnas
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.searchable - Si permite búsqueda
 * @param {boolean} props.pagination - Si muestra paginación
 * @param {number} props.pageSize - Tamaño de página por defecto
 * @param {Function} props.onRowClick - Callback al hacer clic en fila
 * @param {Function} props.onExport - Callback para exportar datos
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  pagination = true,
  pageSize = 10,
  onRowClick,
  onExport,
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrar datos por término de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(item => {
      return columns.some(column => {
        const value = column.cell ? column.cell(item) : item[column.key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      });
    });
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginar datos
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  // Calcular información de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  // Manejar ordenamiento
  const handleSort = key => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Manejar cambio de página
  const handlePageChange = page => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Manejar clic en fila
  const handleRowClick = item => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  // Columnas con ordenamiento
  const tableColumns = columns.map(column => ({
    ...column,
    header: (
      <button
        onClick={() => handleSort(column.key)}
        className='flex items-center space-x-1 hover:text-gray-700 transition-colors'
      >
        <span>{column.header}</span>
        {sortConfig.key === column.key && (
          <span className='text-xs'>
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </button>
    ),
  }));

  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Header con búsqueda y acciones */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div className='flex-1 max-w-sm'>
          {searchable && (
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                type='text'
                placeholder='Buscar...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {onExport && (
            <Button variant='outline' size='sm' onClick={onExport}>
              <Download className='h-4 w-4 mr-2' />
              Exportar
            </Button>
          )}

          {pagination && (
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <span>Mostrar</span>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className='border border-gray-300 rounded px-2 py-1'
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>por página</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabla */}
      <Table
        data={paginatedData}
        columns={tableColumns}
        loading={loading}
        className='bg-white rounded-lg shadow'
      />

      {/* Información de resultados */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600'>
        <div>
          Mostrando {startItem} a {endItem} de {filteredData.length} resultados
          {searchTerm && ` para "${searchTerm}"`}
        </div>

        {/* Paginación */}
        {pagination && totalPages > 1 && (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>

            <span className='px-3 py-1 text-sm'>
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
