import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

/**
 * Toast Component
 * Sistema de notificaciones profesional usando Radix UI.
 * Soporta diferentes tipos y posiciones.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la notificación
 * @param {string} props.description - Descripción de la notificación
 * @param {string} props.variant - Tipo de notificación
 * @param {boolean} props.open - Estado abierto/cerrado
 * @param {Function} props.onOpenChange - Callback para cambio de estado
 */
const Toast = ToastPrimitive.Root;

const ToastProvider = ToastPrimitive.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

const ToastContent = React.forwardRef(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-gray-200',
      success: 'bg-green-50 border border-green-200 text-green-900',
      error: 'bg-red-50 border border-red-200 text-red-900',
      warning: 'bg-yellow-50 border border-yellow-200 text-yellow-900',
      info: 'bg-blue-50 border border-blue-200 text-blue-900',
    };

    return (
      <ToastPrimitive.Content
        ref={ref}
        className={cn(
          'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
ToastContent.displayName = ToastPrimitive.Content.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
      className
    )}
    toast-close=''
    {...props}
  >
    <X className='h-4 w-4' />
  </ToastPrimitive.Close>
));
ToastClose.displayName = ToastPrimitive.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitive.Action.displayName;

// Hook para usar toasts
const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(
    ({ title, description, variant = 'default', ...props }) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = {
        id,
        title,
        description,
        variant,
        ...props,
      };

      setToasts(prev => [...prev, newToast]);

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);

      return id;
    },
    []
  );

  const dismiss = React.useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
  };
};

// Componente Toast con ícono
const ToastWithIcon = ({ variant, title, description, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    default: Info,
  };

  const Icon = icons[variant] || icons.default;

  return (
    <Toast>
      <ToastContent variant={variant}>
        <div className='flex items-start gap-3'>
          <Icon className='h-5 w-5 mt-0.5 flex-shrink-0' />
          <div className='flex-1'>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
        </div>
        <ToastClose onClick={onClose} />
      </ToastContent>
    </Toast>
  );
};

export {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastContent,
  ToastClose,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastWithIcon,
  useToast,
};