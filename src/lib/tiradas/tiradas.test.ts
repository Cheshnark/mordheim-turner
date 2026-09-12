import { describe, expect, it } from 'vitest'
import { tiradaHerir, tiradaImpactar } from './tiradas'

describe('tiradaImpactar', () => {
  it('atacante y defensor iguales → 4+', () => {
    expect(tiradaImpactar(3, 3)).toBe(4)
    expect(tiradaImpactar(1, 1)).toBe(4)
    expect(tiradaImpactar(10, 10)).toBe(4)
  })

  it('atacante por encima del defensor → 3+, por poco o por mucho', () => {
    expect(tiradaImpactar(4, 3)).toBe(3)
    expect(tiradaImpactar(10, 1)).toBe(3)
  })

  it('defensor por encima del atacante, hasta el doble → 4+', () => {
    expect(tiradaImpactar(3, 4)).toBe(4)
    expect(tiradaImpactar(3, 6)).toBe(4) // exactamente el doble, sigue en 4+
    expect(tiradaImpactar(1, 2)).toBe(4)
  })

  it('defensor por encima del doble del atacante → 5+', () => {
    expect(tiradaImpactar(3, 7)).toBe(5)
    expect(tiradaImpactar(1, 3)).toBe(5)
    expect(tiradaImpactar(4, 9)).toBe(5)
  })
})

describe('tiradaHerir', () => {
  it('fuerza y resistencia iguales → 4+', () => {
    expect(tiradaHerir(3, 3)).toBe(4)
  })

  it('fuerza 1 punto por encima → 3+; 2 o más → 2+ (suelo)', () => {
    expect(tiradaHerir(4, 3)).toBe(3)
    expect(tiradaHerir(5, 3)).toBe(2)
    expect(tiradaHerir(10, 1)).toBe(2)
  })

  it('resistencia 1 punto por encima → 5+; 2 o 3 puntos → 6+ (techo)', () => {
    expect(tiradaHerir(3, 4)).toBe(5)
    expect(tiradaHerir(3, 5)).toBe(6)
    expect(tiradaHerir(1, 4)).toBe(6)
  })

  it('resistencia 4 puntos o más por encima → imposible (null)', () => {
    expect(tiradaHerir(1, 5)).toBeNull()
    expect(tiradaHerir(2, 10)).toBeNull()
  })
})
