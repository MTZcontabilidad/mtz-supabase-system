# 🤖 PROMPT OPTIMIZADO PARA CURSORES - SISTEMA MTZ

## 🚨 PROBLEMA CRÍTICO IDENTIFICADO

**ERROR: "infinite recursion detected in policy for relation 'usuarios'"**

Este error indica que las políticas RLS están causando recursión infinita, probablemente debido a referencias circulares en las políticas de la tabla `usuarios`.

## 📊 ANÁLISIS ACTUAL DE LA BASE DE DATOS

### ✅ TABLAS FUNCIONANDO:

- `cobranzas` (0 columnas detectadas)
- `empleados` (24 columnas)
- `nominas` (24 columnas)
- `asignaciones` (0 columnas)
- `asignaciones_clientes` (0 columnas)
- `roles` (0 columnas)
- `proyecciones` (0 columnas)
- `rrhh` (0 columnas)

### ❌ TABLAS CON ERROR DE RECURSIÓN:

- `ventas` - infinite recursion detected in policy for relation "usuarios"
- `clientes_contables` - infinite recursion detected in policy for relation "usuarios"
- `empresas` - infinite recursion detected in policy for relation "usuarios"
- `usuarios` - infinite recursion detected in policy for relation "usuarios"

### 🔗 RELACIONES FUNCIONANDO:

- ✅ `cobranzas.venta_id` → `ventas.id`
- ✅ `nominas.empleado_id` → `empleados.id`
- ✅ `asignaciones_clientes.cliente_id` → `clientes_contables.id`
- ✅ `asignaciones_clientes.usuario_id` → `usuarios.id`

### ❌ RELACIONES CON PROBLEMAS:

- ❌ `cobranzas.cliente_id` → `clientes_contables.id` (columna no existe)
- ❌ Todas las relaciones que involucran tablas con recursión infinita

## 🎯 TAREAS PRIORITARIAS

### **TAREA 1: CORREGIR RECURSIÓN INFINITA EN RLS**

```sql
-- PROBLEMA: Las políticas RLS están causando recursión infinita
-- SOLUCIÓN: Revisar y corregir las políticas de la tabla 'usuarios'

-- Necesito que:
-- 1. Identifiques las políticas problemáticas
-- 2. Corrijas las referencias circulares
-- 3. Implementes políticas RLS seguras sin recursión
```

### **TAREA 2: CORREGIR ESTRUCTURA DE TABLAS**

```sql
-- PROBLEMA: Algunas tablas no tienen columnas detectadas
-- SOLUCIÓN: Verificar y corregir estructura

-- Tablas que necesitan corrección:
-- 1. cobranzas: Agregar columna cliente_id si no existe
-- 2. asignaciones: Definir estructura completa
-- 3. asignaciones_clientes: Definir estructura completa
-- 4. roles: Definir estructura completa
-- 5. proyecciones: Definir estructura completa
-- 6. rrhh: Definir estructura completa
```

### **TAREA 3: CREAR CURSORES OPTIMIZADOS**

```sql
-- Una vez corregidos los problemas, crear cursores para:

-- 1. CURSOR VENTAS
CREATE OR REPLACE FUNCTION ventas.obtener_ventas_cursor(
    p_empresa_id UUID DEFAULT NULL,
    p_estado TEXT DEFAULT NULL,
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
) RETURNS SETOF RECORD AS $$
-- Implementación del cursor
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CURSOR COBRANZAS
CREATE OR REPLACE FUNCTION ventas.obtener_cobranzas_cursor(
    p_estado TEXT DEFAULT NULL,
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
) RETURNS SETOF RECORD AS $$
-- Implementación del cursor
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CURSOR EMPLEADOS
CREATE OR REPLACE FUNCTION rrhh.obtener_empleados_cursor(
    p_departamento TEXT DEFAULT NULL,
    p_estado TEXT DEFAULT NULL
) RETURNS SETOF RECORD AS $$
-- Implementación del cursor
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CURSOR CLIENTES
CREATE OR REPLACE FUNCTION clientes.obtener_clientes_cursor(
    p_empresa_id UUID DEFAULT NULL,
    p_estado TEXT DEFAULT NULL
) RETURNS SETOF RECORD AS $$
-- Implementación del cursor
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔧 SOLUCIÓN PARA RECURSIÓN INFINITA

### **PASO 1: IDENTIFICAR POLÍTICAS PROBLEMÁTICAS**

```sql
-- Consultar políticas existentes
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'usuarios';
```

### **PASO 2: CORREGIR POLÍTICAS RLS**

```sql
-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "policy_name" ON public.usuarios;

-- Crear políticas corregidas sin recursión
CREATE POLICY "usuarios_select_policy" ON public.usuarios
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_insert_policy" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "usuarios_update_policy" ON public.usuarios
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "usuarios_delete_policy" ON public.usuarios
    FOR DELETE USING (auth.uid() = id);
```

### **PASO 3: VERIFICAR OTRAS TABLAS**

```sql
-- Aplicar el mismo patrón a otras tablas con problemas
-- ventas, clientes_contables, empresas
```

## 📋 ESTRUCTURA ESPERADA PARA CURSORES

### **ESQUEMA: ventas**

```sql
-- Funciones para cursores de ventas
CREATE SCHEMA IF NOT EXISTS ventas;

-- Cursor principal de ventas
CREATE OR REPLACE FUNCTION ventas.obtener_ventas_cursor(
    p_empresa_id UUID DEFAULT NULL,
    p_estado TEXT DEFAULT NULL,
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    venta_id UUID,
    numero_factura VARCHAR,
    fecha_emision DATE,
    monto_total NUMERIC,
    estado_venta TEXT,
    cliente_rut VARCHAR,
    cliente_razon_social TEXT,
    empresa_nombre TEXT,
    usuario_nombre TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        v.id AS venta_id,
        v.numero_factura,
        v.fecha_emision,
        v.monto_total,
        v.estado AS estado_venta,
        cc.rut AS cliente_rut,
        cc.razon_social AS cliente_razon_social,
        e.nombre AS empresa_nombre,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario_nombre
    FROM
        public.ventas v
    JOIN
        public.clientes_contables cc ON v.cliente_id = cc.id
    JOIN
        public.empresas e ON v.empresa_id = e.id
    JOIN
        public.usuarios u ON v.usuario_id = u.id
    WHERE
        (p_empresa_id IS NULL OR v.empresa_id = p_empresa_id)
        AND (p_estado IS NULL OR v.estado = p_estado)
        AND (p_fecha_inicio IS NULL OR v.fecha_emision >= p_fecha_inicio)
        AND (p_fecha_fin IS NULL OR v.fecha_emision <= p_fecha_fin)
    ORDER BY
        v.fecha_emision DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### **ESQUEMA: cobranzas**

```sql
-- Funciones para cursores de cobranzas
CREATE SCHEMA IF NOT EXISTS cobranzas;

-- Cursor principal de cobranzas
CREATE OR REPLACE FUNCTION cobranzas.obtener_cobranzas_cursor(
    p_estado TEXT DEFAULT NULL,
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    cobranza_id UUID,
    monto NUMERIC,
    fecha_cobro DATE,
    estado_cobranza TEXT,
    numero_factura VARCHAR,
    monto_factura NUMERIC,
    cliente_rut VARCHAR,
    cliente_razon_social TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id AS cobranza_id,
        c.monto,
        c.fecha_cobro,
        c.estado AS estado_cobranza,
        v.numero_factura,
        v.monto_total AS monto_factura,
        cc.rut AS cliente_rut,
        cc.razon_social AS cliente_razon_social
    FROM
        public.cobranzas c
    JOIN
        public.ventas v ON c.venta_id = v.id
    JOIN
        public.clientes_contables cc ON v.cliente_id = cc.id
    WHERE
        (p_estado IS NULL OR c.estado = p_estado)
        AND (p_fecha_inicio IS NULL OR c.fecha_cobro >= p_fecha_inicio)
        AND (p_fecha_fin IS NULL OR c.fecha_cobro <= p_fecha_fin)
    ORDER BY
        c.fecha_cobro DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔐 POLÍTICAS RLS CORREGIDAS

### **POLÍTICAS PARA USUARIOS (SIN RECURSIÓN)**

```sql
-- Políticas corregidas para usuarios
DROP POLICY IF EXISTS "usuarios_select_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_insert_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_delete_policy" ON public.usuarios;

-- Políticas simples sin recursión
CREATE POLICY "usuarios_select_policy" ON public.usuarios
    FOR SELECT USING (true);

CREATE POLICY "usuarios_insert_policy" ON public.usuarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY "usuarios_update_policy" ON public.usuarios
    FOR UPDATE USING (true);

CREATE POLICY "usuarios_delete_policy" ON public.usuarios
    FOR DELETE USING (true);
```

### **POLÍTICAS PARA OTRAS TABLAS**

```sql
-- Políticas para ventas
CREATE POLICY "ventas_select_policy" ON public.ventas
    FOR SELECT USING (true);

-- Políticas para clientes_contables
CREATE POLICY "clientes_contables_select_policy" ON public.clientes_contables
    FOR SELECT USING (true);

-- Políticas para empresas
CREATE POLICY "empresas_select_policy" ON public.empresas
    FOR SELECT USING (true);
```

## 📊 ÍNDICES OPTIMIZADOS

```sql
-- Índices para cursores de ventas
CREATE INDEX IF NOT EXISTS idx_ventas_fecha_emision ON public.ventas(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON public.ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_empresa_id ON public.ventas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente_id ON public.ventas(cliente_id);

-- Índices para cursores de cobranzas
CREATE INDEX IF NOT EXISTS idx_cobranzas_fecha_cobro ON public.cobranzas(fecha_cobro);
CREATE INDEX IF NOT EXISTS idx_cobranzas_estado ON public.cobranzas(estado);
CREATE INDEX IF NOT EXISTS idx_cobranzas_venta_id ON public.cobranzas(venta_id);

-- Índices para cursores de empleados
CREATE INDEX IF NOT EXISTS idx_empleados_departamento ON public.empleados(departamento);
CREATE INDEX IF NOT EXISTS idx_empleados_estado ON public.empleados(estado);

-- Índices para cursores de clientes
CREATE INDEX IF NOT EXISTS idx_clientes_contables_empresa_id ON public.clientes_contables(empresa_id);
CREATE INDEX IF NOT EXISTS idx_clientes_contables_estado ON public.clientes_contables(estado);
```

## 🎯 INSTRUCCIONES ESPECÍFICAS

**Por favor, ayúdame a:**

1. **🔧 CORREGIR LA RECURSIÓN INFINITA** en las políticas RLS de la tabla `usuarios`
2. **📊 VERIFICAR LA ESTRUCTURA** de todas las tablas
3. **🔗 CORREGIR LAS RELACIONES** faltantes
4. **📈 CREAR CURSORES OPTIMIZADOS** para las consultas principales
5. **🔐 IMPLEMENTAR POLÍTICAS RLS SEGURAS** sin recursión
6. **⚡ OPTIMIZAR CON ÍNDICES** apropiados
7. **📋 DOCUMENTAR** todas las funciones y políticas

**¿Puedes ayudarme a resolver estos problemas paso a paso?**

---

**Información del Proyecto:**

- **URL:** https://bwgnmastiHgndmtbqvkj.supabase.co
- **Problema Principal:** Recursión infinita en políticas RLS
- **Objetivo:** Crear cursores optimizados para sistema de gestión contable
- **País:** Chile
- **Moneda:** CLP (Pesos Chilenos)
