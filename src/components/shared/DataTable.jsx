import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
} from 'lucide-react';
import { Table, Button, Input, Badge } from '../../ui';
import { cn, formatCurrency, formatDate } from '../../../utils/helpers';

/**
 * DataTable Component
 * Tabla de datos profesional con búsqueda, paginación y filtros.
 * Optimizada para grandes volúmenes de datos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos a mostrar
 * @param {Array} props.columns - Configuración de columnas
 * @param {Object} props.searchConfig - Configuración de búsqueda
 * @param {Object} props.paginationConfig - Configuración de paginación
 * @param {Function} props.onRowClick - Callback al hacer click en una fila
 * @param {Function} props.onExport - Callback para exportar datos
 * @param {boolean} props.loading - Estado de carga
 */
const DataTable = ({
  data = [],
  columns = [],
  searchConfig = {},
  paginationConfig = {},
  onRowClick,
  onExport,
  loading = false,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const {
    searchable = true,
    searchPlaceholder = 'Buscar...',
    searchFields = [],
  } = searchConfig;

  const {
    enabled: paginationEnabled = true,
    pageSize = 10,
    showPageInfo = true,
    showPageSizeSelector = true,
  } = paginationConfig;

  // Filtrar y ordenar datos
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Aplicar búsqueda
    if (searchTerm && searchFields.length > 0) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field]?.toString().toLowerCase() || '';
          return value.includes(searchTerm.toLowerCase());
        })
      );
    }

    // Aplicar ordenamiento
    if (sortConfig.key) {
      filtered.sort((a, b) => {
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
    }

    return filtered;
  }, [data, searchTerm, searchFields, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(processedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = paginationEnabled
    ? processedData.slice(startIndex, endIndex)
    : processedData;

  // Manejar ordenamiento
  const handleSort = key => {
    setSortConfig(prevConfig => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  // Manejar cambio de página
  const handlePageChange = page => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Resetear página cuando cambia la búsqueda
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className='w-full p-8 text-center'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <p className='mt-2 text-gray-500'>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header con búsqueda y acciones */}
      <div className='flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
        {searchable && (
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        )}
        
        <div className='flex gap-2'>
          {onExport && (
            <Button variant='outline' size='sm' onClick={onExport}>
              <Download className='w-4 h-4 mr-2' />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Información de resultados */}
      {showPageInfo && (
        <div className='flex justify-between items-center text-sm text-gray-600'>
          <span>
            {processedData.length === 0
              ? 'No hay resultados'
              : `Mostrando ${startIndex + 1} a ${
                  Math.min(endIndex, processedData.length)
                } de ${processedData.length} resultados`}
          </span>
          {searchTerm && (
            <Badge variant='outline' size='sm'>
              Filtrado por: "{searchTerm}"
            </Badge>
          )}
        </div>
      )}

      {/* Tabla */}
      <Table
        data={currentData}
        columns={columns.map(col => ({
          ...col,
          sortable: col.sortable !== false,
        }))}
        onSort={handleSort}
        sortConfig={sortConfig}
        onRowClick={onRowClick}
        className='border rounded-lg'
      />

      {/* Paginación */}
      {paginationEnabled && totalPages > 1 && (
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Página:</span>
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className='w-4 h-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>
              
              <span className='px-3 py-1 text-sm font-medium'>
                {currentPage} de {totalPages}
              </span>
              
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {showPageSizeSelector && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Mostrar:</span>
              <select
                value={pageSize}
                onChange={e => {
                  // Aquí podrías agregar lógica para cambiar el tamaño de página
                  console.log('Page size changed:', e.target.value);
                }}
                className='px-2 py-1 border border-gray-300 rounded text-sm'
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className='text-sm text-gray-600'>por página</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;