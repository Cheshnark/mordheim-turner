# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado del proyecto

**App completa a nivel de contenido, lógica y UI** (2026-09-10). Base verde: `lint`,
`typecheck`, `test` (48/48), `build`. Store (`src/store/estadoApp.ts`, zustand + persist),
`src/data/`, las tres pantallas reales (`Prebattle`/`Battle`/`Postgame`) vía `useEstadoApp`,
`src/components/{ItemChecklist,ListaChecklist}`, capa visual grimdark sobre el boceto
(`docs/mordheim-battle-mockup.html`) y Grenze Gotisch self-hosted (`src/fonts/`). Resto:
solo prioridad baja (despliegue, favicon — ver `docs/todos.md`). Preview: `.claude/launch.json`
(server `dev`, 5173).

Antes de programar, lee en este orden:

1. `docs/handoff.md` — especificación de producto y diseño, cerrada. Fuente de verdad del **qué**.
2. `docs/project_state.md` — qué está hecho y el siguiente paso concreto.
3. `docs/architecture.md` — stack y estructura (con marcas `[x]` / `[ ]`).
4. `docs/decisions.md` — decisiones técnicas y su motivo (incluida la paleta y la tipografía).

## Qué es

**Turnheim** — compañero de turno para Mordheim. Guía de apoyo, 100 % en cliente, para
jugar partidas en mesa: checklists de **Prebattle / Battle / Postgame** para no saltarse
pasos de cada fase, con enlaces a la regla exacta en mordheimer.net. Uso individual,
pensada para móvil y tablet, sin backend, sin cuentas, sin campañas ni estadísticas.
Detalle completo en `docs/handoff.md`. (El repo/paquete sigue siendo `mordheim-turner`.)

Fuera de alcance: gestor de warbands, tracker de partidas, sincronización con el rival,
reproducir el texto de las reglas (sólo se **enlaza** a mordheimer.net, `target="_blank"`).

## Stack

- **Vite 8 + React 19 + TypeScript 6** — SPA, sin SSR. El SEO no es objetivo, por eso no
  se usa Next (ver `docs/decisions.md`).
- **react-router-dom 7** — `<BrowserRouter>` + `<Routes>` en `App.tsx`.
- **Zustand 5** para el estado global, serializado a una **única** clave de `localStorage`
  (middleware `persist`). _Instalado; store aún sin escribir._
- **CSS Modules + design tokens** (`src/styles/tokens.css`). **Sin Tailwind** (ver decisiones).
- **Vitest 5 + Testing Library**, entorno `jsdom` por defecto, tests colocados.
- **ESLint 10 flat config + Prettier 3** — Prettier manda en formato; **ignora `*.md`**.
- Alias `@/` → `src/` (`resolve.tsconfigPaths` nativo de Vite; `paths` en `tsconfig.app.json`).
- **Node 22** (`.nvmrc`). CI en `.github/workflows/ci.yml`.

Convenciones alineadas con el proyecto hermano `../mortgage-calculator` (mismo autor).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | `tsc -b` + build de producción |
| `npm run preview` | Sirve el build para revisarlo |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b` |
| `npm test` | Vitest, una pasada |
| `npm run test:watch` | Vitest en watch |
| `npx vitest run src/lib/battle/fases.test.ts` | Un único archivo de test |
| `npm run format` | Prettier sobre el repo (ignora `*.md`) |
| `npm run format:check` | Prettier en modo comprobación (lo que corre CI) |

## Estructura

`docs/architecture.md` tiene el árbol con marcas `[x]` / `[ ]`. Resumen:

```
src/
  main.tsx, App.tsx        [x] router con 4 rutas
  routes/                  [x] Home · Prebattle · Battle · Postgame (reales, CSS estructural)
  components/              [x] ItemChecklist/ · ListaChecklist/ · CabeceraPantalla/ · GlifoFase/
  store/                   [x] tipos.ts · [x] estadoApp.ts (zustand + persist, 5 acciones)
  data/                    [x] prebattle · postgame · battle (checklists como DATOS, no JSX)
  lib/battle/fases.ts      [x] ORDEN_FASES, faseSiguiente, cierraRonda (+ test)
  styles/                  [x] tokens.css · global.css (viñeta, hollín, .stack/.row)
  test/setup.ts            [x] jest-dom + cleanup
  fonts/                   [x] grenze-gotisch-latin-400.woff2 + OFL.txt
```

## Modelo de estado (del handoff, §3)

`EstadoApp` = `battle` (`ronda`, `fase`, `modo: 'tutorial' | 'rapido'`, `checklistFaseActual`)
+ `checklistPrebattle` + `checklistPostgame`.

- `fase` ∈ `'recuperacion' | 'movimiento' | 'disparo' | 'combate'`. Cíclico.
- **No existe "turno mío / turno del rival"** en el estado: sólo Ronda + Fase. Lo lleva el jugador.
- Al completar la Fase 4 (Combate): `ronda += 1`, `fase = 'recuperacion'`, se limpia
  `checklistFaseActual`. Sin pantalla intermedia ni resumen.
- El toggle tutorial/rápido **sólo existe en Battle**. Prebattle y Postgame son checklists
  planas con explicación breve fija.
- **Modo tutorial**: casillas + explicación por paso + enlace de fase; "Siguiente fase"
  bloqueado hasta marcar todo. **Modo rápido**: solo referencia — lista de pasos sin
  casillas + enlace de fase; se avanza cuando el jugador quiera (decisión 2026-09-10;
  diverge del mockup, que lo mostraba con casillas).
- Todo `EstadoApp` se serializa a una única clave de `localStorage` en cada cambio y se lee
  al abrir. Sin botón de "nueva partida" / reset.

## Dirección visual

Grimdark de Mordheim — "fuimos una gran ciudad y ahora decaemos". Paleta y tokens exactos
en `docs/decisions.md`. Reglas:

- **Dos colores** (decisión 2026-09-10): neutros grimdark del handoff (§8) + hueso de
  texto **+ un único acento rojo** (`--color-acento`). Sin verde/segundo acento. Viñeta
  en los bordes y textura estática (SVG `feTurbulence`). Sin imágenes de fondo tras el
  texto, sin animación decorativa: uso en mesa → contraste y toque grande por encima de todo.
- **Sin assets de Games Workshop** (logo, cometa bicola, arte/iconos). Solo el nombre
  "Mordheim" como texto y ornamentos propios. Ver `docs/decisions.md` (2026-09-10).
- Tipografía: **Grenze Gotisch** self-hosted (1 peso) para titulares; stack **sans del
  sistema** para todo lo operativo (checklists, botones, labels). Máximo dos familias.
- Layout: una columna, botones apilados ≥ 50–56 px, bloques planos con borde fino, estilo
  hoja de referencia física. Nada de cards redondeadas con sombra gris genérica.
- El único "momento audaz": la **fase activa** (filo + lavado rojo, sin subrayado). Todo lo demás, callado.

## Reglas de trabajo

- **Español en todo**: código, identificadores de dominio, comentarios, mensajes de commit,
  docs. (Regla global del usuario.)
- Un hook `Stop` (`.claude/hooks/auto-commit.mjs`) hace **commit automático** tras cada
  turno y push si hay remoto. No necesitas confirmar a mano salvo que quieras un mensaje
  concreto para un hito.
- Tras cualquier tarea relevante, **actualiza `docs/`**. Los docs son la fuente de verdad,
  no el historial del chat.
- No reproducir contenido de reglas de Games Workshop / mordheimer.net: sólo enlaces
  externos con `target="_blank"` y `rel="noopener"`.
