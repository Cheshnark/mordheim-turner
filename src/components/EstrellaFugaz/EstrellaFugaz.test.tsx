import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EstrellaFugaz } from './EstrellaFugaz'

describe('EstrellaFugaz', () => {
  it('es un svg decorativo con el tamaño pedido', () => {
    const { container } = render(<EstrellaFugaz size={22} className="x" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('width', '22')
    expect(svg?.getAttribute('class')).toBe('x')
    expect(svg?.querySelectorAll('path')).toHaveLength(2)
  })
})
