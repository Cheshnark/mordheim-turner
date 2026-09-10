# Decisiones técnicas

Cada entrada: decisión, motivo y alternativas descartadas. Orden cronológico.

---

## 2026-09-09 — Vite + React, no Next

**Decisión:** SPA con Vite + React + TypeScript. Sin SSR/SSG.

**Motivo:** es una herramienta de uso individual en mesa, sin necesidad de posicionamiento
en buscadores ni de compartir URLs con preview. Next añadiría complejidad (rutas de
servidor, hidratación, build) sin beneficio. El proyecto hermano `mortgage-calculator` sí
usa Next porque allí el SEO importa; aquí no.

**Descartado:** Next.js, Astro. Revisar sólo si aparece un requisito de SEO o de enlaces
compartibles con metadatos.

---

## 2026-09-09 — Estado con Zustand + `persist`

**Decisión:** `zustand` con el middleware `persist` apuntando a una única clave de
`localStorage` con todo `EstadoApp`.

**Motivo:** el modelo de estado del handoff es pequeño y plano, pero se toca desde varias
pantallas y debe sobrevivir a que el navegador móvil mate la pestaña. `persist` da la
serialización completa en cada cambio y la rehidratación al arrancar sin código a medida.
Mismo stack que `mortgage-calculator` (familiaridad).

**Descartado:** `useReducer` + Context (habría que escribir la persistencia y la
rehidratación a mano); Redux (desproporcionado).

---

## 2026-09-09 — CSS Modules + design tokens, sin Tailwind

**Decisión:** estilos con CSS Modules por componente y un archivo `src/styles/tokens.css`
de custom properties. Dos o tres helpers globales de layout (`.stack`, `.row` con `gap`).
Sin Tailwind.

**Motivo:** la identidad visual es muy específica (grimdark, "hoja de referencia física",
texturas, viñeta). Con utilidades acabaríamos escribiendo valores arbitrarios constantes y
partiendo cada componente entre utilidades de layout y CSS para lo demás. La superficie es
pequeña (~12–15 componentes); la consistencia de espaciado se cubre con tokens. Cada
componente tiene todo su estilo en un sitio.

**Descartado:** Tailwind v4 (lo usa `mortgage-calculator`); esquema mixto Tailwind-para-
layout + CSS-para-el-resto (fricción en las costuras). Reconsiderar sólo si el número de
componentes crece mucho.

---

## 2026-09-09 — Tipografía: Grenze Gotisch + sans del sistema

**Decisión:**

- **Titulares:** `Grenze Gotisch` (Google Fonts, OFL), self-hosted, 1 peso. Fallback
  `Georgia, 'Times New Roman', serif`.
- **Todo lo operativo** (checklists, botones, labels, texto de tutorial): stack sans del
  sistema — `-apple-system, 'Segoe UI', Roboto, system-ui, sans-serif`.

**Motivo:** el handoff pide carácter "con vibe Mordheim" en titulares pero rechaza —con
razón— la blackletter de fantasía (ilegible, cliché). Grenze Gotisch es gótica y rota pero
legible en rótulos cortos. El texto operativo tiene que leerse de un vistazo con mala luz:
sans del sistema, coste cero, familiar. Máximo dos familias para no diluir la identidad.

**Descartado:** blackletter (UnifrakturCook, Pirata One): ilegible. `Cinzel`: alternativa
segura si Grenze Gotisch resulta excesiva. Serif del sistema para el texto de tutorial:
posible más adelante como segunda familia si hace falta distinguir esa prosa; de momento se
resuelve con tamaño/color.

---

## 2026-09-09 — Paleta y atmósfera

Base = tokens del handoff (§8). Añadidos para empujar la "vibe" sin romper el contraste:

| Token | Valor | Uso |
|---|---|---|
| `--fondo` | `#1A1614` | fondo de página |
| `--superficie` | `#241F1C` | tarjetas / bloques |
| `--superficie-2` | `#2E2723` | superficie secundaria |
| `--linea` | `#3A322C` | bordes, hairlines |
| `--acento` | `#8B3A3A` | acción principal / fase activa (rojo sangre seca) |
| `--acento-suave` | `#5C2A2A` | fondo de bloque destacado |
| `--texto` | `#EDE6DC` | texto principal (hueso) |
| `--texto-2` | `#9C9086` | texto secundario |
| `--completado` | `#5B7553` | item marcado (verde apagado) |
| `--enlace-externo` | `#C98A6A` | enlaces a mordheimer.net (ámbar de antorcha) |
| `--wyrdstone` | `#6F8F3E` *(ajustar al implementar; distinto de `--completado`)* | **segundo acento**: filo iluminado del paso activo, sólo ahí |

**Atmósfera (todo estático, sin animación):**

- **Viñeta:** oscurecido radial e irregular en los bordes del viewport.
- **Hollín / grano:** SVG `feTurbulence` al 2–3 % de opacidad sobre las superficies. Sin
  asset de imagen. Compatible con `prefers-reduced-motion` por ser estático.
- Hairlines ligeramente irregulares; inset tipo huella de imprenta en los bloques; items
  completados con aspecto de sellado/tachado.
- Enlaces externos con estilo de anotación al margen.

**Motivo:** un único acento rojo sobre negro es el "tema oscuro genérico" por defecto. El
segundo acento + la textura son lo que ancla el resultado en Mordheim. Nada de imágenes de
fondo tras el texto ni movimiento ambiental: el uso en mesa exige contraste y objetivos
táctiles grandes (handoff §8).

---

## 2026-09-10 — `avanzarFase` limpia el checklist en cada fase, no solo en Combate

**Decisión:** `avanzarFase` pone `checklistFaseActual = {}` en **todo** avance de fase. El
`ronda += 1` sí es exclusivo de salir de Combate (`cierraRonda`).

**Motivo:** `checklistFaseActual` es, por nombre y por modelo (handoff §3), el marcado de la
fase **actual**. Al pasar de Movimiento a Disparo, los ticks de Movimiento ya no significan
nada y la nueva fase debe entrar en blanco. El handoff solo menciona la limpieza al cerrar
Combate porque es el punto donde además cambia la ronda, no porque las fases 1→2→3 deban
conservar el marcado.

**Descartado:** un mapa de marcado por fase (`Record<FaseTurno, Record<string, boolean>>`).
No aporta nada: no hay "volver a la fase anterior" en el flujo y el estado se mantiene
mínimo.

---

## 2026-09-10 — Modo por defecto `tutorial`; sin acción de reset

**Decisión:** `ESTADO_INICIAL.battle.modo = 'tutorial'`. El store no expone ninguna acción
de reinicio.

**Motivo:** hay pantalla de selección de modo antes del bucle (handoff §2), así que el
valor inicial solo cuenta hasta que el usuario elige; `tutorial` es el que no oculta
información. El reset dedicado está descartado en el handoff §4 (el usuario desmarca a
mano); no se añade una acción que la UI no debe ofrecer.

---

## 2026-09-10 — "Estar en el bucle" de Battle es estado local, no del store

**Decisión:** `Battle.tsx` guarda `enBucle` con `useState`. Al entrar en `/battle`
siempre se ve primero la selección de modo, aunque `ronda`, `fase` y el marcado sigan
en `localStorage`.

**Motivo:** el handoff (§2, §9) describe el flujo como "elegir modo → bucle" cada vez
que entras a Battle. Volver a tocar Tutorial/Rápido es un gesto y además confirma el
contexto al retomar ("Vas por la Ronda 3 · Disparo"). Meter un flag en `EstadoApp`
obligaría a decidir si se persiste (y a limpiarlo), ensuciando un modelo que el handoff
quiere mínimo y sin reset.

**Descartado:** flag persistido `enPartida`; entrar directo al bucle saltándose el
selector si la partida no está "fresca" (heurística no pedida).

---

## 2026-09-10 — "Siguiente fase" bloqueado hasta marcar todo

**Decisión:** el botón de avance de fase está `disabled` hasta que todos los items de
la fase están marcados (mockup §9). Un paso que no aplica se marca igual.

**Motivo:** es el comportamiento del mockup de referencia y encaja con la naturaleza
de una checklist: "revisado y no aplica" también es un tick. Evita avances por
descuido saltándose pasos.

**Descartado:** permitir avanzar siempre; botón sin bloqueo con aviso. Reconsiderar si
en uso real molesta marcar pasos inaplicables (p. ej. Estupidez sin guerreros estúpidos).

---

## 2026-09-10 — Reconciliación con `mordheim-battle-mockup.html`

El boceto entró en el repo (`docs/`, fuera de Prettier). Es referencia de interacción y
layout, **no** código final (lo dice el propio `handoff.md` §9). Cómo se usa:

**Se adopta:** frame de una columna estrecha; estado "marcado" del item (borde
`--completado`, lavado verde muy sutil, caja con check en vez de raya sola);
`phase-track` de 4 puntos (done / activa / pendiente); toggle de modo discreto tipo
pill; en Home, Battle como acceso destacado y el enlace externo con borde discontinuo;
botón "Siguiente fase" a ancho completo, `disabled` hasta completar.

**Se rechaza:** la pill **"Mi turno"**. Contradice `handoff.md` §3 ("no existe turno
mío / del rival en el estado"). El boceto es anterior al cierre de esa decisión.

**Diverge a propósito** (ya decidido antes, se mantiene):

| Tema | Boceto | Proyecto |
|---|---|---|
| Titulares | Iowan Old Style / Georgia | Grenze Gotisch self-hosted (entrada 2026-09-09) |
| Textura | ninguna | viñeta + hollín `feTurbulence` estáticos |
| 2.º acento | ninguno | `--color-wyrdstone` como filo de la fase activa |
| Casilla | `<div>` con clase | `<input type="checkbox">` nativo (a11y) |
| Toggle modo | 1 botón que cicla | 2 botones con `aria-pressed` (a11y), con estilo pill |

---

## 2026-09-10 — Cómo se materializa el "momento audaz" de la fase activa

**Decisión:** en Battle, la cabecera de la fase (ronda + `pista` + título) es el único
bloque con acento fuerte: barra `--color-wyrdstone` + resplandor **contenido** en el
borde izquierdo (`--filo-activo`, box-shadow `inset`), lavado rojo tenue y regla
`--color-acento` de 2 px bajo el `<h1>`. El título **no** va en rojo (contraste
insuficiente sobre `--color-superficie`).

**Motivo:** `decisions.md` (2026-09-09) pide "rojo sangre + filo verde" solo ahí. El
primer intento con box-shadow no-inset creaba un halo alrededor de todo el bloque; el
inset lo mantiene como filo. El resto de la pantalla queda "callado".

**Descartado:** `<h1>` en `--color-acento` (falla WCAG AA); halo exterior wyrdstone
(demasiado ruido para uso en mesa).

- `--color-wyrdstone`: `#6f8f3e` → `#9fbe3b` (más luminoso y claramente distinto de
  `--color-completado` `#5b7553`).
- `pista` de fase: `<ol>` de 4 `<li>` con `aria-hidden` — el `<h1>` "Fase N · …" ya
  comunica la fase a lectores de pantalla; la pista es refuerzo visual.
- Toggle tutorial/rápido: se mantienen 2 botones con `aria-pressed` (a11y) pero con
  aspecto de pill discreta, como el botón único del boceto.

---

## 2026-09-10 — Grenze Gotisch: solo subconjunto latino, vía asset de Vite

**Decisión:** un único archivo `grenze-gotisch-latin-400.woff2` (subset `latin` de
Google Fonts, `unicode-range` U+0000–00FF + puntuación), en `src/fonts/`, referenciado
desde `global.css` con `url('../fonts/…')`. `font-display: swap`.

**Motivo:** el contenido es 100 % español; `latin` cubre acentos, `ñ`, `¿¡` y las
flechas `→ ↑ ↓` de la UI. Traer `latin-ext` y `vietnamese` (los otros dos subsets que
sirve Google) sería peso muerto. Referenciar como asset relativo deja que Vite lo
hashee y lo incluya en el build (16 kB); `public/` no lo versionaría igual de limpio.
`swap` porque el titular puede tardar y el fallback `Georgia` es aceptable un instante.

**Descartado:** fuente variable (Grenze Gotisch en Google no lo es en este eje);
cargar los tres subsets; `@import` desde Google Fonts en runtime (rompe uso offline).

---

## 2026-09-09 — Copia de seguridad automática (hook `Stop`)

**Decisión:** `.claude/hooks/auto-commit.mjs`, disparado por el evento `Stop` desde
`.claude/settings.json` (a nivel de proyecto, no global).

**Motivo:** regla global del usuario ("commit y push tras cada tarea"). A nivel de proyecto
y no global para no lanzar `git push` en repos sin remoto o a medio conflicto en otras
carpetas. El script no bloquea a Claude, no falla ruidosamente y hace push sólo si la rama
tiene upstream. Mientras no haya remoto, sólo confirma en local.

**Pendiente:** crear el repo en GitHub y añadir `origin` para que el push empiece a
funcionar (ver `docs/todos.md`).
