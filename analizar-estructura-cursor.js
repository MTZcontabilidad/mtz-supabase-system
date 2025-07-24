// =====================================================================
// 🔍 ANALIZAR ESTRUCTURA PARA CURSORES - SISTEMA MTZ
// =====================================================================
// Script para analizar estructura de tablas y generar información para cursores
// =====================================================================

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =====================================================================
// FUNCIONES DE ANÁLISIS
// =====================================================================

async function analizarEstructuraTablas() {
  console.log('🔍 ANALIZANDO ESTRUCTURA DE TABLAS PARA CURSORES');
  console.log('================================================\n');

  const tablas = [
    'ventas',
    'clientes_contables',
    'cobranzas',
    'empresas',
    'empleados',
    'nominas',
    'asignaciones',
    'asignaciones_clientes',
    'usuarios',
    'roles',
    'proyecciones',
    'rrhh',
  ];

  const estructuras = {};

  for (const tabla of tablas) {
    try {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        console.log(`❌ ${tabla}: ${error.message}`);
        estructuras[tabla] = { existe: false, error: error.message };
      } else {
        console.log(`✅ ${tabla}: Analizando estructura...`);
        const columnas = data[0] ? Object.keys(data[0]) : [];
        estructuras[tabla] = {
          existe: true,
          columnas: columnas,
          tipos: data[0]
            ? Object.entries(data[0]).map(([key, value]) => ({
                columna: key,
                tipo: typeof value,
                ejemplo: value,
              }))
            : [],
        };
      }
    } catch (err) {
      console.log(`❌ ${tabla}: ${err.message}`);
      estructuras[tabla] = { existe: false, error: err.message };
    }
  }

  return estructuras;
}

async function analizarRelacionesParaCursores() {
  console.log('\n🔗 ANALIZANDO RELACIONES PARA CURSORES');
  console.log('=====================================\n');

  const relaciones = [];

  // Relaciones esperadas para cursores
  const relacionesEsperadas = [
    {
      tabla: 'ventas',
      columna: 'cliente_id',
      referencia: 'clientes_contables.id',
    },
    { tabla: 'ventas', columna: 'empresa_id', referencia: 'empresas.id' },
    { tabla: 'ventas', columna: 'usuario_id', referencia: 'usuarios.id' },
    { tabla: 'cobranzas', columna: 'venta_id', referencia: 'ventas.id' },
    {
      tabla: 'cobranzas',
      columna: 'cliente_id',
      referencia: 'clientes_contables.id',
    },
    { tabla: 'nominas', columna: 'empleado_id', referencia: 'empleados.id' },
    {
      tabla: 'asignaciones_clientes',
      columna: 'cliente_id',
      referencia: 'clientes_contables.id',
    },
    {
      tabla: 'asignaciones_clientes',
      columna: 'usuario_id',
      referencia: 'usuarios.id',
    },
    {
      tabla: 'clientes_contables',
      columna: 'empresa_id',
      referencia: 'empresas.id',
    },
  ];

  for (const rel of relacionesEsperadas) {
    try {
      const { data, error } = await supabase
        .from(rel.tabla)
        .select(`${rel.columna}`)
        .limit(1);

      if (error) {
        console.log(
          `❌ ${rel.tabla}.${rel.columna} -> ${rel.referencia}: ${error.message}`
        );
        relaciones.push({ ...rel, existe: false, error: error.message });
      } else {
        console.log(
          `✅ ${rel.tabla}.${rel.columna} -> ${rel.referencia}: EXISTE`
        );
        relaciones.push({ ...rel, existe: true });
      }
    } catch (err) {
      console.log(
        `❌ ${rel.tabla}.${rel.columna} -> ${rel.referencia}: ${err.message}`
      );
      relaciones.push({ ...rel, existe: false, error: err.message });
    }
  }

  return relaciones;
}

async function generarEjemplosCursores() {
  console.log('\n📊 GENERANDO EJEMPLOS DE CURSORES');
  console.log('==================================\n');

  const ejemplosCursores = {
    ventas: {
      nombre: 'obtener_ventas_cursor',
      descripcion:
        'Cursor para obtener ventas con detalles de cliente y empresa',
      parametros: ['p_empresa_id', 'p_estado', 'p_fecha_inicio', 'p_fecha_fin'],
      joins: ['clientes_contables', 'empresas'],
      ordenamiento: 'fecha_emision',
    },
    cobranzas: {
      nombre: 'obtener_cobranzas_cursor',
      descripcion: 'Cursor para obtener cobranzas con detalles de venta',
      parametros: ['p_estado', 'p_fecha_inicio', 'p_fecha_fin'],
      joins: ['ventas', 'clientes_contables'],
      ordenamiento: 'fecha_cobro',
    },
    empleados: {
      nombre: 'obtener_empleados_cursor',
      descripcion: 'Cursor para obtener empleados con detalles de nóminas',
      parametros: ['p_departamento', 'p_estado'],
      joins: ['nominas'],
      ordenamiento: 'nombres',
    },
    clientes: {
      nombre: 'obtener_clientes_cursor',
      descripcion:
        'Cursor para obtener clientes con resumen de ventas y cobranzas',
      parametros: ['p_empresa_id', 'p_estado'],
      joins: ['ventas', 'cobranzas', 'empresas'],
      ordenamiento: 'razon_social',
    },
  };

  return ejemplosCursores;
}

// =====================================================================
// FUNCIÓN PRINCIPAL
// =====================================================================

async function analizarEstructuraParaCursores() {
  console.log('🚀 ANALIZANDO ESTRUCTURA PARA CURSORES');
  console.log('======================================\n');

  // 1. Analizar estructura de tablas
  const estructuras = await analizarEstructuraTablas();

  // 2. Analizar relaciones
  const relaciones = await analizarRelacionesParaCursores();

  // 3. Generar ejemplos de cursores
  const ejemplosCursores = await generarEjemplosCursores();

  // 4. Generar reporte completo
  console.log('\n📋 REPORTE COMPLETO PARA CURSORES');
  console.log('==================================\n');

  console.log('## 📊 ESTRUCTURA DE TABLAS:');
  Object.entries(estructuras).forEach(([tabla, info]) => {
    if (info.existe) {
      console.log(`- ✅ ${tabla}: ${info.columnas?.length || 0} columnas`);
      if (info.columnas && info.columnas.length > 0) {
        console.log(
          `  Columnas: ${info.columnas.slice(0, 5).join(', ')}${
            info.columnas.length > 5 ? '...' : ''
          }`
        );
      }
    } else {
      console.log(`- ❌ ${tabla}: ${info.error}`);
    }
  });

  console.log('\n## 🔗 RELACIONES PARA CURSORES:');
  relaciones.forEach(rel => {
    if (rel.existe) {
      console.log(`- ✅ ${rel.tabla}.${rel.columna} -> ${rel.referencia}`);
    } else {
      console.log(
        `- ❌ ${rel.tabla}.${rel.columna} -> ${rel.referencia}: ${rel.error}`
      );
    }
  });

  console.log('\n## 📊 EJEMPLOS DE CURSORES SUGERIDOS:');
  Object.entries(ejemplosCursores).forEach(([tipo, cursor]) => {
    console.log(`\n### ${cursor.nombre}:`);
    console.log(`- Descripción: ${cursor.descripcion}`);
    console.log(`- Parámetros: ${cursor.parametros.join(', ')}`);
    console.log(`- Joins: ${cursor.joins.join(', ')}`);
    console.log(`- Ordenamiento: ${cursor.ordenamiento}`);
  });

  // 5. Generar recomendaciones
  console.log('\n## 🎯 RECOMENDACIONES PARA CURSORES:');
  console.log(
    '1. 🔗 Verificar que todas las relaciones existan antes de crear cursores'
  );
  console.log('2. 📊 Crear índices en campos de ordenamiento y filtrado');
  console.log('3. 🔐 Implementar políticas RLS apropiadas para los cursores');
  console.log('4. ⚡ Optimizar consultas con LIMIT y OFFSET para paginación');
  console.log('5. 🔄 Considerar cursores para reportes complejos');
  console.log('6. 📈 Implementar cursores para análisis de datos');

  // 6. Generar prompt para IA
  console.log('\n## 📝 PROMPT SUGERIDO PARA IA SUPABASE (CURSORES):');
  console.log(
    '"Necesito crear cursores optimizados para mi sistema de gestión contable. Tengo las siguientes tablas principales:'
  );
  console.log(
    '- ventas (con relaciones a clientes_contables, empresas, usuarios)'
  );
  console.log('- cobranzas (con relaciones a ventas, clientes_contables)');
  console.log('- empleados (con relaciones a nominas)');
  console.log(
    '- clientes_contables (con relaciones a empresas, ventas, cobranzas)'
  );
  console.log('');
  console.log('Por favor, ayúdame a crear:');
  console.log('1. Cursor para ventas con detalles de cliente y empresa');
  console.log('2. Cursor para cobranzas con detalles de venta');
  console.log('3. Cursor para empleados con resumen de nóminas');
  console.log('4. Cursor para clientes con resumen de ventas y cobranzas');
  console.log('5. Índices optimizados para los cursores');
  console.log('6. Políticas RLS apropiadas"');

  console.log('\n🎉 ¡ANÁLISIS COMPLETO PARA CURSORES!');

  return {
    estructuras,
    relaciones,
    ejemplosCursores,
  };
}

// =====================================================================
// EJECUTAR ANÁLISIS
// =====================================================================

analizarEstructuraParaCursores().catch(console.error);
