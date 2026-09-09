import type { FaseTurno } from '@/store/tipos'

/** Orden cíclico de las fases del turno (handoff §3 y §5). */
export const ORDEN_FASES = [
  'recuperacion',
  'movimiento',
  'disparo',
  'combate',
] as const satisfies readonly FaseTurno[]

/**
 * Fase siguiente en el ciclo. Tras 'combate' vuelve a 'recuperacion'.
 * El cierre de ronda (ronda += 1 y limpieza del checklist) lo hace el store.
 */
export function faseSiguiente(fase: FaseTurno): FaseTurno {
  const i = ORDEN_FASES.indexOf(fase)
  return ORDEN_FASES[(i + 1) % ORDEN_FASES.length]
}

/** ¿Completar esta fase cierra la ronda? Solo la Fase 4 (Combate). */
export function cierraRonda(fase: FaseTurno): boolean {
  return fase === 'combate'
}
