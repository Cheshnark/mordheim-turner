# Estado del proyecto

_Actualizado: 2026-09-09_

## Dónde estamos

**Cimientos montados. Sin código de aplicación todavía.**

Hecho hoy:

- `git init` en `main`.
- `.gitignore` (Vite/Node) y `.nvmrc` (Node 22).
- Hook `Stop` de copia de seguridad automática: `.claude/hooks/auto-commit.mjs` +
  `.claude/settings.json`. Confirma en local tras cada turno; hará push cuando haya remoto.
- `CLAUDE.md` con stack, estructura, modelo de estado y dirección visual.
- `docs/`: `business.md`, `architecture.md`, `decisions.md`, `todos.md`, este archivo, y
  `handoff.md` (la especificación original, movida aquí).

Decidido (detalle y motivo en `docs/decisions.md`):

- Vite + React + TS, sin Next.
- Zustand + `persist` sobre una clave única de `localStorage`.
- CSS Modules + `tokens.css`, sin Tailwind.
- Titulares en Grenze Gotisch self-hosted; resto en sans del sistema.
- Paleta del handoff + segundo acento wyrdstone + viñeta y textura de hollín estáticas.

## Siguiente paso (sesión nueva)

**Andamiaje del proyecto Vite.** En un chat nuevo, con este prompt de arranque:

> Lee `docs/project_state.md`, `docs/architecture.md` y `docs/decisions.md`. Anda el
> proyecto: Vite + React + TS, Vitest + Testing Library, ESLint flat + Prettier, scripts
> de npm equivalentes a `../mortgage-calculator`, CI en GitHub Actions, la estructura de
> carpetas de `architecture.md`, `src/styles/tokens.css` con la paleta de `decisions.md`,
> y la fuente Grenze Gotisch self-hosted. Sin pantallas todavía o sólo Home con los 4
> accesos.

Después, en orden sugerido:

1. `src/data/` con el contenido de las checklists (handoff §5–7).
2. `src/lib/battle/fases.ts` + tests: avance de fase, cierre de ronda, limpieza.
3. Store zustand + `persist` + tests de rehidratación.
4. Pantallas: Home → Battle (bucle) → Prebattle → Postgame.
5. Capa visual (tokens, viñeta, textura, tipografía) sobre el mockup de referencia.

## Bloqueos / dependencias

- El mockup `mordheim-battle-mockup.html` que menciona `handoff.md` §9 **no está** en el
  repo. Pedirlo al usuario antes de la capa visual de Battle.

## Resuelto

- **Remoto en GitHub** (2026-09-09): `origin` =
  https://github.com/Cheshnark/mordheim-turner.git, `main` rastrea `origin/main`. El hook
  `Stop` confirma y hace push. `gh` CLI no se pudo instalar (winget/choco sin permisos de
  administrador); el repo se creó por web.
