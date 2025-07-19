import { cn } from '../../utils/helpers.js';

/**
 * Table Component
 * Tabla responsive y profesional para sistemas empresariales.
 * Soporta ordenamiento, paginación y filtros.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos a mostrar
 * @param {Array} props.columns - Configuración de columnas
 * @param {boolean} props.loading - Estado de carga
 * @param {Function} props.onSort - Función para ordenamiento
 * @param {Object} props.sortConfig - Configuración de ordenamiento actual
 * @param {string} props.className - Clases CSS adicionales
 */
const Table = ({
  data = [],
  columns = [],
  loading = false,
  onSort,
  sortConfig,
  className,
  ...props
}) => {
  if (loading) {
    return (
      <div className='w-full p-8 text-center'>
        <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <p className='mt-2 text-gray-500'>Cargando datos...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className='w-full p-8 text-center text-gray-500'>
        <p>No hay datos para mostrar</p>
      </div>
    );
  }

  const handleSort = (columnKey) => {
    if (onSort && columnKey) {
      onSort(columnKey);
    }
  };

  return (
    <div className={cn('overflow-x-auto shadow-sm border border-gray-200 rounded-lg', className)} {...props}>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                scope='col'
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  column.sortable && 'cursor-pointer hover:bg-gray-100',
                  column.className
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className='flex items-center space-x-1'>
                  <span>{column.title}</span>
                  {column.sortable && sortConfig && (
                    <span className='ml-2'>
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : (
                        '↕'
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className='hover:bg-gray-50'>
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${column.key || colIndex}`}
                  className={cn(
                    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                    column.cellClassName
                  )}
                >
                  {column.render
                    ? column.render(row[column.key], row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;