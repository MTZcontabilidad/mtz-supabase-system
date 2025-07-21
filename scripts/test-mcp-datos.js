// Script para probar la funcionalidad de agregar datos usando Supabase
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = 'https://bwgnmastihgndmtbqvkj.supabase.co';
const SUPABASE_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjczMzM3OCwiZXhwIjoyMDY4MzA5Mzc4fQ.2y4rbxpHNxhM2tMHzZ43GQi9fIMC6lpl9FjEw7sxoNM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🧪 PROBANDO FUNCIONALIDAD DE AGREGAR DATOS');
console.log('==========================================');

// Función para verificar si una tabla existe
async function verificarTabla(nombreTabla) {
  try {
    const { data, error } = await supabase
      .from(nombreTabla)
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log(`❌ Tabla ${nombreTabla} NO existe`);
      return false;
    } else if (error) {
      console.log(`❌ Error verificando ${nombreTabla}:`, error.message);
      return false;
    } else {
      console.log(`✅ Tabla ${nombreTabla} existe`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Error verificando ${nombreTabla}:`, error.message);
    return false;
  }
}

// Función para crear tabla de prueba simple
async function crearTablaPrueba() {
  console.log('\n📝 Creando tabla de prueba...');

  const sqlCrearTabla = `
    CREATE TABLE IF NOT EXISTS public.tabla_prueba (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      valor DECIMAL(10,2),
      activo BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    // Intentar crear la tabla usando RPC
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sqlCrearTabla,
    });

    if (error) {
      console.log('❌ No se pudo crear tabla via RPC:', error.message);
      console.log('⚠️ La función exec_sql no está disponible');
      return false;
    }

    console.log('✅ Tabla de prueba creada via RPC');
    return true;
  } catch (error) {
    console.log('❌ Error creando tabla:', error.message);
    return false;
  }
}

// Función para insertar datos de prueba
async function insertarDatosPrueba() {
  console.log('\n📊 Insertando datos de prueba...');

  const datosPrueba = [
    {
      nombre: 'Test 1',
      descripcion: 'Primer registro de prueba',
      valor: 100.5,
      activo: true,
    },
    {
      nombre: 'Test 2',
      descripcion: 'Segundo registro de prueba',
      valor: 250.75,
      activo: true,
    },
    {
      nombre: 'Test 3',
      descripcion: 'Tercer registro de prueba',
      valor: 75.25,
      activo: false,
    },
  ];

  try {
    const { data, error } = await supabase
      .from('tabla_prueba')
      .insert(datosPrueba)
      .select();

    if (error) {
      console.log('❌ Error insertando datos:', error.message);
      return false;
    }

    console.log('✅ Datos de prueba insertados correctamente');
    console.log('📋 Registros insertados:', data.length);
    return true;
  } catch (error) {
    console.log('❌ Error insertando datos:', error.message);
    return false;
  }
}

// Función para leer datos de prueba
async function leerDatosPrueba() {
  console.log('\n📖 Leyendo datos de prueba...');

  try {
    const { data, error } = await supabase
      .from('tabla_prueba')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ Error leyendo datos:', error.message);
      return false;
    }

    console.log('✅ Datos leídos correctamente');
    console.log('📋 Total de registros:', data.length);

    data.forEach((registro, index) => {
      console.log(
        `   ${index + 1}. ${registro.nombre} - $${registro.valor} - ${registro.activo ? 'Activo' : 'Inactivo'}`
      );
    });

    return true;
  } catch (error) {
    console.log('❌ Error leyendo datos:', error.message);
    return false;
  }
}

// Función para actualizar datos de prueba
async function actualizarDatosPrueba() {
  console.log('\n✏️ Actualizando datos de prueba...');

  try {
    const { data, error } = await supabase
      .from('tabla_prueba')
      .update({
        valor: 999.99,
        descripcion: 'Registro actualizado via test',
      })
      .eq('nombre', 'Test 1')
      .select();

    if (error) {
      console.log('❌ Error actualizando datos:', error.message);
      return false;
    }

    console.log('✅ Datos actualizados correctamente');
    console.log('📋 Registros actualizados:', data.length);
    return true;
  } catch (error) {
    console.log('❌ Error actualizando datos:', error.message);
    return false;
  }
}

// Función para eliminar datos de prueba
async function eliminarDatosPrueba() {
  console.log('\n🗑️ Eliminando datos de prueba...');

  try {
    const { data, error } = await supabase
      .from('tabla_prueba')
      .delete()
      .eq('nombre', 'Test 3')
      .select();

    if (error) {
      console.log('❌ Error eliminando datos:', error.message);
      return false;
    }

    console.log('✅ Datos eliminados correctamente');
    console.log('📋 Registros eliminados:', data.length);
    return true;
  } catch (error) {
    console.log('❌ Error eliminando datos:', error.message);
    return false;
  }
}

// Función principal
async function ejecutarPruebas() {
  console.log('🔍 Verificando tablas existentes...');

  // Verificar tablas que deberían existir
  const tablasExistentes = await Promise.all([
    verificarTabla('roles'),
    verificarTabla('usuarios_sistema'),
    verificarTabla('empresas'),
    verificarTabla('tabla_prueba'),
  ]);

  // Si no hay tablas, intentar crear una de prueba
  if (!tablasExistentes.some(existe => existe)) {
    console.log('\n⚠️ No se encontraron tablas existentes');
    console.log('Intentando crear tabla de prueba...');

    const tablaCreada = await crearTablaPrueba();
    if (!tablaCreada) {
      console.log('\n❌ No se pudo crear tabla de prueba');
      console.log('Necesitas ejecutar el script SQL en Supabase Dashboard');
      return;
    }
  }

  // Ejecutar pruebas de CRUD
  const pruebas = [
    { nombre: 'Insertar', funcion: insertarDatosPrueba },
    { nombre: 'Leer', funcion: leerDatosPrueba },
    { nombre: 'Actualizar', funcion: actualizarDatosPrueba },
    { nombre: 'Eliminar', funcion: eliminarDatosPrueba },
  ];

  console.log('\n🧪 EJECUTANDO PRUEBAS CRUD');
  console.log('==========================');

  let exitosos = 0;

  for (const prueba of pruebas) {
    console.log(`\n📝 Prueba: ${prueba.nombre}`);
    const resultado = await prueba.funcion();
    if (resultado) exitosos++;
  }

  console.log('\n📊 RESUMEN DE PRUEBAS');
  console.log('=====================');
  console.log(`✅ Exitosas: ${exitosos}`);
  console.log(`❌ Fallidas: ${pruebas.length - exitosos}`);
  console.log(`📁 Total: ${pruebas.length}`);

  if (exitosos === pruebas.length) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
    console.log('El cliente de Supabase funciona correctamente');
    console.log('El problema está en la configuración del MCP');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron');
    console.log('Revisa los errores anteriores');
  }
}

// Ejecutar pruebas
ejecutarPruebas().catch(console.error);
