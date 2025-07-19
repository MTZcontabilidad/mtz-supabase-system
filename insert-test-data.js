import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Datos de prueba para clientes
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
    direccion: 'Av. Providencia 1234, Santiago',
    created_at: new Date().toISOString(),
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
    direccion: 'Las Condes 567, Santiago',
    created_at: new Date().toISOString(),
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
    direccion: 'Vitacura 890, Santiago',
    created_at: new Date().toISOString(),
  },
  {
    id_cliente: 'CLI004',
    razon_social: 'Comercial Central EIRL',
    rut: '80.456.789-0',
    total_facturado: '12000000',
    categoria_cliente: 'Regular',
    estado: 'Activo',
    rubro: 'Comercio',
    email: 'ventas@comercialcentral.cl',
    telefono: '+56 2 5678 9012',
    direccion: 'Ñuñoa 234, Santiago',
    created_at: new Date().toISOString(),
  },
  {
    id_cliente: 'CLI005',
    razon_social: 'Servicios Financieros Pro S.A.',
    rut: '81.567.890-1',
    total_facturado: '9500000',
    categoria_cliente: 'Regular',
    estado: 'Activo',
    rubro: 'Servicios Financieros',
    email: 'contacto@servfinpro.cl',
    telefono: '+56 2 6789 0123',
    direccion: 'Providencia 456, Santiago',
    created_at: new Date().toISOString(),
  },
];

async function insertTestData() {
  console.log('🚀 Insertando datos de prueba en Supabase...');
  console.log('============================================');

  try {
    // Insertar clientes
    const { data, error } = await supabase
      .from('clientes_contables')
      .insert(testClientes);

    if (error) {
      console.error('❌ Error insertando datos:', error);
      return;
    }

    console.log('✅ Datos insertados exitosamente');
    console.log('📊 Registros insertados:', data?.length || 0);

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
      console.log('\n📋 Primeros 3 clientes:');
      verifyData.slice(0, 3).forEach((cliente, index) => {
        console.log(`${index + 1}. ${cliente.razon_social} - ${cliente.rut}`);
      });
    }
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

insertTestData();
