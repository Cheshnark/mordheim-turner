import type { ReactElement } from 'react'
import type { FaseTurno } from '@/store/tipos'

type Props = {
  fase: FaseTurno
  className?: string
}

/**
 * Glifo de fase, trazo tipo xilografía. Motivos genéricos (no iconografía de
 * Games Workshop): alzarse, senda, flecha, espadas cruzadas. Decorativo:
 * `aria-hidden`, el título de la fase ya nombra la fase.
 */
const TRAZOS: Record<FaseTurno, ReactElement> = {
  // Alzarse del suelo: cheurón hacia arriba sobre una línea de tierra.
  recuperacion: (
    <>
      <path d="M4 10l8-6 8 6" />
      <path d="M12 4v10" />
      <path d="M4 20h16" />
    </>
  ),
  // Senda: línea que serpentea.
  movimiento: <path d="M4 20c5 0 3-8 8-8s3-8 8-8" />,
  // Flecha lanzada.
  disparo: (
    <>
      <path d="M4 20L20 4" />
      <path d="M13 4h7v7" />
    </>
  ),
  // Espadas cruzadas.
  combate: (
    <>
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
      <path d="M3 7l4-4M17 21l4-4M21 7l-4-4M7 21l-4-4" />
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
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {TRAZOS[fase]}
    </svg>
  )
}
