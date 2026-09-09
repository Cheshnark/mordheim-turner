import { describe, expect, it } from 'vitest'
import type { FaseTurno } from '@/store/tipos'
import { ORDEN_FASES, cierraRonda, faseSiguiente } from './fases'

describe('faseSiguiente', () => {
  it('avanza en el orden del turno', () => {
    expect(faseSiguiente('recuperacion')).toBe('movimiento')
    expect(faseSiguiente('movimiento')).toBe('disparo')
    expect(faseSiguiente('disparo')).toBe('combate')
  })

  it('tras combate vuelve a recuperacion', () => {
    expect(faseSiguiente('combate')).toBe('recuperacion')
  })

  it('recorre las cuatro fases y vuelve al inicio', () => {
    let fase: FaseTurno = ORDEN_FASES[0]
    for (let i = 0; i < ORDEN_FASES.length; i++) fase = faseSiguiente(fase)
    expect(fase).toBe(ORDEN_FASES[0])
  })
})

describe('cierraRonda', () => {
  it('solo la fase de combate cierra la ronda', () => {
    expect(cierraRonda('combate')).toBe(true)
    expect(cierraRonda('recuperacion')).toBe(false)
    expect(cierraRonda('movimiento')).toBe(false)
    expect(cierraRonda('disparo')).toBe(false)
  })
})
