import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Contexto para las notificaciones
const ToastContext = createContext();

// Hook personalizado para usar las notificaciones
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
};

// Componente Toast individual
const Toast = ({ id, type, title, message, duration = 5000, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remover después del tiempo especificado
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onRemove(id), 300); // Esperar animación de salida
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='w-5 h-5 text-green-500' />;
      case 'error':
        return <AlertCircle className='w-5 h-5 text-red-500' />;
      case 'warning':
        return <AlertTriangle className='w-5 h-5 text-yellow-500' />;
      case 'info':
        return <Info className='w-5 h-5 text-blue-500' />;
      default:
        return <Info className='w-5 h-5 text-gray-500' />;
    }
  };

  const getStyles = () => {
    const baseStyles =
      'flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform';

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  return (
    <div
      className={`${getStyles()} ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ minWidth: '300px', maxWidth: '400px' }}
    >
      {getIcon()}
      <div className='flex-1 min-w-0'>
        {title && <h4 className='font-medium text-sm mb-1'>{title}</h4>}
        {message && <p className='text-sm opacity-90'>{message}</p>}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(id), 300);
        }}
        className='flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors'
      >
        <X className='w-4 h-4' />
      </button>
    </div>
  );
};

// Contenedor de toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

// Provider principal
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = toast => {
    const id = Date.now() + Math.random();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = (type, message, options = {}) => {
    return addToast({
      type,
      message,
      ...options,
    });
  };

  // Métodos de conveniencia
  const toast = {
    success: (message, options) => showToast('success', message, options),
    error: (message, options) => showToast('error', message, options),
    warning: (message, options) => showToast('warning', message, options),
    info: (message, options) => showToast('info', message, options),
    show: showToast,
    remove: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Componente de ejemplo de uso
export const ToastExample = () => {
  const toast = useToast();

  return (
    <div className='space-y-2'>
      <button
        onClick={() => toast.success('Operación completada exitosamente!')}
        className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
      >
        Mostrar Éxito
      </button>

      <button
        onClick={() => toast.error('Ha ocurrido un error inesperado')}
        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
      >
        Mostrar Error
      </button>

      <button
        onClick={() => toast.warning('Atención: Este archivo será eliminado')}
        className='px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600'
      >
        Mostrar Advertencia
      </button>

      <button
        onClick={() => toast.info('Nueva actualización disponible')}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        Mostrar Info
      </button>
    </div>
  );
};

export default Toast;
