# 🔑 OBTENER TOKENS CORRECTOS DE SUPABASE

## 📋 Pasos para obtener los tokens:

### 1. Ir a Supabase Dashboard

- Ve a: https://supabase.com/dashboard/project/bwgnmastihgndmtbqvkj

### 2. Abrir Settings > API

- En el menú lateral, haz clic en "Settings"
- Luego haz clic en "API"

### 3. Copiar los tokens

En la sección "Project API keys" encontrarás:

#### 🔐 **anon public** (Token Anónimo)

- Este es el token que empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Role: `anon`
- Úsalo para acceso público

#### 🔐 **service_role secret** (Token de Servicio)

- Este es el token que empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Role: `service_role`
- Úsalo para acceso administrativo

### 4. Verificar que los tokens son diferentes

- El token anónimo debe tener `"role":"anon"` en el payload
- El token service_role debe tener `"role":"service_role"` en el payload

### 5. Actualizar configuración

Una vez que tengas los tokens correctos:

1. **Para el MCP**: Actualiza `.cursor/mcp.json` con el token service_role
2. **Para pruebas**: Usa el token anónimo en los scripts de prueba

## 🚨 IMPORTANTE:

- **NUNCA** compartas el token service_role
- El token anónimo es seguro para usar en el frontend
- El token service_role solo debe usarse en el backend o MCP

## 🔍 Verificar tokens:

Puedes decodificar los tokens en: https://jwt.io/

- Pega el token en el decoder
- Verifica que el `role` sea el correcto
- Verifica que el `ref` sea `bwgnmastihgndmtbqvkj`
