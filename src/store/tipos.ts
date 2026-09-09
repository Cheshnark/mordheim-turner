/** Tipos de dominio. Fuente: docs/handoff.md §3. */

export type FaseTurno = 'recuperacion' | 'movimiento' | 'disparo' | 'combate'

export type ChecklistItem = {
  id: string
  texto_corto: string
  /** Solo se muestra en modo tutorial. */
  texto_explicado?: string
  /** Enlace externo a mordheimer.net. Solo se muestra en modo tutorial. */
  link_regla?: string
}

export type EstadoBattle = {
  ronda: number
  fase: FaseTurno
  modo: 'tutorial' | 'rapido'
  /** Marcado de la fase actual, por id de item. */
  checklistFaseActual: Record<string, boolean>
}

export type EstadoApp = {
  battle: EstadoBattle
  checklistPrebattle: Record<string, boolean>
  checklistPostgame: Record<string, boolean>
}
