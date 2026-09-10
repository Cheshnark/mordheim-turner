import type { ReactElement } from 'react'
import type { FaseTurno } from '@/store/tipos'

type Props = {
  fase: FaseTurno
  className?: string
}

/**
 * Glifo de fase: silueta maciza, estilo sello de xilografía. Motivos genéricos
 * y propios (no iconografía de Games Workshop): calavera, bota, saeta, espadas
 * cruzadas. Decorativo (`aria-hidden`); el título de la fase ya la nombra.
 */
const TRAZOS: Record<FaseTurno, ReactElement> = {
  // Recuperación: calavera (bajas, heridas, levantarse). Ojos y nariz a hueco.
  recuperacion: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C7.6 2 4.5 5.2 4.5 9.6c0 2.3.8 4 2.2 5.4v3c0 .6.4 1 1 1h1v1.5c0 .3.3.6.6.6s.6-.3.6-.6V19h1.3v1.5c0 .3.3.6.6.6s.6-.3.6-.6V19h1.3v1.5c0 .3.3.6.6.6s.6-.3.6-.6V19h1c.6 0 1-.4 1-1v-3c1.4-1.4 2.2-3.1 2.2-5.4C19.5 5.2 16.4 2 12 2ZM9 8.4c-1 0-1.8.9-1.8 2s.8 2 1.8 2 1.8-.9 1.8-2-.8-2-1.8-2Zm6 0c-1 0-1.8.9-1.8 2s.8 2 1.8 2 1.8-.9 1.8-2-.8-2-1.8-2Zm-3 4.1-1.2 2.5h2.4z"
    />
  ),
  // Movimiento: bota pesada de perfil, puntera a la derecha.
  movimiento: (
    <path d="M8 3c-.6 0-1 .4-1 1v8.8c0 .7-.3 1.3-.9 1.7l-2 1.4c-.7.5-1.1 1.3-1.1 2.2V20c0 .6.4 1 1 1h14.5c.5 0 .9-.4 1-.9.3-2.6-1.4-5-3.9-5.7l-4-1.1C10 12 9 10.5 9 8.9V4c0-.6-.4-1-1-1H8Z" />
  ),
  // Disparo: saeta lanzada en diagonal, con emplumado en la cola.
  disparo: (
    <>
      <path d="M21 3 21 10.5 18.4 7.9 8.2 18.1 5.9 15.8 16.1 5.6 13.5 3Z" />
      <path d="M6.7 15.1 3 21l5.9-3.7-2.2-2.2Z" />
    </>
  ),
  // Combate: dos espadas cruzadas, hoja arriba, pomo y gavilán abajo.
  combate: (
    <>
      <path d="M3.6 18.6 17.4 4.8 19.2 6.6 5.4 20.4Z" />
      <path d="M4.8 4.8 6.6 3 20.4 16.8 18.6 18.6Z" />
      <path d="M4 15l2 2-1.4 1.4L2.6 16.4Z" />
      <path d="M20 15l-2 2 1.4 1.4 2-2Z" />
      <circle cx="3.5" cy="20.5" r="1.7" />
      <circle cx="20.5" cy="20.5" r="1.7" />
    </>
  ),
}

export function GlifoFase({ fase, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
    >
      {TRAZOS[fase]}
    </svg>
  )
}
