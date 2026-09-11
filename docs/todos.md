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
- [x] ~~**Capa visual grimdark**~~ — hecho 2026-09-10. Estado "marcado" (borde
      `--completado` + lavado + tachado), `pista` de 4 tramos en Battle, cabecera de
      fase activa con filo wyrdstone contenido + regla roja, toggle pill, Home con
      Battle destacado y enlace externo discontinuo. Verificado en navegador. La pill
      "Mi turno" del boceto **no** se implementó (contradice handoff §3).
- [x] ~~Self-hostear **Grenze Gotisch**~~ — hecho 2026-09-10. `grenze-gotisch-latin-400.woff2`
      (1 peso, latino) + `OFL.txt` en `src/fonts/`; `@font-face` (`display: swap`) en
      `global.css`. Verificado en navegador.
- [x] ~~Ajustar `--color-wyrdstone`~~ — hecho 2026-09-10: `#6f8f3e` → `#9fbe3b`.
- [x] ~~Botones a pantalla completa en móvil~~ — hecho 2026-09-10. Home y selección de
      modo estiran los botones (`#root` flex column); `--toque-min` 56 px.
- [x] ~~2ª pasada "más Mordheim"~~ — hecho 2026-09-10. Running head + filete + inicial
      iluminada (`CabeceraPantalla`), casilla-sello, esquinas marcadas, textura de
      nube + tinte de borde, glifos de fase (`GlifoFase`). Descartado: rondas en
      romano. Detalle en `decisions.md`.

## Prioridad baja / abierto

- [x] ~~Empujar la identidad "chulísima"~~ — hecho por partes: wordmark (2026-09-10),
      glifos de fase macizos (2026-09-10), textura de superficies + marca de agua del
      glifo en la cabecera de Battle (2026-09-11, ver `decisions.md`).
- [ ] Confirmar visualmente en el navegador los cambios de 2026-09-11 (textura +
      marca de agua): el preview no arrancó esta sesión porque el spawner de
      `.claude/launch.json` no resuelve `npm` en su `PATH` (no es un problema del
      código). Reintentar cuando el entorno lo permita.

- [ ] Decidir despliegue (GitHub Pages / Netlify / Vercel estático) y documentarlo.
- [x] ~~Icono / favicon~~ — hecho 2026-09-10. `public/favicon.svg`: estrella fugaz propia
      (hueso + cola roja sobre fondo oscuro). No usa marcas de GW.
- [ ] Revisar si el texto de tutorial necesita una segunda familia tipográfica (serif del
      sistema) o basta con tamaño/color.
- [ ] `.env.example` si acaba habiendo alguna variable (hoy no hay backend → probablemente no).
- [ ] Revisar el tamaño del bundle si crece: el base ya son ~83 kB gzip (React + Router).

## Pedir al usuario

- [x] ~~El mockup `mordheim-battle-mockup.html`~~ — recibido y añadido a `docs/` (2026-09-10).

## Bugs

_(ninguno)_
