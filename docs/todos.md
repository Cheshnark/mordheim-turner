# Pendientes

## Prioridad alta

- [x] ~~Crear el repo en GitHub y añadir `origin`~~ — hecho 2026-09-09.
- [x] ~~Andamiaje Vite + React + TS~~ — hecho 2026-09-09. Base verde (lint/typecheck/test/build).
- [x] ~~`src/data/` con las checklists~~ — hecho 2026-09-09. `prebattle.ts`, `postgame.ts`
      (+ `NOTAS_POSTGAME`), `battle.ts` (`CONTENIDO_BATTLE` por fase, con `linkFase` y
      `notasFijas`), `checklists.test.ts` (21 asserts). Nada las consume aún.
- [x] ~~**Store zustand + `persist`**~~ — hecho 2026-09-10. `src/store/estadoApp.ts`
      (clave única `mordheim-turner`, `partialize`, 5 acciones) + `estadoApp.test.ts`
      (acciones, partialize, rehidratación; 9 asserts). Test total: 30/30.

## Prioridad media

- [x] ~~Pantallas reales que reemplacen los stubs~~ — hecho 2026-09-10. Battle
      (selección de modo + bucle con toggle tutorial/rápido, "Siguiente fase" /
      "Cerrar ronda"), Prebattle y Postgame consumen `useEstadoApp` + `src/data/`.
      Tests por pantalla. Test total: 48/48.
- [x] ~~Componente(s) de checklist reutilizable(s)~~ — hecho 2026-09-10.
      `src/components/ItemChecklist/` y `src/components/ListaChecklist/` (patrón carpeta,
      con test cada uno).
- [ ] **Capa visual grimdark** sobre checklists y fase activa (rojo sangre + filo
      wyrdstone). Las pantallas tienen hoy CSS estructural mínimo (tap targets, legible),
      no la estética final. Bloqueado por el mockup (ver "Pedir al usuario").
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
