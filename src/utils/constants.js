// =====================================================================
// 📋 CONSTANTES GLOBALES - SISTEMA MTZ v3.0
// =====================================================================

// =====================================================================
// 🏢 CONSTANTES DE EMPRESA
// =====================================================================

export const COMPANY = {
  name: 'MTZ Consultores Tributarios',
  shortName: 'MTZ',
  email: 'mtzcontabilidad@gmail.com',
  phone: '+56 9 XXXX XXXX',
  website: 'https://mtz.cl',
  address: 'Santiago, Chile',
  ruc: 'XX.XXX.XXX-X',
};

// =====================================================================
// 🎨 CONSTANTES DE UI
// =====================================================================

export const UI = {
  // Colores del sistema
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    dark: '#1F2937',
    light: '#F9FAFB',
  },

  // Breakpoints
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },

  // Animaciones
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// =====================================================================
// 📊 CONSTANTES DE DATOS
// =====================================================================

export const DATA = {
  // Estados de clientes
  clientStatus: {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
    SUSPENDIDO: 'suspendido',
    PENDIENTE: 'pendiente',
  },

  // Categorías de clientes
  clientCategories: {
    VIP: 'VIP',
    PREMIUM: 'Premium',
    TOP: 'Top',
    REGULAR: 'Regular',
    BAJO: 'Bajo',
  },

  // Tipos de documentos
  documentTypes: {
    FACTURA: 'factura',
    BOLETA: 'boleta',
    NOTA_CREDITO: 'nota_credito',
    NOTA_DEBITO: 'nota_debito',
    FACTURA_EXENTA: 'factura_exenta',
    FACTURA_EXPORTACION: 'factura_exportacion',
  },

  // Estados de documentos
  documentStatus: {
    PENDIENTE: 'pendiente',
    PAGADO: 'pagado',
    VENCIDO: 'vencido',
    ANULADO: 'anulado',
    PROCESADO: 'procesado',
  },

  // Tipos de declaraciones
  declarationTypes: {
    F29: 'f29',
    F50: 'f50',
    RENTA: 'renta',
    IVA: 'iva',
    RETENCION: 'retencion',
    PATENTE: 'patente',
    MUNICIPAL: 'municipal',
  },

  // Estados de declaraciones
  declarationStatus: {
    PENDIENTE: 'pendiente',
    BORRADOR: 'borrador',
    PRESENTADA: 'presentada',
    PAGADA: 'pagada',
    VENCIDA: 'vencida',
    RECTIFICADA: 'rectificada',
  },

  // Tipos de empresas
  companyTypes: {
    CLIENTE: 'cliente',
    PROVEEDOR: 'proveedor',
    CLIENTE_PROVEEDOR: 'cliente_proveedor',
    COMPETIDOR: 'competidor',
    OTRO: 'otro',
  },

  // Estados de empresas
  companyStatus: {
    ACTIVA: 'activa',
    INACTIVA: 'inactiva',
    SUSPENDIDA: 'suspendida',
    EN_LIQUIDACION: 'en_liquidacion',
  },
};

// =====================================================================
// 🔐 CONSTANTES DE SEGURIDAD
// =====================================================================

export const SECURITY = {
  // Roles del sistema
  roles: {
    ADMIN: 'admin',
    COLABORADOR: 'colaborador',
    CLIENTE: 'cliente',
    EXTERNO: 'externo',
  },

  // Permisos
  permissions: {
    READ: 'read',
    WRITE: 'write',
    DELETE: 'delete',
    ADMIN: 'admin',
    ALL: '*',
  },

  // Configuración de contraseñas
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },

  // Configuración de sesión
  session: {
    timeout: 24 * 60 * 60 * 1000, // 24 horas
    refreshInterval: 5 * 60 * 1000, // 5 minutos
  },
};

// =====================================================================
// 📅 CONSTANTES DE FECHAS
// =====================================================================

export const DATES = {
  // Formatos de fecha
  formats: {
    SHORT: 'dd/MM/yyyy',
    LONG: 'dd/MM/yyyy HH:mm',
    ISO: 'yyyy-MM-dd',
    TIME: 'HH:mm',
    DATETIME: 'dd/MM/yyyy HH:mm:ss',
  },

  // Locale
  locale: 'es-CL',
  timezone: 'America/Santiago',

  // Meses
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],

  // Días de la semana
  weekDays: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
};

// =====================================================================
// 💰 CONSTANTES DE MONEDA
// =====================================================================

export const CURRENCY = {
  // Moneda principal
  primary: {
    code: 'CLP',
    symbol: '$',
    name: 'Peso Chileno',
    locale: 'es-CL',
  },

  // Otras monedas
  others: {
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'Dólar Estadounidense',
      locale: 'en-US',
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      locale: 'es-ES',
    },
  },

  // Configuración de formato
  format: {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
};

// =====================================================================
// 📱 CONSTANTES DE RESPONSIVE
// =====================================================================

export const RESPONSIVE = {
  // Breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },

  // Configuración de grid
  grid: {
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
      wide: 4,
    },
    gap: {
      mobile: 16,
      tablet: 20,
      desktop: 24,
      wide: 32,
    },
  },
};

// =====================================================================
// 🎯 CONSTANTES DE VALIDACIÓN
// =====================================================================

export const VALIDATION = {
  // Patrones de validación
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    rut: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/,
    phone: /^\+?[0-9\s\-()]{8,}$/,
    url: /^https?:\/\/.+/,
    password:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },

  // Mensajes de error
  messages: {
    required: 'Este campo es obligatorio',
    email: 'Ingrese un email válido',
    rut: 'Ingrese un RUT válido (formato: 12.345.678-9)',
    phone: 'Ingrese un teléfono válido',
    url: 'Ingrese una URL válida',
    password:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
    minLength: min => `Mínimo ${min} caracteres`,
    maxLength: max => `Máximo ${max} caracteres`,
    minValue: min => `Valor mínimo: ${min}`,
    maxValue: max => `Valor máximo: ${max}`,
  },

  // Límites
  limits: {
    name: { min: 2, max: 100 },
    email: { max: 255 },
    phone: { min: 8, max: 20 },
    rut: { min: 9, max: 12 },
    password: { min: 8, max: 128 },
    description: { max: 1000 },
    address: { max: 500 },
  },
};

// =====================================================================
// 📊 CONSTANTES DE PAGINACIÓN
// =====================================================================

export const PAGINATION = {
  // Tamaños de página
  pageSizes: [5, 10, 20, 50, 100],
  defaultPageSize: 10,
  maxPageSize: 100,

  // Configuración de navegación
  navigation: {
    showFirstLast: true,
    showPrevNext: true,
    showPageNumbers: true,
    maxPageNumbers: 5,
  },
};

// =====================================================================
// 🔔 CONSTANTES DE NOTIFICACIONES
// =====================================================================

export const NOTIFICATIONS = {
  // Tipos de notificación
  types: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },

  // Posiciones
  positions: {
    TOP_RIGHT: 'top-right',
    TOP_CENTER: 'top-center',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_LEFT: 'bottom-left',
  },

  // Configuración
  config: {
    autoHideDuration: 5000,
    maxSnack: 3,
    preventDuplicate: true,
  },
};

// =====================================================================
// 📁 CONSTANTES DE ARCHIVOS
// =====================================================================

export const FILES = {
  // Tipos de archivo permitidos
  allowedTypes: {
    images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'],
    all: [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.csv',
      '.jpg',
      '.jpeg',
      '.png',
    ],
  },

  // Tamaños máximos
  maxSizes: {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    all: 10 * 1024 * 1024, // 10MB
  },

  // Configuración de upload
  upload: {
    maxFiles: 5,
    chunkSize: 1024 * 1024, // 1MB
    retryAttempts: 3,
  },
};

// =====================================================================
// 🎨 CONSTANTES DE TEMAS
// =====================================================================

export const THEMES = {
  // Temas disponibles
  available: {
    light: {
      name: 'Claro',
      value: 'light',
    },
    dark: {
      name: 'Oscuro',
      value: 'dark',
    },
    auto: {
      name: 'Automático',
      value: 'auto',
    },
  },

  // Configuración por defecto
  default: 'light',
  storageKey: 'mtz-theme',
};

// =====================================================================
// 🚀 CONSTANTES DE PERFORMANCE
// =====================================================================

export const PERFORMANCE = {
  // Delays
  delays: {
    debounce: 300,
    throttle: 100,
    autoRefresh: 30000, // 30 segundos
  },

  // Timeouts
  timeouts: {
    api: 10000, // 10 segundos
    connection: 5000, // 5 segundos
    retry: 1000, // 1 segundo
  },

  // Límites
  limits: {
    maxRetries: 3,
    maxConcurrentRequests: 5,
    maxCacheSize: 100,
  },
};

export default {
  COMPANY,
  UI,
  DATA,
  SECURITY,
  DATES,
  CURRENCY,
  RESPONSIVE,
  VALIDATION,
  PAGINATION,
  NOTIFICATIONS,
  FILES,
  THEMES,
  PERFORMANCE,
};
