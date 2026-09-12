import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { ChecklistItem } from '@/store/tipos'
import { ItemChecklist } from './ItemChecklist'

const ITEM: ChecklistItem = {
  id: 'x1',
  texto_corto: 'Paso corto',
  texto_explicado: 'Explicación larga del paso.',
  link_regla: 'https://mordheimer.net/docs/rules/recovery',
}

describe('ItemChecklist', () => {
  it('refleja el estado marcado en la casilla', () => {
    const { rerender } = render(
      <ItemChecklist
        item={ITEM}
        marcado={false}
        onAlternar={() => {}}
        mostrarDetalle={false}
      />,
    )
    expect(screen.getByRole('checkbox')).not.toBeChecked()

    rerender(
      <ItemChecklist
        item={ITEM}
        marcado
        onAlternar={() => {}}
        mostrarDetalle={false}
      />,
    )
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('llama a onAlternar al pulsar la fila', async () => {
    const onAlternar = vi.fn()
    render(
      <ItemChecklist
        item={ITEM}
        marcado={false}
        onAlternar={onAlternar}
        mostrarDetalle={false}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onAlternar).toHaveBeenCalledOnce()
  })

  it('oculta la explicación pero no el enlace cuando mostrarDetalle es false', () => {
    render(
      <ItemChecklist
        item={ITEM}
        marcado={false}
        onAlternar={() => {}}
        mostrarDetalle={false}
      />,
    )
    expect(screen.queryByText(ITEM.texto_explicado as string)).toBeNull()
    // El enlace no depende de mostrarDetalle: también se ve en modo rápido.
    expect(screen.getByRole('link')).toHaveAttribute('href', ITEM.link_regla)
  })

  it('muestra explicación y enlace externo cuando mostrarDetalle es true', () => {
    render(
      <ItemChecklist
        item={ITEM}
        marcado={false}
        onAlternar={() => {}}
        mostrarDetalle
      />,
    )
    expect(screen.getByText(ITEM.texto_explicado as string)).toBeInTheDocument()
    const enlace = screen.getByRole('link')
    expect(enlace).toHaveAttribute('href', ITEM.link_regla)
    expect(enlace).toHaveAttribute('target', '_blank')
    expect(enlace).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('con mostrarDetalle pero sin detalle no renderiza bloque extra', () => {
    render(
      <ItemChecklist
        item={{ id: 'y', texto_corto: 'Solo corto' }}
        marcado={false}
        onAlternar={() => {}}
        mostrarDetalle
      />,
    )
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('en modo no interactivo no hay casilla, solo el texto', () => {
    render(
      <ItemChecklist
        item={ITEM}
        marcado={false}
        onAlternar={() => {}}
        mostrarDetalle={false}
        interactivo={false}
      />,
    )
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByText(ITEM.texto_corto)).toBeInTheDocument()
  })
})
