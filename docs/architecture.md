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
    [x] Prebattle.tsx        STUB (título + volver a Home)
    [x] Battle.tsx           STUB
    [x] Postgame.tsx         STUB
  components/                (vacío) patrón: <Nombre>/<Nombre>.{tsx,module.css,test.tsx}
  store/
    [x] tipos.ts             tipos de dominio (handoff §3)
    [ ] estadoApp.ts         store zustand + persist (clave única de localStorage)
  data/                      (vacío)
    [ ] prebattle.ts         ChecklistItem[]
    [ ] postgame.ts          ChecklistItem[]
    [ ] battle.ts            por fase: ChecklistItem[] + notas fijas
  lib/
    [x] battle/fases.ts      ORDEN_FASES, faseSiguiente, cierraRonda (lógica pura)
    [x] battle/fases.test.ts
  styles/
    [x] tokens.css           custom properties (color, espaciado, tipografía)
    [x] global.css           reset + viñeta + textura de hollín SVG + .stack / .row + reduced-motion
  test/
    [x] setup.ts             jest-dom + cleanup por test
  fonts/                     (vacío)
    [ ] grenze-gotisch-*.woff2
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
- **Fuente Grenze Gotisch**: self-hosted en `src/fonts/` (OFL). No se carga desde Google
  Fonts en runtime (uso potencial sin conexión en mesa).
