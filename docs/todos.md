# Pendientes

## Prioridad alta

- [x] ~~Crear el repo en GitHub y añadir `origin`~~ — hecho 2026-09-09.
- [x] ~~Andamiaje Vite + React + TS~~ — hecho 2026-09-09. Base verde (lint/typecheck/test/build).
- [ ] **`src/data/`** con las checklists de Prebattle, Battle (4 fases) y Postgame a partir de
      `handoff.md` §5–7, incluidos `texto_explicado` y `link_regla` de cada item, más las
      notas fijas (Fase de Combate §5, cierre de Postgame §7).
- [ ] **Store zustand + `persist`** (clave única de `localStorage`) + test de rehidratación.
      La acción de avance de fase usa `faseSiguiente` / `cierraRonda` (ya en `src/lib/battle/`)
      y limpia `checklistFaseActual` al cerrar ronda (`ronda += 1`, `fase = 'recuperacion'`).

## Prioridad media

- [ ] Pantallas reales que reemplacen los stubs: Battle (selección de modo + bucle con
      toggle tutorial/rápido), Prebattle, Postgame.
- [ ] Componente(s) de checklist reutilizable(s) en `src/components/` (patrón carpeta:
      `Nombre.tsx` + `Nombre.module.css` + `Nombre.test.tsx`).
- [ ] Capa visual grimdark sobre checklists y fase activa (rojo sangre + filo wyrdstone).
- [ ] Self-hostear **Grenze Gotisch** (woff2, subconjunto latino) en `src/fonts/` + `@font-face`.
- [ ] Ajustar `--color-wyrdstone` al implementar la fase activa (que no choque con `--color-completado`).

## Prioridad baja / abierto

- [ ] Decidir despliegue (GitHub Pages / Netlify / Vercel estático) y documentarlo.
- [ ] Icono / favicon con la estética de la app (ahora no hay favicon).
- [ ] Revisar si el texto de tutorial necesita una segunda familia tipográfica (serif del
      sistema) o basta con tamaño/color.
- [ ] `.env.example` si acaba habiendo alguna variable (hoy no hay backend → probablemente no).
- [ ] Revisar el tamaño del bundle si crece: el base ya son ~83 kB gzip (React + Router).

## Pedir al usuario

- [ ] El mockup `mordheim-battle-mockup.html` (referencia visual de Battle, `handoff.md` §9)
      no está en el repo.

## Bugs

_(ninguno)_
