// Componentes UI centralizados para el sistema MTZ
// Exportaciones profesionales para facilitar imports

// Componentes base
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Modal } from './Modal';
export { default as LoadingSpinner } from './LoadingSpinner';

// Componentes avanzados
export { default as Table } from './Table';
export { default as Progress } from './Progress';

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
} from './Dialog';

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './Toast';

// Componentes compartidos
export { default as DataTable } from '../shared/DataTable';

// Componentes de clientes
export { default as SearchFilters } from '../clientes/SearchFilters';
export { default as ClienteForm } from '../clientes/ClienteForm';
