-- =====================================================================
-- ⚡ TRIGGERS DE ACTUALIZACIÓN AUTOMÁTICA
-- Archivo: 02_functions/update_triggers.sql
-- Propósito: Triggers para mantener campos updated_at actualizados
-- Dependencias: Ninguna
-- =====================================================================

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar actividad del usuario
CREATE OR REPLACE FUNCTION public.update_user_last_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar fecha de último acceso en usuarios_sistema
    UPDATE public.usuarios_sistema 
    SET fecha_ultimo_acceso = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para validar datos antes de inserción
CREATE OR REPLACE FUNCTION public.validate_user_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar email
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Email inválido: %', NEW.email;
    END IF;
    
    -- Validar nombre completo no vacío
    IF LENGTH(TRIM(NEW.nombre_completo)) < 2 THEN
        RAISE EXCEPTION 'Nombre completo debe tener al menos 2 caracteres';
    END IF;
    
    -- Normalizar email a minúsculas
    NEW.email = LOWER(NEW.email);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para tabla roles
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
CREATE TRIGGER update_roles_updated_at 
    BEFORE UPDATE ON public.roles
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Crear triggers para tabla usuarios_sistema
DROP TRIGGER IF EXISTS update_usuarios_sistema_updated_at ON public.usuarios_sistema;
CREATE TRIGGER update_usuarios_sistema_updated_at 
    BEFORE UPDATE ON public.usuarios_sistema
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS validate_usuarios_sistema_data ON public.usuarios_sistema;
CREATE TRIGGER validate_usuarios_sistema_data
    BEFORE INSERT OR UPDATE ON public.usuarios_sistema
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_user_data();

-- Comentarios para documentación
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Función trigger genérica para actualizar campo updated_at';
COMMENT ON FUNCTION public.update_user_last_access() IS 'Actualiza fecha de último acceso del usuario';
COMMENT ON FUNCTION public.validate_user_data() IS 'Valida y normaliza datos de usuario antes de inserción/actualización';

-- ✅ TRIGGERS DE ACTUALIZACIÓN CREADOS EXITOSAMENTE
