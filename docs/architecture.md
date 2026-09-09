# Arquitectura

> Estado: **previsto**. Todavía no hay código; este documento fija el objetivo del
> andamiaje. Las decisiones y su motivo están en `docs/decisions.md`.

## Stack

| Área | Elección | Motivo (resumen) |
|---|---|---|
| Build / framework | **Vite + React + TypeScript** | SPA en cliente puro; sin SSR porque el SEO no es objetivo |
| Estado | **Zustand** + middleware `persist` | Modelo de estado pequeño; `persist` cubre el `localStorage` único |
| Estilos | **CSS Modules + `tokens.css`** | Identidad visual muy personalizada; Tailwind estorbaría (ver decisiones) |
| Tests | **Vitest + Testing Library**, jsdom | Igual que `mortgage-calculator`; tests colocados |
| Lint / formato | **ESLint flat config + Prettier** | Prettier manda en formato; ESLint sólo reglas |
| Runtime | **Node 22** (`.nvmrc`) | Única fuente de verdad para local y CI |
| CI | **GitHub Actions** | lint + typecheck + test + build en push/PR a `main` |

Proyecto de referencia para convenciones: `../mortgage-calculator` (mismo autor). De ahí
se copian scripts de npm, configs y el patrón de carpetas por componente. **No** se copia
Next ni `next-intl`: aquí no hay SSR ni i18n (contenido sólo en español).

## Estructura de carpetas (objetivo)

```
src/
  main.tsx              punto de entrada
  App.tsx               router + layout raíz
  routes/
    Home.tsx            4 accesos al mismo nivel
    Prebattle.tsx       checklist plana
    Battle.tsx          selección de modo + bucle ronda/fase
    Postgame.tsx        checklist plana
  components/
    <Nombre>/<Nombre>.tsx
    <Nombre>/<Nombre>.module.css
    <Nombre>/<Nombre>.test.tsx
  store/
    estadoApp.ts         store zustand + persist (clave única de localStorage)
  data/
    prebattle.ts         ChecklistItem[]
    postgame.ts          ChecklistItem[]
    battle.ts            por fase: ChecklistItem[] + notas fijas
  lib/
    battle/fases.ts      avance de fase, cierre de ronda, limpieza de checklist (lógica pura)
    battle/fases.test.ts
  styles/
    tokens.css           custom properties (color, espaciado, tipografía)
    global.css           reset + base + helpers .stack / .row
  fonts/
    grenze-gotisch-*.woff2
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

- **`src/lib/`**: lógica pura (avance de ronda/fase, limpieza de checklist). Tests unitarios,
  entorno `node`.
- **`src/components/`** y **`src/store/`**: Testing Library + jsdom. Cubrir el bucle de
  Battle (completar checklist → habilitar "Siguiente fase" → cerrar ronda) y la
  rehidratación desde `localStorage`.

## Dependencias externas

- **mordheimer.net**: sólo enlaces `target="_blank" rel="noopener"`. Sin fetch, sin embed.
- **Fuente Grenze Gotisch**: self-hosted en `src/fonts/` (OFL). No se carga desde Google
  Fonts en runtime (uso potencial sin conexión en mesa).
