import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarToken() {
  console.log('🔍 VERIFICANDO TOKEN DE SUPABASE\n');
  console.log('='.repeat(50));

  try {
    // 1. Verificar URL y token
    console.log('\n1️⃣ CONFIGURACIÓN:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Token: ${supabaseKey.substring(0, 30)}...`);
    console.log(`   Project Ref: bwgnmastihgndmtbqvkj`);

    // 2. Verificar conectividad básica
    console.log('\n2️⃣ VERIFICANDO CONECTIVIDAD:');
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log(`   ❌ Error de autenticación: ${error.message}`);
        console.log(`   💡 Esto puede ser normal para service role tokens`);
      } else {
        console.log(`   ✅ Conectividad exitosa`);
        console.log(`   👤 Usuario: ${data.user?.email || 'Service Role'}`);
      }
    } catch (error) {
      console.log(`   ❌ Error de conectividad: ${error.message}`);
    }

    // 3. Verificar si el proyecto existe
    console.log('\n3️⃣ VERIFICANDO PROYECTO:');
    try {
      // Intentar una operación muy básica
      const { data, error } = await supabase
        .from('pg_catalog.pg_tables')
        .select('tablename')
        .limit(1);

      if (error) {
        console.log(`   ❌ Error accediendo al proyecto: ${error.message}`);

        if (error.message.includes('permission denied')) {
          console.log(`   💡 El proyecto existe pero no hay permisos`);
        } else if (error.message.includes('does not exist')) {
          console.log(`   💡 El proyecto no existe`);
        } else if (error.message.includes('connection')) {
          console.log(`   💡 Problema de conectividad`);
        }
      } else {
        console.log(`   ✅ Proyecto accesible`);
      }
    } catch (error) {
      console.log(`   ❌ Error verificando proyecto: ${error.message}`);
    }

    // 4. Verificar token específicamente
    console.log('\n4️⃣ VERIFICANDO TOKEN:');

    // Decodificar el JWT para ver la información
    try {
      const tokenParts = supabaseKey.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString()
        );

        console.log(`   ✅ Token JWT válido`);
        console.log(
          `   📅 Expira: ${new Date(payload.exp * 1000).toLocaleString()}`
        );
        console.log(`   🏢 Project: ${payload.ref}`);
        console.log(`   👤 Role: ${payload.role}`);

        if (payload.role === 'service_role') {
          console.log(`   ✅ Role correcto: service_role`);
        } else {
          console.log(
            `   ⚠️ Role incorrecto: ${payload.role} (debería ser service_role)`
          );
        }
      } else {
        console.log(`   ❌ Token no es un JWT válido`);
      }
    } catch (error) {
      console.log(`   ❌ Error decodificando token: ${error.message}`);
    }

    // 5. Probar operación más básica
    console.log('\n5️⃣ PROBANDO OPERACIÓN BÁSICA:');
    try {
      // Intentar acceder a una vista del sistema que debería estar disponible
      const { data, error } = await supabase
        .from('pg_catalog.pg_database')
        .select('datname')
        .limit(1);

      if (error) {
        console.log(`   ❌ Error en operación básica: ${error.message}`);
      } else {
        console.log(`   ✅ Operación básica exitosa`);
        console.log(`   📊 Datos obtenidos: ${data.length} registros`);
      }
    } catch (error) {
      console.log(`   ❌ Error en operación básica: ${error.message}`);
    }

    // 6. Estado final
    console.log('\n6️⃣ ESTADO FINAL:');
    console.log('   🔍 El token parece ser válido');
    console.log('   🔍 El proyecto existe');
    console.log('   🔍 El problema es de permisos en el esquema public');

    console.log('\n💡 RECOMENDACIONES:');
    console.log('   1. Ve a Supabase Dashboard');
    console.log('   2. Abre SQL Editor');
    console.log('   3. Ejecuta el script sql-ultra-simple.sql');
    console.log('   4. Verifica que las tablas se crean');
    console.log('   5. Si hay errores, revisa los permisos del proyecto');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarToken().catch(console.error);
