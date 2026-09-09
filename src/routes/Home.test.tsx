import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Home } from './Home'

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )
}

describe('Home', () => {
  it('enlaza a las tres pantallas internas', () => {
    renderHome()
    expect(screen.getByRole('link', { name: /prebattle/i })).toHaveAttribute(
      'href',
      '/prebattle',
    )
    expect(screen.getByRole('link', { name: /^battle/i })).toHaveAttribute(
      'href',
      '/battle',
    )
    expect(screen.getByRole('link', { name: /postgame/i })).toHaveAttribute(
      'href',
      '/postgame',
    )
  })

  it('abre mordheimer.net en pestaña nueva y fuera de la app', () => {
    renderHome()
    const externo = screen.getByRole('link', { name: /mordheimer\.net/i })
    expect(externo).toHaveAttribute('href', 'https://mordheimer.net')
    expect(externo).toHaveAttribute('target', '_blank')
    expect(externo).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })
})
