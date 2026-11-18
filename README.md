# Portfolio · Vinícius Barbosa

Mi web personal: [evbarbosadev.web.app](https://evbarbosadev.web.app). Una página principal y un caso de estudio por proyecto, en español (`/`) y en inglés (`/en`).

## Qué hay detrás

- **Estática y sin depender de JavaScript.** Cada ruta se genera como HTML ya renderizado. El movimiento es una capa añadida y con `prefers-reduced-motion` no se descarga.
- **Mi propia marca.** Los colores, los espacios, el movimiento y la tipografía (Vørlys Sans, derivada de Schibsted Grotesk) salen de Vørlys. Los tokens están en `src/estilos/tokens.css`.
- **Contenido validado.** Los textos son Markdown y se validan con zod al compilar: si falta un dato, el build se para y dice dónde.
- **Comprobado en cada push.** Tests de humo y accesibilidad con Playwright y axe, y Lighthouse CI con umbrales: rendimiento ≥ 90; accesibilidad, buenas prácticas y SEO ≥ 95.

## Arrancar

Hace falta Node 26 LTS (ver `.nvmrc`) y pnpm.

```bash
pnpm install
```

```bash
pnpm dev
```

| Script            | Qué hace                                                                        |
| ----------------- | ------------------------------------------------------------------------------- |
| `pnpm dev`        | Servidor de desarrollo. Los borradores (`borrador: true`) se ven aquí.          |
| `pnpm build`      | Valida el contenido y genera `dist/` con el HTML, las imágenes OG y el sitemap. |
| `pnpm preview`    | Sirve `dist/` con las mismas cabeceras y la misma 404 que Firebase Hosting.     |
| `pnpm lint`       | ESLint.                                                                         |
| `pnpm format`     | Prettier (4 espacios y clases de Tailwind ordenadas).                           |
| `pnpm typecheck`  | Tipos con `vue-tsc`.                                                            |
| `pnpm test`       | Tests de humo y accesibilidad. Necesita un `pnpm build` previo y Chrome.        |
| `pnpm lighthouse` | Lighthouse CI con los umbrales de `lighthouserc.json`. También tras el build.   |

## Estructura

```
plugins/             Plugins de Vite propios: contenido, imágenes OG y vista previa
public/              Favicons, manifest y tema.js
src/
  constantes.ts      Constantes compartidas (idiomas, anclas, claves)
  rutas.ts           Rutas por idioma y ayudas para construirlas
  estilos/           tokens.css (tokens de diseño) y base.css
  recursos/          Vørlys Sans (con su licencia OFL) y el símbolo de las tarjetas OG
  idiomas/           Textos de la interfaz: es.ts y en.ts
  contenido/         Todo el contenido, en Markdown, y sus esquemas
  composables/       Lógica reutilizable: tema, idioma, textos, cabecera, movimiento
  componentes/       base/ (piezas), layout/ (cabecera, pie) y secciones/ (página principal)
  movimiento/        GSAP: se carga aparte, en reposo
  paginas/           InicioPage, ProyectoPage y NoEncontradaPage
tests/               Playwright y axe
```
