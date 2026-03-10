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

## Paso 3 — Instalar Vite

Añadir como devDependencies:

- `vite`
- `@vitejs/plugin-react`

## Paso 4 — Crear `vite.config.ts`

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

## Paso 5 — Mover `index.html` a la raíz

- Mover `public/index.html` → `./index.html`
- Reemplazar `%PUBLIC_URL%` por cadena vacía
- Añadir antes de `</body>`:

```html
<script type="module" src="/src/index.tsx"></script>
```

## Paso 6 — Variables de entorno

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

## Paso 7 — Actualizar `tsconfig.json`

- `target`: `"es5"` → `"ES2020"`
- `moduleResolution`: `"node"` → `"bundler"`
- `types`: quitar jest/node, añadir `["vite/client"]`
- Mantener `noEmit`, `isolatedModules`, `jsx: "react-jsx"`

## Paso 8 — Actualizar scripts en `package.json`

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

## Paso 9 — Limpiar `package.json`

- Eliminar bloque `eslintConfig` (usa configs de CRA)
- Eliminar bloque `browserslist` (Vite lo gestiona internamente)

## Paso 10 — Eliminar boilerplate CRA

- Borrar `src/reportWebVitals.ts`
- Quitar import y llamada a `reportWebVitals()` en `src/index.tsx`
- Borrar `src/setupTests.ts` (se recrea para Vitest)

## Paso 11 — Migrar tests a Vitest

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

## Paso 12 — `npm install` y verificar

1. `npm install` → genera `package-lock.json`
2. `npm run dev` → verificar dev server
3. `npm run build` → verificar build
4. `npm test` → verificar tests

## Paso 13 — Actualizar `.gitignore`

- Quitar entradas `.yarn/...`
- Verificar que `node_modules/` y `/build` están presentes

---

## Posibles problemas

| Problema | Solución |
|----------|----------|
| `react-virtualized` (CJS) puede fallar | Añadir a `optimizeDeps.include` en vite config |
| `webfontloader` (CJS) | Vite lo pre-bundlea, verificar en runtime |
| Script `build` en Windows | `$(date ...)` es bash-only, usar `cross-env` si necesario |
| Puerto por defecto | Vite usa 5173, configuramos 3000 explícitamente |
