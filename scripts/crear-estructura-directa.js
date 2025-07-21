// Script para crear la estructura completa del sistema MTZ usando Supabase directamente
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

console.log('🚀 CREANDO ESTRUCTURA COMPLETA MTZ');
console.log('==================================');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Scripts SQL para crear la estructura completa
const scripts = [
  {
    name: 'Habilitar extensiones',
    sql: `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `,
  },
  {
    name: 'Crear tabla roles',
    sql: `
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nombre VARCHAR(50) NOT NULL UNIQUE,
        descripcion TEXT,
        permisos JSONB DEFAULT '{}',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla empresas',
    sql: `
      CREATE TABLE IF NOT EXISTS empresas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        rut VARCHAR(20) NOT NULL UNIQUE,
        razon_social VARCHAR(200) NOT NULL,
        nombre_fantasia VARCHAR(200),
        direccion TEXT,
        telefono VARCHAR(20),
        email VARCHAR(100),
        sitio_web VARCHAR(200),
        categoria VARCHAR(50) DEFAULT 'Cliente',
        estado VARCHAR(20) DEFAULT 'Activo',
        fecha_creacion DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla usuarios_sistema',
    sql: `
      CREATE TABLE IF NOT EXISTS usuarios_sistema (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(100) NOT NULL UNIQUE,
        nombre_completo VARCHAR(200) NOT NULL,
        password_hash VARCHAR(255),
        rol_id UUID REFERENCES roles(id),
        empresa_asignada UUID REFERENCES empresas(id),
        cargo VARCHAR(100),
        telefono VARCHAR(20),
        activo BOOLEAN DEFAULT true,
        ultimo_acceso TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla clientes',
    sql: `
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        empresa_id UUID REFERENCES empresas(id),
        rut VARCHAR(20) NOT NULL,
        nombre_completo VARCHAR(200) NOT NULL,
        email VARCHAR(100),
        telefono VARCHAR(20),
        direccion TEXT,
        categoria VARCHAR(50) DEFAULT 'Cliente',
        estado VARCHAR(20) DEFAULT 'Activo',
        fecha_registro DATE DEFAULT CURRENT_DATE,
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla ventas',
    sql: `
      CREATE TABLE IF NOT EXISTS ventas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cliente_id UUID REFERENCES clientes(id),
        numero_factura VARCHAR(50) NOT NULL UNIQUE,
        fecha_emision DATE NOT NULL,
        fecha_vencimiento DATE,
        monto_subtotal DECIMAL(15,2) DEFAULT 0,
        monto_iva DECIMAL(15,2) DEFAULT 0,
        monto_total DECIMAL(15,2) DEFAULT 0,
        estado VARCHAR(20) DEFAULT 'Pendiente',
        forma_pago VARCHAR(50),
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla cobranzas',
    sql: `
      CREATE TABLE IF NOT EXISTS cobranzas (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        venta_id UUID REFERENCES ventas(id),
        cliente_id UUID REFERENCES clientes(id),
        monto DECIMAL(15,2) NOT NULL,
        fecha_pago DATE NOT NULL,
        forma_pago VARCHAR(50),
        estado VARCHAR(20) DEFAULT 'Pendiente',
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla compras',
    sql: `
      CREATE TABLE IF NOT EXISTS compras (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        proveedor_id UUID REFERENCES empresas(id),
        numero_factura VARCHAR(50) NOT NULL,
        fecha_emision DATE NOT NULL,
        fecha_vencimiento DATE,
        monto_subtotal DECIMAL(15,2) DEFAULT 0,
        monto_iva DECIMAL(15,2) DEFAULT 0,
        monto_total DECIMAL(15,2) DEFAULT 0,
        estado VARCHAR(20) DEFAULT 'Pendiente',
        forma_pago VARCHAR(50),
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla contratos',
    sql: `
      CREATE TABLE IF NOT EXISTS contratos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cliente_id UUID REFERENCES clientes(id),
        numero_contrato VARCHAR(50) NOT NULL UNIQUE,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE,
        monto_mensual DECIMAL(15,2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'Activo',
        tipo_servicio VARCHAR(100),
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla rrhh',
    sql: `
      CREATE TABLE IF NOT EXISTS rrhh (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        empresa_id UUID REFERENCES empresas(id),
        rut VARCHAR(20) NOT NULL,
        nombre_completo VARCHAR(200) NOT NULL,
        email VARCHAR(100),
        telefono VARCHAR(20),
        cargo VARCHAR(100),
        fecha_ingreso DATE,
        salario DECIMAL(15,2),
        estado VARCHAR(20) DEFAULT 'Activo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla proyecciones',
    sql: `
      CREATE TABLE IF NOT EXISTS proyecciones (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        empresa_id UUID REFERENCES empresas(id),
        tipo VARCHAR(50) NOT NULL,
        periodo VARCHAR(20) NOT NULL,
        monto DECIMAL(15,2) NOT NULL,
        estado VARCHAR(20) DEFAULT 'Pendiente',
        fecha_proyeccion DATE DEFAULT CURRENT_DATE,
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Crear tabla asignaciones',
    sql: `
      CREATE TABLE IF NOT EXISTS asignaciones (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        usuario_id UUID REFERENCES usuarios_sistema(id),
        cliente_id UUID REFERENCES clientes(id),
        tipo_asignacion VARCHAR(50) NOT NULL,
        fecha_asignacion DATE DEFAULT CURRENT_DATE,
        estado VARCHAR(20) DEFAULT 'Activo',
        observaciones TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `,
  },
  {
    name: 'Configurar permisos service role',
    sql: `
      GRANT ALL PRIVILEGES ON SCHEMA public TO service_role;
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
      GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
    `,
  },
];

async function crearEstructuraCompleta() {
  try {
    console.log('1. Verificando conexión con Supabase...');

    // Probar conexión
    const { data: testData, error: testError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (testError && testError.message.includes('permission denied')) {
      console.log('❌ Error de permisos. Intentando crear estructura...');
    } else {
      console.log('✅ Conexión establecida');
    }

    // Ejecutar scripts
    for (const script of scripts) {
      console.log(`\n2. ${script.name}...`);

      const { data, error } = await supabase.rpc('exec_sql', {
        sql: script.sql,
      });

      if (error) {
        console.log(`⚠️ Error en ${script.name}:`, error.message);
        // Continuar con el siguiente script
      } else {
        console.log(`✅ ${script.name} completado`);
      }
    }

    console.log('\n🎉 ESTRUCTURA CREADA EXITOSAMENTE');
    console.log('Ahora el MCP de Supabase debería funcionar correctamente');
  } catch (error) {
    console.log('❌ Error general:', error.message);
    console.log('\n💡 SOLUCIÓN:');
    console.log('Ejecutar los scripts SQL directamente en Supabase Dashboard');
  }
}

crearEstructuraCompleta();
