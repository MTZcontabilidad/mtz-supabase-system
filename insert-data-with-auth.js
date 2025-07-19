import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertDataWithAuth() {
  console.log('🔐 INSERTANDO DATOS CON AUTENTICACIÓN');
  console.log('=====================================');

  try {
    // Primero autenticar con el usuario admin
    console.log('🔄 Autenticando como admin...');
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: 'mtzcontabilidad@gmail.com',
        password: 'Alohomora33.',
      });

    if (authError) {
      console.error('❌ Error de autenticación:', authError);
      return;
    }

    console.log('✅ Autenticación exitosa');
    console.log('Usuario:', authData.user.email);
    console.log('ID:', authData.user.id);

    // Ahora intentar insertar datos
    const testClientes = [
      {
        id_cliente: 'CLI001',
        razon_social: 'Empresa Minera del Norte S.A.',
        rut: '76.123.456-7',
        total_facturado: '25000000',
        categoria_cliente: 'VIP',
        estado: 'Activo',
        rubro: 'Minería',
        email: 'contacto@mineranorte.cl',
        telefono: '+56 2 2345 6789',
      },
      {
        id_cliente: 'CLI002',
        razon_social: 'Constructora Sur Ltda.',
        rut: '78.234.567-8',
        total_facturado: '18000000',
        categoria_cliente: 'Premium',
        estado: 'Activo',
        rubro: 'Construcción',
        email: 'info@constructorasur.cl',
        telefono: '+56 2 3456 7890',
      },
      {
        id_cliente: 'CLI003',
        razon_social: 'Tecnología Avanzada SpA.',
        rut: '79.345.678-9',
        total_facturado: '15000000',
        categoria_cliente: 'Premium',
        estado: 'Activo',
        rubro: 'Tecnología',
        email: 'admin@tecavanzada.cl',
        telefono: '+56 2 4567 8901',
      },
    ];

    console.log('🔄 Insertando clientes...');
    const { data: insertData, error: insertError } = await supabase
      .from('clientes_contables')
      .insert(testClientes)
      .select();

    if (insertError) {
      console.error('❌ Error insertando datos:', insertError);
      return;
    }

    console.log('✅ Datos insertados exitosamente');
    console.log('📊 Registros insertados:', insertData?.length || 0);

    // Verificar que se insertaron
    const { data: verifyData, error: verifyError } = await supabase
      .from('clientes_contables')
      .select('*');

    if (verifyError) {
      console.error('❌ Error verificando datos:', verifyError);
      return;
    }

    console.log('✅ Verificación exitosa');
    console.log('📊 Total de clientes en BD:', verifyData?.length || 0);

    // Mostrar algunos datos
    if (verifyData && verifyData.length > 0) {
      console.log('\n📋 Clientes en la base de datos:');
      verifyData.forEach((cliente, index) => {
        console.log(
          `${index + 1}. ${cliente.razon_social} - ${cliente.rut} - $${cliente.total_facturado}`
        );
      });
    }
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

insertDataWithAuth();
