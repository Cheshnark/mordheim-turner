import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { cierraRonda, faseSiguiente } from '@/lib/battle/fases'
import type { EstadoApp, EstadoBattle } from '@/store/tipos'

/** Clave única de `localStorage` con todo `EstadoApp` serializado (handoff §4). */
export const CLAVE_PERSISTENCIA = 'mordheim-turner'

/** Versión del esquema persistido; súbela si cambia la forma de `EstadoApp`. */
const VERSION_PERSISTENCIA = 1

/** Estado de partida en blanco. Ronda 1, primera fase, modo tutorial por defecto. */
export const ESTADO_INICIAL: EstadoApp = {
  battle: {
    ronda: 1,
    fase: 'recuperacion',
    modo: 'tutorial',
    checklistFaseActual: {},
  },
  checklistPrebattle: {},
  checklistPostgame: {},
}

export type AccionesApp = {
  /** Fija el modo de Battle. El toggle solo existe en esa pantalla (handoff §3). */
  establecerModo: (modo: EstadoBattle['modo']) => void
  /** Marca/desmarca un item de la fase actual de Battle. */
  alternarItemFase: (id: string) => void
  /**
   * Avanza a la fase siguiente y limpia `checklistFaseActual` (los marcados son
   * de esa fase). Si la fase actual es Combate, además cierra la ronda:
   * `ronda += 1` y vuelve a Recuperación (handoff §3, §5).
   */
  avanzarFase: () => void
  /** Marca/desmarca un item de la checklist de Prebattle. */
  alternarItemPrebattle: (id: string) => void
  /** Marca/desmarca un item de la checklist de Postgame. */
  alternarItemPostgame: (id: string) => void
}

export type StoreApp = EstadoApp & AccionesApp

const alternar = (mapa: Record<string, boolean>, id: string) => ({
  ...mapa,
  [id]: !mapa[id],
})

export const useEstadoApp = create<StoreApp>()(
  persist(
    (set) => ({
      ...ESTADO_INICIAL,

      establecerModo: (modo) => set((s) => ({ battle: { ...s.battle, modo } })),

      alternarItemFase: (id) =>
        set((s) => ({
          battle: {
            ...s.battle,
            checklistFaseActual: alternar(s.battle.checklistFaseActual, id),
          },
        })),

      avanzarFase: () =>
        set((s) => ({
          battle: {
            ...s.battle,
            ronda: cierraRonda(s.battle.fase)
              ? s.battle.ronda + 1
              : s.battle.ronda,
            fase: faseSiguiente(s.battle.fase),
            checklistFaseActual: {},
          },
        })),

      alternarItemPrebattle: (id) =>
        set((s) => ({
          checklistPrebattle: alternar(s.checklistPrebattle, id),
        })),

      alternarItemPostgame: (id) =>
        set((s) => ({
          checklistPostgame: alternar(s.checklistPostgame, id),
        })),
    }),
    {
      name: CLAVE_PERSISTENCIA,
      version: VERSION_PERSISTENCIA,
      storage: createJSONStorage(() => localStorage),
      // Solo datos: las acciones no se serializan.
      partialize: (s) => ({
        battle: s.battle,
        checklistPrebattle: s.checklistPrebattle,
        checklistPostgame: s.checklistPostgame,
      }),
    },
  ),
)
