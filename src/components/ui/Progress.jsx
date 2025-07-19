import React from 'react';
import { cn } from '../../utils/helpers.js';

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
const Progress = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-cyan-600',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className='flex justify-between text-sm mb-1'>
          <span className='text-gray-600'>Progreso</span>
          <span className='font-medium text-gray-900'>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;