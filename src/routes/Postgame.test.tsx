import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CHECKLIST_POSTGAME, NOTAS_POSTGAME } from '@/data/postgame'
import { ESTADO_INICIAL, useEstadoApp } from '@/store/estadoApp'
import { Postgame } from './Postgame'

beforeEach(() => {
  localStorage.clear()
  useEstadoApp.setState(structuredClone(ESTADO_INICIAL))
})

const montar = () =>
  render(
    <MemoryRouter>
      <Postgame />
    </MemoryRouter>,
  )

describe('Postgame', () => {
  it('renderiza los pasos y la nota fija sin casilla', () => {
    montar()
    expect(screen.getAllByRole('checkbox')).toHaveLength(
      CHECKLIST_POSTGAME.length,
    )
    expect(screen.getByText(NOTAS_POSTGAME[0])).toBeInTheDocument()
  })

  it('marcar un paso lo persiste en checklistPostgame', async () => {
    montar()
    await userEvent.click(screen.getByText('Reparto de experiencia'))
    expect(useEstadoApp.getState().checklistPostgame).toEqual({
      'post-experiencia': true,
    })
  })
})
