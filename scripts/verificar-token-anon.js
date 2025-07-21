import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con token anónimo
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
// Token anónimo (normalmente empieza con eyJ...)
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.EjemploTokenAnonimo';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verificarTokenAnon() {
  console.log('🔍 VERIFICANDO CON TOKEN ANÓNIMO\n');
  console.log('='.repeat(50));

  try {
    // 1. Probar acceso básico
    console.log('\n1️⃣ PROBANDO ACCESO BÁSICO:');

    const { data: simpleData, error: simpleError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(3);

    if (simpleError) {
      console.log(`   ❌ Error: ${simpleError.message}`);
    } else {
      console.log(`   ✅ Datos encontrados: ${simpleData.length} registros`);
      simpleData.forEach(item => {
        console.log(`      📋 ${item.nombre} (${item.descripcion})`);
      });
    }

    // 2. Probar operaciones CRUD
    console.log('\n2️⃣ PROBANDO OPERACIONES CRUD:');

    // INSERT
    const { data: newRecord, error: insertError } = await supabase
      .from('test_mcp_simple')
      .insert({
        nombre: 'Test Anon Token',
        descripcion: 'Registro desde token anónimo',
      })
      .select()
      .single();

    if (insertError) {
      console.log(`   ❌ Error al insertar: ${insertError.message}`);
    } else {
      console.log(`   ✅ Insertado: ${newRecord.nombre} (ID: ${newRecord.id})`);

      // Limpiar
      await supabase.from('test_mcp_simple').delete().eq('id', newRecord.id);

      console.log(`   🧹 Registro eliminado`);
    }

    // 3. Estado final
    console.log('\n3️⃣ ESTADO FINAL:');

    if (simpleError) {
      console.log('   🔴 Token anónimo tampoco funciona');
      console.log('   💡 El problema es de configuración del proyecto');
    } else {
      console.log('   🟢 Token anónimo funciona');
      console.log('   💡 El problema es específico del service role');
    }
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar verificación
verificarTokenAnon().catch(console.error);
