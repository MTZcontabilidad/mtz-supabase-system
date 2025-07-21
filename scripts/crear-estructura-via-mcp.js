// Script para crear la estructura del sistema MTZ usando el MCP de Supabase
import { spawn } from 'child_process';

const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

console.log('🚀 CREANDO ESTRUCTURA MTZ VÍA MCP SUPABASE');
console.log('==========================================');

// Función para ejecutar comandos MCP
function ejecutarMCP(comando) {
  return new Promise((resolve, reject) => {
    const args = [
      '/c',
      'npx',
      '-y',
      '@supabase/mcp-server-supabase@latest',
      '--project-ref=bwgnmastihgndmtbqvkj',
      '--access-token=' + SUPABASE_SERVICE_KEY,
    ];

    const env = {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: SUPABASE_SERVICE_KEY,
    };

    const child = spawn('cmd', args, { env });

    let output = '';
    let error = '';

    child.stdout.on('data', data => {
      output += data.toString();
    });

    child.stderr.on('data', data => {
      error += data.toString();
    });

    child.on('close', code => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`MCP failed with code ${code}: ${error}`));
      }
    });

    // Enviar comando al MCP
    child.stdin.write(JSON.stringify(comando) + '\n');
    child.stdin.end();
  });
}

// Scripts SQL para crear la estructura
const scripts = [
  {
    name: 'Crear extensiones',
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
];

async function crearEstructura() {
  try {
    console.log('1. Verificando conexión MCP...');

    // Probar conexión
    const testResult = await ejecutarMCP({
      method: 'tools/call',
      params: {
        name: 'list_tables',
        arguments: { schemas: ['public'] },
      },
    });

    console.log('✅ Conexión MCP establecida');

    // Ejecutar scripts
    for (const script of scripts) {
      console.log(`\n2. ${script.name}...`);

      const result = await ejecutarMCP({
        method: 'tools/call',
        params: {
          name: 'execute_sql',
          arguments: { query: script.sql },
        },
      });

      console.log(`✅ ${script.name} completado`);
    }

    console.log('\n🎉 ESTRUCTURA CREADA EXITOSAMENTE');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n💡 SOLUCIÓN ALTERNATIVA:');
    console.log('Ejecutar los scripts SQL directamente en Supabase Dashboard');
  }
}

crearEstructura();
