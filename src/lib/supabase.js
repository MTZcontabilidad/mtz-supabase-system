import { createClient } from '@supabase/supabase-js';

// Configuración Supabase desde variables de entorno
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Diagnóstico de configuración
console.log('🔍 DIAGNÓSTICO SUPABASE:');
console.log('URL:', SUPABASE_URL);
console.log('Key configurada:', !!SUPABASE_ANON_KEY);
console.log('Key length:', SUPABASE_ANON_KEY?.length || 0);
console.log('Key starts with:', SUPABASE_ANON_KEY?.substring(0, 20) + '...');

// Crear cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'mtz-system@1.0.0',
    },
  },
});

// Datos mock para cuando Supabase no esté disponible
const MOCK_CLIENTES = [
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
    created_at: '2024-01-15T10:00:00Z',
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
    created_at: '2024-02-20T14:30:00Z',
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
    created_at: '2024-03-10T09:15:00Z',
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
    created_at: '2024-04-05T16:45:00Z',
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
    created_at: '2024-05-12T11:20:00Z',
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
    direccion: 'Maipú 789, Santiago',
    created_at: '2024-06-18T13:10:00Z',
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
    direccion: 'Las Condes 321, Santiago',
    created_at: '2024-07-25T08:30:00Z',
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
    direccion: 'Vitacura 654, Santiago',
    created_at: '2024-08-30T15:45:00Z',
  },
];

// Función de prueba para verificar conexión
export const testSupabaseConnection = async () => {
  try {
    console.log('🔍 Probando conexión con Supabase...');
    console.log('URL:', SUPABASE_URL);
    console.log('Key configurada:', !!SUPABASE_ANON_KEY);

    // Primero probar una consulta simple
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Error de conexión:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Conexión exitosa con Supabase');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error en prueba de conexión:', err);
    return { success: false, error: err.message };
  }
};

// Función para probar diferentes tablas
export const testAllTables = async () => {
  const tables = ['clientes_contables', 'usuarios_sistema', 'roles'];
  const results = {};

  for (const table of tables) {
    try {
      console.log(`🔍 Probando tabla: ${table}`);
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        console.error(`❌ Error en tabla ${table}:`, error);
        results[table] = { success: false, error: error.message };
      } else {
        console.log(`✅ Tabla ${table} accesible`);
        results[table] = { success: true, count: data?.length || 0 };
      }
    } catch (err) {
      console.error(`❌ Error probando tabla ${table}:`, err);
      results[table] = { success: false, error: err.message };
    }
  }

  return results;
};

// Funciones de utilidad simplificadas
export const getClientes = async () => {
  try {
    console.log('🔄 Cargando clientes desde Supabase...');

    // Probar primero si la tabla existe
    const tableTest = await testAllTables();
    if (!tableTest.clientes_contables?.success) {
      console.error(
        '❌ Tabla clientes_contables no accesible:',
        tableTest.clientes_contables?.error
      );
      console.log('🔄 Usando datos mock como fallback...');
      return MOCK_CLIENTES;
    }

    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .order('total_facturado', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo clientes:', error);
      console.log('🔄 Usando datos mock como fallback...');
      return MOCK_CLIENTES;
    }

    console.log(`✅ ${data?.length || 0} clientes cargados exitosamente`);
    return data || MOCK_CLIENTES;
  } catch (err) {
    console.error('❌ Error en getClientes:', err);
    console.log('🔄 Usando datos mock como fallback...');
    return MOCK_CLIENTES;
  }
};

export const buscarClientes = async termino => {
  if (!termino.trim()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('clientes_contables')
      .select('*')
      .or(
        `razon_social.ilike.%${termino}%,rut.ilike.%${termino}%,id_cliente.ilike.%${termino}%`
      )
      .order('total_facturado', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error buscando clientes:', error);
      // Usar datos mock como fallback
      return MOCK_CLIENTES.filter(
        cliente =>
          cliente.razon_social.toLowerCase().includes(termino.toLowerCase()) ||
          cliente.rut.includes(termino) ||
          cliente.id_cliente.toLowerCase().includes(termino.toLowerCase())
      );
    }

    return data || [];
  } catch (err) {
    console.error('Error en buscarClientes:', err);
    // Usar datos mock como fallback
    return MOCK_CLIENTES.filter(
      cliente =>
        cliente.razon_social.toLowerCase().includes(termino.toLowerCase()) ||
        cliente.rut.includes(termino) ||
        cliente.id_cliente.toLowerCase().includes(termino.toLowerCase())
    );
  }
};

// Exportar configuración para debug
export const MTZ_CONFIG = {
  url: SUPABASE_URL,
  keyConfigured: !!SUPABASE_ANON_KEY,
  keyLength: SUPABASE_ANON_KEY?.length || 0,
  version: '1.0.0',
};

export default supabase;
