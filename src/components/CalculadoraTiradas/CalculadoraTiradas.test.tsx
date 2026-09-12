import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CalculadoraTiradas } from './CalculadoraTiradas'

/** Por defecto una ruta que no es Home: el caso "arriba" (mayoría de pantallas). */
const montar = (ruta = '/battle') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <CalculadoraTiradas />
    </MemoryRouter>,
  )

describe('CalculadoraTiradas', () => {
  it('en Home el disparador va abajo; en el resto de rutas, arriba', () => {
    const { unmount } = montar('/')
    expect(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    ).toHaveAttribute('data-posicion', 'abajo')
    unmount()

    montar('/battle')
    expect(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    ).toHaveAttribute('data-posicion', 'arriba')
  })

  it('empieza cerrada y se abre al pulsar el disparador', () => {
    montar()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    )

    expect(
      screen.getByRole('dialog', { name: /calculadora de tiradas/i }),
    ).toBeInTheDocument()
  })

  it('Impactar arranca en 3 vs 3 y reacciona a los contadores', () => {
    montar()
    fireEvent.click(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    )

    expect(screen.getByText('Necesitas 4+')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /subir ha\/hp — atacante/i,
      }),
    )
    expect(screen.getByText('Necesitas 3+')).toBeInTheDocument()
  })

  it('cambia a Herir y muestra "Imposible herir" cuando corresponde', () => {
    montar()
    fireEvent.click(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Herir' }))

    expect(screen.getByText('Necesitas 4+')).toBeInTheDocument()

    const bajarResistencia = screen.getByRole('button', {
      name: /bajar resistencia/i,
    })
    fireEvent.click(bajarResistencia)
    fireEvent.click(bajarResistencia)
    // Fuerza 3 vs Resistencia 1 → diferencia +2 → suelo de 2+.
    expect(screen.getByText('Necesitas 2+')).toBeInTheDocument()

    const subirResistencia = screen.getByRole('button', {
      name: /subir resistencia/i,
    })
    for (let i = 0; i < 6; i++) fireEvent.click(subirResistencia)
    // Fuerza 3 vs Resistencia 7 → diferencia -4 → imposible.
    expect(screen.getByText('Imposible herir')).toBeInTheDocument()
  })

  it('se cierra con el botón de cerrar', () => {
    montar()
    fireEvent.click(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    )
    fireEvent.click(screen.getByRole('button', { name: /cerrar calculadora/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('se cierra al pulsar fuera del diálogo', () => {
    montar()
    fireEvent.click(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    )
    const dialogo = screen.getByRole('dialog')
    // El overlay es el padre inmediato del diálogo.
    fireEvent.click(dialogo.parentElement!)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('se cierra con Escape', () => {
    montar()
    fireEvent.click(
      screen.getByRole('button', { name: /abrir calculadora de tiradas/i }),
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
