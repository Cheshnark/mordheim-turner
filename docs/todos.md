# Pendientes

## Prioridad alta

- [ ] **Andamiaje Vite + React + TS** (sesión nueva). Ver `docs/project_state.md` → "Siguiente paso".
- [ ] **Crear el repo en GitHub y añadir `origin`** para que el hook de copia de seguridad
      empiece a hacer push. Requiere instalar `gh` CLI o crear el repo por web.

## Prioridad media

- [ ] `src/data/` con las checklists de Prebattle, Battle (4 fases) y Postgame a partir de
      `handoff.md` §5–7, incluidos `texto_explicado` y `link_regla` de cada item.
- [ ] `src/lib/battle/fases.ts` + tests: avance de fase, cierre de ronda (`ronda += 1`,
      `fase = 'recuperacion'`, limpieza de `checklistFaseActual`).
- [ ] Store zustand + `persist` (clave única de `localStorage`) + test de rehidratación.
- [ ] Pantallas: Home (4 accesos), Battle (selección de modo + bucle), Prebattle, Postgame.
- [ ] `src/styles/tokens.css` con la paleta de `decisions.md`; helpers `.stack` / `.row`.
- [ ] Self-hostear **Grenze Gotisch** (woff2, subconjunto latino) en `src/fonts/`.
- [ ] Viñeta + textura de hollín SVG estática; verificar con `prefers-reduced-motion`.
- [ ] Notas fijas (no checkbox): Fase de Combate (handoff §5) y cierre de Postgame (§7).

## Prioridad baja / abierto

- [ ] Decidir despliegue (GitHub Pages / Netlify / Vercel estático) y añadirlo a `docs/`.
- [ ] `.env.example` si acaba habiendo alguna variable (hoy no hay backend → probablemente no).
- [ ] Revisar si el texto de tutorial necesita una segunda familia tipográfica (serif del
      sistema) o basta con tamaño/color.
- [ ] Icono / favicon con la estética de la app.

## Pedir al usuario

- [ ] El mockup `mordheim-battle-mockup.html` (referencia visual de Battle, `handoff.md` §9)
      no está en el repo.

## Bugs

_(ninguno)_
