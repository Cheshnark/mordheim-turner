/**
 * Calculadoras de tiradas de Impactar (cuerpo a cuerpo) y Herir.
 *
 * Tablas verificadas pixel a pixel contra las imágenes oficiales que usa
 * mordheimer.net ("To Hit chart" y "Wound chart", ambas escaneadas del
 * reglamento), no contra el widget interactivo de esa misma página: ese
 * widget no actualiza la tirada cuando la Habilidad de Combate del defensor
 * supera a la del atacante (bug confirmado a mano, no se reproduce aquí).
 *
 * Rango cubierto: 1-10, el mismo que imprimen ambas tablas.
 */

/** Límites de las tablas fuente. Fuera de este rango no hay dato verificado. */
export const TIRADAS_MIN = 1
export const TIRADAS_MAX = 10

/**
 * Impactar en cuerpo a cuerpo: compara la Habilidad de Combate (WS) del
 * atacante con la del defensor.
 *
 * - Atacante > defensor: 3+ (siempre, por mucha diferencia que haya).
 * - Igual: 4+.
 * - Defensor > atacante, hasta el doble: 4+.
 * - Defensor > el doble del atacante: 5+.
 */
export function tiradaImpactar(wsAtacante: number, wsDefensor: number): number {
  if (wsAtacante > wsDefensor) return 3
  if (wsAtacante === wsDefensor) return 4
  return wsDefensor > wsAtacante * 2 ? 5 : 4
}

/**
 * Herir: compara la Fuerza del atacante con la Resistencia del objetivo.
 * `null` = imposible herir (la Resistencia le saca 4 puntos o más a la Fuerza).
 */
export function tiradaHerir(
  fuerza: number,
  resistencia: number,
): number | null {
  const diferencia = fuerza - resistencia
  if (diferencia >= 2) return 2
  if (diferencia === 1) return 3
  if (diferencia === 0) return 4
  if (diferencia === -1) return 5
  if (diferencia >= -3) return 6
  return null
}
