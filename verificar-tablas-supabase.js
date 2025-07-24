import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con credenciales reales
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para verificar si una tabla existe
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ Tabla ${tableName} no existe:`, error.message);
      return false;
    }
    console.log(`✅ Tabla ${tableName} existe`);
    return true;
  } catch (error) {
    console.log(`❌ Error verificando tabla ${tableName}:`, error.message);
    return false;
  }
}

// Función para insertar datos de prueba
async function insertTestData(tableName, data) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) {
      console.log(`❌ Error insertando datos en ${tableName}:`, error.message);
      return false;
    }
    console.log(`✅ Datos insertados en ${tableName}:`, result.length, 'registros');
    return true;
  } catch (error) {
    console.log(`❌ Error insertando datos en ${tableName}:`, error.message);
    return false;
  }
}

// Función principal
async function verificarTablas() {
  console.log('🔍 Verificando tablas en Supabase...\n');

  // Lista de tablas a verificar
  const tables = [
    'clientes',
    'ventas',
    'cobranzas',
    'compras',
    'rrhh',
    'nominas',
    'contratos',
    'declaraciones_iva'
  ];

  const results = {};

  // Verificar cada tabla
  for (const table of tables) {
    results[table] = await tableExists(table);
  }

  console.log('\n📊 RESUMEN DE TABLAS:');
  console.log('========================');

  for (const [table, exists] of Object.entries(results)) {
    const status = exists ? '✅ EXISTE' : '❌ NO EXISTE';
    console.log(`${table}: ${status}`);
  }

  // Insertar datos de prueba en las tablas que existen
  console.log('\n📝 INSERTANDO DATOS DE PRUEBA...');
  console.log('==================================');

  if (results.clientes) {
    const clientesData = [
      {
        nombre: 'Empresa ABC Ltda.',
        ruc: '12345678-9',
        email: 'contacto@abc.cl',
        telefono: '+56 2 2345 6789',
        estado: 'Activo'
      },
      {
        nombre: 'Comercial XYZ SpA',
        ruc: '98765432-1',
        email: 'info@xyz.cl',
        telefono: '+56 2 3456 7890',
        estado: 'Activo'
      }
    ];
    await insertTestData('clientes', clientesData);
  }

  if (results.ventas) {
    const ventasData = [
      {
        numero_factura: 'F001-2024',
        cliente: 'Empresa ABC Ltda.',
        descripcion: 'Servicios de contabilidad mensual',
        monto_subtotal: 500000,
        monto_iva: 95000,
        monto_total: 595000,
        estado: 'Pagada',
        forma_pago: 'Transferencia',
        categoria: 'Contabilidad',
        fecha_emision: '2024-01-15',
        fecha_vencimiento: '2024-02-15',
        dias_vencimiento: 30
      }
    ];
    await insertTestData('ventas', ventasData);
  }

  if (results.cobranzas) {
    const cobranzasData = [
      {
        numero_factura: 'F001-2024',
        cliente: 'Empresa ABC Ltda.',
        descripcion: 'Servicios de contabilidad mensual',
        monto_total: 595000,
        monto_pagado: 595000,
        monto_pendiente: 0,
        estado: 'Pagada',
        fecha_emision: '2024-01-15',
        fecha_vencimiento: '2024-02-15',
        fecha_pago: '2024-02-10',
        forma_pago: 'Transferencia',
        dias_vencimiento: 0
      }
    ];
    await insertTestData('cobranzas', cobranzasData);
  }

  if (results.compras) {
    const comprasData = [
      {
        numero_orden: 'OC-2024-001',
        proveedor: 'Proveedor ABC Ltda.',
        descripcion: 'Materiales de oficina',
        monto_total: 250000,
        fecha_orden: '2024-12-15',
        fecha_entrega: '2024-12-20',
        estado: 'Aprobada',
        categoria: 'Oficina',
        forma_pago: 'Transferencia',
        prioridad: 'Normal'
      }
    ];
    await insertTestData('compras', comprasData);
  }

  if (results.rrhh) {
    const rrhhData = [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@mtz.com',
        telefono: '+56 9 1234 5678',
        departamento: 'Administración',
        cargo: 'Gerente',
        fecha_ingreso: '2023-01-15',
        salario_base: 1500000,
        estado: 'activo'
      }
    ];
    await insertTestData('rrhh', rrhhData);
  }

  console.log('\n🎉 Verificación completada!');
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('1. Revisar las tablas que no existen');
  console.log('2. Crear las tablas faltantes manualmente en Supabase');
  console.log('3. Ejecutar este script nuevamente para insertar datos');
}

// Ejecutar verificación
verificarTablas().catch(console.error);
