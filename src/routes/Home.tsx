import { Link } from 'react-router-dom'
import { EstrellaFugaz } from '@/components/EstrellaFugaz/EstrellaFugaz'
import styles from './Home.module.css'

export function Home() {
  return (
    <main className={styles.home}>
      <header className={styles.header}>
        <EstrellaFugaz size={30} className={styles.marca} />
        <h1 className={styles.title}>Turnheim</h1>
        <div className={styles.filete} aria-hidden="true" />
        <p className={styles.subtitle}>Compañero de turno para Mordheim</p>
      </header>

      <nav className={styles.accesos}>
        <Link className={styles.acceso} to="/prebattle">
          <span className={styles.nombre}>Prebattle</span>
          <span className={styles.nota}>Antes de desplegar</span>
        </Link>
        <Link className={`${styles.acceso} ${styles.destacado}`} to="/battle">
          <span className={styles.nombre}>Battle</span>
          <span className={styles.nota}>Bucle de ronda y fase</span>
        </Link>
        <Link className={styles.acceso} to="/postgame">
          <span className={styles.nombre}>Postgame</span>
          <span className={styles.nota}>Después de la partida</span>
        </Link>
        <a
          className={`${styles.acceso} ${styles.externo}`}
          href="https://mordheimer.net"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.nombre}>Mordheimer.net</span>
          <span className={styles.nota}>Reglas completas. Sale de la app.</span>
        </a>
      </nav>
    </main>
  )
}
