import type { ChecklistItem } from '@/store/tipos'

/**
 * Postgame: checklist plana, sin modo tutorial/rápido (handoff §3).
 * Fuente: docs/handoff.md §7.
 */
export const CHECKLIST_POSTGAME: ChecklistItem[] = [
  {
    id: 'post-heridas-graves',
    texto_corto: 'Tiradas de heridas graves para los caídos',
    link_regla: 'https://mordheimer.net/docs/rules/wounds-and-injuries',
  },
  {
    id: 'post-exploracion',
    texto_corto: 'Fase de exploración / búsqueda de tesoro',
    texto_explicado: 'Solo si el escenario la incluye.',
    link_regla: 'https://mordheimer.net/docs/campaigns',
  },
  {
    id: 'post-experiencia',
    texto_corto: 'Reparto de experiencia',
    link_regla:
      'https://mordheimer.net/docs/campaigns/experience#earning-experience',
  },
]

/**
 * Nota siempre visible, sin checkbox (handoff §7).
 */
export const NOTAS_POSTGAME: string[] = [
  'La actualización de tu warband no se hace aquí: usa tu gestor de warband habitual (p. ej. Rosterheim).',
]
