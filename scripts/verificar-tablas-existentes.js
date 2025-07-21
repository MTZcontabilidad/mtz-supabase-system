import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verificarTablasExistentes() {
  console.log('🔍 VERIFICANDO TABLAS EXISTENTES EN SUPABASE\n');
  console.log('=' .repeat(60));

  try {
    // Obtener todas las tablas del esquema public
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (error) {
      console.error('❌ Error al obtener tablas:', error.message);
      return;
    }

    console.log('📋 TABLAS EXISTENTES EN SUPABASE:');
    console.log('');

    const tablasExistentes = tables.map(t => t.table_name).sort();

    tablasExistentes.forEach((tabla, index) => {
      console.log(`   ${index + 1}. ${tabla}`);
    });

    console.log('');
    console.log(`📊 Total de tablas: ${tablasExistentes.length}`);

    // Verificar tablas específicas del sistema MTZ
    const tablasMTZ = [
      'empresas',
      'roles',
      'usuarios',
      'clientes',
      'ventas',
      'cobranzas',
      'compras',
      'contratos',
      'rrhh',
      'proyecciones',
      'asignaciones'
    ];

    console.log('\n🎯 VERIFICACIÓN DE TABLAS MTZ:');
    console.log('');

    tablasMTZ.forEach(tabla => {
      const existe = tablasExistentes.includes(tabla);
      const status = existe ? '✅' : '❌';
      console.log(`   ${status} ${tabla}`);
    });

    // Contar tablas existentes vs faltantes
    const existentes = tablasMTZ.filter(t => tablasExistentes.includes(t));
    const faltantes = tablasMTZ.filter(t => !tablasExistentes.includes(t));

    console.log('');
    console.log('📈 RESUMEN:');
    console.log(`   ✅ Tablas existentes: ${existentes.length}`);
    console.log(`   ❌ Tablas faltantes: ${faltantes.length}`);

    if (faltantes.length > 0) {
      console.log('\n📋 TABLAS FALTANTES:');
      faltantes.forEach(tabla => {
        console.log(`   • ${tabla}`);
      });
    }

    // Verificar estructura de tablas existentes
    console.log('\n🔍 ESTRUCTURA DE TABLAS EXISTENTES:');

    for (const tabla of existentes) {
      console.log(`\n📋 Tabla: ${tabla}`);

      const { data: columns, error: colError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', tabla)
        .order('ordinal_position');

      if (colError) {
        console.log(`   ❌ Error al obtener columnas: ${colError.message}`);
        continue;
      }

      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        console.log(`   • ${col.column_name}: ${col.data_type} (${nullable})`);
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar verificación
verificarTablasExistentes().catch(console.error);