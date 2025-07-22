# 📋 GUÍA DE ESTILO Y CONVENCIONES DE PROGRAMACIÓN MTZ v3.0

## 1. Formato de Archivos y Estructura

- **Extensión de archivos:**
  - Componentes React: `.jsx`
  - Hooks: `.js`
  - Utilidades: `.js`
  - Servicios: `.js`
  - Configuración: `.js` o `.json`
- **Estructura de carpetas:**
  - `src/components/` → Componentes reutilizables
  - `src/pages/` → Páginas principales
  - `src/hooks/` → Custom hooks
  - `src/lib/` → Servicios y lógica de negocio
  - `src/utils/` → Utilidades y helpers
  - `src/contexts/` → Contextos globales
  - `src/styles/` → Estilos globales
  - `database/` → SQL y scripts de BD
  - `scripts/` → Scripts de automatización y limpieza

## 2. Formato de Código

- **Indentación:** 2 espacios
- **Comillas:** Simples `'` para JS/JSX, dobles `"` solo en JSON
- **Imports:**
  - Primero librerías externas, luego internos, luego estilos.
  - Usar alias `@/` para rutas absolutas internas.
- **Componentes:** PascalCase, export default solo si es el principal.
- **Hooks:** camelCase y prefijo `use`.
- **Constantes:** MAYÚSCULAS y snake_case.
- **Variables:** camelCase.
- **Funciones asíncronas:** Siempre `async/await`.
- **Comentarios:** Breves y solo donde sea necesario.

## 3. Buenas Prácticas

- Centralizar servicios en `src/lib/dataService.js`.
- Eliminar código muerto y duplicado.
- No dejar `console.log` en producción (solo errores críticos).
- Hooks personalizados documentados y con dependencias claras.
- Componentes puros y reutilizables.
- Manejo de errores con try/catch en servicios y hooks asíncronos.
- Uso de scripts MCP para automatización y limpieza.

## 4. Plan de Trabajo y Mantenimiento

1. Unificar servicios en `dataService.js`.
2. Limpiar imports con `npm run limpiar:inteligente` y agregar React con el script.
3. Revisar hooks y componentes para imports correctos.
4. Eliminar duplicados y código muerto.
5. Mantener esta guía actualizada.
6. Automatizar limpieza y diagnóstico con scripts MCP.
7. Mantener y ampliar tests en `tests/`.
8. Code review obligatorio para todo cambio.

## 5. Notas para el Equipo

- Revisa este archivo antes de programar.
- Sigue la convención y documenta nuevos hooks/componentes/servicios.
- Reporta y unifica código duplicado.
- Documenta el uso de scripts MCP en `scripts/README.md`.
- Propón mejoras a la guía en el próximo sprint.

## 6. Ejemplo de Importación Correcta

```js
// Correcto
import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import { dataService } from '@/lib/dataService.js';

// Incorrecto
import { useState } from 'react';
import { dataService } from '../../lib/dataService.js';
```

## 7. Automatización y Scripts MCP

- Limpieza de imports: `npm run limpiar:inteligente`
- Agregar imports de React: `node scripts/agregar-imports-react.js`
- Diagnóstico de páginas: `npm run diagnostico`
- Optimización: `npm run optimizar`
- Formateo: `npm run format`
- Lint: `npm run lint` (debe quedar en 0 errores y menos de 10 warnings)

---

**Esta guía es OBLIGATORIA para todo el equipo.**
