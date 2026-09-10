import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CabeceraPantalla } from './CabeceraPantalla'

const montar = (props: Parameters<typeof CabeceraPantalla>[0]) =>
  render(
    <MemoryRouter>
      <CabeceraPantalla {...props} />
    </MemoryRouter>,
  )

describe('CabeceraPantalla', () => {
  it('muestra el título como encabezado y enlaza a Home por defecto', () => {
    montar({ titulo: 'Prebattle' })
    expect(
      screen.getByRole('heading', { level: 1, name: 'Prebattle' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('respeta un destino de vuelta personalizado', () => {
    montar({ titulo: 'Battle', volverA: '/battle' })
    expect(screen.getByRole('link', { name: /volver/i })).toHaveAttribute(
      'href',
      '/battle',
    )
  })
})
