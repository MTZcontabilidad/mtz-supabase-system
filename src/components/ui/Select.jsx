import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/helpers.js';

const Select = forwardRef(
  (
    {
      className,
      children,
      placeholder = 'Seleccionar...',
      disabled = false,
      error = false,
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'relative w-full';

    const selectClasses = cn(
      'w-full appearance-none bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
      {
        // Sizes
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-2.5 text-base': size === 'md',
        'px-4 py-3 text-lg': size === 'lg',

        // Variants
        'border-gray-300 text-gray-900': variant === 'default',
        'border-blue-300 text-blue-900 bg-blue-50': variant === 'primary',
        'border-green-300 text-green-900 bg-green-50': variant === 'success',
        'border-yellow-300 text-yellow-900 bg-yellow-50': variant === 'warning',
        'border-red-300 text-red-900 bg-red-50': variant === 'error',

        // States
        'opacity-50 cursor-not-allowed': disabled,
        'border-red-500 focus:ring-red-500 focus:border-red-500': error,

        // Hover states
        'hover:border-gray-400': !disabled && !error && variant === 'default',
        'hover:border-blue-400': !disabled && !error && variant === 'primary',
        'hover:border-green-400': !disabled && !error && variant === 'success',
        'hover:border-yellow-400': !disabled && !error && variant === 'warning',
        'hover:border-red-400': !disabled && !error && variant === 'error',
      },
      className
    );

    const iconClasses = cn(
      'absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform',
      {
        'text-gray-400': variant === 'default',
        'text-blue-500': variant === 'primary',
        'text-green-500': variant === 'success',
        'text-yellow-500': variant === 'warning',
        'text-red-500': variant === 'error',
      }
    );

    return (
      <div className={baseClasses}>
        <select
          ref={ref}
          className={selectClasses}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <ChevronDown className={cn(iconClasses, 'h-4 w-4')} />

        {error && (
          <p className='mt-1 text-sm text-red-600'>
            {typeof error === 'string' ? error : 'Campo requerido'}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
