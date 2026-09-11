# Despliegue

_Última actualización: 2026-09-11_

## Modelo: GitHub Pages, publicado por GitHub Actions

El repo es público y la app es 100 % cliente (sin backend), así que GitHub Pages sirve sin
más: gratis, sin cuenta nueva, y `.github/workflows/ci.yml` ya hace `build` en cada push.
Se descartaron Netlify/Vercel por no aportar nada aquí — no hay funciones de servidor,
redirects dinámicos ni preview deploys que se echen en falta (comparar con la decisión
_2026-09-08_ de `../mortgage-calculator`, que por el mismo motivo tira de export estático a
servidor propio en vez de Vercel; aquí no hay ese servidor propio, así que Pages es más
simple que montar uno solo para esto).

**URL de producción:** `https://cheshnark.github.io/mordheim-turner/`

## Cómo funciona

Un único workflow, `.github/workflows/ci.yml`:

1. **`verify`** (push y PR a `main`): `npm ci` → lint → typecheck → test → `npm run build`.
   Después duplica `dist/index.html` como `dist/404.html` (ver más abajo). En PRs se queda
   ahí: valida que el build no rompe, no publica nada.
2. **`deploy`** (solo push a `main`, tras `verify`): sube `dist/` con
   `actions/upload-pages-artifact` y lo publica con `actions/deploy-pages`. Usa el entorno
   `github-pages` y su propio grupo de concurrencia (`pages`, sin cancelar en curso) —
   recomendación de GitHub para no pisar una publicación a medias.

**Paso manual único, una sola vez:** en GitHub, Settings → Pages → "Build and deployment" →
Source → **GitHub Actions** (no "Deploy from a branch"). Sin esto el workflow sube el
artefacto pero no hay sitio que lo sirva. No se puede hacer por API sin token — hay que
tocarlo desde la web.

## `base` de Vite y la subruta del sitio de proyecto

GitHub Pages sirve el repo en `usuario.github.io/<repo>/`, no en la raíz del dominio. Sin
avisar a Vite de esa subruta, todas las URLs absolutas (`/assets/...`, `/favicon.svg`)
apuntarían a la raíz real de `github.io` y romperían.

`vite.config.ts`:

```ts
base: mode === 'production' ? '/mordheim-turner/' : '/',
```

`mode` y no `command`: `vite preview` usa `command: 'serve'` igual que `vite dev`, así que
condicionar por `command` deja `vite preview` sirviendo con `base: '/'` mientras el HTML ya
construido pide todo bajo `/mordheim-turner/` — 404 en todos los assets. `mode` sí distingue
bien los tres casos (`development` en dev, `test` en Vitest, `production` en build y en
preview).

`src/main.tsx` pasa esa misma base al router: `<BrowserRouter basename={import.meta.env.BASE_URL}>`.
Sin el `basename`, los enlaces internos (`<Link to="/battle">`) generarían `/battle` en vez
de `/mordheim-turner/battle`.

## `404.html`: recargar o enlazar directo a una ruta

GitHub Pages es un servidor de ficheros estático: no sabe que `/mordheim-turner/battle` es
una ruta de React Router, así que sin nada más devuelve un 404 real al recargar ahí o al
abrir un enlace directo (no solo navegando desde Home).

Truco estándar para SPA en Pages: GitHub sirve `404.html` para cualquier ruta que no exista
como archivo. Si `404.html` es un calco de `index.html`, el navegador arranca la misma app
en la URL que el usuario pidió (la barra de direcciones no cambia), y React Router —con el
`basename` correcto— resuelve la ruta real desde ahí. `verify` lo genera con
`cp dist/index.html dist/404.html` después del build, así nunca se desincroniza de los
nombres de archivo con hash de cada build.

## Actualizar

Nada manual: push a `main` (o mergear un PR) dispara `verify` → `deploy`. Con los tests
verdes, en unos 1–2 minutos el cambio está en producción. Revisar el estado en la pestaña
Actions del repo, o en Settings → Pages (enlace a la última publicación).

## Verificado

- Build local con `mode=production`: `dist/index.html` referencia
  `/mordheim-turner/assets/...` y `/mordheim-turner/favicon.svg`.
- `vite preview` sirviendo ese `dist/` (puerto local, no GitHub): Home carga bajo
  `/mordheim-turner/`, los `<Link>` internos ya llevan el prefijo, y un deep-link directo a
  `/mordheim-turner/battle` renderiza Battle (no cae a Home) — mismo mecanismo que usará
  `404.html` en Pages.
- Primer intento de publicación real (push `61505c2`): el job `deploy` falló con
  `Failed to create deployment ... Ensure GitHub Pages has been enabled` — exactamente el
  paso manual de Settings → Pages de más arriba, que todavía no se había hecho. `verify`
  había pasado bien; el build en sí nunca fue el problema.
- Hecho el paso manual (Source → GitHub Actions). Push siguiente (`8e7429b`): `deploy`
  en verde, `https://cheshnark.github.io/mordheim-turner/` responde 200. **Publicado.**
