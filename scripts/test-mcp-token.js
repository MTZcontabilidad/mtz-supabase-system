// Script para verificar el token de servicio de Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

console.log('🔍 VERIFICANDO TOKEN DE SERVICIO SUPABASE');
console.log('==========================================');

// Decodificar el token JWT para verificar su contenido
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    return { header, payload };
  } catch (error) {
    console.log('❌ Error decodificando JWT:', error.message);
    return null;
  }
}

// Verificar el token
const tokenInfo = decodeJWT(SUPABASE_SERVICE_KEY);
if (tokenInfo) {
  console.log('✅ Token JWT válido');
  console.log('📝 Header:', tokenInfo.header);
  console.log('📋 Payload:', {
    iss: tokenInfo.payload.iss,
    ref: tokenInfo.payload.ref,
    role: tokenInfo.payload.role,
    iat: new Date(tokenInfo.payload.iat * 1000).toLocaleString(),
    exp: new Date(tokenInfo.payload.exp * 1000).toLocaleString(),
  });

  if (tokenInfo.payload.role === 'service_role') {
    console.log('✅ Token de servicio correcto');
  } else {
    console.log('❌ ERROR: Token no es de servicio');
  }
}

// Probar diferentes métodos de conexión
async function testConnection() {
  try {
    console.log('\n🔌 Probando conexión con Supabase...');

    // Método 1: Cliente básico
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    console.log('✅ Cliente creado');

    // Método 2: Probar con headers personalizados
    const supabaseWithHeaders = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
            apikey: SUPABASE_SERVICE_KEY,
          },
        },
      }
    );
    console.log('✅ Cliente con headers personalizados creado');

    // Probar consulta simple
    console.log('\n📊 Probando consulta simple...');
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (error) {
      console.log('❌ Error en consulta:', error.message);
      console.log('🔍 Código de error:', error.code);
      console.log('📋 Detalles:', error.details);
    } else {
      console.log('✅ Consulta exitosa');
      console.log('📋 Datos:', data);
    }

    // Probar RPC
    console.log('\n🔧 Probando función RPC...');
    const { data: rpcData, error: rpcError } = await supabase.rpc('version');

    if (rpcError) {
      console.log('❌ Error en RPC:', rpcError.message);
    } else {
      console.log('✅ RPC exitoso');
      console.log('📋 Resultado:', rpcData);
    }
  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

// Ejecutar pruebas
testConnection();

console.log('\n🎯 RECOMENDACIONES:');
console.log('==================');
console.log('1. Si el token es válido pero las consultas fallan:');
console.log('   - Verificar permisos del service role en Supabase Dashboard');
console.log('   - Revisar políticas RLS');
console.log('   - Verificar que las tablas existan');
console.log('');
console.log('2. Si el token no es válido:');
console.log('   - Generar nuevo service role key');
console.log('   - Actualizar configuración MCP');
console.log('   - Reiniciar Cursor');
