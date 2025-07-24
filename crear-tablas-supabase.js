import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase con credenciales reales
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para crear tabla usando SQL directo
async function createTableWithSQL(tableName, sql) {
  try {
    console.log(`🔨 Creando tabla ${tableName}...`);

    // Usar SQL directo para crear la tabla
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.log(`❌ Error creando tabla ${tableName}:`, error.message);
      return false;
    }

    console.log(`✅ Tabla ${tableName} creada exitosamente`);
    return true;
  } catch (error) {
    console.log(`❌ Error creando tabla ${tableName}:`, error.message);
    return false;
  }
}

// Función para insertar datos de prueba
async function insertTestData(tableName, data) {
  try {
    console.log(`📝 Insertando datos en ${tableName}...`);

    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) {
      console.log(`❌ Error insertando datos en ${tableName}:`, error.message);
      return false;
    }

    console.log(`✅ ${result.length} registros insertados en ${tableName}`);
    return true;
  } catch (error) {
    console.log(`❌ Error insertando datos en ${tableName}:`, error.message);
    return false;
  }
}

// Función principal
async function crearTablas() {
  console.log('🚀 Creando tablas en Supabase...\n');

  // SQL para crear tabla RRHH
  const rrhhSQL = `
    CREATE TABLE IF NOT EXISTS rrhh (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      telefono VARCHAR(20),
      departamento VARCHAR(100) NOT NULL,
      cargo VARCHAR(100) NOT NULL,
      fecha_ingreso DATE NOT NULL,
      salario_base DECIMAL(12,2) NOT NULL,
      estado VARCHAR(50) DEFAULT 'activo',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // SQL para crear tabla Cobranzas
  const cobranzasSQL = `
    CREATE TABLE IF NOT EXISTS cobranzas (
      id SERIAL PRIMARY KEY,
      numero_factura VARCHAR(20),
      cliente VARCHAR(255) NOT NULL,
      descripcion TEXT,
      monto_total DECIMAL(15,2) NOT NULL,
      monto_pagado DECIMAL(15,2) DEFAULT 0,
      monto_pendiente DECIMAL(15,2) NOT NULL,
      estado VARCHAR(20) DEFAULT 'Pendiente',
      fecha_emision DATE,
      fecha_vencimiento DATE,
      fecha_pago DATE,
      forma_pago VARCHAR(50),
      dias_vencimiento INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // SQL para crear tabla Ventas
  const ventasSQL = `
    CREATE TABLE IF NOT EXISTS ventas (
      id SERIAL PRIMARY KEY,
      numero_factura VARCHAR(20) UNIQUE NOT NULL,
      cliente VARCHAR(255) NOT NULL,
      descripcion TEXT,
      monto_subtotal DECIMAL(15,2) NOT NULL,
      monto_iva DECIMAL(15,2) DEFAULT 0,
      monto_total DECIMAL(15,2) NOT NULL,
      estado VARCHAR(20) DEFAULT 'Emitida',
      forma_pago VARCHAR(50),
      categoria VARCHAR(100),
      fecha_emision DATE,
      fecha_vencimiento DATE,
      dias_vencimiento INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // SQL para crear tabla Compras
  const comprasSQL = `
    CREATE TABLE IF NOT EXISTS compras (
      id SERIAL PRIMARY KEY,
      numero_orden VARCHAR(20) UNIQUE NOT NULL,
      proveedor VARCHAR(255) NOT NULL,
      descripcion TEXT,
      monto_total DECIMAL(15,2) NOT NULL,
      fecha_orden DATE,
      fecha_entrega DATE,
      estado VARCHAR(20) DEFAULT 'Pendiente',
      categoria VARCHAR(100),
      forma_pago VARCHAR(50),
      prioridad VARCHAR(20) DEFAULT 'Normal',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    // Crear tablas
    await createTableWithSQL('rrhh', rrhhSQL);
    await createTableWithSQL('cobranzas', cobranzasSQL);
    await createTableWithSQL('ventas', ventasSQL);
    await createTableWithSQL('compras', comprasSQL);

    // Datos de prueba para RRHH
    const empleadosData = [
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
      },
      {
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@mtz.com',
        telefono: '+56 9 2345 6789',
        departamento: 'Contabilidad',
        cargo: 'Analista',
        fecha_ingreso: '2023-03-20',
        salario_base: 1200000,
        estado: 'activo'
      }
    ];

    // Datos de prueba para Cobranzas
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
      },
      {
        numero_factura: 'F002-2024',
        cliente: 'Comercial XYZ SpA',
        descripcion: 'Declaración de IVA',
        monto_total: 357000,
        monto_pagado: 0,
        monto_pendiente: 357000,
        estado: 'Pendiente',
        fecha_emision: '2024-01-20',
        fecha_vencimiento: '2024-02-20',
        fecha_pago: null,
        forma_pago: 'Efectivo',
        dias_vencimiento: 15
      }
    ];

    // Datos de prueba para Ventas
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

    // Datos de prueba para Compras
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

    // Insertar datos de prueba
    await insertTestData('rrhh', empleadosData);
    await insertTestData('cobranzas', cobranzasData);
    await insertTestData('ventas', ventasData);
    await insertTestData('compras', comprasData);

    console.log('\n🎉 Proceso completado exitosamente!');
    console.log('\n📊 Tablas creadas y datos insertados:');
    console.log('  - rrhh');
    console.log('  - cobranzas');
    console.log('  - ventas');
    console.log('  - compras');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

// Ejecutar creación de tablas
crearTablas().catch(console.error);
