// =====================================================================
// 🛠️ UTILIDADES GLOBALES - SISTEMA MTZ v3.0
// =====================================================================

// Configuración del sistema
const MTZ_CONFIG = {
  app: {
    name: 'MTZ Sistema',
    version: '3.0.0',
  },
};

// =====================================================================
// 📅 FUNCIONES DE FECHA
// =====================================================================

/**
 * Formatear fecha según configuración
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';

  const options = {
    short: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    long: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
    iso: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  };

  return dateObj.toLocaleDateString(MTZ_CONFIG.date.locale, options[format]);
};

/**
 * Formatear fecha relativa (hace X tiempo)
 */
export const formatRelativeDate = date => {
  if (!date) return 'N/A';

  const now = new Date();
  const dateObj = new Date(date);
  const diffInMs = now - dateObj;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
  if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;

  return `Hace ${Math.floor(diffInDays / 365)} años`;
};

/**
 * Validar si una fecha es válida
 */
export const isValidDate = date => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// =====================================================================
// 💰 FUNCIONES DE MONEDA
// =====================================================================

/**
 * Formatear moneda según configuración
 */
export const formatCurrency = (amount, currency = 'CLP') => {
  if (amount === null || amount === undefined) return '$0';

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '$0';

  return new Intl.NumberFormat(MTZ_CONFIG.currency.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

/**
 * Formatear número con separadores de miles
 */
export const formatNumber = number => {
  if (number === null || number === undefined) return '0';

  const num = parseFloat(number);
  if (isNaN(num)) return '0';

  return new Intl.NumberFormat(MTZ_CONFIG.currency.locale).format(num);
};

/**
 * Formatear porcentaje
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';

  const num = parseFloat(value);
  if (isNaN(num)) return '0%';

  return `${num.toFixed(decimals)}%`;
};

// =====================================================================
// 🔍 FUNCIONES DE VALIDACIÓN
// =====================================================================

/**
 * Validar email
 */
export const validateEmail = email => {
  return MTZ_CONFIG.validation.email.pattern.test(email);
};

/**
 * Validar RUT chileno
 */
export const validateRut = rut => {
  return MTZ_CONFIG.validation.rut.pattern.test(rut);
};

/**
 * Formatear RUT chileno (ej: 12345678-9)
 */
export const formatRUT = rut => {
  if (!rut) return '';

  // Limpiar el RUT de puntos y guiones
  let cleanRut = rut.toString().replace(/[.-]/g, '');

  // Si no tiene dígito verificador, agregar uno temporal
  if (cleanRut.length < 2) return rut;

  // Separar número y dígito verificador
  const numero = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  // Formatear con puntos y guión
  let formatted = '';
  for (let i = numero.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formatted = '.' + formatted;
    }
    formatted = numero[i] + formatted;
  }

  return `${formatted}-${dv}`;
};

/**
 * Validar teléfono
 */
export const validatePhone = phone => {
  return MTZ_CONFIG.validation.phone.pattern.test(phone);
};

/**
 * Validar archivo
 */
export const validateFile = (file, maxSize = MTZ_CONFIG.files.maxSize) => {
  if (!file)
    return { isValid: false, error: 'No se seleccionó ningún archivo' };

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Máximo ${formatFileSize(
        maxSize
      )}`,
    };
  }

  return { isValid: true };
};

// =====================================================================
// 📁 FUNCIONES DE ARCHIVOS
// =====================================================================

/**
 * Formatear tamaño de archivo
 */
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obtener extensión de archivo
 */
export const getFileExtension = filename => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Validar tipo de archivo
 */
export const isValidFileType = (
  filename,
  allowedTypes = MTZ_CONFIG.files.allowedTypes
) => {
  const extension = getFileExtension(filename).toLowerCase();
  return allowedTypes.includes(`.${extension}`);
};

// =====================================================================
// 🎨 FUNCIONES DE UI
// =====================================================================

/**
 * Combinar clases CSS con clsx
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Generar color aleatorio
 */
export const generateRandomColor = () => {
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#EC4899',
    '#6366F1',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Obtener color por estado
 */
export const getStatusColor = status => {
  const colors = {
    activo: 'text-green-600',
    inactivo: 'text-red-600',
    pendiente: 'text-yellow-600',
    completado: 'text-green-600',
    cancelado: 'text-red-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    success: 'text-green-600',
  };
  return colors[status] || 'text-gray-600';
};

// =====================================================================
// 🔧 FUNCIONES DE UTILIDAD
// =====================================================================

/**
 * Debounce function
 */
export const debounce = (
  func,
  delay = MTZ_CONFIG.performance.debounceDelay
) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (
  func,
  delay = MTZ_CONFIG.performance.throttleDelay
) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

/**
 * Generar ID único
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Capitalizar primera letra
 */
export const capitalize = str => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncar texto
 */
export const truncate = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Limpiar objeto de valores nulos/undefined
 */
export const cleanObject = obj => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ''
    )
  );
};

/**
 * Copiar al portapapeles
 */
export const copyToClipboard = async text => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Error copiando al portapapeles:', error);
    return { success: false, error: error.message };
  }
};

// =====================================================================
// 📊 FUNCIONES DE DATOS
// =====================================================================

/**
 * Agrupar array por propiedad
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Ordenar array por múltiples propiedades
 */
export const sortBy = (array, ...keys) => {
  return array.sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
};

/**
 * Filtrar array por término de búsqueda
 */
export const filterBySearch = (array, searchTerm, fields = []) => {
  if (!searchTerm) return array;

  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

/**
 * Calcular promedio
 */
export const calculateAverage = (array, field) => {
  if (!array || array.length === 0) return 0;

  const sum = array.reduce(
    (acc, item) => acc + (parseFloat(item[field]) || 0),
    0
  );
  return sum / array.length;
};

/**
 * Calcular suma
 */
export const calculateSum = (array, field) => {
  if (!array || array.length === 0) return 0;

  return array.reduce((acc, item) => acc + (parseFloat(item[field]) || 0), 0);
};

// =====================================================================
// 🔐 FUNCIONES DE SEGURIDAD
// =====================================================================

/**
 * Sanitizar string para prevenir XSS
 */
export const sanitizeString = str => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Generar contraseña segura
 */
export const generateSecurePassword = (length = 12) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
};

// =====================================================================
// 📱 FUNCIONES DE DISPOSITIVOS
// =====================================================================

/**
 * Detectar si es dispositivo móvil
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detectar si es tablet
 */
export const isTablet = () => {
  return /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(
    navigator.userAgent
  );
};

/**
 * Obtener tamaño de pantalla
 */
export const getScreenSize = () => {
  const width = window.innerWidth;

  if (width < 640) return 'sm';
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
};

// =====================================================================
// 🎯 FUNCIONES DE ERRORES
// =====================================================================

/**
 * Manejar errores de forma consistente
 */
export const handleError = (error, context = '') => {
  console.error(`Error en ${context}:`, error);

  const errorMessage =
    error?.message || error?.toString() || 'Error desconocido';

  return {
    error: true,
    message: errorMessage,
    context,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Validar respuesta de API
 */
export const validateApiResponse = response => {
  if (!response) {
    return { isValid: false, error: 'No hay respuesta del servidor' };
  }

  if (response.error) {
    return { isValid: false, error: response.error };
  }

  return { isValid: true, data: response.data || response };
};

export default {
  formatDate,
  formatCurrency,
  formatNumber,
  validateEmail,
  validateRut,
  formatRUT,
  cn,
  debounce,
  throttle,
  generateId,
  capitalize,
  truncate,
  cleanObject,
  copyToClipboard,
  groupBy,
  sortBy,
  filterBySearch,
  calculateAverage,
  calculateSum,
  sanitizeString,
  isMobile,
  isTablet,
  getScreenSize,
  handleError,
  validateApiResponse,
};
