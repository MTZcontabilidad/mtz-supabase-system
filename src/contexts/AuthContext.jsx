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

// Proveedor de autenticación MEJORADO
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastLoginAttempt, setLastLoginAttempt] = useState(0);

  // Función de login MEJORADA con rate limiting básico
  const signIn = async (email, password) => {
    try {
      const now = Date.now();
      const timeWindow = 5 * 60 * 1000; // 5 minutos

      // Rate limiting básico: máximo 5 intentos en 5 minutos
      if (loginAttempts >= 5 && now - lastLoginAttempt < timeWindow) {
        const remainingTime = Math.ceil(
          (timeWindow - (now - lastLoginAttempt)) / 1000 / 60
        );
        console.warn(
          `🚫 Demasiados intentos de login. Espera ${remainingTime} minutos.`
        );
        return {
          data: null,
          error: `Demasiados intentos de login. Intenta de nuevo en ${remainingTime} minutos.`,
        };
      }

      // Resetear contador si pasó el tiempo
      if (now - lastLoginAttempt >= timeWindow) {
        setLoginAttempts(0);
      }

      console.log('🔄 Intentando login con:', email);
      setLastLoginAttempt(now);
      setLoginAttempts(prev => prev + 1);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error en login:', error);
        return { data: null, error: error.message };
      }

      // Resetear contador en login exitoso
      setLoginAttempts(0);
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

  // Verificar permisos MEJORADO
  const hasPermission = permission => {
    // Por ahora, mantener simplicidad pero con estructura para futuro
    if (!user) return false;

    // TODO: Implementar verificación real de permisos cuando se configure RLS
    // Por ahora, permitir acceso básico a usuarios autenticados
    return true;
  };

  // Inicialización ULTRA-SIMPLE
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticación minimalista...');

        // Obtener sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession();

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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
    userProfile: user
      ? {
          id: user.id,
          email: user.email,
          nombre_completo: user.email.split('@')[0],
        }
      : null,
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
