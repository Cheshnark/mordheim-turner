# Estado del proyecto

_Actualizado: 2026-09-10_

## Dónde estamos

**App funcional, sin capa visual final.** Store + datos + las tres pantallas reales
conectadas. Falta la estética grimdark (bloqueada por el mockup) y la fuente.

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

### Pantallas reales + componentes de checklist (sesión 5 — esta)

Reemplazan los stubs de `src/routes/`; consumen `useEstadoApp` + `src/data/`.

- `src/components/ItemChecklist/` — fila: casilla + `texto_corto`; con `mostrarDetalle`,
  además `texto_explicado` y enlace externo a la regla (`target="_blank"`, `rel` noopener).
- `src/components/ListaChecklist/` — `<ul>` de `ItemChecklist`, sin estado propio.
- `Prebattle` / `Postgame` — checklist plana, `mostrarDetalle` siempre. Postgame pinta
  `NOTAS_POSTGAME` como bloques sin casilla.
- `Battle` — `enBucle` (`useState` local): al entrar se re-elige modo aunque ronda/fase
  sigan en `localStorage` (decisión registrada). Bucle: cabecera ronda/fase, toggle
  tutorial/rápido en vivo, `linkFase` + detalle solo en tutorial, `notasFijas` de la
  fase, y botón "Siguiente fase" / "Cerrar ronda" (`disabled` hasta marcar todo) →
  `avanzarFase`.
- CSS por pantalla/componente: **solo estructura** (tap targets ≥ 52 px, legible). La
  estética grimdark y el "momento audaz" de la fase activa van con el mockup.
- Tests nuevos: `ItemChecklist` (5), `ListaChecklist` (2), `Prebattle` (3), `Postgame`
  (2), `Battle` (6). **test total: 48/48.** `lint`, `typecheck`, `format:check`, `build`
  verdes.

### Nota sobre Prettier y markdown

`*.md` está en `.prettierignore`: Prettier destrozaba las tablas de prosa de los docs.
Los `.md` se mantienen a mano.

## Siguiente paso

Contenido y lógica, en este orden (cada bloque = sesión nueva):

1. **Capa visual** — tokens y estética grimdark en checklists y fase activa
   (rojo sangre + filo wyrdstone) sobre `docs/mordheim-battle-mockup.html` (ya en el repo).
   No copiar del boceto: la pill "Mi turno" (contradice handoff §3, no hay turno en el
   estado). Divergencias ya decididas en `decisions.md` que se mantienen: Grenze Gotisch
   (el boceto usa Iowan/Georgia), viñeta + hollín + filo wyrdstone (el boceto no los tiene).
2. **Fuente Grenze Gotisch** self-hosted en `src/fonts/` + `@font-face`.

Suelto, sin bloqueo: revisar en uso si "Siguiente fase" debería permitir avanzar sin
marcar los pasos que no aplican (decisión registrada, reconsiderable).

## Bloqueos / pendientes de terceros

- ~~El mockup no está en el repo~~ — resuelto 2026-09-10: `docs/mordheim-battle-mockup.html`
  (excluido de Prettier en `.prettierignore`). La capa visual ya no está bloqueada.
- `gh` CLI no instalado (winget/choco sin permisos de admin). No bloquea nada ahora.
