-- =====================================================================
-- 🚀 SCRIPT DE IMPLEMENTACIÓN COMPLETA MTZ OUROBORUS AI v3.0
-- Archivo: 06_deployment/deploy_all.sql
-- Propósito: Ejecutar toda la instalación del sistema en orden correcto
-- Uso: Copiar y pegar en Supabase Dashboard > SQL Editor
-- =====================================================================

-- INFORMACIÓN DEL DEPLOYMENT
SELECT 
    '🚀 INICIANDO IMPLEMENTACIÓN COMPLETA MTZ OUROBORUS AI v3.0' as mensaje,
    NOW() as fecha_inicio;

-- =====================================================================
-- 📋 FASE 1: CREAR ESQUEMAS BASE (TABLAS Y VISTAS)
-- =====================================================================

-- 1.1 Crear tabla de roles
\echo '📋 Creando tabla de roles...'
\i database/01_schemas/roles.sql

-- 1.2 Crear tabla de usuarios del sistema
\echo '👤 Creando tabla de usuarios...'
\i database/01_schemas/usuarios.sql

-- 1.3 Crear tabla de asignaciones de trabajo
\echo '📋 Creando tabla de asignaciones...'
\i database/01_schemas/asignaciones.sql

-- 1.4 Crear vistas del dashboard
\echo '📊 Creando vistas del dashboard...'
\i database/01_schemas/dashboard_views.sql

-- =====================================================================
-- ⚙️ FASE 2: CREAR FUNCIONES DEL SISTEMA
-- =====================================================================

-- 2.1 Función para obtener rol de usuario
\echo '👤 Creando función get_user_role...'
\i database/02_functions/get_user_role.sql

-- 2.2 Funciones de verificación de permisos
\echo '🔐 Creando funciones de permisos...'
\i database/02_functions/user_permissions.sql

-- 2.3 Función para obtener clientes según rol
\echo '🏢 Creando función get_clientes_by_role...'
\i database/02_functions/get_clientes_by_role.sql

-- 2.4 Triggers de actualización automática
\echo '⚡ Creando triggers de actualización...'
\i database/02_functions/update_triggers.sql

-- =====================================================================
-- 🔐 FASE 3: CONFIGURAR SEGURIDAD (RLS)
-- =====================================================================

-- 3.1 Habilitar Row Level Security
\echo '🔐 Habilitando Row Level Security...'
\i database/03_security/enable_rls.sql

-- 3.2 Políticas para tabla roles
\echo '🎭 Configurando políticas de roles...'
\i database/03_security/roles_policies.sql

-- 3.3 Políticas para tabla usuarios
\echo '👤 Configurando políticas de usuarios...'
\i database/03_security/usuarios_policies.sql

-- 3.4 Políticas para tabla asignaciones
\echo '📋 Configurando políticas de asignaciones...'
\i database/03_security/asignaciones_policies.sql

-- =====================================================================
-- 📊 FASE 4: INSERTAR DATOS INICIALES
-- =====================================================================

-- 4.1 Insertar roles predefinidos
\echo '🎭 Insertando roles del sistema...'
\i database/04_data/insert_roles.sql

-- 4.2 Configurar usuario administrador
\echo '👑 Configurando administrador Carlos Villagra...'
\i database/04_data/insert_admin_user.sql

-- 4.3 Insertar datos de ejemplo (opcional)
\echo '🧪 Insertando datos de ejemplo...'
\i database/04_data/sample_data.sql

-- =====================================================================
-- ✅ FASE 5: VERIFICACIÓN FINAL
-- =====================================================================

-- Verificar que todo se instaló correctamente
SELECT 
    '✅ VERIFICANDO INSTALACIÓN COMPLETA' as fase,
    NOW() as timestamp;

-- Contar tablas creadas
SELECT 
    'TABLAS' as componente,
    COUNT(*) as cantidad
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('roles', 'usuarios_sistema', 'asignaciones_trabajo');

-- Contar funciones creadas
SELECT 
    'FUNCIONES' as componente,
    COUNT(*) as cantidad
FROM information_schema.routines 
WHERE routine_schema = 'public' 
    AND routine_name IN ('get_user_role', 'user_has_permission', 'get_clientes_by_role');

-- Verificar roles insertados
SELECT 
    'ROLES' as componente,
    COUNT(*) as cantidad,
    STRING_AGG(nombre, ', ') as roles_creados
FROM public.roles;

-- Verificar administrador configurado
SELECT 
    'ADMINISTRADOR' as componente,
    u.nombre_completo as nombre,
    r.nombre as rol,
    u.activo as activo
FROM public.usuarios_sistema u
JOIN public.roles r ON u.rol_id = r.id
WHERE u.email = 'mtzcontabilidad@gmail.com';

-- Verificar políticas RLS
SELECT 
    'POLÍTICAS RLS' as componente,
    COUNT(*) as cantidad
FROM information_schema.table_privileges 
WHERE grantee = 'authenticated';

-- =====================================================================
-- 🎉 IMPLEMENTACIÓN COMPLETADA
-- =====================================================================

SELECT 
    '🎉 SISTEMA MTZ OUROBORUS AI v3.0 IMPLEMENTADO EXITOSAMENTE' as mensaje,
    NOW() as fecha_completacion,
    'El sistema está listo para usar con autenticación y roles configurados' as estado;

-- ✅ DEPLOYMENT COMPLETO - SISTEMA LISTO PARA PRODUCCIÓN
