# Estado del proyecto

_Actualizado: 2026-09-11_

## Dónde estamos

**App funcional con la identidad visual completa.** Store + datos + las tres pantallas
reales + capa visual grimdark + Grenze Gotisch self-hosted en titulares. La fase de UI
del plan queda cerrada; lo que resta es "prioridad baja" (despliegue, favicon).

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

### Capa visual grimdark (sesión 6 — esta)

Sobre `docs/mordheim-battle-mockup.html`, con las divergencias ya decididas.

- `tokens.css`: `--color-wyrdstone` ajustado a `#9fbe3b` (verde tóxico, distinto de
  `--color-completado`); nuevos `--huella`, `--lavado-completado`, `--filo-activo`
  (barra + resplandor **contenido** en el borde izquierdo, sin halo).
- `ItemChecklist`: `:has(.check:checked)` → borde `--color-completado` + lavado verde;
  casilla nativa 1.4 rem con `accent-color`; texto tachado. Transición solo al marcar.
- `Battle`: cabecera = "momento audaz" (filo wyrdstone + lavado rojo + regla roja bajo
  el título); `pista` de 4 tramos (hecha/activa/pendiente) desde `ORDEN_FASES`
  (`aria-hidden`, el `<h1>` ya da la fase); toggle de modo discreto tipo pill.
- `Home`: Battle como acceso destacado (borde rojo + degradado sangre); enlace externo
  con borde discontinuo.
- `.claude/launch.json` añadido (config `dev`, Vite en 5173) para previsualizar.
- Verificado en navegador (móvil 375): Home, selección de modo, bucle tutorial/rápido,
  avance de fase con `pista` actualizada, Prebattle, Postgame. **test total: 48/48.**
  `lint`, `typecheck`, `format:check`, `build` verdes.

### Fuente Grenze Gotisch (sesión 7 — esta)

- `src/fonts/grenze-gotisch-latin-400.woff2` (Google Fonts v20, subset `latin`, 16 kB)
  + `src/fonts/OFL.txt`. `src/fonts/` ya estaba en `.prettierignore`.
- `@font-face` (`font-weight: 400`, `font-display: swap`, `unicode-range` del subset
  latino) al inicio de `global.css`, con `url('../fonts/…')` → Vite la empaqueta y
  hashea (`dist/assets/grenze-gotisch-latin-400-*.woff2`).
- Verificado en navegador: `document.fonts.check(...)` = `true`; titulares (Home,
  nombres de acceso, "Fase N · …") en la gótica; el resto sigue en sans del sistema.
- Motivo del subset único en `decisions.md`. **test total: 48/48**, resto verde.

### Ajustes de UI móvil (sesión 8 — esta)

- Home y selección de modo de Battle: botones a pantalla completa (`#root` flex column
  + `<main>` con `flex: 1`, sin `max-height`). `--toque-min` 52 → 56 px.
- Atmósfera: inicial iluminada en `::first-letter` de los `<h1>` de pantalla; resplandor
  cálido de antorcha sobre la viñeta. Motivo en `decisions.md`.
- Verificado en navegador (móvil 375). **test 48/48**, resto verde.

### 2ª pasada de estética (sesión 8 — esta, cont.)

- Nuevos componentes: `CabeceraPantalla` (running head + inicial iluminada + filete) y
  `GlifoFase` (svg xilográfico por fase, `aria-hidden`). Prebattle/Postgame/Battle-modo
  usan `CabeceraPantalla`; el bucle de Battle conserva su cabecera-momento-audaz + el
  glifo de la fase.
- `ItemChecklist`: casilla nativa reestilada como sello de tinta (`appearance: none`,
  aspa al marcar); esquinas marcadas en dos vértices.
- Textura: `body::after` de nube gruesa (2,2 %) + tinte cálido en el borde superior de
  las tarjetas.
- Motivo y contradicciones resueltas en `decisions.md`. Descartado: rondas en romano.
- **test 52/52** (nuevos: `CabeceraPantalla` 2, `GlifoFase` 2). Resto verde.

### Giro a dos colores + identidad propia (sesión 9 — esta)

- **Dos colores**: fuera `--color-wyrdstone` y `--color-completado`. Neutros + rojo único.
  Item marcado = fila hundida a `--color-fondo` + casilla-sello en tinta apagada, sin
  color. Pista: `hecha` neutra, `activa` roja. `--filo-activo` pasa a rojo.
- **Fuera el subrayado** bajo el título de fase; el filo rojo lleva la señal.
- **Botón "volver"**: clase global `.volver` — versalitas espaciadas + chevrón, sin
  subrayado. Reutilizada por `CabeceraPantalla` y el bucle.
- **Assets de GW: descartados** (uso privado no exime de copyright). Ornamento propio de
  "estrella fugaz" en `CabeceraPantalla` y `public/favicon.svg` (primer favicon).
- Motivo completo en `decisions.md` (2026-09-10, supersede la paleta del 09-09).
- **test 52/52**, `lint`/`typecheck`/`format`/`build` verdes.

### Modo rápido como referencia + nombre "Turnheim" (sesión 10 — esta)

- **Battle rápido**: sin casillas (`ItemChecklist interactivo={false}`, viñeta), botón de
  avance siempre activo, `linkFase` visible también aquí. Tutorial no cambia. El marcado
  sigue en el store. Motivo en `decisions.md`.
- **Nombre**: la app pasa a llamarse **Turnheim** ("Compañero de turno para Mordheim").
  Cambia Home, `<title>`, `meta description`, README, CLAUDE.md. Repo/paquete siguen como
  `mordheim-turner`.
- Wordmark de Home ya con "Turnheim" (versal roja en la "T").
- Tests de Battle reescritos para el nuevo rápido; nuevo test de `ItemChecklist` no
  interactivo. **test 55/55**, `lint`/`typecheck`/`format`/`build` verdes.

### Textura de superficies + marca de agua del glifo (sesión 11 — esta)

- `--tinte-superficie` (nuevo token) reemplaza el degradado repetido en
  `ItemChecklist` y el botón de modo de Battle, y se aplica también a las notas
  fijas de Battle y Postgame (antes sin tinte). Cierra el pendiente de
  "textura de superficies".
- Marca de agua: `GlifoFase` de la fase activa, grande (6.5rem) y muy tenue
  (opacity 0.06), recortada al borde derecho de la cabecera del bucle de
  Battle. Motivo y detalle en `decisions.md`.
- **No verificado en el preview del navegador esta sesión**: el spawner de
  `.claude/launch.json` no encuentra `npm` en su entorno (falta Node en su
  `PATH`). No se ha tocado `launch.json` con una ruta específica de esta
  máquina — pendiente confirmar visualmente. Sí verificado: `lint`,
  `typecheck`, `format:check`, `test` (55/55), `build`.

### Nota sobre Prettier y markdown

`*.md` está en `.prettierignore`: Prettier destrozaba las tablas de prosa de los docs.
Los `.md` se mantienen a mano.

## Siguiente paso

La fase de contenido/lógica/UI del plan está **cerrada**. El empuje de identidad visual
(wordmark, glifos macizos, textura de superficies, marca de agua) está hecho. Prioridad
baja pendiente:

1. Confirmar visualmente en el navegador la textura de superficies y la marca de agua
   del glifo (sesión 11) en cuanto el preview funcione en esta máquina.
2. Decidir despliegue estático (GitHub Pages / Netlify / Vercel) y documentarlo.

Nota: el avance sin marcar en modo rápido ya está resuelto (rápido = referencia). En
tutorial se mantiene el bloqueo hasta marcar todo (reconsiderable).

## Bloqueos / pendientes de terceros

- ~~El mockup no está en el repo~~ — resuelto 2026-09-10: `docs/mordheim-battle-mockup.html`
  (excluido de Prettier en `.prettierignore`). La capa visual ya no está bloqueada.
- `gh` CLI no instalado (winget/choco sin permisos de admin). No bloquea nada ahora.
