-- =====================================================================
-- 🔐 POLÍTICAS DE SEGURIDAD - VENTAS Y COBRANZA MTZ
-- Archivo: 03_security/ventas_cobranza_policies.sql
-- Propósito: Configurar RLS para tablas de ventas y cobranza
-- =====================================================================

-- =====================================================================
-- 🔒 HABILITAR RLS EN TABLAS
-- =====================================================================

ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobranzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_venta ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- 📊 POLÍTICAS PARA TABLA VENTAS
-- =====================================================================

-- Administradores pueden ver todas las ventas
CREATE POLICY "admin_ventas_all" ON public.ventas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Colaboradores pueden ver ventas que ellos emitieron
CREATE POLICY "colaborador_ventas_own" ON public.ventas
    FOR ALL USING (
        emitida_por_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'colaborador'
        )
    );

-- Clientes pueden ver solo sus propias ventas
CREATE POLICY "cliente_ventas_own" ON public.ventas
    FOR SELECT USING (
        cliente_id IN (
            SELECT ac.cliente_id
            FROM public.asignaciones_clientes ac
            WHERE ac.usuario_id = auth.uid() AND ac.activo = true
        )
    );

-- =====================================================================
-- 💰 POLÍTICAS PARA TABLA COBRANZAS
-- =====================================================================

-- Administradores pueden ver todas las cobranzas
CREATE POLICY "admin_cobranzas_all" ON public.cobranzas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Colaboradores pueden ver cobranzas asignadas a ellos
CREATE POLICY "colaborador_cobranzas_assigned" ON public.cobranzas
    FOR ALL USING (
        asignado_a_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'colaborador'
        )
    );

-- Clientes pueden ver solo sus propias cobranzas
CREATE POLICY "cliente_cobranzas_own" ON public.cobranzas
    FOR SELECT USING (
        cliente_id IN (
            SELECT ac.cliente_id
            FROM public.asignaciones_clientes ac
            WHERE ac.usuario_id = auth.uid() AND ac.activo = true
        )
    );

-- =====================================================================
-- 📈 POLÍTICAS PARA TABLA SERVICIOS
-- =====================================================================

-- Todos los usuarios autenticados pueden ver servicios activos
CREATE POLICY "servicios_read_all" ON public.servicios
    FOR SELECT USING (
        activo = true AND auth.uid() IS NOT NULL
    );

-- Solo administradores pueden modificar servicios
CREATE POLICY "admin_servicios_modify" ON public.servicios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- =====================================================================
-- 📋 POLÍTICAS PARA TABLA DETALLES_VENTA
-- =====================================================================

-- Administradores pueden ver todos los detalles
CREATE POLICY "admin_detalles_all" ON public.detalles_venta
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'administrador'
        )
    );

-- Colaboradores pueden ver detalles de ventas que emitieron
CREATE POLICY "colaborador_detalles_own" ON public.detalles_venta
    FOR ALL USING (
        venta_id IN (
            SELECT id FROM public.ventas
            WHERE emitida_por_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.usuarios_sistema us
            JOIN public.roles r ON us.rol_id = r.id
            WHERE us.id = auth.uid() AND r.nombre = 'colaborador'
        )
    );

-- Clientes pueden ver detalles de sus propias ventas
CREATE POLICY "cliente_detalles_own" ON public.detalles_venta
    FOR SELECT USING (
        venta_id IN (
            SELECT v.id FROM public.ventas v
            JOIN public.asignaciones_clientes ac ON v.cliente_id = ac.cliente_id
            WHERE ac.usuario_id = auth.uid() AND ac.activo = true
        )
    );

-- =====================================================================
-- 🔄 TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================================

-- Trigger para actualizar updated_at en ventas
CREATE OR REPLACE FUNCTION update_ventas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ventas_updated_at
    BEFORE UPDATE ON public.ventas
    FOR EACH ROW
    EXECUTE FUNCTION update_ventas_updated_at();

-- Trigger para actualizar updated_at en cobranzas
CREATE OR REPLACE FUNCTION update_cobranzas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cobranzas_updated_at
    BEFORE UPDATE ON public.cobranzas
    FOR EACH ROW
    EXECUTE FUNCTION update_cobranzas_updated_at();

-- Trigger para actualizar updated_at en servicios
CREATE OR REPLACE FUNCTION update_servicios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_servicios_updated_at
    BEFORE UPDATE ON public.servicios
    FOR EACH ROW
    EXECUTE FUNCTION update_servicios_updated_at();

-- =====================================================================
-- ✅ VERIFICACIÓN DE POLÍTICAS
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
WHERE tablename IN ('ventas', 'cobranzas', 'servicios', 'detalles_venta')
ORDER BY tablename, policyname;

-- ✅ POLÍTICAS DE SEGURIDAD CREADAS EXITOSAMENTE
