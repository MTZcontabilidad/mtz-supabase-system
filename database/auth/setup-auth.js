// =====================================================================
// 🔐 CONFIGURACIÓN DE AUTENTICACIÓN MTZ
// Archivo: auth/setup-auth.js
// Propósito: Configurar usuarios demo para testing del sistema
// Dependencias: supabase client
// =====================================================================

import { supabase } from '../src/lib/supabase.js'

/**
 * Configurar usuarios demo para el sistema MTZ
 */
async function setupAuthUsers() {
  console.log('🚀 Configurando usuarios de autenticación para MTZ...')
  
  const users = [
    {
      email: 'admin@mtz.cl',
      password: 'admin123',
      userData: {
        full_name: 'Administrador MTZ Demo',
        role: 'admin'
      }
    },
    {
      email: 'colaborador@mtz.cl',
      password: 'colaborador123',
      userData: {
        full_name: 'María González Demo',
        role: 'colaborador'
      }
    }
  ]

  try {
    for (const user of users) {
      console.log(`\n📧 Procesando usuario: ${user.email}`)
      
      // Intentar crear usuario
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: user.userData
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          console.log(`✅ Usuario ${user.email} ya existe, verificando...`)
          
          // Verificar con login
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password
          })
          
          if (signInError) {
            console.error(`❌ Error verificando ${user.email}:`, signInError.message)
          } else {
            console.log(`✅ Usuario ${user.email} verificado correctamente`)
            console.log(`🆔 ID: ${signInData.user.id}`)
          }
        } else {
          console.error(`❌ Error creando ${user.email}:`, signUpError.message)
        }
      } else {
        console.log(`✅ Usuario ${user.email} creado exitosamente`)
        console.log(`🆔 ID: ${signUpData.user.id}`)
        console.log(`⚠️  Nota: El usuario necesita confirmar su email`)
      }
    }

    // Verificar usuario existente de producción
    console.log('\n🔍 Verificando usuario de producción...')
    const { data: prodUser, error: prodError } = await supabase.auth.signInWithPassword({
      email: 'mtzcontabilidad@gmail.com',
      password: 'Alohomora33.'
    })
    
    if (prodError) {
      console.error('❌ Error con usuario de producción:', prodError.message)
    } else {
      console.log('✅ Usuario de producción verificado')
      console.log('📧 Email:', prodUser.user.email)
      console.log('🆔 ID:', prodUser.user.id)
    }

  } catch (error) {
    console.error('❌ Error general en configuración de auth:', error)
  }
  
  console.log('\n🎯 Credenciales Demo Configuradas:')
  console.log('📧 Admin: admin@mtz.cl / admin123')
  console.log('📧 Colaborador: colaborador@mtz.cl / colaborador123')
  console.log('📧 Producción: mtzcontabilidad@gmail.com / Alohomora33.')
}

// Ejecutar configuración si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupAuthUsers()
}

export { setupAuthUsers }

// ✅ CONFIGURACIÓN DE AUTENTICACIÓN LISTA
