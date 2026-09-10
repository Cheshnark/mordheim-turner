import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CONTENIDO_BATTLE } from '@/data/battle'
import { ESTADO_INICIAL, useEstadoApp } from '@/store/estadoApp'
import { Battle } from './Battle'

beforeEach(() => {
  localStorage.clear()
  useEstadoApp.setState(structuredClone(ESTADO_INICIAL))
})

const montar = () =>
  render(
    <MemoryRouter>
      <Battle />
    </MemoryRouter>,
  )

/** Marca todas las casillas visibles. */
async function marcarTodo(user: ReturnType<typeof userEvent.setup>) {
  for (const casilla of screen.getAllByRole('checkbox')) {
    await user.click(casilla)
  }
}

describe('Battle — selección de modo', () => {
  it('entra con el selector de modo y muestra dónde se retoma', () => {
    useEstadoApp.setState((s) => ({ battle: { ...s.battle, ronda: 3 } }))
    montar()
    expect(screen.getByText(/Vas por la/i)).toHaveTextContent('Ronda 3')
    expect(
      screen.getByRole('button', { name: /tutorial/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rápido/i })).toBeInTheDocument()
  })

  it('elegir Rápido entra al bucle y fija el modo en el store', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /rápido/i }))

    expect(useEstadoApp.getState().battle.modo).toBe('rapido')
    expect(
      screen.getByRole('heading', { name: /Fase 1 · Recuperación/i }),
    ).toBeInTheDocument()
    // En rápido no hay explicación ni enlace de fase.
    expect(screen.queryByText(/Rout test/i)).toBeNull()
    expect(
      screen.queryByRole('link', { name: /reglas de la fase/i }),
    ).toBeNull()
  })

  it('en Tutorial se ve la explicación de cada paso y el enlace de la fase', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /tutorial/i }))

    expect(screen.getByText(/Rout test/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /reglas de la fase/i }),
    ).toHaveAttribute('href', CONTENIDO_BATTLE.recuperacion.linkFase)
  })
})

describe('Battle — bucle', () => {
  it('"Siguiente fase" se habilita al marcar todo y avanza la fase', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /tutorial/i }))

    const siguiente = screen.getByRole('button', { name: /siguiente fase/i })
    expect(siguiente).toBeDisabled()

    await marcarTodo(user)
    expect(siguiente).toBeEnabled()

    await user.click(siguiente)
    expect(useEstadoApp.getState().battle.fase).toBe('movimiento')
    expect(useEstadoApp.getState().battle.ronda).toBe(1)
    expect(
      screen.getByRole('heading', { name: /Fase 2 · Movimiento/i }),
    ).toBeInTheDocument()
  })

  it('desde Combate el botón cierra la ronda: ronda += 1 y vuelve a Recuperación', async () => {
    useEstadoApp.setState((s) => ({
      battle: { ...s.battle, fase: 'combate', ronda: 2 },
    }))
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /rápido/i }))

    expect(screen.getByText(/se resuelve sí o sí/i)).toBeInTheDocument()

    const cerrar = screen.getByRole('button', { name: /cerrar ronda/i })
    await marcarTodo(user)
    await user.click(cerrar)

    const { ronda, fase, checklistFaseActual } = useEstadoApp.getState().battle
    expect(ronda).toBe(3)
    expect(fase).toBe('recuperacion')
    expect(checklistFaseActual).toEqual({})
  })

  it('el toggle cambia el modo en vivo sin perder el marcado', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /tutorial/i }))

    const [primera] = screen.getAllByRole('checkbox')
    await user.click(primera)
    expect(useEstadoApp.getState().battle.checklistFaseActual).not.toEqual({})

    await user.click(screen.getByRole('button', { name: /^rápido$/i }))
    expect(useEstadoApp.getState().battle.modo).toBe('rapido')
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
    expect(screen.queryByText(/Rout test/i)).toBeNull()
  })
})
