import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ORDEN_FASES } from '@/lib/battle/fases'
import { GlifoFase } from './GlifoFase'

describe('GlifoFase', () => {
  it('renderiza un svg decorativo (aria-hidden) para cada fase', () => {
    for (const fase of ORDEN_FASES) {
      const { container } = render(<GlifoFase fase={fase} />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg).toHaveAttribute('aria-hidden', 'true')
      expect(svg?.querySelector('path')).not.toBeNull()
    }
  })

  it('aplica la className recibida', () => {
    const { container } = render(<GlifoFase fase="combate" className="x" />)
    expect(container.querySelector('svg')?.getAttribute('class')).toBe('x')
  })
})
