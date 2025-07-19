-- 🎯 SOLUCIÓN FINAL DEFINITIVA MTZ
-- El frontend está PERFECTO, el problema es la política RLS recursiva
-- Ejecutar INMEDIATAMENTE en Supabase Dashboard → SQL Editor

-- PASO 1: Eliminar política RLS recursiva problemática
DROP POLICY IF EXISTS "Admin ve todos los perfiles" ON perfiles_usuario;
DROP POLICY IF EXISTS "Admins ven todos los perfiles" ON perfiles_usuario;
DROP POLICY IF EXISTS "Admins ven todos los perfiles - SIN RECURSION" ON perfiles_usuario;

-- PASO 2: Crear perfil para Carlos Villagra (evitar tabla vacía)
INSERT INTO perfiles_usuario (
    id,
    nombre_completo,
    email,
    rol,
    empresa_contable,
    telefono,
    activo,
    configuracion
) VALUES (
    'aa43bcf5-4eb9-46bb-8403-1028b83cbab9'::uuid,
    'Carlos Villagra',
    'mtzcontabilidad@gmail.com',
    'admin',
    'MTZ Consultores Tributarios',
    '+56 57 2123456',
    true,
    '{"tema": "light", "idioma": "es"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    nombre_completo = EXCLUDED.nombre_completo,
    email = EXCLUDED.email,
    rol = EXCLUDED.rol,
    updated_at = now();

-- PASO 3: Crear política RLS segura SIN RECURSIÓN
-- Solo permite ver su propio perfil + admin usando usuarios_sistema
CREATE POLICY "Usuarios ven su perfil + admin SIN RECURSION" 
ON perfiles_usuario 
FOR ALL
TO public 
USING (
    -- Usuario ve su propio perfil
    auth.uid() = id
    OR
    -- Admin verificado via usuarios_sistema (evita recursión)
    EXISTS (
        SELECT 1 
        FROM usuarios_sistema us 
        INNER JOIN roles r ON us.rol_id = r.id 
        WHERE us.id = auth.uid() 
        AND r.nombre = 'administrador'
        AND us.activo = true
    )
);

-- PASO 4: Verificar que funcione correctamente
-- Test 1: Verificar perfil de Carlos
SELECT 
    'Carlos Perfil' as test,
    p.nombre_completo,
    p.email,
    p.rol
FROM perfiles_usuario p
WHERE p.id = 'aa43bcf5-4eb9-46bb-8403-1028b83cbab9'::uuid;

-- Test 2: Verificar políticas activas
SELECT 
    'Políticas RLS' as test,
    policyname,
    cmd,
    length(qual) as qual_length
FROM pg_policies 
WHERE tablename = 'perfiles_usuario'
ORDER BY policyname;

-- Test 3: Verificar usuarios_sistema 
SELECT 
    'Usuario Sistema' as test,
    us.nombre_completo,
    r.nombre as rol
FROM usuarios_sistema us
LEFT JOIN roles r ON us.rol_id = r.id
WHERE us.id = 'aa43bcf5-4eb9-46bb-8403-1028b83cbab9'::uuid;

-- ✅ RESULTADO ESPERADO:
-- - Sin errores de recursión infinita
-- - Carlos Villagra visible en ambas tablas
-- - Política RLS segura funcionando
-- - Sistema MTZ conectado correctamente

-- 🚀 DESPUÉS DE EJECUTAR:
-- 1. Presiona "Reprobar Conexión" en tu sistema MTZ
-- 2. Deberías ver: Supabase ✅ Conectado, Clientes: 8, Puerto: 3002
-- 3. Dashboard con datos reales: $85,555,727 facturación