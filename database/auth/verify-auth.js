// =====================================================================
// ✅ VERIFICACIÓN DE AUTENTICACIÓN MTZ
// Archivo: auth/verify-auth.js
// Propósito: Verificar que la autenticación funciona correctamente
// Dependencias: supabase client
// =====================================================================

import { supabase } from '../src/lib/supabase.js'

/**
 * Verificar estado de autenticación del sistema
 */
async function verifyAuthentication() {
  console.log('🔍 Verificando sistema de autenticación MTZ...')
  
  const testUsers = [
    { email: 'mtzcontabilidad@gmail.com', password: 'Alohomora33.', type: 'Producción' },
    { email: 'admin@mtz.cl', password: 'admin123', type: 'Demo Admin' },
    { email: 'colaborador@mtz.cl', password: 'colaborador123', type: 'Demo Colaborador' }
  ]

  let successCount = 0
  let totalTests = testUsers.length

  try {
    for (const testUser of testUsers) {
      console.log(`\n🧪 Probando usuario ${testUser.type}: ${testUser.email}`)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      })
      
      if (error) {
        console.error(`❌ Error en ${testUser.type}:`, error.message)
        
        // Intentar diagnosticar el error
        if (error.message.includes('Invalid login credentials')) {
          console.log(`   💡 Posible causa: Credenciales incorrectas o email no confirmado`)
        } else if (error.message.includes('Email not confirmed')) {
          console.log(`   💡 Causa: Email no confirmado. Usuario existe pero necesita confirmación`)
        }
      } else {
        console.log(`✅ ${testUser.type} autenticado exitosamente`)
        console.log(`   📧 Email: ${data.user.email}`)
        console.log(`   🆔 ID: ${data.user.id}`)
        console.log(`   ✉️ Email confirmado: ${data.user.email_confirmed_at ? 'Sí' : 'No'}`)
        console.log(`   📅 Creado: ${new Date(data.user.created_at).toLocaleString()}`)
        successCount++
        
        // Cerrar sesión para siguiente prueba
        await supabase.auth.signOut()
      }
    }

    // Verificar configuración de Supabase
    console.log('\n🔧 Verificando configuración de Supabase...')
    
    // Obtener usuario actual (debería ser null)
    const { data: currentUser } = await supabase.auth.getUser()
    console.log(`👤 Usuario actual: ${currentUser.user ? currentUser.user.email : 'Ninguno (correcto)'}`)
    
    // Verificar conexión con base de datos
    const { data: testQuery, error: dbError } = await supabase
      .from('roles')
      .select('nombre')
      .limit(1)
    
    if (dbError) {
      console.error('❌ Error conectando con base de datos:', dbError.message)
    } else {
      console.log('✅ Conexión con base de datos funcionando')
      console.log(`📋 Roles disponibles: ${testQuery?.length || 0}`)
    }

  } catch (error) {
    console.error('❌ Error general en verificación:', error)
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:')
  console.log(`✅ Usuarios funcionando: ${successCount}/${totalTests}`)
  console.log(`❌ Usuarios con problemas: ${totalTests - successCount}/${totalTests}`)
  
  if (successCount === totalTests) {
    console.log('🎉 AUTENTICACIÓN COMPLETAMENTE FUNCIONAL')
  } else if (successCount > 0) {
    console.log('⚠️ AUTENTICACIÓN PARCIALMENTE FUNCIONAL')
  } else {
    console.log('❌ AUTENTICACIÓN NO FUNCIONAL')
  }
  
  return successCount === totalTests
}

/**
 * Verificar usuario específico
 */
async function verifySpecificUser(email, password) {
  console.log(`🔍 Verificando usuario específico: ${email}`)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ Error:', error.message)
      return false
    }
    
    console.log('✅ Usuario verificado exitosamente')
    console.log('📧 Email:', data.user.email)
    console.log('🆔 ID:', data.user.id)
    
    await supabase.auth.signOut()
    return true
  } catch (error) {
    console.error('❌ Error en verificación:', error)
    return false
  }
}

// Ejecutar verificación si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyAuthentication()
}

export { verifyAuthentication, verifySpecificUser }

// ✅ VERIFICACIÓN DE AUTENTICACIÓN LISTA
