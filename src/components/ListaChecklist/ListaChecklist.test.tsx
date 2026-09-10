import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ChecklistItem } from '@/store/tipos'
import { ListaChecklist } from './ListaChecklist'

const ITEMS: ChecklistItem[] = [
  { id: 'a', texto_corto: 'Primero' },
  { id: 'b', texto_corto: 'Segundo' },
  { id: 'c', texto_corto: 'Tercero' },
]

describe('ListaChecklist', () => {
  it('renderiza un item por entrada y aplica el marcado por id', () => {
    render(
      <ListaChecklist
        items={ITEMS}
        marcadas={{ b: true }}
        onAlternar={() => {}}
        mostrarDetalle={false}
      />,
    )
    const casillas = screen.getAllByRole('checkbox')
    expect(casillas).toHaveLength(3)
    expect(casillas[0]).not.toBeChecked()
    expect(casillas[1]).toBeChecked()
    expect(casillas[2]).not.toBeChecked()
  })

  it('propaga el id del item pulsado a onAlternar', async () => {
    const onAlternar = vi.fn()
    render(
      <ListaChecklist
        items={ITEMS}
        marcadas={{}}
        onAlternar={onAlternar}
        mostrarDetalle={false}
      />,
    )
    await userEvent.click(screen.getByText('Tercero'))
    expect(onAlternar).toHaveBeenCalledWith('c')
  })
})
