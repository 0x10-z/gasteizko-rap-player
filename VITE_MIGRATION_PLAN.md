# Plan de migración: CRA + Yarn → Vite + npm

## Paso 1 — Eliminar artefactos de Yarn

- Borrar `yarn.lock`, `.yarnrc.yml`, `.yarn/`
- Limpiar entradas de Yarn en `.gitignore`

## Paso 2 — Eliminar dependencias de CRA y Babel

Quitar de `package.json`:

- `react-scripts`
- `@babel/core`
- `@babel/plugin-proposal-private-property-in-object`
- `@babel/plugin-syntax-flow`
- `@babel/plugin-transform-react-jsx`
- `web-vitals`

## Paso 3 — Actualizar y limpiar paquetes

### Eliminar paquetes no usados

| Paquete | Motivo |
|---------|--------|
| `uuid` | No se importa en ningún archivo del proyecto. Eliminar. |
| `react-switch` | Solo lo usa `ThemeToggle.tsx` que está comentado/sin usar en `Nav.tsx`. Eliminar junto con el componente. |
| `webfontloader` + `@types/webfontloader` | Solo carga la fuente Lato. Reemplazar por un `<link>` en `index.html` (más rápido, sin JS). |
| `@types/react-router-dom` | Innecesario desde react-router-dom v6 (incluye sus propios tipos). |
| `@types/styled-components` | Innecesario desde styled-components v6 (incluye sus propios tipos). |
| `@types/jest` | Se reemplaza por tipos de Vitest. |
| `@types/mocha` | No se usa, eliminar. |
| `@types/testing-library__jest-dom` | Deprecado, el paquete principal ya incluye tipos. |

### Actualizar paquetes a últimas versiones

| Paquete | Actual | Recomendado | Notas |
|---------|--------|-------------|-------|
| `react` + `react-dom` | 18.3.1 | **19.x** | React 19 con mejor rendimiento. Verificar compatibilidad de styled-components y react-virtualized. Si da problemas, quedarse en 18. |
| `react-router-dom` | 6.23.0 | **7.x** | v7 estable, mejor integración con Vite. API muy similar a v6. |
| `styled-components` | 6.1.8 | **6.1.x** (última) | Ya está actualizado, solo bump minor. |
| `react-toastify` | 10.0.5 | **11.x** | Última versión con mejor tree-shaking. |
| `@fortawesome/*` | 6.5.2 | **6.7.x** | Bump minor, sin breaking changes. |
| `typescript` | 5.4.5 | **5.7.x** | Última estable. |
| `@testing-library/react` | 15.0.5 | **16.x** | Compatible con React 19. |
| `@vercel/analytics` | 1.2.2 | **1.4.x** | Última versión. |

### Reemplazar `react-virtualized` → `@tanstack/react-virtual`

`react-virtualized` es un paquete CJS pesado (150KB+) con problemas conocidos en Vite. Reemplazar por `@tanstack/react-virtual`:

- **Tamaño**: ~5KB vs 150KB
- **ESM nativo**: funciona perfecto con Vite
- **API moderna**: hooks-based
- **Activamente mantenido**

Refactoring necesario en `Library.tsx`:

```tsx
// Antes (react-virtualized)
import { List, AutoSizer, ListRowProps } from "react-virtualized";

// Después (@tanstack/react-virtual)
import { useVirtualizer } from "@tanstack/react-virtual";

// El componente usa un ref al contenedor + useVirtualizer()
// en vez de <AutoSizer> + <List>
```

### Eliminar `webfontloader` — usar CSS nativo

En `index.html` (después de moverlo a la raíz):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
```

Quitar de `src/index.tsx`:

```tsx
// Eliminar estas líneas:
import WebFontLoader from "webfontloader";
WebFontLoader.load({ google: { families: ["Lato:400,700"] } });
```

### Limpieza de código muerto

| Archivo | Acción |
|---------|--------|
| `src/components/ThemeToggle.tsx` | Borrar (no se usa, está comentado en Nav.tsx) |
| `src/themes.ts` | Borrar si se elimina ThemeToggle (el ThemeContext/Provider solo se usa como wrapper sin efecto real) |
| `src/contexts/ThemeContext.tsx` | Evaluar: solo aplica un div con estilos del tema pero la app ya no usa temas dinámicamente. Se puede simplificar eliminando el provider. |
| `src/reportWebVitals.ts` | Borrar (boilerplate CRA) |

## Paso 4 — Instalar Vite

Añadir como devDependencies:

- `vite`
- `@vitejs/plugin-react`

## Paso 5 — Crear `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
```

## Paso 6 — Mover `index.html` a la raíz

- Mover `public/index.html` → `./index.html`
- Reemplazar `%PUBLIC_URL%` por cadena vacía
- Añadir `<link>` de Google Fonts (reemplazando webfontloader)
- Añadir antes de `</body>`:

```html
<script type="module" src="/src/index.tsx"></script>
```

## Paso 7 — Variables de entorno

- En `Credit.tsx`: `process.env.REACT_APP_BUILD_DATE` → `import.meta.env.VITE_BUILD_DATE`
- Script build: `REACT_APP_BUILD_DATE=...` → `VITE_BUILD_DATE=...`
- Crear `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_DATE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Paso 8 — Actualizar `tsconfig.json`

- `target`: `"es5"` → `"ES2020"`
- `moduleResolution`: `"node"` → `"bundler"`
- `types`: quitar jest/node, añadir `["vite/client"]`
- Mantener `noEmit`, `isolatedModules`, `jsx: "react-jsx"`

## Paso 9 — Actualizar scripts en `package.json`

```json
"scripts": {
  "dev": "vite",
  "build": "VITE_BUILD_DATE=$(date +'%Y.%m.%d-%H:%M') vite build",
  "build:windows": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

## Paso 10 — Limpiar `package.json`

- Eliminar bloque `eslintConfig` (usa configs de CRA)
- Eliminar bloque `browserslist` (Vite lo gestiona internamente)

## Paso 11 — Eliminar boilerplate CRA

- Borrar `src/reportWebVitals.ts`
- Quitar import y llamada a `reportWebVitals()` en `src/index.tsx`
- Quitar import y uso de `WebFontLoader` en `src/index.tsx`
- Borrar `src/setupTests.ts` (se recrea para Vitest)
- Borrar `src/components/ThemeToggle.tsx`

## Paso 12 — Migrar tests a Vitest

Añadir devDependencies: `vitest`, `jsdom`

Añadir a `vite.config.ts`:

```ts
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./src/setupTests.ts",
}
```

Recrear `src/setupTests.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

`App.test.tsx` no necesita cambios (API compatible).

## Paso 13 — `npm install` y verificar

1. `npm install` → genera `package-lock.json`
2. `npm run dev` → verificar dev server
3. `npm run build` → verificar build
4. `npm test` → verificar tests

## Paso 14 — Actualizar `.gitignore`

- Quitar entradas `.yarn/...`
- Verificar que `node_modules/` y `/build` están presentes

---

## Resumen de dependencias finales

### dependencies

```json
{
  "@fortawesome/fontawesome-svg-core": "^6.7.0",
  "@fortawesome/free-solid-svg-icons": "^6.7.0",
  "@fortawesome/react-fontawesome": "^0.2.2",
  "@tanstack/react-virtual": "^3.11.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.0.0",
  "react-toastify": "^11.0.0",
  "styled-components": "^6.1.13"
}
```

### devDependencies

```json
{
  "@testing-library/dom": "^10.4.0",
  "@testing-library/jest-dom": "^6.6.0",
  "@testing-library/react": "^16.1.0",
  "@testing-library/user-event": "^14.5.2",
  "@types/react": "^18.3.12",
  "@types/react-dom": "^18.3.1",
  "@vercel/analytics": "^1.4.0",
  "@vitejs/plugin-react": "^4.3.4",
  "jsdom": "^25.0.0",
  "typescript": "^5.7.0",
  "vite": "^6.0.0",
  "vitest": "^2.1.0"
}
```

> Nota: Si react-router-dom v7 da problemas, quedarse en v6 (API casi idéntica).
> Si se quiere probar React 19, cambiar react/react-dom a ^19.0.0 y @types/react a ^19.0.0.

---

## Posibles problemas

| Problema | Solución |
|----------|----------|
| `react-virtualized` (CJS) puede fallar | **Reemplazar por `@tanstack/react-virtual`** |
| `webfontloader` (CJS) | **Reemplazar por `<link>` en HTML** |
| Script `build` en Windows | `$(date ...)` es bash-only, usar `cross-env` si necesario |
| Puerto por defecto | Vite usa 5173, configuramos 3000 explícitamente |
| `react-router-dom` v7 breaking changes | v7 cambia a file-based routing opcional. La API programática de v6 sigue funcionando con un import diferente. Verificar imports. |
