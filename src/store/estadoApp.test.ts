import { beforeEach, describe, expect, it } from 'vitest'
import { CLAVE_PERSISTENCIA, ESTADO_INICIAL, useEstadoApp } from './estadoApp'

/** Copia profunda del estado en blanco (los tests mutan los mapas por acción). */
const estadoLimpio = () => structuredClone(ESTADO_INICIAL)

beforeEach(() => {
  localStorage.clear()
  useEstadoApp.setState(estadoLimpio())
})

describe('avanzarFase', () => {
  it('avanza a la fase siguiente sin tocar la ronda', () => {
    useEstadoApp.getState().avanzarFase()

    const { ronda, fase } = useEstadoApp.getState().battle
    expect(fase).toBe('movimiento')
    expect(ronda).toBe(1)
  })

  it('limpia el marcado de la fase al avanzar', () => {
    useEstadoApp.getState().alternarItemFase('rec-rout-test')
    expect(useEstadoApp.getState().battle.checklistFaseActual).toEqual({
      'rec-rout-test': true,
    })

    useEstadoApp.getState().avanzarFase()
    expect(useEstadoApp.getState().battle.checklistFaseActual).toEqual({})
  })

  it('desde combate cierra la ronda: ronda += 1 y vuelve a recuperación', () => {
    useEstadoApp.setState((s) => ({
      battle: { ...s.battle, fase: 'combate', ronda: 3 },
    }))

    useEstadoApp.getState().avanzarFase()

    const { ronda, fase, checklistFaseActual } = useEstadoApp.getState().battle
    expect(fase).toBe('recuperacion')
    expect(ronda).toBe(4)
    expect(checklistFaseActual).toEqual({})
  })

  it('recorre las cuatro fases y deja la ronda en 2', () => {
    for (let i = 0; i < 4; i++) useEstadoApp.getState().avanzarFase()

    const { ronda, fase } = useEstadoApp.getState().battle
    expect(fase).toBe('recuperacion')
    expect(ronda).toBe(2)
  })
})

describe('alternarItemFase', () => {
  it('marca y desmarca el mismo id', () => {
    const { alternarItemFase } = useEstadoApp.getState()

    alternarItemFase('rec-rally')
    expect(
      useEstadoApp.getState().battle.checklistFaseActual['rec-rally'],
    ).toBe(true)

    alternarItemFase('rec-rally')
    expect(
      useEstadoApp.getState().battle.checklistFaseActual['rec-rally'],
    ).toBe(false)
  })
})

describe('establecerModo', () => {
  it('cambia el modo sin tocar el resto de battle', () => {
    useEstadoApp.getState().establecerModo('rapido')

    const { modo, fase, ronda } = useEstadoApp.getState().battle
    expect(modo).toBe('rapido')
    expect(fase).toBe('recuperacion')
    expect(ronda).toBe(1)
  })
})

describe('checklists planas', () => {
  it('prebattle y postgame son independientes entre sí y de battle', () => {
    useEstadoApp.getState().alternarItemPrebattle('pre-escenario')
    useEstadoApp.getState().alternarItemPostgame('post-experiencia')

    const s = useEstadoApp.getState()
    expect(s.checklistPrebattle).toEqual({ 'pre-escenario': true })
    expect(s.checklistPostgame).toEqual({ 'post-experiencia': true })
    expect(s.battle.checklistFaseActual).toEqual({})
  })
})

describe('persistencia', () => {
  it('escribe el estado en la clave única de localStorage, sin acciones', () => {
    useEstadoApp.getState().establecerModo('rapido')
    useEstadoApp.getState().alternarItemPrebattle('pre-escenario')

    const crudo = localStorage.getItem(CLAVE_PERSISTENCIA)
    expect(crudo).not.toBeNull()

    const guardado = JSON.parse(crudo as string)
    expect(guardado.version).toBe(1)
    expect(guardado.state.battle.modo).toBe('rapido')
    expect(guardado.state.checklistPrebattle).toEqual({ 'pre-escenario': true })
    // partialize: las funciones no viajan a localStorage.
    expect(guardado.state).not.toHaveProperty('establecerModo')
    expect(guardado.state).not.toHaveProperty('avanzarFase')
  })

  it('rehidrata desde un localStorage previo al arrancar', async () => {
    localStorage.setItem(
      CLAVE_PERSISTENCIA,
      JSON.stringify({
        version: 1,
        state: {
          battle: {
            ronda: 5,
            fase: 'disparo',
            modo: 'rapido',
            checklistFaseActual: { 'dis-resolver': true },
          },
          checklistPrebattle: { 'pre-zonas-despliegue': true },
          checklistPostgame: {},
        },
      }),
    )

    await useEstadoApp.persist.rehydrate()

    const s = useEstadoApp.getState()
    expect(s.battle).toEqual({
      ronda: 5,
      fase: 'disparo',
      modo: 'rapido',
      checklistFaseActual: { 'dis-resolver': true },
    })
    expect(s.checklistPrebattle).toEqual({ 'pre-zonas-despliegue': true })
    // Las acciones siguen disponibles tras rehidratar.
    expect(typeof s.avanzarFase).toBe('function')
  })
})
