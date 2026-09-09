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

## 2026-09-09 — Copia de seguridad automática (hook `Stop`)

**Decisión:** `.claude/hooks/auto-commit.mjs`, disparado por el evento `Stop` desde
`.claude/settings.json` (a nivel de proyecto, no global).

**Motivo:** regla global del usuario ("commit y push tras cada tarea"). A nivel de proyecto
y no global para no lanzar `git push` en repos sin remoto o a medio conflicto en otras
carpetas. El script no bloquea a Claude, no falla ruidosamente y hace push sólo si la rama
tiene upstream. Mientras no haya remoto, sólo confirma en local.

**Pendiente:** crear el repo en GitHub y añadir `origin` para que el push empiece a
funcionar (ver `docs/todos.md`).
