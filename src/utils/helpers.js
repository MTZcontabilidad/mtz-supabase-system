import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * =====================================================================
 * UTILIDADES CSS Y CLASES
 * =====================================================================
 */

/**
 * Combina clases CSS de manera inteligente usando clsx y tailwind-merge
 * @param {...any} inputs - Clases CSS a combinar
 * @returns {string} - Clases CSS combinadas
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * =====================================================================
 * UTILIDADES DE FORMATEO
 * =====================================================================
 */

/**
 * Formatea un número como moneda chilena
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Moneda (por defecto CLP)
 * @returns {string} - Cantidad formateada
 */
export function formatCurrency(amount, currency = 'CLP') {
  if (!amount && amount !== 0) return '-';

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} - Número formateado
 */
export function formatNumber(number) {
  if (!number && number !== 0) return '-';

  return new Intl.NumberFormat('es-CL').format(number);
}

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale (por defecto es-CL)
 * @returns {string} - Fecha formateada
 */
export function formatDate(date, locale = 'es-CL') {
  if (!date) return '-';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Formatea una fecha en formato corto
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale (por defecto es-CL)
 * @returns {string} - Fecha formateada
 */
export function formatDateShort(date, locale = 'es-CL') {
  if (!date) return '-';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '-';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * =====================================================================
 * UTILIDADES DE VALIDACIÓN
 * =====================================================================
 */

/**
 * Obtiene el color de estado para badges
 * @param {string} status - Estado del cliente
 * @returns {string} - Variante de color
 */
export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case 'activo':
      return 'success';
    case 'inactivo':
      return 'destructive';
    case 'pendiente':
      return 'warning';
    default:
      return 'secondary';
  }
}

/**
 * Valida un RUT chileno
 * @param {string} rut - RUT a validar
 * @returns {boolean} - True si es válido
 */
export function validateRUT(rut) {
  if (!rut) return false;

  // Limpiar formato
  const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();

  // Verificar longitud mínima
  if (cleanRut.length < 2) return false;

  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  // Verificar que el número sea válido
  if (!/^\d+$/.test(rutNumber)) return false;

  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;

  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDV = 11 - (sum % 11);
  const calculatedDV =
    expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();

  return dv === calculatedDV;
}

/**
 * Formatea un RUT con puntos y guión
 * @param {string} rut - RUT a formatear
 * @returns {string} - RUT formateado
 */
export function formatRUT(rut) {
  if (!rut) return '';

  // Limpiar formato
  const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();

  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  // Agregar puntos
  let formatted = '';
  for (let i = rutNumber.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formatted = '.' + formatted;
    }
    formatted = rutNumber[i] + formatted;
  }

  return `${formatted}-${dv}`;
}

/**
 * Verifica si un email es válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Verifica si un teléfono es válido
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - True si es válido
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  // Formato chileno: +56912345678 o 912345678
  const phoneRegex = /^(\+?56)?[9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * =====================================================================
 * UTILIDADES DE MANIPULACIÓN
 * =====================================================================
 */

/**
 * Genera un ID único
 * @returns {string} - ID único
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} str - String a capitalizar
 * @returns {string} - String capitalizado
 */
export function capitalize(str) {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(
  );
}

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @param {string} suffix - Sufijo para texto truncado
 * @returns {string} - Texto truncado
 */
export function truncate(text, length = 50, suffix = '...') {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + suffix;
}

/**
 * =====================================================================
 * UTILIDADES DE OPTIMIZACIÓN
 * =====================================================================
 */

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a debounce
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función debounced
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function para optimizar eventos
 * @param {Function} func - Función a throttle
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} - Función throttled
 */
export function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}