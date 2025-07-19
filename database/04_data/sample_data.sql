-- =====================================================================
-- 🧪 DATOS DE EJEMPLO PARA TESTING
-- Archivo: 04_data/sample_data.sql
-- Propósito: Insertar datos de ejemplo para pruebas del sistema
-- Dependencias: public.usuarios_sistema, public.asignaciones_trabajo
-- =====================================================================

-- Insertar usuarios de ejemplo para testing (solo si no existen)
INSERT INTO public.usuarios_sistema (
    id, 
    email, 
    nombre_completo, 
    rol_id, 
    activo, 
    cargo,
    departamento,
    notas
) VALUES 

-- Usuario colaborador de ejemplo
(
    'b1234567-89ab-cdef-0123-456789abcdef',
    'colaborador@mtz.cl',
    'María González Pérez',
    (SELECT id FROM public.roles WHERE nombre = 'colaborador'),
    true,
    'Contadora Senior',
    'Contabilidad',
    'Usuario colaborador de ejemplo para testing'
),

-- Usuario externo de ejemplo
(
    'c2345678-9abc-def0-1234-56789abcdef0',
    'externo@contador.cl',
    'Juan Carlos Contador',
    (SELECT id FROM public.roles WHERE nombre = 'externo'),
    true,
    'Contador Independiente',
    'Externo',
    'Contador externo de ejemplo para testing de asignaciones'
),

-- Usuario cliente de ejemplo
(
    'd3456789-abcd-ef01-2345-6789abcdef01',
    'cliente@empresa.cl',
    'Ana María Empresaria',
    (SELECT id FROM public.roles WHERE nombre = 'cliente'),
    true,
    'Gerente General',
    'Administración',
    'Usuario cliente de ejemplo - empresa asignada: 0217'
)

-- Evitar duplicados
ON CONFLICT (email) DO NOTHING;

-- Asignar empresa al usuario cliente (North Center GPS)
UPDATE public.usuarios_sistema 
SET empresa_asignada = '0217'
WHERE email = 'cliente@empresa.cl';

-- Insertar asignaciones de ejemplo para el contador externo
INSERT INTO public.asignaciones_trabajo (
    usuario_externo_id,
    cliente_id,
    tipo_trabajo,
    descripcion,
    fecha_vencimiento,
    estado,
    prioridad,
    asignado_por_id
) VALUES 

-- Asignación 1: Contabilidad para North Center GPS
(
    'c2345678-9abc-def0-1234-56789abcdef0',
    '0217',
    'contabilidad',
    'Revisar libro de compras y ventas del mes de julio 2025',
    CURRENT_DATE + INTERVAL '7 days',
    'pendiente',
    'alta',
    'aa43bcf5-4eb9-46bb-8403-1028b83cbab9' -- Carlos Villagra
),

-- Asignación 2: Tributario para otro cliente
(
    'c2345678-9abc-def0-1234-56789abcdef0',
    '0042',
    'tributario',
    'Declaración F29 y F50 del mes anterior',
    CURRENT_DATE + INTERVAL '15 days',
    'en_proceso',
    'media',
    'aa43bcf5-4eb9-46bb-8403-1028b83cbab9' -- Carlos Villagra
)

-- Evitar duplicados
ON CONFLICT (usuario_externo_id, cliente_id, tipo_trabajo) 
DO UPDATE SET
    descripcion = EXCLUDED.descripcion,
    fecha_vencimiento = EXCLUDED.fecha_vencimiento,
    estado = EXCLUDED.estado;

-- Verificar datos de ejemplo insertados
DO $$
DECLARE
    users_count INTEGER;
    assignments_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO users_count FROM public.usuarios_sistema WHERE email LIKE '%@mtz.cl' OR email LIKE '%@contador.cl' OR email LIKE '%@empresa.cl';
    SELECT COUNT(*) INTO assignments_count FROM public.asignaciones_trabajo;
    
    RAISE NOTICE '✅ Datos de ejemplo insertados: % usuarios de prueba, % asignaciones', users_count, assignments_count;
END
$$;

-- Comentarios para documentación
COMMENT ON TABLE public.usuarios_sistema IS 'Incluye usuarios de ejemplo para testing: colaborador@mtz.cl, externo@contador.cl, cliente@empresa.cl';
COMMENT ON TABLE public.asignaciones_trabajo IS 'Incluye asignaciones de ejemplo para testing del flujo de trabajo';

-- ✅ DATOS DE EJEMPLO INSERTADOS EXITOSAMENTE
