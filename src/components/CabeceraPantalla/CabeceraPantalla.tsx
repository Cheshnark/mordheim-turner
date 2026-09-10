import { Link } from 'react-router-dom'
import { EstrellaFugaz } from '@/components/EstrellaFugaz/EstrellaFugaz'
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

/** Filete ornamental: estrella fugaz entre dos hairlines. */
function Filete() {
  return (
    <div className={styles.filete} aria-hidden="true">
      <span className={styles.fileteLinea} />
      <EstrellaFugaz size={16} className={styles.estrella} />
      <span className={styles.fileteLinea} />
    </div>
  )
}
