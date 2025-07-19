import { cn } from '../../utils/helpers.js';

/**
 * Badge Component
 * Componente de etiqueta profesional para estados y categorías.
 * Soporta múltiples variantes y tamaños.
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante de estilo
 * @param {string} props.size - Tamaño del badge
 * @param {string} props.className - Clases CSS adicionales
 * @param {ReactNode} props.children - Contenido del badge
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center rounded-full font-medium transition-colors';

  const variants = {
    primary: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    purple: 'bg-purple-100 text-purple-800 border border-purple-200',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700',
    solid: 'bg-gray-800 text-white border border-gray-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;