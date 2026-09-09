# Mordheim Turn Companion — Handoff para desarrollo

Documento de traspaso. Resume todas las decisiones de producto y diseño cerradas antes de empezar a programar. No incluye código de producción, solo especificación + un mockup HTML de referencia (`mordheim-battle-mockup.html`, ya generado) que sirve de guía visual para la pantalla de Battle.

## 1. Qué es esta app (y qué NO es)

Guía de apoyo para jugar partidas de Mordheim en mesa, con dos públicos:
- Jugadores novatos: no se les olvida ningún paso de cada fase.
- Jugadores veteranos: acceso rápido a la regla exacta sin tener que buscarla.

**Fuera de alcance explícitamente:**
- No es un gestor/creador de warbands (ya existe Rosterheim, no se duplica).
- No trackea partidas pasadas, estadísticas ni campañas.
- No sincroniza con el rival — uso 100% individual, un dispositivo por jugador. Si el rival no usa la app, no afecta en nada al funcionamiento.
- No reproduce el contenido de las reglas de Games Workshop ni de mordheimer.net — solo enlaza a él. mordheimer.net no tiene licencia abierta declarada (solo un aviso de que el contenido es copyright de GW); su único uso permitido es como enlace externo (`target="_blank"`), nunca scraping ni texto incrustado.

## 2. Arquitectura de navegación

Home con 4 accesos **al mismo nivel**, sin secuencia forzada — el usuario entra al que necesite en cada momento:

```
Home
├── Prebattle   → checklist plano
├── Battle      → elegir modo → loop ronda/fase
├── Postgame    → checklist plano
└── Mordheimer.net → enlace externo (target="_blank"), sale de la app
```

Sin backend. Todo el estado vive en cliente.

## 3. Modelo de estado

```ts
type FaseTurno = 'recuperacion' | 'movimiento' | 'disparo' | 'combate'

type EstadoBattle = {
  ronda: number
  fase: FaseTurno
  modo: 'tutorial' | 'rapido'
  checklistFaseActual: Record<string, boolean>  // por id de item
}

type EstadoApp = {
  battle: EstadoBattle
  checklistPrebattle: Record<string, boolean>
  checklistPostgame: Record<string, boolean>
}
```

Decisiones clave sobre este modelo:
- **No existe concepto de "turno mío / turno del rival"** en el estado. Solo hay Ronda + Fase, cíclico. La app no sabe ni gestiona de quién es el turno — eso lo lleva el jugador. Ver nota especial en la Fase de Combate (sección 5).
- Al terminar Fase 4 (Combate) y pulsar "Siguiente fase": `ronda += 1`, `fase = 'recuperacion'`, y se limpia `checklistFaseActual`. Sin pantalla de confirmación ni resumen de ronda — vuelve directo, sin fricción.
- El toggle **tutorial / rápido solo existe en Battle** (es lo único que se repite muchas veces por partida y donde molesta la repetición). Prebattle y Postgame no tienen este toggle: se hacen una vez por partida y siempre muestran su explicación breve.
- El modelo de datos de cada item de checklist es el mismo en tutorial y rápido — lo único que cambia es qué se renderiza:
  ```ts
  type ChecklistItem = {
    id: string
    texto_corto: string
    texto_explicado?: string   // solo se muestra en modo tutorial
    link_regla?: string        // solo se muestra en modo tutorial
  }
  ```

## 4. Persistencia

Un único `localStorage` (clave única, todo el `EstadoApp` serializado) que se actualiza en cada cambio de estado y se lee al abrir la app.

**Por qué:** en móvil, el navegador puede matar la pestaña en segundo plano (partidas largas, bloqueo de pantalla entre turnos, cambio de app). Sin persistencia, se perdería el punto exacto de la partida. No hay lógica especial por pantalla — es el mismo mecanismo para Prebattle, Battle y Postgame a la vez.

**Explícitamente descartado:** botón de "Nueva partida" / reset dedicado. Si el usuario quiere reiniciar, desmarca manualmente. Esto es una guía, no un tracker de partidas con historial.

## 5. Contenido — Battle (loop)

### Fase 1 — Recuperación
- ¿25% o más del warband fuera de combate? → Test de Desbandada (Rout test) contra Liderazgo del líder.
- Guerreros Estúpidos: si no están a 3" de un héroe aliado no estúpido, test de Estupidez.
- Guerreros derribados se levantan (no podrán correr ni cargar este turno).
- Guerreros aturdidos pasan a derribados.
- Guerreros en fuga: test de Rally (2D6 ≤ Liderazgo). No se puede intentar si el enemigo más cercano está más cerca que cualquier aliado.
- Link: `https://mordheimer.net/docs/rules/recovery`

### Fase 2 — Movimiento
- Declarar todas las cargas antes de mover a nadie.
- Resolver movimientos obligatorios (huida, etc.).
- Mover el resto de guerreros, uno a uno.
- No se puede correr si hay enemigos a 8" al empezar el turno.
- Declarar qué guerreros quedan ocultos.
- Casos especiales si aplica: saltos, escalada, caídas.
- Link: `https://mordheimer.net/docs/rules/movement`

### Fase 3 — Disparo
- Los modelos trabados en combate cuerpo a cuerpo NO disparan.
- Resolver disparos de los guerreros que puedan hacerlo.
- Link: `https://mordheimer.net/docs/rules/shooting`

### Fase 4 — Combate cuerpo a cuerpo
- **Nota fija siempre visible (no checkbox):** esta fase se resuelve sí o sí en cada ronda si hay modelos trabados, sin importar de quién es el turno — no es un paso que se pueda saltar por no ser "tu turno".
- Orden de golpes: mayor a menor Iniciativa (empates → dado).
- Excepción: quien se levantó en la Recuperación de este turno golpea siempre el último.
- Un modelo derribado en combate es golpeado automáticamente.
- Al final: si un guerrero lucha solo contra 2+ enemigos sin aliados a 6", test de Liderazgo o huye.
- Link: `https://mordheimer.net/docs/rules/close-combat`
- Al completar → `ronda += 1`, vuelve a Fase 1 (ver sección 3).

## 6. Contenido — Prebattle (checklist plano, sin modo tutorial/rápido)

- Escenario elegido y leído → `https://mordheimer.net/docs/campaigns/scenarios`
- Condición de fin de partida clara (uso interno del jugador; la app no la detecta ni la evalúa)
- Reglas especiales del escenario, si las hay
- Zonas de despliegue
- Quién empieza (tirada si el escenario no lo fija)

## 7. Contenido — Postgame (checklist plano, sin modo tutorial/rápido)

- Tiradas de heridas graves para los caídos → `https://mordheimer.net/docs/rules/wounds-and-injuries`
- Fase de exploración / búsqueda de tesoro, si el escenario la incluye → `https://mordheimer.net/docs/campaigns`
- Reparto de experiencia
- Nota fija (no checkbox): "La actualización de tu warband no se hace aquí — usa tu gestor de warband habitual (p. ej. Rosterheim)."

## 8. Diseño visual (tokens)

Contexto de uso: mesa de juego, luz variable, consulta rápida entre tiradas — prioridad absoluta a contraste y objetivos táctiles grandes sobre estética decorativa.

- Fondo: `#1A1614`
- Superficie (tarjetas): `#241F1C`
- Superficie secundaria: `#2E2723`
- Línea/borde: `#3A322C`
- Acento (acción principal / fase activa): `#8B3A3A`
- Acento suave (fondo de tarjeta destacada): `#5C2A2A`
- Texto principal: `#EDE6DC`
- Texto secundario: `#9C9086`
- Completado: `#5B7553`
- Link externo: `#C98A6A`

Tipografía: slab/serif con carácter para titulares (p. ej. Iowan Old Style/Georgia como fallback — evitar blackletter de fantasía genérico), sans-serif del sistema para todo el contenido operativo (checklists, botones).

Layout: una columna, botones grandes apilados (mín. ~50-56px de alto), sin cards redondeadas genéricas con sombra — bloques planos con borde fino, estilo hoja de referencia física. Sin animaciones decorativas; solo transición de estado (marcar/desmarcar item).

## 9. Referencia visual ya generada

`mordheim-battle-mockup.html` — mockup HTML navegable de: Home (4 botones) → selección de modo → loop de Battle con checklist de la Fase 1 (Recuperación), toggle tutorial/rápido en vivo, y botón "Siguiente fase" que se activa al completar el checklist. Usar como referencia de interacción, no como código final.

## 10. Abierto / a decisión de quien implemente

Nada queda pendiente a nivel de producto — todas las decisiones de flujo, contenido y persistencia están cerradas en este documento. Lo único no especificado es implementación de detalle (estructura de componentes, librería de estado si se usa alguna, testing), que queda a criterio de quien lo construya.
