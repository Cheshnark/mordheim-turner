# Negocio

## Objetivo

Una guía de apoyo para jugar partidas de **Mordheim** en mesa que evite olvidos de
secuencia y dé acceso inmediato a la regla exacta, sin sustituir al reglamento ni
reproducir su contenido.

## Usuarios

- **Jugador novato**: no se le olvida ningún paso de cada fase del turno.
- **Jugador veterano**: llega a la regla concreta sin buscarla en el libro.

Uso **individual**, un dispositivo por jugador. Que el rival use o no la app es
indiferente. Contexto físico: mesa de juego, luz variable, consultas rápidas entre
tiradas. Principal soporte esperado: **móvil y tablet**.

## Requisitos

- Cuatro accesos desde Home, al mismo nivel y sin secuencia forzada: **Prebattle**,
  **Battle**, **Postgame** y un enlace externo a **mordheimer.net**.
- **Battle**: bucle Ronda → 4 fases (Recuperación, Movimiento, Disparo, Combate) con
  checklist por fase y toggle **tutorial / rápido**.
- **Prebattle** y **Postgame**: checklists planas, con explicación breve siempre visible.
- **Persistencia total** del punto de la partida en `localStorage` (el navegador móvil
  puede matar la pestaña entre turnos).
- Enlaces a la regla en mordheimer.net que abren en pestaña nueva.

## Fuera de alcance (explícito)

- Gestor o creador de warbands (ya existe Rosterheim).
- Tracker de partidas, estadísticas o campañas.
- Sincronización con el rival.
- Reproducir el texto de las reglas de Games Workshop o de mordheimer.net. mordheimer.net
  no declara licencia abierta: su único uso permitido es **enlace externo**, nunca scraping
  ni texto incrustado.

## Restricciones legales

Todo el contenido de reglas es copyright de Games Workshop. La app sólo enlaza. Cualquier
texto propio debe ser reformulación operativa (checklist), no transcripción.
