import { Link } from 'react-router-dom'
import styles from './CabeceraPantalla.module.css'

type Props = {
  titulo: string
  /** Destino del enlace "Volver". Por defecto, Home. */
  volverA?: string
}

/**
 * Cabecera común de las pantallas calladas (Prebattle, Postgame, selección de
 * modo de Battle): fila de "running head" (volver + nombre en versalitas),
 * título con inicial iluminada y filete ornamental. Estilo hoja de reglamento.
 */
export function CabeceraPantalla({ titulo, volverA = '/' }: Props) {
  return (
    <header className={styles.cabecera}>
      <div className={styles.corrida}>
        <Link className="volver" to={volverA}>
          Volver
        </Link>
        <span className={styles.runningHead}>{titulo}</span>
        <span aria-hidden="true" />
      </div>
      <h1 className={styles.titulo}>{titulo}</h1>
      <Filete />
    </header>
  )
}

/** Filete ornamental: estrella fugaz (motivo propio) entre dos hairlines. */
function Filete() {
  return (
    <div className={styles.filete} aria-hidden="true">
      <span className={styles.fileteLinea} />
      <svg
        className={styles.estrella}
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
      >
        <path
          d="M12 2.5l1.7 6.4 6.3 1.6-6.3 1.6L12 18.5l-1.7-6.4L4 10.5l6.3-1.6z"
          fill="currentColor"
        />
        <path
          d="M8.5 13.5L3.5 20"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.fileteLinea} />
    </div>
  )
}
