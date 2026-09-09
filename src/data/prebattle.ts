import type { ChecklistItem } from '@/store/tipos'

/**
 * Prebattle: checklist plana, sin modo tutorial/rápido (handoff §3).
 * `texto_explicado` y `link_regla` se muestran siempre en esta pantalla.
 * Fuente: docs/handoff.md §6.
 */
export const CHECKLIST_PREBATTLE: ChecklistItem[] = [
  {
    id: 'pre-escenario',
    texto_corto: 'Escenario elegido y leído',
    link_regla: 'https://mordheimer.net/docs/campaigns/scenarios',
  },
  {
    id: 'pre-condicion-fin',
    texto_corto: 'Condición de fin de partida clara',
    texto_explicado:
      'Uso interno del jugador; la app no la detecta ni la evalúa.',
  },
  {
    id: 'pre-reglas-especiales',
    texto_corto: 'Reglas especiales del escenario, si las hay',
  },
  {
    id: 'pre-zonas-despliegue',
    texto_corto: 'Zonas de despliegue',
  },
  {
    id: 'pre-quien-empieza',
    texto_corto: 'Quién empieza',
    texto_explicado: 'Tirada si el escenario no lo fija.',
  },
]
