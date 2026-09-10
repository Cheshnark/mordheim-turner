# Arquitectura

> Estado: **andamiaje montado** (2026-09-09). Base verde: lint, typecheck, test y build
> pasan. Pantallas Prebattle/Battle/Postgame son stubs. Decisiones y motivo en
> `docs/decisions.md`; estado y siguiente paso en `docs/project_state.md`.

## Stack

| Área | Elección | Notas |
|---|---|---|
| Build / framework | **Vite 8 + React 19 + TypeScript 6** | SPA en cliente puro; sin SSR (el SEO no es objetivo). Template `react-ts` de create-vite 9, personalizado |
| Routing | **react-router-dom 7** | `<BrowserRouter>` + `<Routes>` en `App.tsx`. 4 rutas: `/`, `/prebattle`, `/battle`, `/postgame` |
| Estado | **Zustand 5** + middleware `persist` | Instalado; store aún sin escribir. `persist` cubre el `localStorage` único |
| Estilos | **CSS Modules + `tokens.css`** | Identidad muy personalizada; Tailwind estorbaría (ver decisiones) |
| Tests | **Vitest 5 + Testing Library**, jsdom | Entorno `jsdom` por defecto; setup en `src/test/setup.ts`; tests colocados |
| Lint / formato | **ESLint 10 flat + Prettier 3** | Prettier manda en formato. Prettier **ignora `*.md`** (destroza tablas de prosa) |
| Alias | `@/` → `src/` | `resolve.tsconfigPaths: true` nativo de Vite 8 (sin plugin) + `paths` en `tsconfig.app.json` |
| Runtime | **Node 22** (`.nvmrc`) | Única fuente de verdad para local y CI |
| CI | **GitHub Actions** (`.github/workflows/ci.yml`) | lint + typecheck + test + build en push/PR a `main` |

Proyecto de referencia para convenciones: `../mortgage-calculator` (mismo autor) — scripts
de npm, filosofía de config, patrón de carpetas por componente. **No** se copia Next ni
`next-intl`: aquí no hay SSR ni i18n (contenido sólo en español). El template nuevo de Vite
trae `oxlint`; se sustituyó por ESLint flat + Prettier para alinear con el proyecto hermano.

## Estructura de carpetas

`[x]` existe · `[ ]` previsto

```
src/
  [x] main.tsx              punto de entrada: BrowserRouter + tokens.css + global.css
  [x] App.tsx               <Routes> con las 4 rutas
  routes/
    [x] Home.tsx / .module.css / .test.tsx   4 accesos al mismo nivel, con estilo
    [x] Prebattle.tsx / .module.css / .test.tsx   checklist plana (CHECKLIST_PREBATTLE)
    [x] Battle.tsx / .module.css / .test.tsx      selección de modo + bucle ronda/fase
    [x] Postgame.tsx / .module.css / .test.tsx    checklist plana + NOTAS_POSTGAME
  components/                patrón: <Nombre>/<Nombre>.{tsx,module.css,test.tsx}
    [x] ItemChecklist/       fila: casilla + texto corto (+ explicación/enlace si mostrarDetalle)
    [x] ListaChecklist/      <ul> de ItemChecklist; sin estado, todo por props
  store/
    [x] tipos.ts             tipos de dominio (handoff §3)
    [x] estadoApp.ts         store zustand + persist (clave única `mordheim-turner`) + acciones
    [x] estadoApp.test.ts    acciones, partialize y rehidratación (9 asserts)
  data/
    [x] prebattle.ts         CHECKLIST_PREBATTLE: ChecklistItem[]
    [x] postgame.ts          CHECKLIST_POSTGAME + NOTAS_POSTGAME
    [x] battle.ts            CONTENIDO_BATTLE: Record<FaseTurno, ContenidoFase> (items + linkFase + notasFijas)
    [x] checklists.test.ts   invariantes de los datos (ids, links, cobertura de fases)
  lib/
    [x] battle/fases.ts      ORDEN_FASES, faseSiguiente, cierraRonda (lógica pura)
    [x] battle/fases.test.ts
  styles/
    [x] tokens.css           custom properties: color, espaciado, tipografía, --huella / --filo-activo
    [x] global.css           reset + viñeta + textura de hollín SVG + .stack / .row + reduced-motion
  test/
    [x] setup.ts             jest-dom + cleanup por test
  fonts/
    [x] grenze-gotisch-latin-400.woff2   1 peso, subconjunto latino (Google Fonts v20)
    [x] OFL.txt                          licencia SIL OFL 1.1
```

## Tipos de dominio (del handoff)

```ts
type FaseTurno = 'recuperacion' | 'movimiento' | 'disparo' | 'combate';

type ChecklistItem = {
  id: string;
  texto_corto: string;
  texto_explicado?: string; // sólo en modo tutorial
  link_regla?: string;      // sólo en modo tutorial
};

type EstadoBattle = {
  ronda: number;
  fase: FaseTurno;
  modo: 'tutorial' | 'rapido';
  checklistFaseActual: Record<string, boolean>; // por id de item
};

type EstadoApp = {
  battle: EstadoBattle;
  checklistPrebattle: Record<string, boolean>;
  checklistPostgame: Record<string, boolean>;
};
```

## Persistencia

Un único `localStorage` con **todo** `EstadoApp` serializado (clave única), reescrito en
cada cambio de estado y leído al arrancar. Sin lógica por pantalla. Sin reset dedicado: el
usuario desmarca a mano si quiere reiniciar.

**Implementado** en `src/store/estadoApp.ts` con `zustand` + middleware `persist`:

- Clave `mordheim-turner` (`CLAVE_PERSISTENCIA`), `version: 1`, `storage` explícito sobre
  `localStorage`.
- `partialize` guarda solo los datos (`battle`, `checklistPrebattle`, `checklistPostgame`);
  las acciones no viajan al almacenamiento.
- Acciones: `establecerModo`, `alternarItemFase`, `avanzarFase`, `alternarItemPrebattle`,
  `alternarItemPostgame`. Ninguna muta estado en sitio.
- `avanzarFase` usa `faseSiguiente` / `cierraRonda` de `src/lib/battle/fases.ts`. Limpia
  `checklistFaseActual` en **todo** avance de fase (los marcados son de la fase que se deja);
  si la fase era Combate, además `ronda += 1`. Sin pantalla intermedia.
- `ESTADO_INICIAL` exportado: ronda 1, fase `recuperacion`, modo `tutorial`.

## Pantallas (consumen store + datos)

- **Prebattle / Postgame**: checklist plana. `useEstadoApp` para el mapa de marcado y
  su acción `alternar*`; `<ListaChecklist mostrarDetalle>` siempre. Postgame añade
  `NOTAS_POSTGAME` como bloques sin casilla.
- **Battle**: `enBucle` es `useState` local — al entrar en la ruta se re-elige modo
  aunque ronda/fase sigan donde los dejó `localStorage` (motivo en `decisions.md`).
  - Selección de modo: dos botones que hacen `establecerModo` + `setEnBucle(true)`;
    muestra "Vas por la Ronda N · Fase X".
  - Bucle: cabecera ronda/fase (bloque de fase activa: filo `--filo-activo` + regla
    roja), `pista` de 4 tramos (`ORDEN_FASES`, `aria-hidden`), toggle tutorial/rápido
    en vivo (`establecerModo`), `linkFase` y detalle de items solo en tutorial,
    `notasFijas` de la fase, `<ListaChecklist>` sobre `CONTENIDO_BATTLE[fase].items`, y
    botón "Siguiente fase" / "Cerrar ronda" (`disabled` hasta marcar todo) → `avanzarFase`.

## Preview local

`.claude/launch.json` define el server `dev` (Vite, puerto 5173) para previsualizar en
navegador. No afecta al build ni al CI.

## Estrategia de tests

Entorno **`jsdom` por defecto** para todos los tests (`vite.config.ts` → `test.environment`).
La lógica pura de `src/lib/` corre igual sin coste real; se evita el boilerplate de
`// @vitest-environment` por archivo.

- **`src/lib/`**: lógica pura (avance de ronda/fase, limpieza de checklist). Tests unitarios.
- **`src/components/`** y **`src/store/`**: Testing Library. Cubrir el bucle de Battle
  (completar checklist → habilitar "Siguiente fase" → cerrar ronda) y la rehidratación
  desde `localStorage`.

## Dependencias externas

- **mordheimer.net**: sólo enlaces `target="_blank" rel="noopener"`. Sin fetch, sin embed.
- **Fuente Grenze Gotisch**: self-hosted en `src/fonts/grenze-gotisch-latin-400.woff2`
  (OFL, 1 peso, subconjunto latino). `@font-face` con `font-display: swap` en
  `global.css`, referenciada con `url('../fonts/…')` para que Vite la empaquete y hashee.
  No se carga desde Google Fonts en runtime (uso potencial sin conexión en mesa).
