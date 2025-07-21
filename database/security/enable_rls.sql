-- =====================================================================
-- 🔐 HABILITAR RLS Y POLÍTICAS DE SEGURIDAD - MTZ v3.0
-- =====================================================================

-- Habilitar RLS en tablas principales
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- =====================================================================
-- POLÍTICAS PARA TABLA usuarios
-- =====================================================================

-- Política: Usuarios pueden ver solo su propio perfil
CREATE POLICY "Usuarios pueden ver su propio perfil" ON usuarios
  FOR SELECT USING (auth.uid() = id);

-- Política: Usuarios pueden actualizar solo su propio perfil
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON usuarios
  FOR UPDATE USING (auth.uid() = id);

-- Política: Solo admins pueden crear usuarios
CREATE POLICY "Solo admins pueden crear usuarios" ON usuarios
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = auth.uid() AND r.nombre = 'admin'
    )
  );

-- Política: Solo admins pueden eliminar usuarios
CREATE POLICY "Solo admins pueden eliminar usuarios" ON usuarios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = auth.uid() AND r.nombre = 'admin'
    )
  );

-- =====================================================================
-- POLÍTICAS PARA TABLA roles
-- =====================================================================

-- Política: Todos los usuarios autenticados pueden ver roles
CREATE POLICY "Usuarios autenticados pueden ver roles" ON roles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política: Solo admins pueden modificar roles
CREATE POLICY "Solo admins pueden modificar roles" ON roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = auth.uid() AND r.nombre = 'admin'
    )
  );

-- =====================================================================
-- POLÍTICAS PARA TABLA empresas
-- =====================================================================

-- Política: Usuarios pueden ver empresas de su empresa asignada
CREATE POLICY "Usuarios pueden ver su empresa" ON empresas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.id = auth.uid() AND u.empresa_id = empresas.id
    )
  );

-- Política: Solo admins pueden modificar empresas
CREATE POLICY "Solo admins pueden modificar empresas" ON empresas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = auth.uid() AND r.nombre = 'admin'
    )
  );

-- =====================================================================
-- FUNCIÓN PARA VERIFICAR PERMISOS
-- =====================================================================

CREATE OR REPLACE FUNCTION check_user_permission(
  user_id UUID,
  permission TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.id = user_id
    AND u.activo = true
    AND (
      r.nombre = 'admin'
      OR r.permisos ? permission
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- TRIGGERS PARA MANTENER TIMESTAMPS
-- =====================================================================

-- Trigger para usuarios
CREATE OR REPLACE FUNCTION update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_usuarios_updated_at();

-- Trigger para roles
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_roles_updated_at();

-- Trigger para empresas
CREATE OR REPLACE FUNCTION update_empresas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_empresas_updated_at
  BEFORE UPDATE ON empresas
  FOR EACH ROW
  EXECUTE FUNCTION update_empresas_updated_at();

-- =====================================================================
-- VERIFICACIÓN FINAL
-- =====================================================================

-- Verificar que RLS está habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('usuarios', 'roles', 'empresas')
ORDER BY tablename;

-- Verificar políticas creadas
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('usuarios', 'roles', 'empresas')
ORDER BY tablename, policyname;
