import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn  } from '../../utils/helpers.js';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />

      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel
          className={cn('w-full bg-white rounded-xl shadow-2xl', sizes[size])}
        >
          <div className='flex items-center justify-between p-6 border-b'>
            <Dialog.Title className='text-xl font-semibold text-gray-900'>
              {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          <div className='p-6'>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
