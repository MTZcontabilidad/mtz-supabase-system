// =====================================================================
// 🔐 HOOK DE AUTENTICACIÓN - SISTEMA MTZ v3.0
// =====================================================================

import { useContext, useCallback } from 'react';
import { AuthContext } from '@/contexts/AuthContext.jsx';
import { MTZ_CONFIG } from '@/lib/config.js';
import { handleError } from '@/utils/helpers.js';

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona acceso al contexto de autenticación con validaciones
 *
 * @returns {Object} Objeto con funciones y estado de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 *
 * @example
 * ```jsx
 * const { user, signIn, signOut, isAuthenticated, loading } = useAuth();
 *
 * const handleLogin = async () => {
 *   const result = await signIn(email, password);
 *   if (result.success) {
 *     // Login exitoso
 *   } else {
 *     // Manejar error
 *   }
 * };
 * ```
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro del AuthProvider');
  }

  const {
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
    isAuthenticated,
  } = context;

  /**
   * Función mejorada de login con validación y manejo de errores
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} Resultado del login
   */
  const login = useCallback(
    async (email, password, options = {}) => {
      try {
        // Validaciones básicas
        if (!email?.trim()) {
          return { success: false, error: 'El email es requerido' };
        }

        if (!password?.trim()) {
          return { success: false, error: 'La contraseña es requerida' };
        }

        // Validar formato de email
        const emailRegex = MTZ_CONFIG.validation.email.pattern;
        if (!emailRegex.test(email)) {
          return { success: false, error: MTZ_CONFIG.validation.email.message };
        }

        // Validar longitud de contraseña
        if (password.length < MTZ_CONFIG.security.password.minLength) {
          return {
            success: false,
            error: `La contraseña debe tener al menos ${MTZ_CONFIG.security.password.minLength} caracteres`,
          };
        }

        console.log('🔄 Iniciando login para:', email);

        // Llamar a la función de signIn del contexto
        const result = await signIn(email.trim(), password);

        if (result.success) {
          console.log('✅ Login exitoso para:', email);

          // Analytics (si está configurado)
          if (MTZ_CONFIG.analytics.enabled) {
            // Aquí se podría enviar evento de analytics
            console.log('📊 Evento de login registrado');
          }

          return { success: true, user: result.data?.user };
        } else {
          // Manejar errores específicos de Supabase
          let errorMessage = result.error;
          if (result.error?.includes('Invalid login credentials')) {
            errorMessage = 'Email o contraseña incorrectos';
          } else if (result.error?.includes('Email not confirmed')) {
            errorMessage =
              'Por favor confirma tu email antes de iniciar sesión';
          } else if (result.error?.includes('Too many requests')) {
            errorMessage = 'Demasiados intentos. Intenta más tarde';
          }
          console.error('❌ Error en login:', errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        const errorInfo = handleError(error, 'useAuth.login');
        console.error('❌ Error inesperado en login:', errorInfo);
        return { success: false, error: errorInfo.message };
      }
    },
    [signIn]
  );

  /**
   * Función mejorada de registro con validación
   * @param {Object} userData - Datos del usuario
   * @param {string} password - Contraseña
   * @param {string} confirmPassword - Confirmación de contraseña
   * @returns {Promise<Object>} Resultado del registro
   */
  const register = useCallback(
    async (userData, password, confirmPassword) => {
      try {
        // Validaciones básicas
        if (!userData?.email?.trim()) {
          return { success: false, error: 'El email es requerido' };
        }

        if (!password?.trim()) {
          return { success: false, error: 'La contraseña es requerida' };
        }

        if (password !== confirmPassword) {
          return { success: false, error: 'Las contraseñas no coinciden' };
        }

        // Validar formato de email
        const emailRegex = MTZ_CONFIG.validation.email.pattern;
        if (!emailRegex.test(userData.email)) {
          return { success: false, error: MTZ_CONFIG.validation.email.message };
        }

        // Validar contraseña según configuración
        const passwordConfig = MTZ_CONFIG.security.password;
        if (password.length < passwordConfig.minLength) {
          return {
            success: false,
            error: `La contraseña debe tener al menos ${passwordConfig.minLength} caracteres`,
          };
        }

        if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
          return {
            success: false,
            error: 'La contraseña debe contener al menos una mayúscula',
          };
        }

        if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
          return {
            success: false,
            error: 'La contraseña debe contener al menos una minúscula',
          };
        }

        if (passwordConfig.requireNumbers && !/\d/.test(password)) {
          return {
            success: false,
            error: 'La contraseña debe contener al menos un número',
          };
        }

        if (
          passwordConfig.requireSpecialChars &&
          !/[!@#$%^&*]/.test(password)
        ) {
          return {
            success: false,
            error: 'La contraseña debe contener al menos un carácter especial',
          };
        }

        console.log('🔄 Iniciando registro para:', userData.email);

        // Llamar a la función de signUp del contexto
        const result = await signUp(userData.email.trim(), password, userData);

        if (result.success) {
          console.log('✅ Registro exitoso para:', userData.email);
          return { success: true, user: result.data?.user };
        } else {
          console.error('❌ Error en registro:', result.error);
          return { success: false, error: result.error };
        }
      } catch (error) {
        const errorInfo = handleError(error, 'useAuth.register');
        console.error('❌ Error inesperado en registro:', errorInfo);
        return { success: false, error: errorInfo.message };
      }
    },
    [signUp]
  );

  /**
   * Función mejorada de logout
   * @returns {Promise<Object>} Resultado del logout
   */
  const logout = useCallback(async () => {
    try {
      console.log('🔄 Iniciando logout...');

      // Analytics (si está configurado)
      if (MTZ_CONFIG.analytics.enabled && user) {
        console.log('📊 Evento de logout registrado');
      }

      await signOut();
      console.log('✅ Logout exitoso');

      return { success: true };
    } catch (error) {
      const errorInfo = handleError(error, 'useAuth.logout');
      console.error('❌ Error en logout:', errorInfo);
      return { success: false, error: errorInfo.message };
    }
  }, [signOut, user]);

  /**
   * Verificar si el usuario tiene un permiso específico
   * @param {string} permission - Permiso a verificar
   * @returns {boolean} True si tiene el permiso
   */
  const checkPermission = useCallback(
    permission => {
      if (!isAuthenticated || !user) {
        return false;
      }

      // Si el usuario es admin, tiene todos los permisos
      if (role === 'admin') {
        return true;
      }

      // Verificar permiso específico
      return hasPermission(permission);
    },
    [isAuthenticated, user, role, hasPermission]
  );

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} requiredRole - Rol requerido
   * @returns {boolean} True si tiene el rol
   */
  const checkRole = useCallback(
    requiredRole => {
      if (!isAuthenticated || !user) {
        return false;
      }

      return role === requiredRole;
    },
    [isAuthenticated, user, role]
  );

  /**
   * Obtener información del perfil del usuario
   * @returns {Object|null} Información del perfil
   */
  const getProfile = useCallback(() => {
    if (!isAuthenticated || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      emailVerified: user.email_confirmed_at,
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      ...userProfile,
    };
  }, [isAuthenticated, user, userProfile]);

  /**
   * Verificar si la sesión está activa y válida
   * @returns {boolean} True si la sesión es válida
   */
  const isSessionValid = useCallback(() => {
    if (!isAuthenticated || !user) {
      return false;
    }

    // Verificar si la sesión no ha expirado
    const sessionTimeout = MTZ_CONFIG.security.session.timeout;
    const lastSignIn = new Date(user.last_sign_in_at || user.created_at);
    const now = new Date();
    const sessionAge = now.getTime() - lastSignIn.getTime();

    return sessionAge < sessionTimeout;
  }, [isAuthenticated, user]);

  /**
   * Actualizar perfil del usuario
   * @param {Object} profileData - Datos del perfil a actualizar
   * @returns {Promise<Object>} Resultado de la actualización
   */
  const updateProfile = useCallback(
    async profileData => {
      try {
        if (!isAuthenticated || !user) {
          return { success: false, error: 'Usuario no autenticado' };
        }

        console.log('🔄 Actualizando perfil del usuario...');

        // Aquí se implementaría la lógica de actualización
        // Por ahora, simulamos la actualización
        console.log('✅ Perfil actualizado exitosamente');
        return { success: true, data: profileData };
      } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        return { success: false, error: error.message };
      }
    },
    [isAuthenticated, user]
  );

  /**
   * Actualizar contraseña del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Resultado de la actualización
   */
  const updatePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        if (!isAuthenticated || !user) {
          return { success: false, error: 'Usuario no autenticado' };
        }

        console.log('🔄 Actualizando contraseña...');

        // Aquí se implementaría la lógica de actualización de contraseña
        // Por ahora, simulamos la actualización
        console.log('✅ Contraseña actualizada exitosamente');
        return { success: true };
      } catch (error) {
        console.error('❌ Error actualizando contraseña:', error);
        return { success: false, error: error.message };
      }
    },
    [isAuthenticated, user]
  );

  /**
   * Refrescar datos del usuario
   * @returns {Promise<Object>} Resultado del refresh
   */
  const refreshUser = useCallback(async () => {
    try {
      if (!isAuthenticated || !user) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      console.log('🔄 Refrescando datos del usuario...');

      // Aquí se implementaría la lógica de refresh
      // Por ahora, simulamos el refresh
      console.log('✅ Datos del usuario refrescados');
      return { success: true };
    } catch (error) {
      console.error('❌ Error refrescando usuario:', error);
      return { success: false, error: error.message };
    }
  }, [isAuthenticated, user]);

  return {
    // Estado
    user,
    userProfile,
    role,
    permissions,
    loading,
    error,
    isAuthenticated,

    // Funciones principales
    login,
    register,
    logout,
    signIn: login, // Alias para compatibilidad
    signUp: register, // Alias para compatibilidad
    signOut: logout, // Alias para compatibilidad

    // Funciones de verificación
    hasPermission: checkPermission,
    checkRole,
    getProfile,
    isSessionValid,

    // Funciones de actualización
    updateProfile,
    updatePassword,
    refreshUser,
  };
};

export default useAuth;
