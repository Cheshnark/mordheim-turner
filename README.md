# Turnheim

Compañero de turno para **Mordheim**: guía de apoyo, 100 % en cliente, para jugar
partidas en mesa. Checklists de Prebattle / Battle / Postgame para no saltarse pasos, con
enlaces a la regla exacta en mordheimer.net. Pensada para móvil y tablet. Sin backend, sin
cuentas, sin campañas.

_El nombre del paquete/repo sigue siendo `mordheim-turner` (interno)._

## Requisitos

- Node 22 (ver `.nvmrc`)

## Puesta en marcha

```bash
npm install
npm run dev
```

## Scripts

| Comando              | Qué hace                        |
| -------------------- | ------------------------------- |
| `npm run dev`        | Servidor de desarrollo (Vite)   |
| `npm run build`      | Typecheck + build de producción |
| `npm run preview`    | Sirve el build para revisarlo   |
| `npm run lint`       | ESLint                          |
| `npm run typecheck`  | `tsc -b`                        |
| `npm test`           | Vitest, una pasada              |
| `npm run test:watch` | Vitest en watch                 |
| `npm run format`     | Prettier sobre todo el repo     |

## Documentación

La fuente de verdad está en `docs/`:

- `docs/handoff.md` — especificación de producto y diseño (el **qué**)
- `docs/architecture.md` — stack y estructura (el **cómo**)
- `docs/decisions.md` — decisiones técnicas y su motivo
- `docs/project_state.md` — estado actual y siguiente paso
- `docs/todos.md` — pendientes

Ver también `CLAUDE.md` para trabajar en el repo con Claude Code.
