import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de Supabase con credenciales reales
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MzMzNzgsImV4cCI6MjA2ODMwOTM3OH0.ZTOHO8HXeDrsmBomYXX516Leq9WdRuM7lunqNI2uC8I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para leer archivos SQL
function readSqlFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error leyendo archivo ${filePath}:`, error.message);
    return null;
  }
}

// Función para ejecutar SQL
async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      console.error('Error ejecutando SQL:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error en executeSql:', error);
    return false;
  }
}

// Función para verificar si una tabla existe
async function tableExists(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Función para crear tabla simple
async function createSimpleTable(tableName, columns) {
  try {
    console.log(`Creando tabla ${tableName}...`);

    // Crear tabla usando SQL directo
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columns}
      );
    `;

    const { error } = await supabase.rpc('exec_sql', { sql_query: createTableSQL });

    if (error) {
      console.error(`Error creando tabla ${tableName}:`, error);
      return false;
    }

    console.log(`✅ Tabla ${tableName} creada exitosamente`);
    return true;
  } catch (error) {
    console.error(`Error creando tabla ${tableName}:`, error);
    return false;
  }
}

// Función principal de migración
async function migrateTables() {
  console.log('🚀 Iniciando migración de tablas a Supabase...\n');

  // Verificar conexión
  try {
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1);
    if (error) {
      console.error('❌ Error de conexión con Supabase:', error);
      return;
    }
    console.log('✅ Conexión con Supabase establecida\n');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return;
  }

  // Definir tablas a crear
  const tables = [
    {
      name: 'clientes',
      columns: `
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        ruc VARCHAR(20) UNIQUE,
        email VARCHAR(255),
        telefono VARCHAR(20),
        direccion TEXT,
        estado VARCHAR(20) DEFAULT 'Activo',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      `
    },
    {
      name: 'ventas',
      columns: `
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
      `
    },
    {
      name: 'cobranzas',
      columns: `
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
      `
    },
    {
      name: 'compras',
      columns: `
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
      `
    },
    {
      name: 'rrhh',
      columns: `
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
      `
    },
    {
      name: 'nominas',
      columns: `
        id SERIAL PRIMARY KEY,
        empleado_id INTEGER REFERENCES rrhh(id) ON DELETE CASCADE,
        mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
        año INTEGER NOT NULL,
        dias_trabajados INTEGER,
        salario_base DECIMAL(12,2) NOT NULL,
        bonificaciones DECIMAL(12,2) DEFAULT 0,
        descuentos DECIMAL(12,2) DEFAULT 0,
        salario_neto DECIMAL(12,2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'Pendiente',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(empleado_id, mes, año)
      `
    },
    {
      name: 'contratos',
      columns: `
        id SERIAL PRIMARY KEY,
        numero_contrato VARCHAR(20) UNIQUE NOT NULL,
        cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
        descripcion TEXT,
        monto_total DECIMAL(15,2) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        estado VARCHAR(20) DEFAULT 'Activo',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      `
    },
    {
      name: 'declaraciones_iva',
      columns: `
        id SERIAL PRIMARY KEY,
        periodo VARCHAR(20) NOT NULL,
        fecha_vencimiento DATE NOT NULL,
        monto_declarado DECIMAL(15,2) DEFAULT 0,
        monto_pagado DECIMAL(15,2) DEFAULT 0,
        estado VARCHAR(20) DEFAULT 'Pendiente',
        observaciones TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      `
    }
  ];

  // Crear tablas
  for (const table of tables) {
    const exists = await tableExists(table.name);
    if (exists) {
      console.log(`ℹ️ Tabla ${table.name} ya existe`);
    } else {
      await createSimpleTable(table.name, table.columns);
    }
  }

  console.log('\n🎉 Migración de tablas completada!');
  console.log('\n📊 Tablas creadas/verificadas:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });
}

// Ejecutar migración
migrateTables().catch(console.error);
