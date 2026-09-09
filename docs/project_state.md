# Estado del proyecto

_Actualizado: 2026-09-09_

## Dónde estamos

**Andamiaje Vite montado y verde.** Cimientos + proyecto base funcionando.

### Cimientos (sesión 1)

- `git init` en `main`; `.gitignore`, `.gitattributes`, `.editorconfig`, `.nvmrc` (Node 22).
- Hook `Stop` de copia de seguridad: `.claude/hooks/auto-commit.mjs` + `.claude/settings.json`.
- `CLAUDE.md` + `docs/` (`business`, `architecture`, `decisions`, `todos`, este archivo, `handoff`).
- Remoto: `origin` = https://github.com/Cheshnark/mordheim-turner.git, `main` rastrea `origin/main`.

### Andamiaje (sesión 2 — esta)

- **Vite 8 + React 19 + TypeScript 6** (template `react-ts` de create-vite 9, personalizado).
- **ESLint 10 flat config + Prettier** (Prettier ignora `*.md` — ver nota abajo).
- **Vitest 5 + Testing Library** (jsdom), `src/test/setup.ts`.
- **react-router-dom 7** con `<BrowserRouter>` / `<Routes>`; **zustand 5** instalado (aún sin store).
- Alias `@/` → `src/` vía `resolve.tsconfigPaths` nativo de Vite (sin plugin).
- CI en `.github/workflows/ci.yml`: lint + typecheck + test + build.
- Estructura de `src/` según `docs/architecture.md`. Creado:
  - `src/main.tsx`, `src/App.tsx` (router con las 4 rutas)
  - `src/routes/Home.tsx` + `Home.module.css` + `Home.test.tsx` — los 4 accesos, con estilo
  - `src/routes/{Prebattle,Battle,Postgame}.tsx` — **stubs** (solo título + enlace a Home)
  - `src/styles/tokens.css` (paleta de `decisions.md`) + `src/styles/global.css`
    (reset, viñeta, textura de hollín SVG, helpers `.stack` / `.row`, `prefers-reduced-motion`)
  - `src/store/tipos.ts` — tipos de dominio del handoff §3
  - `src/lib/battle/fases.ts` + `fases.test.ts` — `ORDEN_FASES`, `faseSiguiente`, `cierraRonda`
- **Verificado:** `npm run lint`, `typecheck`, `test` (6/6), `format:check`, `build` — todo pasa.

### Nota sobre Prettier y markdown

`*.md` está en `.prettierignore`: Prettier destrozaba las tablas de prosa de los docs.
Los `.md` se mantienen a mano.

## Siguiente paso

Contenido y lógica, en este orden (cada bloque = sesión nueva):

1. **`src/data/`** — checklists de Prebattle, Battle (4 fases) y Postgame desde `handoff.md`
   §5–7 como `ChecklistItem[]`, con `texto_explicado` y `link_regla`. Más las notas fijas
   (Fase de Combate §5, cierre de Postgame §7).
2. **Store zustand + `persist`** — `EstadoApp` en una clave única de `localStorage`;
   acción de avance de fase que usa `faseSiguiente` / `cierraRonda` y limpia el checklist
   al cerrar ronda. Tests de rehidratación.
3. **Pantallas reales** — Battle (selección de modo + bucle ronda/fase con toggle
   tutorial/rápido) → Prebattle → Postgame. Reemplazan los stubs.
4. **Capa visual** — aplicar tokens y estética grimdark a checklists y fase activa
   (rojo sangre + filo wyrdstone) sobre el mockup de referencia.
5. **Fuente Grenze Gotisch** self-hosted en `src/fonts/` + `@font-face`.

## Bloqueos / pendientes de terceros

- El mockup `mordheim-battle-mockup.html` (`handoff.md` §9) **no está** en el repo.
  Pedirlo al usuario antes de la capa visual de Battle.
- `gh` CLI no instalado (winget/choco sin permisos de admin). No bloquea nada ahora.
