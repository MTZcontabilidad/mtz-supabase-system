import React from 'react';
import { cn } from '@/utils/helpers';

/**
 * Progress Component
 * Barra de progreso profesional para sistemas empresariales.
 * Soporta diferentes variantes y estados.
 *
 * @param {Object} props - Propiedades del componente
 * @param {number} props.value - Valor actual (0-100)
 * @param {number} props.max - Valor máximo (default: 100)
 * @param {string} props.variant - Variante de estilo
 * @param {string} props.size - Tamaño del componente
 * @param {boolean} props.showLabel - Si mostrar etiqueta
 */
const Progress = React.forwardRef(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'default',
      size = 'default',
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variants = {
      default: 'bg-blue-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
    };

    const sizes = {
      sm: 'h-1',
      default: 'h-2',
      lg: 'h-3',
    };

    return (
      <div className={cn('w-full', className)} {...props}>
        <div className='flex items-center justify-between mb-2'>
          {showLabel && (
            <span className='text-sm font-medium text-gray-700'>Progreso</span>
          )}
          {showLabel && (
            <span className='text-sm text-gray-500'>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        <div
          ref={ref}
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            sizes[size]
          )}
        >
          <div
            className={cn(
              'h-full transition-all duration-300 ease-in-out',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export default Progress;
