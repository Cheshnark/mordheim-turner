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

/** Marca todas las casillas visibles (solo existen en modo tutorial). */
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

  it('elegir Rápido entra al bucle: referencia sin casillas, con enlace de fase', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /rápido/i }))

    expect(useEstadoApp.getState().battle.modo).toBe('rapido')
    expect(
      screen.getByRole('heading', { name: /Fase 1 · Recuperación/i }),
    ).toBeInTheDocument()
    // Sin casillas ni explicaciones: es solo referencia.
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(screen.queryByText(/Liderazgo del líder/i)).toBeNull()
    // El texto corto de cada paso sí está.
    expect(screen.getByText(/Test de Desbandada si el 25/i)).toBeInTheDocument()
    // Y el enlace a la regla de la fase, por si hay dudas.
    expect(
      screen.getByRole('link', { name: /reglas de la fase/i }),
    ).toHaveAttribute('href', CONTENIDO_BATTLE.recuperacion.linkFase)
  })

  it('en Tutorial se ve la explicación de cada paso y el enlace de la fase', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /tutorial/i }))

    expect(screen.getByText(/Liderazgo del líder/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /reglas de la fase/i }),
    ).toHaveAttribute('href', CONTENIDO_BATTLE.recuperacion.linkFase)
  })
})

describe('Battle — bucle', () => {
  it('tutorial: "Siguiente fase" se habilita al marcar todo y avanza la fase', async () => {
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

  it('rápido: se puede avanzar sin marcar nada', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /rápido/i }))

    const siguiente = screen.getByRole('button', { name: /siguiente fase/i })
    expect(siguiente).toBeEnabled()

    await user.click(siguiente)
    expect(useEstadoApp.getState().battle.fase).toBe('movimiento')
  })

  it('desde Combate el botón cierra la ronda: ronda += 1 y vuelve a Recuperación', async () => {
    useEstadoApp.setState((s) => ({
      battle: { ...s.battle, fase: 'combate', ronda: 2 },
    }))
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /tutorial/i }))

    expect(screen.getByText(/se resuelve sí o sí/i)).toBeInTheDocument()

    await marcarTodo(user)
    await user.click(screen.getByRole('button', { name: /cerrar ronda/i }))

    const { ronda, fase, checklistFaseActual } = useEstadoApp.getState().battle
    expect(ronda).toBe(3)
    expect(fase).toBe('recuperacion')
    expect(checklistFaseActual).toEqual({})
  })

  it('el toggle cambia el modo en vivo y el store conserva el marcado', async () => {
    const user = userEvent.setup()
    montar()
    await user.click(screen.getByRole('button', { name: /tutorial/i }))

    await user.click(screen.getAllByRole('checkbox')[0])
    expect(useEstadoApp.getState().battle.checklistFaseActual).not.toEqual({})

    // A rápido: desaparecen las casillas, sigue el texto de referencia.
    await user.click(screen.getByRole('button', { name: /^rápido$/i }))
    expect(useEstadoApp.getState().battle.modo).toBe('rapido')
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
    expect(screen.getByText(/Test de Desbandada si el 25/i)).toBeInTheDocument()

    // De vuelta a tutorial: el marcado seguía en el store.
    await user.click(screen.getByRole('button', { name: /^tutorial$/i }))
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked()
  })
})
