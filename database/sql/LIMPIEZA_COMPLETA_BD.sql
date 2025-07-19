-- 🧹 LIMPIEZA COMPLETA BASE DE DATOS MTZ
-- Eliminar tablas no usadas y estructurar solo lo esencial
-- Ejecutar en Supabase Dashboard → SQL Editor

-- ========================================
-- 🗑️ FASE 1: ELIMINAR TABLAS PROBLEMÁTICAS
-- ========================================

-- Eliminar tabla perfiles_usuario (causa recursión RLS)
DROP TABLE IF EXISTS perfiles_usuario CASCADE;

-- Eliminar tabla asignaciones_trabajo (vacía, no usada)
DROP TABLE IF EXISTS asignaciones_trabajo CASCADE;

-- Eliminar tabla empresas_contables (no usada por frontend)
DROP TABLE IF EXISTS empresas_contables CASCADE;

-- ========================================
-- 🔧 FASE 2: OPTIMIZAR TABLAS ESENCIALES
-- ========================================

-- Limpiar políticas RLS de tablas que no existen
-- (Se eliminan automáticamente con DROP TABLE CASCADE)

-- Optimizar tabla usuarios_sistema (eliminar campos no usados)
ALTER TABLE usuarios_sistema 
DROP COLUMN IF EXISTS empresa_asignada,
DROP COLUMN IF EXISTS fecha_ultimo_acceso,
DROP COLUMN IF EXISTS notas;

-- Simplificar tabla clientes_contables (mantener solo campos usados por frontend)
ALTER TABLE clientes_contables
DROP COLUMN IF EXISTS clave_sii,
DROP COLUMN IF EXISTS rut_representante_legal, 
DROP COLUMN IF EXISTS clave_sii_representante,
DROP COLUMN IF EXISTS clave_unica,
DROP COLUMN IF EXISTS certificado_digital,
DROP COLUMN IF EXISTS empresa_contable_id,
DROP COLUMN IF EXISTS usuario_asignado;

-- ========================================
-- 📊 FASE 3: VERIFICAR ESTRUCTURA FINAL
-- ========================================

-- Verificar tablas restantes
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ========================================
-- 🎯 FASE 4: DATOS FINALES DEL SISTEMA
-- ========================================

-- Resumen de datos finales
SELECT 'ESTRUCTURA FINAL MTZ' as categoria, 'Solo tablas esenciales' as descripcion
UNION ALL
SELECT 'CLIENTES_CONTABLES' as categoria, CONCAT(COUNT(*), ' clientes - $', ROUND(SUM(total_facturado)/1000000,1), 'M') as descripcion
FROM clientes_contables
UNION ALL  
SELECT 'USUARIOS_SISTEMA' as categoria, CONCAT(COUNT(*), ' usuarios - ', STRING_AGG(nombre_completo, ', ')) as descripcion
FROM usuarios_sistema
UNION ALL
SELECT 'ROLES' as categoria, CONCAT(COUNT(*), ' roles - ', STRING_AGG(nombre, ', ')) as descripcion  
FROM roles;

-- ========================================
-- ✅ RESULTADO ESPERADO:
-- ========================================
-- 
-- TABLAS FINALES (solo 3):
-- ✅ clientes_contables - 8 clientes, $85.6M facturación
-- ✅ usuarios_sistema - 1 usuario (Carlos admin)  
-- ✅ roles - 4 roles (administrador, colaborador, externo, cliente)
--
-- ELIMINADO:
-- ❌ perfiles_usuario - Causaba recursión RLS
-- ❌ asignaciones_trabajo - Vacía, no usada
-- ❌ empresas_contables - No usada por frontend
--
-- BENEFICIOS:
-- 🚀 Sin recursión RLS
-- 🚀 Estructura limpia y simple  
-- 🚀 Solo lo que realmente usa el frontend
-- 🚀 Base de datos optimizada
-- 🚀 Mantenimiento simplificado