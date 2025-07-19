import { cn } from '@/utils/helpers.js';
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
  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-transparent',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 border-gray-300',
    outline:
      'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-transparent',
    warning:
      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 border-transparent',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
    ghost:
      'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <button
      className={cn(
        'btn',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className='h-4 w-4 animate-spin' />}
      {children}
    </button>
  );
};

export default Button;
