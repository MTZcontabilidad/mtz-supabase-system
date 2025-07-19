import { cn } from '../../utils/helpers';

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
          'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className='text-sm text-red-600'>{error}</p>
      )}
    </div>
  );
};

export default Input;