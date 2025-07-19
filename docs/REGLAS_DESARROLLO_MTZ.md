# REGLAS DE DESARROLLO MTZ OUROBORUS AI
# Fecha establecida: 2025-07-17 18:18:57

## 🎯 METODOLOGÍA OFICIAL: ESTILO CURSOR

### ✅ USAR SIEMPRE:
- Alias @/ para importaciones: import Component from '@/components/ui/Component'
- JSX estándar: <Component prop={value} />
- Hooks separados: useAuth, usePermissions, etc.
- TypeScript cuando sea posible
- Configuración Vite con alias establecida

### ❌ NUNCA USAR:
- Rutas relativas: import Component from '../../../components'
- React.createElement(): innecesario en JSX moderno
- Lógica compleja en Context providers
- Estados sin flags de inicialización
- Bucles infinitos en useEffect

## 🔧 PATRONES ESTABLECIDOS:

### Context Pattern:
\\\javascript
const [loading, setLoading] = useState(true)
const [initialized, setInitialized] = useState(false)

useEffect(() => {
 if (initialized) return // Evitar bucles
 // ... lógica
 setInitialized(true)
}, [initialized])
\\\`n
### Import Pattern:
\\\javascript
import Component from '@/components/ui/Component'
import { supabase } from '@/lib/supabase'
import useAuth from '@/hooks/useAuth'
\\\`n
### Hook Pattern:
\\\javascript
const useCustomHook = () => {
 const context = useContext(SomeContext)
 if (!context) {
 throw new Error('Hook debe usarse dentro del Provider')
 }
 return context
}
\\\`n
## 🚨 PUNTOS CRÍTICOS:

1. **AUTENTICACIÓN**: Siempre usar flag initialized
2. **IMPORTACIONES**: Solo alias @/, nunca rutas relativas
3. **CONTEXTS**: Lógica simple, estados controlados
4. **HOOKS**: Separados del context, imports correctos
5. **COMPONENTES**: JSX estándar, props tipadas

## 📋 CHECKLIST PRE-COMMIT:

- [ ] Imports usan alias @/
- [ ] No hay React.createElement innecesario
- [ ] Contexts tienen flags de inicialización
- [ ] Hooks están separados y bien importados
- [ ] No hay bucles de renderizado
- [ ] TypeScript types están actualizados

## 🆘 EN CASO DE PROBLEMAS:

1. Verificar imports (deben usar @/)
2. Verificar flags de inicialización
3. Revisar bucles en useEffect
4. Consultar este archivo
5. Revisar REGISTRO_CORRECCIONES_AUTH.md

---
**ESTE ARCHIVO ES LA FUENTE DE VERDAD PARA EL DESARROLLO MTZ**
