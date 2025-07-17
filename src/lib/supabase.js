import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase para MTZ
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwgnmastihgndmtbqvkj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Función helper para manejar errores de Supabase
export const handleSupabaseError = (error) => {
  console.error('Error de Supabase:', error)
  
  if (error.message.includes('JWT')) {
    return 'Sesión expirada. Por favor, inicia sesión nuevamente.'
  }
  
  if (error.message.includes('row-level security')) {
    return 'No tienes permisos para realizar esta acción.'
  }
  
  return error.message || 'Error desconocido en la base de datos'
}

// Funciones de utilidad para autenticación
export const authUtils = {
  // Obtener usuario actual
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Cerrar sesión
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  }
}

// Funciones de utilidad para clientes
export const clientUtils = {
  // Obtener todos los clientes
  getAllClients: async () => {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .order('razon_social', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Obtener cliente por ID
  getClientById: async (clientId) => {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .eq('id_cliente', clientId)
      .single()
    
    if (error) throw error
    return data
  },

  // Crear nuevo cliente
  createClient: async (clientData) => {
    const { data, error } = await supabase
      .from('clientes_contables')
      .insert([clientData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Actualizar cliente
  updateClient: async (clientId, updates) => {
    const { data, error } = await supabase
      .from('clientes_contables')
      .update(updates)
      .eq('id_cliente', clientId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

export default supabase