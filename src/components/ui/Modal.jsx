import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

      {/* Container */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel
          className={cn(
            'bg-white rounded-lg shadow-xl w-full overflow-hidden',
            sizes[size]
          )}
        >
          {/* Header */}
          {title && (
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <Dialog.Title className='text-lg font-semibold text-gray-900'>
                {title}
              </Dialog.Title>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          )}

          {/* Content */}
          <div className='p-6'>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;