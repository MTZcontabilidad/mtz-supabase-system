import { useState, useEffect, createContext } from 'react';
import { supabase } from '../lib/supabase.js';

// =====================================================================
// 🔧 CONTEXTO DE AUTENTICACION - SISTEMA MTZ v3.0 (SIN MODO DEMO)
// =====================================================================

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
  isAuthenticated: false,
});

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================================
  // 🔐 FUNCIONES DE AUTENTICACION
  // =====================================================================

  const signIn = async (email, password) => {
    try {
      setError(null);
      console.log('🔄 Intentando login con email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ Error en signIn:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }

      console.log('✅ Login exitoso para:', data.user.email);

      // Cargar perfil del usuario desde usuarios_sistema
      await loadUserProfile(data.user);

      return { success: true, data };
    } catch (err) {
      console.error('❌ Error inesperado en signIn:', err);
      const errorMsg = err.message || 'Error de conexión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setError(null);
      console.log('🔄 Intentando registro con email:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            nombre: userData.nombre || 'Usuario',
            apellido: userData.apellido || 'MTZ',
          },
        },
      });

      if (error) {
        console.error('❌ Error en signUp:', error.message);
        setError(error.message);
        return { success: false, error: error.message };
      }

      console.log('✅ Registro exitoso para:', data.user?.email);
      return { success: true, data };
    } catch (err) {
      console.error('❌ Error inesperado en signUp:', err);
      const errorMsg = err.message || 'Error de conexión';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('🔄 Cerrando sesión...');

      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setRole(null);
      setPermissions({});

      console.log('✅ Sesión cerrada exitosamente');
    } catch (err) {
      console.error('❌ Error en signOut:', err);
      setError(err.message);
    }
  };

  // =====================================================================
  // 👤 FUNCIONES DE PERFIL Y PERMISOS
  // =====================================================================

  const loadUserProfile = async authUser => {
    try {
      console.log('🔄 Cargando perfil de usuario...');

      // Primero obtener el perfil del usuario desde usuarios_sistema
      const { data: profile, error } = await supabase
        .from('usuarios_sistema')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('❌ Error cargando perfil:', error);
        // Si no existe en usuarios_sistema, crear perfil básico
        setUserProfile({
          id: authUser.id,
          email: authUser.email,
          nombre_completo:
            authUser.user_metadata?.nombre || authUser.email.split('@')[0],
          rol_id: 1, // Rol admin por defecto
          activo: true,
        });
        setRole('Administrador');
        setPermissions({});
        return;
      }

      if (profile) {
        console.log('✅ Perfil cargado:', profile);
        setUserProfile(profile);

        // Si tiene rol_id, obtener los detalles del rol
        if (profile.rol_id) {
          const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', profile.rol_id)
            .single();

          if (!roleError && roleData) {
            console.log('✅ Rol cargado:', roleData);
            setRole(roleData.nombre);
            setPermissions(roleData.permisos || {});
          } else {
            console.log(
              '⚠️ No se pudo cargar el rol, usando admin por defecto'
            );
            setRole('Administrador');
            setPermissions({});
          }
        } else {
          setRole('Administrador');
          setPermissions({});
        }
      }
    } catch (err) {
      console.error('❌ Error cargando perfil:', err);
      setUserProfile(null);
      setRole('Administrador');
      setPermissions({});
    }
  };

  const hasPermission = (resource, action) => {
    if (!user || !userProfile || !permissions) {
      return false;
    }

    // Administradores tienen todos los permisos
    if (role === 'Administrador') {
      return true;
    }

    // Verificar permiso específico
    const resourcePerms = permissions[resource];
    if (!resourcePerms) {
      return false;
    }

    return resourcePerms[action] === true;
  };

  // =====================================================================
  // 🔄 INICIALIZACION Y ESTADO
  // =====================================================================

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticación...');

        // Obtener sesión actual
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.warn('⚠️ Error obteniendo sesión:', error.message);
          // No establecer error para errores de token, solo limpiar sesión
          if (error.message.includes('Invalid Refresh Token')) {
            console.log('🔄 Limpiando sesión inválida...');
            await supabase.auth.signOut();
          }
        }

        if (mounted) {
          if (session?.user) {
            console.log('✅ Sesión activa encontrada:', session.user.email);
            setUser(session.user);
            await loadUserProfile(session.user);
          } else {
            console.log('ℹ️ No hay sesión activa');
            setUser(null);
            setUserProfile(null);
            setRole(null);
            setPermissions({});
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Error en inicialización:', err);
        if (mounted) {
          setError(err.message);
          setUser(null);
          setUserProfile(null);
          setRole(null);
          setPermissions({});
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log('🔄 Cambio de auth detectado:', event);

      switch (event) {
        case 'SIGNED_IN':
          console.log('✅ Usuario autenticado:', session.user.email);
          setUser(session.user);
          await loadUserProfile(session.user);
          setError(null);
          break;
        case 'SIGNED_OUT':
          console.log('ℹ️ Usuario desautenticado');
          setUser(null);
          setUserProfile(null);
          setRole(null);
          setPermissions({});
          setError(null);
          break;
        case 'TOKEN_REFRESHED':
          console.log('🔄 Token actualizado');
          break;
        default:
          console.log('ℹ️ Evento de auth:', event);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // =====================================================================
  // 🎯 VALOR DEL CONTEXTO
  // =====================================================================

  const value = {
    user,
    userProfile,
    role,
    permissions,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    hasPermission,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
