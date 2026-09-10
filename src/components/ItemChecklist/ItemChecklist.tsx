import type { ChecklistItem } from '@/store/tipos'
import styles from './ItemChecklist.module.css'

type Props = {
  item: ChecklistItem
  marcado: boolean
  onAlternar: () => void
  /**
   * Muestra `texto_explicado` y `link_regla`. Siempre `true` en Prebattle y
   * Postgame; en Battle solo en modo tutorial (handoff §3).
   */
  mostrarDetalle: boolean
}

/** Fila de checklist: casilla + texto corto y, si procede, explicación y enlace. */
export function ItemChecklist({
  item,
  marcado,
  onAlternar,
  mostrarDetalle,
}: Props) {
  const detalle =
    mostrarDetalle && (item.texto_explicado != null || item.link_regla != null)

  return (
    <li className={styles.item}>
      <label className={styles.fila}>
        <input
          type="checkbox"
          className={styles.check}
          checked={marcado}
          onChange={onAlternar}
        />
        <span className={styles.texto} data-marcado={marcado || undefined}>
          {item.texto_corto}
        </span>
      </label>

      {detalle && (
        <div className={styles.detalle}>
          {item.texto_explicado != null && (
            <p className={styles.explicado}>{item.texto_explicado}</p>
          )}
          {item.link_regla != null && (
            <a
              className={styles.regla}
              href={item.link_regla}
              target="_blank"
              rel="noopener noreferrer"
            >
              Regla en mordheimer.net
            </a>
          )}
        </div>
      )}
    </li>
  )
}
