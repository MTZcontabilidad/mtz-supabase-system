import { cn } from '@/utils/helpers';

/**
 * Badge Component
 * Componente de etiqueta profesional para estados y categorías.
 * Soporta múltiples variantes y tamaños.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante de estilo
 * @param {string} props.size - Tamaño del badge
 * @param {ReactNode} props.children - Contenido del badge
 * @param {string} props.className - Clases CSS adicionales
 */
const Badge = ({
  variant = 'default',
  size = 'default',
  children,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    vip: 'bg-purple-100 text-purple-800',
    premium: 'bg-cyan-100 text-cyan-800',
    top: 'bg-orange-100 text-orange-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
