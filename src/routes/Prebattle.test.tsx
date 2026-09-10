import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { CHECKLIST_PREBATTLE } from '@/data/prebattle'
import { ESTADO_INICIAL, useEstadoApp } from '@/store/estadoApp'
import { Prebattle } from './Prebattle'

beforeEach(() => {
  localStorage.clear()
  useEstadoApp.setState(structuredClone(ESTADO_INICIAL))
})

const montar = () =>
  render(
    <MemoryRouter>
      <Prebattle />
    </MemoryRouter>,
  )

describe('Prebattle', () => {
  it('renderiza los cinco pasos con su explicación (checklist plana)', () => {
    montar()
    expect(screen.getAllByRole('checkbox')).toHaveLength(
      CHECKLIST_PREBATTLE.length,
    )
    expect(
      screen.getByText(
        'Uso interno del jugador; la app no la detecta ni la evalúa.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /regla en mordheimer\.net/i }),
    ).toHaveAttribute('href', 'https://mordheimer.net/docs/campaigns/scenarios')
  })

  it('marcar un paso lo persiste en checklistPrebattle', async () => {
    montar()
    await userEvent.click(screen.getByText('Zonas de despliegue'))
    expect(useEstadoApp.getState().checklistPrebattle).toEqual({
      'pre-zonas-despliegue': true,
    })
  })

  it('refleja el estado ya guardado al montar', () => {
    useEstadoApp.setState({ checklistPrebattle: { 'pre-escenario': true } })
    montar()
    const [primera] = screen.getAllByRole('checkbox')
    expect(primera).toBeChecked()
  })
})
