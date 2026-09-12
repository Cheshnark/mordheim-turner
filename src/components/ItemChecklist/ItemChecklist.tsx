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
  /**
   * `true` (por defecto): casilla que se marca. `false`: fila de solo lectura
   * con viñeta, para la referencia rápida de Battle.
   */
  interactivo?: boolean
}

/** Fila de checklist: casilla (o viñeta) + texto corto y, si procede, detalle. */
export function ItemChecklist({
  item,
  marcado,
  onAlternar,
  mostrarDetalle,
  interactivo = true,
}: Props) {
  const mostrarExplicado = mostrarDetalle && item.texto_explicado != null
  const mostrarEnlace = mostrarDetalle && item.link_regla != null

  return (
    <li className={styles.item} data-inerte={!interactivo || undefined}>
      <div className={styles.filaSuperior}>
        {interactivo ? (
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
        ) : (
          <div className={styles.fila}>
            <span className={styles.vinneta} aria-hidden="true" />
            <span className={styles.texto}>{item.texto_corto}</span>
          </div>
        )}

        {mostrarEnlace && (
          <a
            className={styles.iconoRegla}
            href={item.link_regla}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ir a esta regla en mordheimer.net: ${item.texto_corto}`}
            title="Ir a esta regla en mordheimer.net"
          >
            <IconoEnlaceExterno />
          </a>
        )}
      </div>

      {mostrarExplicado && (
        <div className={styles.detalle}>
          <p className={styles.explicado}>{item.texto_explicado}</p>
        </div>
      )}
    </li>
  )
}

/** Flecha saliendo de una caja: icono universal de "enlace externo". */
function IconoEnlaceExterno() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path
        d="M6.5 3H3v10h10V9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 2H14v5.5M14 2 7 9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
