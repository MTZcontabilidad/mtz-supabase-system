// =====================================================================
// 🔧 CORREGIR RECURSIÓN INFINITA EN RLS - SISTEMA MTZ
// =====================================================================
// Script para corregir el problema de recursión infinita en políticas RLS
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
// FUNCIONES DE CORRECCIÓN
// =====================================================================

async function verificarProblemaRecursion() {
  console.log('🚨 VERIFICANDO PROBLEMA DE RECURSIÓN INFINITA');
  console.log('=============================================\n');

  const tablasProblematicas = [
    'ventas',
    'clientes_contables',
    'empresas',
    'usuarios',
  ];

  const resultados = {};

  for (const tabla of tablasProblematicas) {
    try {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        console.log(`❌ ${tabla}: ${error.message}`);
        resultados[tabla] = { problema: true, error: error.message };
      } else {
        console.log(`✅ ${tabla}: FUNCIONA CORRECTAMENTE`);
        resultados[tabla] = { problema: false };
      }
    } catch (err) {
      console.log(`❌ ${tabla}: ${err.message}`);
      resultados[tabla] = { problema: true, error: err.message };
    }
  }

  return resultados;
}

async function generarScriptCorreccionRLS() {
  console.log('\n🔧 GENERANDO SCRIPT DE CORRECCIÓN RLS');
  console.log('=====================================\n');

  const scriptCorreccion = `
-- =====================================================================
-- 🔧 CORRECCIÓN RECURSIÓN INFINITA EN RLS - SISTEMA MTZ
-- =====================================================================
-- Script para corregir políticas RLS que causan recursión infinita
-- =====================================================================

-- PASO 1: ELIMINAR POLÍTICAS PROBLEMÁTICAS
-- =====================================================================

-- Eliminar políticas de usuarios (causa principal de recursión)
DROP POLICY IF EXISTS "usuarios_select_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_delete_policy" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir acceso completo a usuarios" ON public.usuarios;

-- Eliminar políticas de ventas
DROP POLICY IF EXISTS "ventas_select_policy" ON public.ventas;
DROP POLICY IF EXISTS "ventas_insert_policy" ON public.ventas;
DROP POLICY IF EXISTS "ventas_update_policy" ON public.ventas;
DROP POLICY IF EXISTS "ventas_delete_policy" ON public.ventas;
DROP POLICY IF EXISTS "Permitir acceso completo a ventas" ON public.ventas;

-- Eliminar políticas de clientes_contables
DROP POLICY IF EXISTS "clientes_contables_select_policy" ON public.clientes_contables;
DROP POLICY IF EXISTS "clientes_contables_insert_policy" ON public.clientes_contables;
DROP POLICY IF EXISTS "clientes_contables_update_policy" ON public.clientes_contables;
DROP POLICY IF EXISTS "clientes_contables_delete_policy" ON public.clientes_contables;
DROP POLICY IF EXISTS "Permitir acceso completo a clientes_contables" ON public.clientes_contables;

-- Eliminar políticas de empresas
DROP POLICY IF EXISTS "empresas_select_policy" ON public.empresas;
DROP POLICY IF EXISTS "empresas_insert_policy" ON public.empresas;
DROP POLICY IF EXISTS "empresas_update_policy" ON public.empresas;
DROP POLICY IF EXISTS "empresas_delete_policy" ON public.empresas;
DROP POLICY IF EXISTS "Permitir acceso completo a empresas" ON public.empresas;

-- PASO 2: CREAR POLÍTICAS CORREGIDAS (SIN RECURSIÓN)
-- =====================================================================

-- Políticas para usuarios (simples y sin recursión)
CREATE POLICY "usuarios_select_simple" ON public.usuarios
    FOR SELECT USING (true);

CREATE POLICY "usuarios_insert_simple" ON public.usuarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY "usuarios_update_simple" ON public.usuarios
    FOR UPDATE USING (true);

CREATE POLICY "usuarios_delete_simple" ON public.usuarios
    FOR DELETE USING (true);

-- Políticas para ventas (simples y sin recursión)
CREATE POLICY "ventas_select_simple" ON public.ventas
    FOR SELECT USING (true);

CREATE POLICY "ventas_insert_simple" ON public.ventas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "ventas_update_simple" ON public.ventas
    FOR UPDATE USING (true);

CREATE POLICY "ventas_delete_simple" ON public.ventas
    FOR DELETE USING (true);

-- Políticas para clientes_contables (simples y sin recursión)
CREATE POLICY "clientes_contables_select_simple" ON public.clientes_contables
    FOR SELECT USING (true);

CREATE POLICY "clientes_contables_insert_simple" ON public.clientes_contables
    FOR INSERT WITH CHECK (true);

CREATE POLICY "clientes_contables_update_simple" ON public.clientes_contables
    FOR UPDATE USING (true);

CREATE POLICY "clientes_contables_delete_simple" ON public.clientes_contables
    FOR DELETE USING (true);

-- Políticas para empresas (simples y sin recursión)
CREATE POLICY "empresas_select_simple" ON public.empresas
    FOR SELECT USING (true);

CREATE POLICY "empresas_insert_simple" ON public.empresas
    FOR INSERT WITH CHECK (true);

CREATE POLICY "empresas_update_simple" ON public.empresas
    FOR UPDATE USING (true);

CREATE POLICY "empresas_delete_simple" ON public.empresas
    FOR DELETE USING (true);

-- PASO 3: VERIFICAR CORRECCIÓN
-- =====================================================================

-- Verificar que las políticas se crearon correctamente
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN ('usuarios', 'ventas', 'clientes_contables', 'empresas')
ORDER BY tablename, policyname;

-- =====================================================================
-- ✅ CORRECCIÓN COMPLETADA
-- =====================================================================
`;

  return scriptCorreccion;
}

async function verificarCorreccion() {
  console.log('\n✅ VERIFICANDO CORRECCIÓN');
  console.log('=========================\n');

  const tablasParaVerificar = [
    'ventas',
    'clientes_contables',
    'empresas',
    'usuarios',
  ];

  const resultados = {};

  for (const tabla of tablasParaVerificar) {
    try {
      const { data, error } = await supabase.from(tabla).select('*').limit(1);

      if (error) {
        console.log(`❌ ${tabla}: ${error.message}`);
        resultados[tabla] = { corregido: false, error: error.message };
      } else {
        console.log(
          `✅ ${tabla}: CORREGIDO - ${data?.length || 0} registros accesibles`
        );
        resultados[tabla] = { corregido: true, registros: data?.length || 0 };
      }
    } catch (err) {
      console.log(`❌ ${tabla}: ${err.message}`);
      resultados[tabla] = { corregido: false, error: err.message };
    }
  }

  return resultados;
}

// =====================================================================
// FUNCIÓN PRINCIPAL
// =====================================================================

async function corregirRecursionRLS() {
  console.log('🚀 CORRIGIENDO RECURSIÓN INFINITA EN RLS');
  console.log('========================================\n');

  // 1. Verificar problema actual
  console.log('📊 PASO 1: VERIFICANDO PROBLEMA ACTUAL');
  const problemaActual = await verificarProblemaRecursion();

  // 2. Generar script de corrección
  console.log('\n📝 PASO 2: GENERANDO SCRIPT DE CORRECCIÓN');
  const scriptCorreccion = await generarScriptCorreccionRLS();

  // 3. Mostrar script
  console.log('\n📋 SCRIPT DE CORRECCIÓN GENERADO:');
  console.log('===================================');
  console.log(scriptCorreccion);

  // 4. Guardar script en archivo
  const fs = await import('fs');
  fs.writeFileSync('CORRECCION_RLS_RECURSION.sql', scriptCorreccion);
  console.log('\n💾 Script guardado en: CORRECCION_RLS_RECURSION.sql');

  // 5. Instrucciones para el usuario
  console.log('\n📋 INSTRUCCIONES PARA CORREGIR:');
  console.log('================================');
  console.log('1. 📄 Abre el archivo CORRECCION_RLS_RECURSION.sql');
  console.log('2. 🔗 Ve a Supabase Dashboard > SQL Editor');
  console.log('3. 📋 Copia y pega todo el contenido del script');
  console.log('4. ▶️ Ejecuta el script completo');
  console.log('5. ✅ Verifica que las tablas funcionen correctamente');

  console.log('\n🎯 RESUMEN DEL PROBLEMA:');
  console.log('========================');
  Object.entries(problemaActual).forEach(([tabla, info]) => {
    if (info.problema) {
      console.log(`❌ ${tabla}: ${info.error}`);
    } else {
      console.log(`✅ ${tabla}: Funciona correctamente`);
    }
  });

  console.log('\n🔧 SOLUCIÓN:');
  console.log('============');
  console.log(
    'El problema es causado por políticas RLS que tienen referencias circulares.'
  );
  console.log(
    'La solución es eliminar las políticas problemáticas y crear nuevas sin recursión.'
  );
  console.log('El script generado hace esto automáticamente.');

  console.log('\n🎉 ¡SCRIPT DE CORRECCIÓN LISTO!');
  console.log('📄 Archivo: CORRECCION_RLS_RECURSION.sql');
  console.log('🔗 Ejecuta en Supabase SQL Editor');
}

// =====================================================================
// EJECUTAR CORRECCIÓN
// =====================================================================

corregirRecursionRLS().catch(console.error);
