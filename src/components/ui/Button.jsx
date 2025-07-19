import { cn } from '../../utils/helpers.js';
import { Loader2 } from 'lucide-react';

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary:
      'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
    outline:
      'bg-transparent border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost:
      'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children}
    </button>
  );
};

export default Button;