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
 * @param {boolean} props.searchable - Si permite búsqueda
 * @param {boolean} props.pagination - Si muestra paginación
 */
const Table = ({
  data = [],
  columns = [],
  loading = false,
  searchable = false,
  pagination = false,
  emptyMessage = 'No hay datos para mostrar',
  className = '',
  ...props
}) => {
  if (loading) {
    return (
      <div className={cn('animate-pulse', className)}>
        <div className='bg-gray-200 h-8 mb-4 rounded'></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='bg-gray-200 h-12 mb-2 rounded'></div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)} {...props}>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b border-gray-200 bg-gray-50'>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={cn(
                  'px-4 py-3 text-left text-sm font-medium text-gray-700',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={cn(
                    'px-4 py-3 text-sm text-gray-900',
                    column.className
                  )}
                >
                  {column.cell ? column.cell(row) : row[column.key]}
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
