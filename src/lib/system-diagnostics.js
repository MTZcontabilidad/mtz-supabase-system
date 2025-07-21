// =====================================================================
// 🔧 SCRIPT DE VERIFICACIÓN Y CORRECCIÓN MTZ v3.0
// =====================================================================

import { supabase } from './supabase.js';

/**
 * Test de conexión simple a Supabase
 */
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('id')
      .limit(1);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Obtener estado básico del sistema
 */
export const getSystemStatus = async () => {
  try {
    const connection = await testConnection();
    return {
      timestamp: new Date().toISOString(),
      connection: connection.success,
      empresas: connection.data ? connection.data.length : 0,
    };
  } catch (err) {
    return {
      timestamp: new Date().toISOString(),
      connection: false,
      error: err.message,
    };
  }
};

export default testConnection;
