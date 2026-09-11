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
| ~~`--completado`~~ | — | **eliminado 2026-09-10** (dos colores). Item marcado = fila hundida + tinta apagada, sin color |
| `--enlace-externo` | `#C98A6A` | enlaces a mordheimer.net (ámbar de antorcha) |
| ~~`--wyrdstone`~~ | — | **eliminado 2026-09-10** (dos colores). El filo del paso activo pasa a rojo |

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

## 2026-09-10 — Lanzadores a pantalla completa; retoques de atmósfera

**Decisión:** Home y la selección de modo de Battle son lanzadores (4 y 2 accesos, nada
más), así que sus botones reparten **todo** el alto disponible: `#root` pasa a
`display: flex; flex-direction: column` y cada `<main>` de lanzador lleva `flex: 1`,
con `min-height` de suelo (4.5–5 rem) y **sin** `max-height`. `--toque-min` 52 → 56 px.
Las tres pantallas de checklist siguen siendo listas con scroll: solo suben el alto de
fila vía el token.

**Motivo:** uso en mesa, luz mala, un toque por pantalla (handoff §8). En un lanzador,
el espacio muerto no aporta; en una lista, estirar filas sí estorbaría.

**Descartado:** `max-height` en los botones (probado: con 2 accesos dejaba medio
viewport vacío); tope global en `.stack` (está sobrecargado en varios sitios).

**Atmósfera añadida (estática):**

- Inicial iluminada: `::first-letter` de los `<h1>` de pantalla en `--color-acento`
  (grande en Prebattle/Postgame/Battle-modo; solo color en el título de Home). No en
  el título de fase de Battle.
- Resplandor cálido de antorcha: 2.ª capa `radial-gradient` ámbar al 7 % arriba del
  `body`, sobre la viñeta.

---

## 2026-09-10 — Segunda pasada de estética "más Mordheim"

Añadidos, todos estáticos, con el rojo/wyrdstone aún **exclusivo** de la fase activa:

- **Running head + filete + inicial iluminada** → `CabeceraPantalla` (Prebattle,
  Postgame, selección de modo de Battle). El bucle de Battle **no** lo usa: su
  cabecera es el "momento audaz" y no debe competir.
- **Casilla como sello de tinta**: `<input>` nativo con `appearance: none`; sin marcar
  = caja vacía, marcada = aspa de tinta en `--color-completado`, ligeramente girada.
  Sigue siendo `type="checkbox"` (rol, foco y `checked` intactos → tests sin cambios).
- **Esquinas marcadas** en los items de checklist (clave de mapa). Se mantiene el
  hairline completo; al marcar, borde + esquinas pasan a verde (la señal no depende
  solo de las esquinas).
- **Textura**: 2.ª capa `body::after` de "nube" gruesa al 2,2 % sobre el hollín fino;
  tinte cálido en el borde superior de las tarjetas. Nada de grano nuevo tras el
  texto de los párrafos.
- **Glifos de fase** (`GlifoFase`): trazo tipo xilografía, motivos **genéricos**
  (alzarse, senda, flecha, espadas cruzadas). Sin la cometa de Mordheim ni runas de
  facción (iconografía de GW). Color `--color-texto-2`, decorativo (`aria-hidden`).

**Descartado a petición del usuario:** números de ronda en romano (peor escaneo).

**Contradicciones resueltas:** cometa GW → motivos genéricos; "solo la fase activa
es audaz" → adornos monocromos y tenues; esquinas vs. señal de marcado → hairline
completo + esquinas; textura vs. "sin fondo tras el texto" → tinte de borde, no grano.

---

## 2026-09-10 — Dos colores (fuera el verde) + sin assets de Games Workshop

**Supersede** la parte de paleta de "2026-09-09 — Paleta y atmósfera" y toda decisión
posterior sobre `--color-wyrdstone` / `--color-completado`.

**Decisión de color:** la identidad es de **dos colores**: neutros grimdark (negros y
marrones del handoff §8, más el hueso del texto) **+ un único acento rojo**
(`--color-acento`). Se eliminan `--color-wyrdstone`, `--color-completado` y
`--lavado-completado`.

- **Fase activa** (`--filo-activo`): filo + resplandor **rojo** a la izquierda de la
  cabecera, sin regla/subrayado bajo el título (no gustaba).
- **Item marcado:** sin color. La fila se hunde al nivel de `--color-fondo`, la casilla
  se sella en tinta apagada (`--color-texto-2`) con aspa a hueco, texto tachado. El
  rojo se reserva para lo activo/CTA/versal, no para "hecho".
- **Pista de fase:** `hecha` = `--color-texto-2`; `activa` = `--color-acento`;
  `pendiente` = `--color-linea`.
- `--color-enlace-externo` (ámbar) se mantiene: es un marrón desaturado de la familia
  neutra y marca "sale de la app". Reconsiderable.

**Motivo:** decisión del usuario. El segundo acento verde se había añadido el 09-09
para huir del "tema oscuro genérico"; el usuario prefiere explícitamente el par
negro/marrón + rojo y lo asume.

**Decisión de assets — no se usan recursos de Games Workshop.** El usuario propuso
incrustar el logotipo de Mordheim, la cometa de dos colas e iconos/arte de GW
argumentando "uso privado". Se descarta:

- Uso privado no elimina copyright ni marca; solo baja la probabilidad de que se
  persiga. GW es especialmente activa defendiendo su IP.
- `handoff.md` §1 y `CLAUDE.md` ya fijan "solo enlaces, nunca assets incrustados".
- `todos.md` contempla despliegue: en cuanto salga del equipo, los assets de GW pasan
  a ser un pasivo.

**En su lugar:** nombrar "Mordheim" como texto (uso nominativo legítimo); tipografía
Grenze Gotisch (OFL) para los titulares; ornamento propio de "estrella fugaz" (una
cola, no la cometa bicola de GW) en `CabeceraPantalla` y en `public/favicon.svg`;
glifos de fase propios (`GlifoFase`).

**Control "volver":** deja de ser un `<a>` subrayado; es una etiqueta de navegación
(versalitas espaciadas, chevrón, sin subrayado, `hover` que aclara). Clase global
`.volver` en `global.css`, reutilizada por `CabeceraPantalla` y el bucle de Battle.

---

## 2026-09-10 — El modo rápido de Battle es solo referencia (sin casillas)

**Decisión:** en modo rápido, la lista de pasos de la fase se renderiza **sin casillas**
(`ItemChecklist interactivo={false}`, viñeta en vez de checkbox) y el botón "Siguiente
fase" / "Cerrar ronda" está **siempre activo**. Se añade el enlace a la regla de la fase
(`linkFase`) también en rápido, no solo en tutorial.

**Motivo (usuario):** quien juega en rápido ya se sabe las fases; obligar a marcar todo
para avanzar es fricción sin valor. Rápido = hoja de referencia de los pasos + acceso a
la regla si hay dudas. El estado marcado sigue viviendo en el store (al volver a tutorial
se conserva), simplemente no se muestra en rápido.

**Diverge de:** `handoff.md` §9 / el mockup, que mostraban rápido con casillas y el botón
bloqueado igual que tutorial.

**Pendiente si se quiere:** los datos de `src/data/battle.ts` solo tienen `linkFase` (un
enlace por fase), no `link_regla` por paso. Para enlaces por paso habría que añadirlos.

---

## 2026-09-10 — Nombre del producto: "Turnheim"

**Decisión:** la app se llama **Turnheim** ("turn" + sufijo locativo "-heim"), subtítulo
"Compañero de turno para Mordheim". Cambia el `<h1>` de Home, el `<title>`, la
`meta description` y el README.

**Motivo:** no construir la identidad del producto sobre la marca de GW. "Turnheim" es un
nombre propio y acuñado (dice qué hace la app); "para Mordheim" en el subtítulo es uso
nominativo. Coherente con la decisión de 2026-09-10 sobre assets de GW.

**No cambia:** el nombre del paquete/repo (`mordheim-turner`) ni el remoto de git — son
internos. Renombrables aparte si hace falta.

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

---

## 2026-09-11 — Tinte de superficie compartido + marca de agua del glifo de fase

**Decisión:** el degradado de "papel envejecido" (`rgb(201 138 106 / 0.045)` → transparente)
que ya llevaban `ItemChecklist` y el botón de modo de Battle pasa a un único token,
`--tinte-superficie` (`tokens.css`), y se aplica también a las notas fijas de Battle y
Postgame (`.nota`), que antes eran las únicas superficies planas sin esa textura.

**Motivo:** era la parte de "textura de superficies" que quedaba abierta en
`docs/project_state.md` desde la 2ª pasada de estética (09-10): el tinte existía pero solo
en dos de los cuatro tipos de bloque plano de la app. Centralizarlo en un token evita que
un quinto bloque futuro se quede fuera por copiar-pegar el valor a medias.

**Marca de agua del glifo de fase (la parte "opcional" del pendiente):** en la cabecera del
bucle de Battle (`.cabecera`), se añade una segunda instancia de `GlifoFase` —la misma fase
activa, a 6.5rem, `opacity: 0.06`, `color: var(--color-texto-2)`— recortada al borde derecho
de la cabecera (`overflow: hidden` + posición absoluta). Decorativa (`aria-hidden` heredado
del componente), monocroma: no compite con el rojo de la fase activa ni con la ya existente
inicial iluminada de `CabeceraPantalla` (que Battle-bucle no usa).

**Verificación:** `lint`/`typecheck`/`format:check`/`test` (55/55)/`build` verdes. No se pudo
verificar en el preview del navegador esta sesión: el spawner de `.claude/launch.json` no
resuelve `npm` en su entorno (falta Node en su `PATH`, distinto del `PATH` de la shell del
proyecto). No es un problema del código ni de `launch.json` en sí —se probó `npm.cmd` y una
ruta absoluta a la instalación de nvm, y solo la segunda funcionaba, pero es específica de
esta máquina/versión de Node, así que no se ha dejado en el archivo versionado. Pendiente
confirmar visualmente en cuanto el preview funcione.
