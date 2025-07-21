// Script de diagnóstico final para el MCP de Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

console.log('🔍 DIAGNÓSTICO FINAL MCP SUPABASE');
console.log('==================================');

async function diagnosticarMCP() {
  try {
    console.log('1. Verificando conexión con Supabase...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Cliente de Supabase creado');

    console.log('\n2. Probando consulta básica...');
    const { data: info, error: infoError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);

    if (infoError) {
      console.log('❌ Error en consulta básica:', infoError.message);
      console.log('🔍 Código:', infoError.code);

      if (infoError.message.includes('permission denied')) {
        console.log('\n🚨 PROBLEMA IDENTIFICADO: Permisos insuficientes');
        console.log(
          '💡 SOLUCIÓN: Ejecutar los scripts de configuración en Supabase Dashboard'
        );
        console.log('   1. scripts/01-crear-estructura-completa.sql');
        console.log('   2. scripts/02-insertar-datos-iniciales.sql');
        console.log('   3. scripts/03-configurar-rls-basico.sql');
        console.log('   4. scripts/04-verificacion-final.sql');
      }
    } else {
      console.log('✅ Consulta básica exitosa');
      console.log('📋 Tablas encontradas:', info.length);

      if (info.length === 0) {
        console.log('\n🚨 PROBLEMA IDENTIFICADO: Base de datos vacía');
        console.log(
          '💡 SOLUCIÓN: Ejecutar los scripts de configuración en Supabase Dashboard'
        );
      } else {
        console.log('📝 Tablas:', info.map(t => t.table_name).join(', '));
      }
    }

    console.log('\n3. Probando consulta de datos...');
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .limit(1);

    if (rolesError) {
      console.log('❌ Error consultando roles:', rolesError.message);
    } else {
      console.log('✅ Consulta de roles exitosa');
      console.log('📊 Roles encontrados:', roles.length);
    }

    console.log('\n4. Verificando configuración MCP...');
    console.log('📋 Project Ref:', 'bwgnmastihgndmtbqvkj');
    console.log('🔑 Token Type: Service Role');
    console.log('🌐 URL:', SUPABASE_URL);

    // Verificar token
    const tokenParts = SUPABASE_SERVICE_KEY.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString()
        );
        console.log('✅ Token JWT válido');
        console.log('📝 Role:', payload.role);
        console.log(
          '📅 Expira:',
          new Date(payload.exp * 1000).toLocaleString()
        );
      } catch (e) {
        console.log('❌ Error decodificando token');
      }
    }
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

diagnosticarMCP();

console.log('\n🎯 RECOMENDACIONES FINALES:');
console.log('==========================');
console.log('1. Si hay errores de permisos:');
console.log('   - Ejecutar scripts en Supabase Dashboard');
console.log('   - Verificar configuración RLS');
console.log('');
console.log('2. Si la BD está vacía:');
console.log('   - Ejecutar scripts de estructura y datos');
console.log('');
console.log('3. Si el MCP no aparece en Cursor:');
console.log('   - Verificar Settings > MCP');
console.log('   - Reiniciar Cursor completamente');
console.log('   - Verificar que no haya errores en la consola');
