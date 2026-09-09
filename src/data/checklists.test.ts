import { describe, expect, it } from 'vitest'
import { ORDEN_FASES } from '@/lib/battle/fases'
import type { ChecklistItem } from '@/store/tipos'
import { CONTENIDO_BATTLE } from './battle'
import { CHECKLIST_POSTGAME, NOTAS_POSTGAME } from './postgame'
import { CHECKLIST_PREBATTLE } from './prebattle'

const URL_MORDHEIMER = /^https:\/\/mordheimer\.net\//

const listas: Array<[string, ChecklistItem[]]> = [
  ['prebattle', CHECKLIST_PREBATTLE],
  ['postgame', CHECKLIST_POSTGAME],
  ...ORDEN_FASES.map(
    (f) =>
      [`battle/${f}`, CONTENIDO_BATTLE[f].items] as [string, ChecklistItem[]],
  ),
]

describe('checklists', () => {
  it.each(listas)(
    '%s: no vacía, ids únicos, textos con contenido',
    (_n, items) => {
      expect(items.length).toBeGreaterThan(0)
      expect(new Set(items.map((i) => i.id)).size).toBe(items.length)
      for (const item of items) {
        expect(item.texto_corto.trim().length).toBeGreaterThan(0)
        expect(item.texto_explicado?.trim() ?? 'x').not.toBe('')
      }
    },
  )

  it.each(listas)(
    '%s: los link_regla son https a mordheimer.net',
    (_n, items) => {
      for (const item of items) {
        if (item.link_regla) expect(item.link_regla).toMatch(URL_MORDHEIMER)
      }
    },
  )

  it('CONTENIDO_BATTLE cubre las cuatro fases, numeradas 1..4 y con link', () => {
    expect(ORDEN_FASES.map((f) => CONTENIDO_BATTLE[f].numero)).toEqual([
      1, 2, 3, 4,
    ])
    for (const fase of ORDEN_FASES) {
      const c = CONTENIDO_BATTLE[fase]
      expect(c.titulo.trim().length).toBeGreaterThan(0)
      expect(c.linkFase).toMatch(URL_MORDHEIMER)
    }
  })

  it('la Fase 4 (Combate) lleva la nota fija de resolverse siempre', () => {
    const notas = CONTENIDO_BATTLE.combate.notasFijas ?? []
    expect(notas.length).toBeGreaterThan(0)
    expect(notas.join(' ')).toMatch(/sin importar de quién es el turno/i)
  })

  it('Postgame lleva la nota fija de no actualizar la warband aquí', () => {
    expect(NOTAS_POSTGAME.join(' ')).toMatch(/warband/i)
  })
})
