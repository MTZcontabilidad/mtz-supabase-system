# 🔑 OBTENER TOKEN DE SERVICIO PARA MCP SUPABASE

## 🚨 PROBLEMA IDENTIFICADO

El token que estamos usando es un **token anónimo** (anon key), pero el MCP de Supabase necesita un **token de servicio** (service role key).

## 📋 SOLUCIÓN: OBTENER TOKEN DE SERVICIO

### **PASO 1: Ir a Supabase Dashboard**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto MTZ
3. Ve a **Settings > API**

### **PASO 2: Obtener Service Role Key**

1. En la sección **"Project API keys"**
2. Busca **"service_role"** (NO el anon key)
3. Haz click en **"Copy"** para copiar el service role key
4. El token empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **PASO 3: Actualizar Configuración MCP**

1. Abre el archivo `.cursor/mcp.json`
2. Reemplaza el token actual con el **service role key**
3. Guarda el archivo

### **PASO 4: Reiniciar Cursor**

1. Cierra completamente Cursor
2. Vuelve a abrir Cursor
3. Ve a **Settings > MCP**
4. Verifica que Supabase esté activo

---

## 🔍 DIFERENCIA ENTRE TOKENS

### **Anon Key (Token Anónimo):**

- ❌ **NO funciona** con MCP
- 🔒 Permisos limitados
- 📱 Para aplicaciones cliente
- 🚫 No puede crear/modificar tablas

### **Service Role Key (Token de Servicio):**

- ✅ **SÍ funciona** con MCP
- 🔓 Permisos completos
- 🖥️ Para servicios backend
- ✅ Puede crear/modificar tablas

---

## 📝 EJEMPLO DE CONFIGURACIÓN CORRECTA

```json
{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--read-only",
        "--project-ref=bwgnmastihgndmtbqvkj"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z25tYXN0aWhnbmRtdGJxdmtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTQ5NzI5MCwiZXhwIjoyMDUxMDczMjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
      }
    }
  }
}
```

**Nota:** El service role key debe tener `"role":"service_role"` en el payload JWT.

---

## 🚨 IMPORTANTE: SEGURIDAD

### **⚠️ ADVERTENCIAS:**

- El **service role key** tiene permisos completos
- **NUNCA** lo expongas en el frontend
- **SÓLO** úsalo en servicios backend o MCP
- Mantén el token **seguro y privado**

### **✅ BUENAS PRÁCTICAS:**

- Usa variables de entorno
- Rota el token periódicamente
- Monitorea el uso del token
- Usa RLS para limitar acceso

---

## 🎯 PRÓXIMOS PASOS

1. **Obtén el service role key** desde Supabase Dashboard
2. **Actualiza** el archivo `.cursor/mcp.json`
3. **Reinicia Cursor**
4. **Prueba la conexión** con el MCP

Una vez que tengas el token correcto, podremos:

- ✅ Verificar el estado de la BD
- ✅ Crear el sistema MTZ completo
- ✅ Insertar datos de ejemplo
- ✅ Configurar RLS y políticas

**¿Necesitas ayuda para encontrar el service role key en el dashboard?**
