import { cn } from '@/utils/helpers.js';

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <input
        className={cn(
          'input',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default Input;
