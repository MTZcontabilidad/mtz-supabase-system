import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Datos reales de clientes para MTZ
const clientesReales = [
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
  },
  {
    id_cliente: 'CLI006',
    razon_social: 'Logística Express Ltda.',
    rut: '82.678.901-2',
    total_facturado: '8500000',
    categoria_cliente: 'Regular',
    estado: 'Activo',
    rubro: 'Logística',
    email: 'info@logisticaexpress.cl',
    telefono: '+56 2 7890 1234',
  },
  {
    id_cliente: 'CLI007',
    razon_social: 'Consultoría Estratégica Norte',
    rut: '83.789.012-3',
    total_facturado: '6500000',
    categoria_cliente: 'Regular',
    estado: 'Activo',
    rubro: 'Consultoría',
    email: 'admin@consultorianorte.cl',
    telefono: '+56 2 8901 2345',
  },
  {
    id_cliente: 'CLI008',
    razon_social: 'Inmobiliaria Premium S.A.',
    rut: '84.890.123-4',
    total_facturado: '5500000',
    categoria_cliente: 'Regular',
    estado: 'Activo',
    rubro: 'Inmobiliaria',
    email: 'ventas@inmopremium.cl',
    telefono: '+56 2 9012 3456',
  },
];

async function insertRealData() {
  console.log('🚀 INSERTANDO DATOS REALES EN SUPABASE');
  console.log('=====================================');
  console.log('URL:', SUPABASE_URL);
  console.log('Key length:', SUPABASE_ANON_KEY.length);
  console.log('');

  try {
    // Primero verificar si ya hay datos
    console.log('🔍 Verificando datos existentes...');
    const { data: existingData, error: checkError } = await supabase
      .from('clientes_contables')
      .select('*');

    if (checkError) {
      console.error('❌ Error verificando datos existentes:', checkError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log(
        `⚠️  Ya existen ${existingData.length} clientes en la base de datos`
      );
      console.log('📋 Clientes existentes:');
      existingData.forEach((cliente, index) => {
        console.log(
          `${index + 1}. ${cliente.razon_social} - ${cliente.rut} - $${cliente.total_facturado}`
        );
      });
      return;
    }

    console.log('✅ Tabla vacía, insertando datos...');

    // Insertar clientes uno por uno para evitar conflictos
    let insertedCount = 0;
    for (const cliente of clientesReales) {
      try {
        const { data, error } = await supabase
          .from('clientes_contables')
          .insert(cliente)
          .select();

        if (error) {
          console.error(`❌ Error insertando ${cliente.razon_social}:`, error);
        } else {
          console.log(`✅ Insertado: ${cliente.razon_social}`);
          insertedCount++;
        }
      } catch (err) {
        console.error(`❌ Error en ${cliente.razon_social}:`, err);
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(
      `✅ ${insertedCount} de ${clientesReales.length} clientes insertados`
    );

    // Verificar datos finales
    const { data: finalData, error: finalError } = await supabase
      .from('clientes_contables')
      .select('*');

    if (finalError) {
      console.error('❌ Error verificando datos finales:', finalError);
      return;
    }

    console.log(`\n🎯 DATOS FINALES:`);
    console.log(`📊 Total de clientes: ${finalData?.length || 0}`);

    if (finalData && finalData.length > 0) {
      const totalFacturado = finalData.reduce(
        (sum, c) => sum + parseFloat(c.total_facturado || 0),
        0
      );
      console.log(`💰 Total facturado: $${totalFacturado.toLocaleString()}`);
      console.log(
        `📈 Promedio por cliente: $${Math.round(totalFacturado / finalData.length).toLocaleString()}`
      );

      console.log('\n📋 Lista de clientes:');
      finalData.forEach((cliente, index) => {
        console.log(
          `${index + 1}. ${cliente.razon_social} - $${parseFloat(cliente.total_facturado).toLocaleString()}`
        );
      });
    }

    console.log('\n🎉 ¡Datos insertados exitosamente!');
    console.log('🔄 Ahora recarga la aplicación para ver los datos reales');
  } catch (err) {
    console.error('❌ Error general:', err);
  }
}

insertRealData();
