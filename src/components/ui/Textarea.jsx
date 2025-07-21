import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers.js';

const Textarea = forwardRef(
  (
    {
      className,
      placeholder,
      disabled = false,
      error = false,
      size = 'md',
      variant = 'default',
      rows = 4,
      maxLength,
      showCharacterCount = false,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleChange = e => {
      const value = e.target.value;
      setCharCount(value.length);

      if (props.onChange) {
        props.onChange(e);
      }
    };

    const textareaClasses = cn(
      'w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical',
      {
        // Sizes
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-2.5 text-base': size === 'md',
        'px-4 py-3 text-lg': size === 'lg',

        // Variants
        'border-gray-300 text-gray-900 bg-white': variant === 'default',
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

    return (
      <div className='w-full'>
        <textarea
          ref={ref}
          className={textareaClasses}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />

        {(error || showCharacterCount) && (
          <div className='mt-1 flex justify-between items-center'>
            {error && (
              <p className='text-sm text-red-600'>
                {typeof error === 'string' ? error : 'Campo requerido'}
              </p>
            )}

            {showCharacterCount && maxLength && (
              <p
                className={cn(
                  'text-sm ml-auto',
                  charCount > maxLength * 0.9 ? 'text-red-600' : 'text-gray-500'
                )}
              >
                {charCount}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
