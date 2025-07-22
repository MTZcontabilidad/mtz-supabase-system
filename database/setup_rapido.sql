-- =====================================================================
-- 🚀 SETUP RÁPIDO - SISTEMA MTZ v3.0
-- =====================================================================
-- Script para configuración rápida del sistema
-- Ejecutar en el SQL Editor de Supabase

-- =====================================================================
-- 📋 PASO 1: CREAR USUARIOS EN AUTH.USERS
-- =====================================================================
-- Nota: Estos usuarios deben crearse manualmente en Supabase Auth
-- Ve a Authentication > Users > Add User y crea los siguientes usuarios:

/*
1. mtzcontabilidad@gmail.com / Alohomora33@ (ADMINISTRADOR PRINCIPAL)
2. gerente@mtz.cl / password123
3. analista@mtz.cl / password123
4. asistente@mtz.cl / password123
5. cliente@techcorp.cl / password123
*/

-- =====================================================================
-- 📋 PASO 2: OBTENER LOS UUIDs DE LOS USUARIOS CREADOS
-- =====================================================================
-- Ejecuta esta consulta para obtener los UUIDs de los usuarios:

SELECT id, email FROM auth.users WHERE email IN (
  'mtzcontabilidad@gmail.com',
  'gerente@mtz.cl',
  'analista@mtz.cl',
  'asistente@mtz.cl',
  'cliente@techcorp.cl'
);

-- =====================================================================
-- 📋 PASO 3: ACTUALIZAR LOS UUIDs EN EL SCRIPT DE DATOS
-- =====================================================================
-- Copia los UUIDs obtenidos y reemplázalos en el archivo insert_test_data.sql
-- Busca las líneas que contienen '00000000-0000-0000-0000-000000000001' y reemplázalas

-- =====================================================================
-- 📋 PASO 4: EJECUTAR EL SCRIPT DE DATOS
-- =====================================================================
-- Una vez actualizados los UUIDs, ejecuta el archivo insert_test_data.sql

-- =====================================================================
-- 📋 PASO 5: VERIFICAR LA INSTALACIÓN
-- =====================================================================

-- Verificar que las tablas existen
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'roles',
  'usuarios_sistema',
  'empresas',
  'ventas',
  'cobranzas',
  'servicios',
  'detalles_venta',
  'proyecciones',
  'empleados',
  'nominas'
);

-- Verificar datos insertados
SELECT 'Roles' as tabla, COUNT(*) as total FROM public.roles
UNION ALL
SELECT 'Usuarios Sistema' as tabla, COUNT(*) as total FROM public.usuarios_sistema
UNION ALL
SELECT 'Empresas' as tabla, COUNT(*) as total FROM public.empresas
UNION ALL
SELECT 'Ventas' as tabla, COUNT(*) as total FROM public.ventas
UNION ALL
SELECT 'Cobranzas' as tabla, COUNT(*) as total FROM public.cobranzas
UNION ALL
SELECT 'Servicios' as tabla, COUNT(*) as total FROM public.servicios
UNION ALL
SELECT 'Detalles Venta' as tabla, COUNT(*) as total FROM public.detalles_venta
UNION ALL
SELECT 'Proyecciones' as tabla, COUNT(*) as total FROM public.proyecciones
UNION ALL
SELECT 'Empleados' as tabla, COUNT(*) as total FROM public.empleados
UNION ALL
SELECT 'Nóminas' as tabla, COUNT(*) as total FROM public.nominas;

-- =====================================================================
-- 📋 PASO 6: CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================================

-- Habilitar RLS en las tablas principales
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobranzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_venta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyecciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empleados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nominas ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 📋 PASO 7: CREAR POLÍTICAS BÁSICAS
-- =====================================================================

-- Política para roles (todos pueden leer)
CREATE POLICY "Roles son visibles para todos los usuarios autenticados" ON public.roles
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para usuarios_sistema (solo ver su propio perfil)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios_sistema
FOR SELECT USING (auth.uid() = id);

-- Política para empresas (todos los usuarios autenticados pueden leer)
CREATE POLICY "Empresas son visibles para usuarios autenticados" ON public.empresas
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para ventas (todos los usuarios autenticados pueden leer)
CREATE POLICY "Ventas son visibles para usuarios autenticados" ON public.ventas
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para cobranzas (todos los usuarios autenticados pueden leer)
CREATE POLICY "Cobranzas son visibles para usuarios autenticados" ON public.cobranzas
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para servicios (todos los usuarios autenticados pueden leer)
CREATE POLICY "Servicios son visibles para usuarios autenticados" ON public.servicios
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para empleados (todos los usuarios autenticados pueden leer)
CREATE POLICY "Empleados son visibles para usuarios autenticados" ON public.empleados
FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================================
-- 📋 PASO 8: VERIFICAR CONFIGURACIÓN FINAL
-- =====================================================================

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN (
  'roles',
  'usuarios_sistema',
  'empresas',
  'ventas',
  'cobranzas',
  'servicios',
  'empleados'
);

-- =====================================================================
-- ✅ SETUP COMPLETADO
-- =====================================================================
-- El sistema está listo para usar con datos de prueba
-- Credenciales de acceso:
-- Admin: admin@mtz.cl / Alohomora33.
-- Gerente: gerente@mtz.cl / password123
-- Analista: analista@mtz.cl / password123
-- Asistente: asistente@mtz.cl / password123
-- Cliente: cliente@techcorp.cl / password123
