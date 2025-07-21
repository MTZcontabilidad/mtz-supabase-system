/**
 * Utilidades de seguridad para MTZ
 * Centraliza funciones de seguridad y validación
 */

// Headers de seguridad recomendados
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Validar email con regex mejorado
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const validateEmail = email => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validar contraseña con criterios de seguridad
 * @param {string} password - Contraseña a validar
 * @returns {Object} - Resultado de validación
 */
export const validatePassword = password => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isValid =
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar;

  return {
    isValid,
    errors: {
      tooShort: password.length < minLength,
      noUpperCase: !hasUpperCase,
      noLowerCase: !hasLowerCase,
      noNumbers: !hasNumbers,
      noSpecialChar: !hasSpecialChar,
    },
  };
};

/**
 * Sanitizar input para prevenir XSS
 * @param {string} input - Input a sanitizar
 * @returns {string} - Input sanitizado
 */
export const sanitizeInput = input => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .replace(/"/g, '') // Remover comillas dobles
    .trim();
};

/**
 * Generar token CSRF simple
 * @returns {string} - Token CSRF
 */
export const generateCSRFToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

/**
 * Validar token CSRF
 * @param {string} token - Token a validar
 * @param {string} storedToken - Token almacenado
 * @returns {boolean} - True si es válido
 */
export const validateCSRFToken = (token, storedToken) => {
  return token && storedToken && token === storedToken;
};

/**
 * Log de eventos de seguridad
 * @param {string} event - Tipo de evento
 * @param {Object} data - Datos del evento
 */
export const logSecurityEvent = (event, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    data,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  console.log('🔒 Security Event:', logEntry);

  // TODO: Enviar a servicio de logging en producción
  // await sendToSecurityLog(logEntry);
};
