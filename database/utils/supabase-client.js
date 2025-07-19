// =====================================================================
// 🔧 CLIENTE SUPABASE OPTIMIZADO MTZ
// Archivo: utils/supabase-client.js
// Propósito: Configuración centralizada y optimizada del cliente Supabase
// Dependencias: @supabase/supabase-js
// =====================================================================

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I'

// Configuración optimizada del cliente
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'MTZ-Ouroborus-AI-v3.0'
    }
  }
}

// Crear cliente Supabase optimizado
const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig)

/**
 * Verificar conexión con Supabase
 */
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('nombre')
      .limit(1)
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return false
    }
    
    console.log('✅ Conexión con Supabase establecida')
    return true
  } catch (error) {
    console.error('❌ Error de red:', error.message)
    return false
  }
}

/**
 * Obtener información del usuario actual
 */
async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error obteniendo usuario:', error.message)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error en getCurrentUser:', error.message)
    return null
  }
}

/**
 * Verificar si el usuario está autenticado
 */
async function isAuthenticated() {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Obtener rol del usuario actual
 */
async function getCurrentUserRole() {
  try {
    const user = await getCurrentUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .rpc('get_user_role', { user_id: user.id })
    
    if (error) {
      console.error('Error obteniendo rol:', error.message)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error en getCurrentUserRole:', error.message)
    return null
  }
}

/**
 * Manejar errores de Supabase de forma centralizada
 */
function handleSupabaseError(error, context = '') {
  console.error(`❌ Error Supabase ${context}:`, error.message)
  
  // Mapear errores comunes a mensajes amigables
  const errorMessages = {
    'Invalid login credentials': 'Credenciales de acceso incorrectas',
    'Email not confirmed': 'Email no confirmado. Revisa tu bandeja de entrada',
    'User not found': 'Usuario no encontrado',
    'row-level security': 'Sin permisos para acceder a este recurso'
  }
  
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) {
      return message
    }
  }
  
  return error.message
}

// Exportar cliente y utilidades
export {
  supabase,
  testConnection,
  getCurrentUser,
  isAuthenticated,
  getCurrentUserRole,
  handleSupabaseError
}

// ✅ CLIENTE SUPABASE OPTIMIZADO LISTO
