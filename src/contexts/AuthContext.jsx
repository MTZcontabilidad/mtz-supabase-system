import { useState, useEffect, createContext } from 'react';
import { supabase } from '@/lib/supabase';

// Crear contexto de autenticación MINIMALISTA
const AuthContext = createContext({
  user: null,
  userProfile: null,
  role: null,
  permissions: {},
  loading: true,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  hasPermission: () => false,
});

// Exportar el contexto
export { AuthContext };

// Proveedor de autenticación ULTRA-SIMPLIFICADO
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función de login ULTRA-SIMPLE
  const signIn = async (email, password) => {
    try {
      console.log('🔄 Intentando login con:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error en login:', error);
        return { data: null, error: error.message };
      }

      console.log('✅ Login exitoso');
      return { data, error: null };
    } catch (error) {
      console.error('❌ Error en signIn:', error);
      return { data: null, error: error.message };
    }
  };

  // Función de registro ULTRA-SIMPLE
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  };

  // Función de logout ULTRA-SIMPLE
  const signOut = async () => {
    try {
      console.log('🔄 Cerrando sesión...');
      await supabase.auth.signOut();
      setUser(null);
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    }
  };

  // Verificar permisos ULTRA-SIMPLE
  const hasPermission = () => true; // Por simplicidad, siempre permitir

  // Inicialización ULTRA-SIMPLE
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticación minimalista...');
        
        // Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            console.log('✅ Usuario encontrado:', session.user.email);
            setUser(session.user);
          } else {
            console.log('ℹ️ No hay usuario autenticado');
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error en inicialización:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    // Escuchar cambios de auth ULTRA-SIMPLE
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth cambió:', event);
      
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    userProfile: user ? {
      id: user.id,
      email: user.email,
      nombre_completo: user.email.split('@')[0],
    } : null,
    role: 'admin', // Simplificado: todos son admin
    permissions: {},
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;