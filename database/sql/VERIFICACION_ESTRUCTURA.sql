-- ✅ VERIFICACIÓN ESTRUCTURA FINAL MTZ
-- Ejecutar DESPUÉS de LIMPIEZA_COMPLETA_BD.sql
-- Para confirmar que la estructura quedó optimizada

-- ========================================
-- 📊 VERIFICAR TABLAS FINALES
-- ========================================

-- Solo deben quedar 3 tablas esenciales
SELECT 
    table_name as "Tabla",
    table_type as "Tipo"
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE '%_seq'  -- Excluir secuencias
ORDER BY table_name;

-- ========================================
-- 📈 VERIFICAR DATOS ESENCIALES
-- ========================================

-- Resumen de datos en tablas finales
SELECT 'CLIENTES_CONTABLES' as tabla, 
       COUNT(*) as registros,
       CONCAT('$', ROUND(SUM(total_facturado)/1000000,1), 'M') as facturacion
FROM clientes_contables

UNION ALL

SELECT 'USUARIOS_SISTEMA' as tabla,
       COUNT(*) as registros, 
       STRING_AGG(nombre_completo, ', ') as usuarios
FROM usuarios_sistema

UNION ALL  

SELECT 'ROLES' as tabla,
       COUNT(*) as registros,
       STRING_AGG(nombre, ', ') as roles_disponibles
FROM roles;

-- ========================================
-- 🔗 VERIFICAR RELACIONES FINALES
-- ========================================

-- Solo debe quedar 1 relación: usuarios_sistema → roles
SELECT 
    tc.table_name as tabla_origen,
    kcu.column_name as columna_origen,
    ccu.table_name as tabla_destino,
    ccu.column_name as columna_destino
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public';

-- ========================================
-- 🔒 VERIFICAR POLÍTICAS RLS RESTANTES
-- ========================================

-- Solo deben quedar políticas en clientes_contables y usuarios_sistema
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ========================================
-- 🎯 VERIFICAR FUNCIONAMIENTO CARLOS
-- ========================================

-- Verificar que Carlos sigue como administrador
SELECT 
    us.id,
    us.email,
    us.nombre_completo,
    r.nombre as rol,
    us.activo
FROM usuarios_sistema us
LEFT JOIN roles r ON us.rol_id = r.id
WHERE us.email = 'mtzcontabilidad@gmail.com';

-- ========================================
-- 📱 VERIFICAR COMPATIBILIDAD FRONTEND
-- ========================================

-- Test consulta que usa AuthContext.jsx
SELECT 
    us.id,
    us.email,
    us.nombre_completo,
    us.activo,
    us.telefono,
    us.cargo,
    r.nombre as rol_nombre,
    r.descripcion as rol_descripcion,
    r.permisos
FROM usuarios_sistema us
LEFT JOIN roles r ON us.rol_id = r.id
WHERE us.id = 'aa43bcf5-4eb9-46bb-8403-1028b83cbab9'::uuid;

-- Test consulta que usa useSupabaseAvanzado.js  
SELECT 
    id_cliente,
    razon_social,
    total_facturado,
    categoria_cliente,
    estado
FROM clientes_contables
WHERE estado = 'Activo'
ORDER BY total_facturado DESC
LIMIT 5;

-- ========================================
-- ✅ RESULTADOS ESPERADOS
-- ========================================

-- TABLAS: Solo 3 (clientes_contables, usuarios_sistema, roles)
-- REGISTROS: 8 clientes, 1 usuario, 4 roles  
-- RELACIONES: Solo 1 (usuarios_sistema → roles)
-- POLÍTICAS RLS: Solo las necesarias, sin recursión
-- CARLOS: Activo como administrador
-- FRONTEND: 100% compatible

-- Si todos los tests pasan:
SELECT '🎉 ESTRUCTURA OPTIMIZADA EXITOSAMENTE' as resultado,
       'Sistema MTZ listo para producción' as estado;