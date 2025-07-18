import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Verificando sesión inicial...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error.message)
        } else if (session?.user && mounted) {
          console.log('✅ Usuario autenticado:', session.user.email)
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: 'admin', // Simplified for now
            profile: {
              nombre_completo: 'Carlos Villagra',
              cargo: 'Director General MTZ Consultores Tributarios'
            }
          })
        } else {
          console.log('ℹ️ No hay sesión activa')
        }
      } catch (error) {
        console.error('❌ Error en getInitialSession:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getInitialSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event)
        
        if (mounted) {
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ Usuario logueado:', session.user.email)
            setUser({
              id: session.user.id,
              email: session.user.email,
              role: 'admin',
              profile: {
                nombre_completo: 'Carlos Villagra',
                cargo: 'Director General MTZ Consultores Tributarios'
              }
            })
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 Usuario deslogueado')
            setUser(null)
          }
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      console.log('🔐 Intentando login con:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ Error en login:', error.message)
        throw error
      }

      console.log('✅ Login exitoso')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error en signIn:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      console.log('👋 Cerrando sesión...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Error en logout:', error.message)
        throw error
      }

      setUser(null)
      console.log('✅ Logout exitoso')
      return { error: null }
    } catch (error) {
      console.error('❌ Error en signOut:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      console.log('📝 Registrando usuario:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        console.error('❌ Error en registro:', error.message)
        throw error
      }

      console.log('✅ Registro exitoso')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Error en signUp:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (permission) => {
    // Simplified permission system
    return user?.role === 'admin'
  }

  const value = {
    user,
    loading,
    initialized,
    signIn,
    signOut,
    signUp,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}