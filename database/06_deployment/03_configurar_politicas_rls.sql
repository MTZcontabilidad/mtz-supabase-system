-- =====================================================
-- SCRIPT 3: CONFIGURAR POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Este script configura las políticas de seguridad para controlar el acceso a los datos

-- =====================================================
-- 1. POLÍTICAS PARA TABLA ROLES
-- =====================================================

-- Permitir lectura de roles a todos los usuarios autenticados
CREATE POLICY "roles_select_policy" ON roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Solo administradores pueden modificar roles
CREATE POLICY "roles_insert_policy" ON roles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "roles_update_policy" ON roles
    FOR UPDATE USING (auth.role() = 'authenticated' AND EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 2. POLÍTICAS PARA TABLA USUARIOS
-- =====================================================

-- Usuarios pueden ver su propia información
CREATE POLICY "usuarios_select_own" ON usuarios
    FOR SELECT USING (email = auth.email());

-- Administradores pueden ver todos los usuarios
CREATE POLICY "usuarios_select_admin" ON usuarios
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden crear/modificar usuarios
CREATE POLICY "usuarios_insert_policy" ON usuarios
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "usuarios_update_policy" ON usuarios
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 3. POLÍTICAS PARA TABLA EMPRESAS_CONTABLES
-- =====================================================

-- Usuarios pueden ver empresas asignadas
CREATE POLICY "empresas_select_assigned" ON empresas_contables
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM asignaciones a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND a.empresa_id = empresas_contables.id AND a.activo = true
    ));

-- Administradores pueden ver todas las empresas
CREATE POLICY "empresas_select_admin" ON empresas_contables
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden crear/modificar empresas
CREATE POLICY "empresas_insert_policy" ON empresas_contables
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "empresas_update_policy" ON empresas_contables
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 4. POLÍTICAS PARA TABLA ASIGNACIONES
-- =====================================================

-- Usuarios pueden ver sus propias asignaciones
CREATE POLICY "asignaciones_select_own" ON asignaciones
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        WHERE u.email = auth.email() AND u.id = asignaciones.usuario_id
    ));

-- Administradores pueden ver todas las asignaciones
CREATE POLICY "asignaciones_select_admin" ON asignaciones
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar asignaciones
CREATE POLICY "asignaciones_insert_policy" ON asignaciones
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "asignaciones_update_policy" ON asignaciones
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 5. POLÍTICAS PARA TABLA CONTRATOS_CLIENTES
-- =====================================================

-- Usuarios pueden ver contratos de empresas asignadas
CREATE POLICY "contratos_select_assigned" ON contratos_clientes
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM asignaciones a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND a.empresa_id = contratos_clientes.empresa_id AND a.activo = true
    ));

-- Administradores pueden ver todos los contratos
CREATE POLICY "contratos_select_admin" ON contratos_clientes
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar contratos
CREATE POLICY "contratos_insert_policy" ON contratos_clientes
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "contratos_update_policy" ON contratos_clientes
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 6. POLÍTICAS PARA TABLA ANEXOS_CONTRATOS
-- =====================================================

-- Usuarios pueden ver anexos de contratos de empresas asignadas
CREATE POLICY "anexos_select_assigned" ON anexos_contratos
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM contratos_clientes c
        JOIN asignaciones a ON c.empresa_id = a.empresa_id
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND c.id = anexos_contratos.contrato_id AND a.activo = true
    ));

-- Administradores pueden ver todos los anexos
CREATE POLICY "anexos_select_admin" ON anexos_contratos
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar anexos
CREATE POLICY "anexos_insert_policy" ON anexos_contratos
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "anexos_update_policy" ON anexos_contratos
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 7. POLÍTICAS PARA TABLA DOCUMENTOS_TRIBUTARIOS
-- =====================================================

-- Usuarios pueden ver documentos de empresas asignadas
CREATE POLICY "documentos_select_assigned" ON documentos_tributarios
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM asignaciones a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND a.empresa_id = documentos_tributarios.empresa_id AND a.activo = true
    ));

-- Administradores pueden ver todos los documentos
CREATE POLICY "documentos_select_admin" ON documentos_tributarios
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar documentos
CREATE POLICY "documentos_insert_policy" ON documentos_tributarios
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "documentos_update_policy" ON documentos_tributarios
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 8. POLÍTICAS PARA TABLA DECLARACIONES_TRIBUTARIAS
-- =====================================================

-- Usuarios pueden ver declaraciones de empresas asignadas
CREATE POLICY "declaraciones_select_assigned" ON declaraciones_tributarias
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM asignaciones a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND a.empresa_id = declaraciones_tributarias.empresa_id AND a.activo = true
    ));

-- Administradores pueden ver todas las declaraciones
CREATE POLICY "declaraciones_select_admin" ON declaraciones_tributarias
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar declaraciones
CREATE POLICY "declaraciones_insert_policy" ON declaraciones_tributarias
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "declaraciones_update_policy" ON declaraciones_tributarias
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 9. POLÍTICAS PARA TABLA VENTAS
-- =====================================================

-- Usuarios pueden ver ventas de empresas asignadas
CREATE POLICY "ventas_select_assigned" ON ventas
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM asignaciones a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND a.empresa_id = ventas.empresa_id AND a.activo = true
    ));

-- Administradores pueden ver todas las ventas
CREATE POLICY "ventas_select_admin" ON ventas
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar ventas
CREATE POLICY "ventas_insert_policy" ON ventas
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "ventas_update_policy" ON ventas
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- 10. POLÍTICAS PARA TABLA COBRANZAS
-- =====================================================

-- Usuarios pueden ver cobranzas de empresas asignadas
CREATE POLICY "cobranzas_select_assigned" ON cobranzas
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM asignaciones a
        JOIN usuarios u ON a.usuario_id = u.id
        WHERE u.email = auth.email() AND a.empresa_id = cobranzas.empresa_id AND a.activo = true
    ));

-- Administradores pueden ver todas las cobranzas
CREATE POLICY "cobranzas_select_admin" ON cobranzas
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- Solo administradores pueden gestionar cobranzas
CREATE POLICY "cobranzas_insert_policy" ON cobranzas
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

CREATE POLICY "cobranzas_update_policy" ON cobranzas
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.email = auth.email() AND r.nombre = 'admin'
    ));

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Políticas RLS configuradas exitosamente';
    RAISE NOTICE '🔒 Seguridad por roles implementada';
    RAISE NOTICE '👥 Usuarios solo ven datos de empresas asignadas';
    RAISE NOTICE '👨‍💼 Administradores tienen acceso completo';
    RAISE NOTICE '🔐 Todas las tablas protegidas con RLS';
END $$;
