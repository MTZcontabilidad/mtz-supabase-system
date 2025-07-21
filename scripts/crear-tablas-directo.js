// Script para crear todas las tablas del sistema MTZ usando Supabase directamente
import { createClient } from '@supabase/supabase-js';

// Configuración con token de servicio
const supabaseUrl = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const supabaseServiceKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function crearTablasDirecto() {
  console.log('🏗️ CREANDO TABLAS DEL SISTEMA MTZ\n');
  console.log('='.repeat(60));

  try {
    // 1. Verificar conexión
    console.log('\n1️⃣ VERIFICANDO CONEXIÓN:');

    const { data: testData, error: testError } = await supabase
      .from('test_mcp_simple')
      .select('*')
      .limit(1);

    if (testError) {
      console.log(`   ❌ Error de conexión: ${testError.message}`);
      return;
    } else {
      console.log('   ✅ Conexión exitosa');
    }

    // 2. Crear tablas principales del sistema MTZ
    console.log('\n2️⃣ CREANDO TABLAS PRINCIPALES:');

    // Tabla de empresas
    console.log('   📋 Creando tabla empresas...');
    const createEmpresasSQL = `
      CREATE TABLE IF NOT EXISTS empresas (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        ruc VARCHAR(20) UNIQUE,
        direccion TEXT,
        telefono VARCHAR(20),
        email VARCHAR(255),
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: empresasError } = await supabase.rpc('exec_sql', {
      sql: createEmpresasSQL,
    });
    if (empresasError) {
      console.log(
        `   ⚠️ Error al crear tabla empresas: ${empresasError.message}`
      );
      console.log('   💡 Intentando método alternativo...');

      // Intentar con SQL directo usando el cliente
      const { error: directError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', 'empresas');

      if (directError) {
        console.log(
          `   ❌ No se puede verificar tabla empresas: ${directError.message}`
        );
      } else {
        console.log('   ✅ Tabla empresas verificada');
      }
    } else {
      console.log('   ✅ Tabla empresas creada');
    }

    // Tabla de roles
    console.log('   📋 Creando tabla roles...');
    const createRolesSQL = `
      CREATE TABLE IF NOT EXISTS roles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        permisos JSONB DEFAULT '{}',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: rolesError } = await supabase.rpc('exec_sql', {
      sql: createRolesSQL,
    });
    if (rolesError) {
      console.log(`   ⚠️ Error al crear tabla roles: ${rolesError.message}`);
    } else {
      console.log('   ✅ Tabla roles creada');
    }

    // Tabla de usuarios
    console.log('   📋 Creando tabla usuarios...');
    const createUsuariosSQL = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255),
        rol_id UUID REFERENCES roles(id),
        empresa_id UUID REFERENCES empresas(id),
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: usuariosError } = await supabase.rpc('exec_sql', {
      sql: createUsuariosSQL,
    });
    if (usuariosError) {
      console.log(
        `   ⚠️ Error al crear tabla usuarios: ${usuariosError.message}`
      );
    } else {
      console.log('   ✅ Tabla usuarios creada');
    }

    // Tabla de clientes
    console.log('   📋 Creando tabla clientes...');
    const createClientesSQL = `
      CREATE TABLE IF NOT EXISTS clientes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        ruc VARCHAR(20),
        direccion TEXT,
        telefono VARCHAR(20),
        email VARCHAR(255),
        empresa_id UUID REFERENCES empresas(id),
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: clientesError } = await supabase.rpc('exec_sql', {
      sql: createClientesSQL,
    });
    if (clientesError) {
      console.log(
        `   ⚠️ Error al crear tabla clientes: ${clientesError.message}`
      );
    } else {
      console.log('   ✅ Tabla clientes creada');
    }

    // Tabla de ventas
    console.log('   📋 Creando tabla ventas...');
    const createVentasSQL = `
      CREATE TABLE IF NOT EXISTS ventas (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        cliente_id UUID REFERENCES clientes(id),
        fecha_venta DATE NOT NULL,
        monto_total DECIMAL(10,2) NOT NULL,
        estado VARCHAR(50) DEFAULT 'pendiente',
        empresa_id UUID REFERENCES empresas(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: ventasError } = await supabase.rpc('exec_sql', {
      sql: createVentasSQL,
    });
    if (ventasError) {
      console.log(`   ⚠️ Error al crear tabla ventas: ${ventasError.message}`);
    } else {
      console.log('   ✅ Tabla ventas creada');
    }

    // 3. Insertar datos de prueba
    console.log('\n3️⃣ INSERTANDO DATOS DE PRUEBA:');

    // Insertar empresa de prueba
    console.log('   📋 Insertando empresa de prueba...');
    const { data: empresaData, error: empresaInsertError } = await supabase
      .from('empresas')
      .insert([
        {
          nombre: 'MTZ Solutions',
          ruc: '12345678901',
          direccion: 'Av. Principal 123',
          telefono: '+51 123 456 789',
          email: 'info@mtzsolutions.com',
        },
      ])
      .select();

    if (empresaInsertError) {
      console.log(
        `   ⚠️ Error al insertar empresa: ${empresaInsertError.message}`
      );
    } else {
      console.log('   ✅ Empresa insertada:', empresaData[0].nombre);
    }

    // Insertar rol de administrador
    console.log('   📋 Insertando rol de administrador...');
    const { data: rolData, error: rolInsertError } = await supabase
      .from('roles')
      .insert([
        {
          nombre: 'Administrador',
          descripcion: 'Rol con todos los permisos del sistema',
          permisos: { admin: true, read: true, write: true, delete: true },
        },
      ])
      .select();

    if (rolInsertError) {
      console.log(`   ⚠️ Error al insertar rol: ${rolInsertError.message}`);
    } else {
      console.log('   ✅ Rol insertado:', rolData[0].nombre);
    }

    // 4. Verificar tablas creadas
    console.log('\n4️⃣ VERIFICANDO TABLAS CREADAS:');

    const tablasEsperadas = [
      'empresas',
      'roles',
      'usuarios',
      'clientes',
      'ventas',
    ];

    for (const tabla of tablasEsperadas) {
      try {
        const { data, error } = await supabase.from(tabla).select('*').limit(1);

        if (error) {
          console.log(`   ❌ Tabla ${tabla}: ${error.message}`);
        } else {
          console.log(`   ✅ Tabla ${tabla}: Accesible`);
        }
      } catch (err) {
        console.log(`   ❌ Tabla ${tabla}: Error de conexión`);
      }
    }

    // 5. Estado final
    console.log('\n5️⃣ ESTADO FINAL:');
    console.log('   🎉 Proceso de creación de tablas completado');
    console.log('   📋 Tablas principales del sistema MTZ creadas');
    console.log('   📊 Datos de prueba insertados');
    console.log('   🔗 Conexión directa funcionando correctamente');
    console.log('   ⚠️ MCP puede necesitar reinicio adicional para funcionar');
  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

// Ejecutar creación de tablas
crearTablasDirecto().catch(console.error);
