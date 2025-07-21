
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDirectConnection() {
  console.log('🔗 PRUEBA DE CONEXIÓN DIRECTA');

  try {
    const { data, error } = await supabase
      .from('test_mcp_simple')
      .select('*');

    if (error) {
      console.log('❌ Error:', error.message);
    } else {
      console.log('✅ Conexión exitosa');
      console.log('📊 Datos:', data.length, 'registros');
    }
  } catch (err) {
    console.log('❌ Error general:', err.message);
  }
}

testDirectConnection();
