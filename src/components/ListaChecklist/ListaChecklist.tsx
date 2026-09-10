import { ItemChecklist } from '@/components/ItemChecklist/ItemChecklist'
import type { ChecklistItem } from '@/store/tipos'
import styles from './ListaChecklist.module.css'

type Props = {
  items: ChecklistItem[]
  /** Marcado por id de item. Un id ausente cuenta como `false`. */
  marcadas?: Record<string, boolean>
  onAlternar?: (id: string) => void
  mostrarDetalle: boolean
  /** `false` → filas de solo lectura (referencia rápida). Por defecto `true`. */
  interactivo?: boolean
}

/** Lista de `ItemChecklist`. Sin estado propio: todo viene por props. */
export function ListaChecklist({
  items,
  marcadas = {},
  onAlternar,
  mostrarDetalle,
  interactivo = true,
}: Props) {
  return (
    <ul className={styles.lista}>
      {items.map((item) => (
        <ItemChecklist
          key={item.id}
          item={item}
          marcado={Boolean(marcadas[item.id])}
          onAlternar={() => onAlternar?.(item.id)}
          mostrarDetalle={mostrarDetalle}
          interactivo={interactivo}
        />
      ))}
    </ul>
  )
}
