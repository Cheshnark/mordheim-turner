# Estado del proyecto

_Actualizado: 2026-09-10_

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

### Datos de checklists (sesión 3 — esta)

`src/data/` desde `handoff.md` §5–7 (aún sin consumir por ninguna pantalla):

- `prebattle.ts` → `CHECKLIST_PREBATTLE: ChecklistItem[]`
- `postgame.ts` → `CHECKLIST_POSTGAME` + `NOTAS_POSTGAME` (nota fija, sin checkbox)
- `battle.ts` → `CONTENIDO_BATTLE: Record<FaseTurno, ContenidoFase>`; cada fase con
  `numero`, `titulo`, `linkFase` (página de reglas) y, en Combate, `notasFijas`
- `checklists.test.ts` → ids únicos, textos no vacíos, links `https://mordheimer.net/`,
  4 fases numeradas 1..4, notas fijas presentes. **test total: 21/21.**

Nota de contenido: los `texto_corto` / `texto_explicado` son reformulación operativa de
las viñetas del handoff, sin añadir reglas que no estén ahí. La transición de fin de
ronda (§5, "al completar Combate → ronda += 1") es lógica del store, no va en datos.

### Store zustand + persist (sesión 4 — esta)

`src/store/estadoApp.ts` — `create` + middleware `persist`:

- Clave única `mordheim-turner`, `version: 1`, `partialize` (solo datos, sin acciones).
- `ESTADO_INICIAL` exportado: ronda 1, fase `recuperacion`, modo `tutorial`.
- Acciones: `establecerModo`, `alternarItemFase`, `avanzarFase`, `alternarItemPrebattle`,
  `alternarItemPostgame`. Todas devuelven objetos nuevos (sin mutación).
- `avanzarFase` delega en `faseSiguiente` / `cierraRonda`; limpia `checklistFaseActual`
  en cada avance y suma ronda solo al salir de Combate. Motivo en `decisions.md`.
- `estadoApp.test.ts` — 9 asserts: acciones, independencia de las tres checklists,
  escritura en `localStorage` sin funciones, y rehidratación vía `persist.rehydrate()`.
- **test total: 30/30.** `lint`, `typecheck`, `format:check`, `build` verdes.

### Nota sobre Prettier y markdown

`*.md` está en `.prettierignore`: Prettier destrozaba las tablas de prosa de los docs.
Los `.md` se mantienen a mano.

## Siguiente paso

Contenido y lógica, en este orden (cada bloque = sesión nueva):

1. **Pantallas reales** — Battle (selección de modo + bucle ronda/fase con toggle
   tutorial/rápido, consumiendo `CONTENIDO_BATTLE`) → Prebattle (`CHECKLIST_PREBATTLE`) →
   Postgame (`CHECKLIST_POSTGAME` + `NOTAS_POSTGAME`). Reemplazan los stubs. Consumen
   `useEstadoApp` de `src/store/estadoApp.ts`.
2. **Componente(s) de checklist** reutilizable(s) en `src/components/` (patrón carpeta).
3. **Capa visual** — tokens y estética grimdark en checklists y fase activa
   (rojo sangre + filo wyrdstone) sobre el mockup de referencia.
4. **Fuente Grenze Gotisch** self-hosted en `src/fonts/` + `@font-face`.

## Bloqueos / pendientes de terceros

- El mockup `mordheim-battle-mockup.html` (`handoff.md` §9) **no está** en el repo.
  Pedirlo al usuario antes de la capa visual de Battle.
- `gh` CLI no instalado (winget/choco sin permisos de admin). No bloquea nada ahora.
