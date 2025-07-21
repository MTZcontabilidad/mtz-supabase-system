// =====================================================================
// ⚙️ CONFIGURACIÓN GLOBAL - SISTEMA MTZ v3.0
// =====================================================================

/**
 * Configuración global del sistema MTZ
 */
export const MTZ_CONFIG = {
  // Información del sistema
  name: 'Sistema MTZ',
  version: '3.0.0',
  environment: import.meta.env.MODE,
  buildDate: new Date().toISOString(),

  // Configuración de Supabase
  supabase: {
    url:
      import.meta.env.VITE_SUPABASE_URL ||
      'https://bwgnmastihgndmtbqvkj.supabase.co',
    anonKey:
      import.meta.env.VITE_SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9Wdd',
    storage: {
      bucket: 'mtz-documents',
      maxFileSize: 10 * 1024 * 1024, // 10MB
    },
  },

  // Configuración de la aplicación
  app: {
    name: 'MTZ Sistema de Gestión',
    description: 'Sistema integral de gestión empresarial',
    company: 'MTZ Consultores Tributarios',
    year: new Date().getFullYear(),
    contact: {
      email: 'mtzcontabilidad@gmail.com',
      phone: '+56 9 XXXX XXXX',
      website: 'https://mtz.cl',
    },
  },

  // Configuración de rutas
  routes: {
    dashboard: '/dashboard',
    clientes: '/clientes',
    ventas: '/ventas',
    cobranza: '/cobranza',
    compras: '/compras',
    contratos: '/contratos',
    analytics: '/analytics',
    reportes: '/reportes',
    reportesAvanzados: '/reportes-avanzados',
    configuracion: '/configuracion',
    admin: {
      usuarios: '/admin/usuarios',
    },
    auth: {
      login: '/login',
      register: '/register',
      resetPassword: '/reset-password',
    },
  },

  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
    maxPageSize: 100,
  },

  // Configuración de archivos
  files: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
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
    imageTypes: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    documentTypes: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'],
  },

  // Configuración de notificaciones
  notifications: {
    autoHideDuration: 5000,
    maxSnack: 3,
    positions: [
      'top-right',
      'top-center',
      'top-left',
      'bottom-right',
      'bottom-center',
      'bottom-left',
    ],
  },

  // Configuración de validación
  validation: {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Ingrese un email válido',
    },
    rut: {
      pattern: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/,
      message: 'Ingrese un RUT válido (formato: 12.345.678-9)',
    },
    phone: {
      pattern: /^\+?[0-9\s\-()]{8,}$/,
      message: 'Ingrese un teléfono válido',
    },
  },

  // Configuración de seguridad
  security: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    session: {
      timeout: 24 * 60 * 60 * 1000, // 24 horas
      refreshInterval: 5 * 60 * 1000, // 5 minutos
    },
    mfa: {
      enabled: false,
      methods: ['email', 'sms'],
    },
  },

  // Configuración de moneda
  currency: {
    code: 'CLP',
    symbol: '$',
    locale: 'es-CL',
    format: {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },

  // Configuración de fechas
  date: {
    locale: 'es-CL',
    timezone: 'America/Santiago',
    format: {
      short: 'dd/MM/yyyy',
      long: 'dd/MM/yyyy HH:mm',
      iso: 'yyyy-MM-dd',
    },
  },

  // Configuración de roles y permisos
  roles: {
    admin: {
      name: 'Administrador',
      permissions: ['*'],
    },
    colaborador: {
      name: 'Colaborador',
      permissions: ['read', 'write', 'delete'],
    },
    cliente: {
      name: 'Cliente',
      permissions: ['read'],
    },
  },

  // Configuración de temas
  themes: {
    light: {
      name: 'Claro',
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    dark: {
      name: 'Oscuro',
      primary: '#60A5FA',
      secondary: '#9CA3AF',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
    },
  },

  // Configuración de performance
  performance: {
    debounceDelay: 300,
    throttleDelay: 100,
    autoRefreshInterval: 30000, // 30 segundos
    maxRetries: 3,
    timeout: 10000, // 10 segundos
  },

  // Configuración de analytics
  analytics: {
    enabled: true,
    trackingId: import.meta.env.VITE_GA_TRACKING_ID,
    events: {
      pageView: 'page_view',
      userAction: 'user_action',
      error: 'error',
    },
  },
};

// Configuración de desarrollo
export const DEV_CONFIG = {
  debug: import.meta.env.DEV,
  logLevel: import.meta.env.DEV ? 'debug' : 'error',
  mockData: import.meta.env.DEV,
  hotReload: import.meta.env.DEV,
};

// Configuración de producción
export const PROD_CONFIG = {
  debug: false,
  logLevel: 'error',
  mockData: false,
  hotReload: false,
};

// Exportar configuración según el entorno
export const CONFIG = import.meta.env.PROD ? PROD_CONFIG : DEV_CONFIG;

export default MTZ_CONFIG;
