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
  // Movimiento: dos huellas en diagonal, rastro de pasos (senda). La bota
  // anterior no se leía bien a tamaño de icono; pocos elementos, grandes y
  // separados, para que el hueco entre planta y dedos no se pierda al reducir.
  movimiento: (
    <>
      <g transform="translate(6.5 18.5) rotate(42)">
        <path d="M-2 1.6A2 3 0 1 0 2 1.6A2 3 0 1 0 -2 1.6Z" />
        <circle cx="-1.3" cy="-2.7" r="0.9" />
        <circle cx="0.1" cy="-3.3" r="1" />
        <circle cx="1.4" cy="-2.6" r="0.85" />
      </g>
      <g transform="translate(15.5 7) rotate(42)">
        <path d="M-2 1.6A2 3 0 1 0 2 1.6A2 3 0 1 0 -2 1.6Z" />
        <circle cx="-1.3" cy="-2.7" r="0.9" />
        <circle cx="0.1" cy="-3.3" r="1" />
        <circle cx="1.4" cy="-2.6" r="0.85" />
      </g>
    </>
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
