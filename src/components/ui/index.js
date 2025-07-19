// Componentes UI centralizados para el sistema MTZ
// Exportaciones profesionales para facilitar imports

// Componentes base
export { default as Button } from './Button.jsx';
export { default as Input } from './Input.jsx';
export { default as Card } from './Card.jsx';
export { default as Badge } from './Badge.jsx';
export { default as Modal } from './Modal.jsx';
export { default as LoadingSpinner } from './LoadingSpinner.jsx';

// Componentes avanzados
export { default as Table } from './Table.jsx';
export { default as Progress } from './Progress.jsx';

// Componentes Radix UI
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog.jsx';

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './Toast.jsx';

// Componentes compartidos y específicos se importan directamente
// para evitar dependencias circulares
