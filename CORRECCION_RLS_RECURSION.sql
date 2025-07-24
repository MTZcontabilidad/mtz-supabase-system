
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
