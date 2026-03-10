# Gasteizko Rap Player

Reproductor de rap de Vitoria y alrededores (2000s). Las pistas recuerdan esos tiempos y traen muchos recuerdos.

**Nota para los Artistas:** Si algún artista ve esto y desea que se elimine su pista, no dude en ponerse en contacto conmigo en [iker@ikerocio.com](mailto:iker@ikerocio.com).

Basado en [WilsonLe's react-music-player](https://github.com/WilsonLe/react-music-player). Funciona completamente en el frontend sin backend.

## Autores

- **Iker Ocio Zuazo** - [Website](https://ikerocio.com)
- **Jonzoone** - [Instagram](https://www.instagram.com/jonzoonegraphics/)

## Empezando

```bash
# Instala las dependencias:
npm install

# Inicia en modo desarrollo:
npm run dev
```

## Scripts disponibles

| Comando              | Descripción                                |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Servidor de desarrollo (Vite, puerto 3000) |
| `npm run build`      | Build de producción                        |
| `npm run preview`    | Preview del build                          |
| `npm run lint`       | ESLint sobre src/                          |
| `npm run typecheck`  | Chequeo de tipos TypeScript                |
| `npm test`           | Tests con Vitest                           |
| `npm run test:watch` | Tests en modo watch                        |

## Stack

- React 19 + TypeScript
- Vite
- styled-components
- @tanstack/react-virtual (lista virtualizada)
- react-router-dom v7
- Vitest + Testing Library

## Despliegue

El proyecto se despliega automáticamente en Vercel: [gasteizko-rap-player.vercel.app](https://gasteizko-rap-player.vercel.app/)

```bash
npm run build
```

## Optimización de Datos

Todas las canciones exportadas a m4a. 727 archivos: **3.65GB -> 2.45GB**.
