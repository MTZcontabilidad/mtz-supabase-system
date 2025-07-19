import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

const LoadingSpinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <Loader2
      className={cn('animate-spin text-mtz-primary', sizes[size], className)}
    />
  );
};

export default LoadingSpinner;