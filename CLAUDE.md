# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado del proyecto

**Aún sin andamiaje.** Existen sólo la especificación y los cimientos (git, hook de
copia de seguridad, `docs/`). El código de la app todavía no está creado.

Antes de programar, lee en este orden:

1. `docs/handoff.md` — especificación de producto y diseño, cerrada. Fuente de verdad del **qué**.
2. `docs/architecture.md` — stack y estructura previstos. El **cómo**.
3. `docs/project_state.md` — qué está hecho y el siguiente paso concreto.
4. `docs/decisions.md` — decisiones técnicas y su motivo (incluida la paleta y la tipografía).

## Qué es

Guía de apoyo, 100 % en cliente, para jugar partidas de Mordheim en mesa: checklists de
**Prebattle / Battle / Postgame** para no saltarse pasos de cada fase, con enlaces a la
regla exacta en mordheimer.net. Uso individual, pensada para móvil y tablet, sin backend,
sin cuentas, sin campañas ni estadísticas. Detalle completo en `docs/handoff.md`.

Fuera de alcance: gestor de warbands, tracker de partidas, sincronización con el rival,
reproducir el texto de las reglas (sólo se **enlaza** a mordheimer.net, `target="_blank"`).

## Stack previsto

- **Vite + React + TypeScript** — SPA, sin SSR. Es una herramienta; el SEO no es objetivo,
  por eso no se usa Next (ver `docs/decisions.md`).
- **Zustand** para el estado global, serializado a una **única** clave de `localStorage`
  en cada cambio.
- **CSS Modules + design tokens** (`src/styles/tokens.css`). **Sin Tailwind** (ver decisiones).
- **Vitest + Testing Library** (jsdom), tests colocados junto al código.
- **ESLint (flat config) + Prettier** — Prettier manda en formato.
- **Node 22** (`.nvmrc`).

Se replicará el conjunto de convenciones del proyecto hermano `../mortgage-calculator`
(mismo autor): scripts de npm, config de ESLint/Prettier/Vitest, `.editorconfig`, CI en
GitHub Actions.

## Comandos

_Disponibles tras el andamiaje. Objetivo (equivalente a `mortgage-calculator`):_

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build para revisarlo |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest, una pasada |
| `npm run test:watch` | Vitest en watch |
| `npx vitest run src/lib/battle/fases.test.ts` | Un único archivo de test |
| `npm run format` | Prettier sobre todo el repo |

## Estructura prevista

```
src/
  main.tsx, App.tsx
  routes/       Home, Prebattle, Battle, Postgame (4 accesos al mismo nivel, sin secuencia)
  components/   una carpeta por componente: Nombre.tsx + Nombre.module.css + Nombre.test.tsx
  store/        estado zustand + persistencia en localStorage
  data/         contenido de las checklists (id, texto_corto, texto_explicado?, link_regla?)
                como DATOS, no como JSX
  lib/          lógica pura (avance de ronda/fase, límpieza de checklist) + tests colocados
  styles/       tokens.css (custom properties) + estilos globales
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
- Todo `EstadoApp` se serializa a una única clave de `localStorage` en cada cambio y se lee
  al abrir. Sin botón de "nueva partida" / reset.

## Dirección visual

Grimdark de Mordheim — "fuimos una gran ciudad y ahora decaemos". Paleta y tokens exactos
en `docs/decisions.md`. Reglas:

- Paleta oscura y cálida del handoff (§8) **+ un segundo acento** verde wyrdstone, usado
  sólo como filo iluminado en el paso activo. Viñeta en los bordes y textura de hollín
  **estática** (SVG `feTurbulence`, 2–3 %). Sin imágenes de fondo tras el texto, sin
  animación decorativa: uso en mesa → contraste y toque grande por encima de todo.
- Tipografía: **Grenze Gotisch** self-hosted (1 peso) para titulares; stack **sans del
  sistema** para todo lo operativo (checklists, botones, labels). Máximo dos familias.
- Layout: una columna, botones apilados ≥ 50–56 px, bloques planos con borde fino, estilo
  hoja de referencia física. Nada de cards redondeadas con sombra gris genérica.
- El único "momento audaz": la **fase activa** (rojo sangre + filo verde). Todo lo demás, callado.

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
