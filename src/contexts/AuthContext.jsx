import { useState, useEffect, createContext } from 'react';
import { supabase } from '../lib/supabase';

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

// AuthProvider SÚPER SIMPLIFICADO
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  // ==========================================
  // 🔥 CONFIGURACIÓN DE SESIÓN AL CARGAR
  // ==========================================
  useEffect(() => {
    console.log('🔥 AuthContext - Inicializando...');

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        console.log('🔍 AuthContext - Obteniendo sesión inicial...');
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Error obteniendo sesión inicial:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Sesión inicial encontrada:', session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          console.log('📝 No hay sesión inicial');
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Error en getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 AuthContext - Auth state change:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ Usuario logueado:', session.user.email);
        setUser(session.user);
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT' || !session) {
        console.log('🚪 Usuario deslogueado');
        setUser(null);
        setUserProfile(null);
        setRole(null);
        setPermissions({});
      }

      setLoading(false);
    });

    return () => {
      console.log('🧹 AuthContext - Cleanup subscription');
      subscription?.unsubscribe();
    };
  }, []);

  // ==========================================
  // 🔍 CARGAR PERFIL DE USUARIO
  // ==========================================
  const loadUserProfile = async user => {
    try {
      console.log('👤 Cargando perfil para:', user.email);

      const { data: profile, error } = await supabase
        .from('usuarios')
        .select(
          `
          id,
          email,
          nombre_completo,
          rol,
          activo,
          created_at
        `
        )
        .eq('email', user.email)
        .single();

      if (error) {
        console.warn('⚠️ Error cargando perfil (puede ser normal):', error);
        // Si no existe el perfil, asumir rol 'user'
        setRole('user');
        setPermissions({ dashboard: true, clientes: true });
        return;
      }

      if (profile) {
        console.log('✅ Perfil cargado:', profile);
        setUserProfile(profile);
        setRole(profile.rol || 'user');

        // Configurar permisos básicos basados en rol
        const userPermissions = {
          dashboard: true,
          clientes: true,
          admin: profile.rol === 'admin',
        };
        setPermissions(userPermissions);
      }
    } catch (error) {
      console.error('❌ Error en loadUserProfile:', error);
      // En caso de error, asumir permisos básicos
      setRole('user');
      setPermissions({ dashboard: true, clientes: true });
    }
  };

  // ==========================================
  // 🔐 FUNCIONES DE AUTENTICACIÓN
  // ==========================================

  const signIn = async ({ email, password }) => {
    try {
      console.log('🔐 Intentando login para:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Error en signIn:', error);
        setLoading(false);
        return { error };
      }

      console.log('✅ Login exitoso');
      return { data };
    } catch (error) {
      console.error('❌ Error inesperado en signIn:', error);
      setLoading(false);
      return { error: { message: 'Error inesperado en el login' } };
    }
  };

  const signUp = async ({ email, password, fullName }) => {
    try {
      console.log('📝 Intentando registro para:', email);
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: fullName,
          },
        },
      });

      setLoading(false);

      if (error) {
        console.error('❌ Error en signUp:', error);
        return { error };
      }

      console.log('✅ Registro exitoso');
      return { data };
    } catch (error) {
      console.error('❌ Error inesperado en signUp:', error);
      setLoading(false);
      return { error: { message: 'Error inesperado en el registro' } };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Cerrando sesión...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error en signOut:', error);
        return { error };
      }
      console.log('✅ Sesión cerrada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error inesperado en signOut:', error);
      return { error: { message: 'Error inesperado al cerrar sesión' } };
    }
  };

  // ==========================================
  // 🔒 FUNCIÓN DE PERMISOS
  // ==========================================
  const hasPermission = permission => {
    return permissions[permission] || false;
  };

  // ==========================================
  // 📦 CONTEXTO VALUE
  // ==========================================
  const contextValue = {
    user,
    userProfile,
    role,
    permissions,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };