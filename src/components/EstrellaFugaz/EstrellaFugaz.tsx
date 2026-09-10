type Props = {
  /** Lado del svg en px. Por defecto 16. */
  size?: number
  className?: string
}

/**
 * Ornamento propio: estrella de cuatro puntas con una sola cola. Motivo de la
 * app (cabeceras, favicon). No es la cometa de dos colas de Games Workshop.
 * Decorativo: `aria-hidden`. Toma el color de `currentColor`.
 */
export function EstrellaFugaz({ size = 16, className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13 2l1.9 7 7 1.7-7 1.7L13 19l-1.9-6.6L4 10.7l7-1.7z"
        fill="currentColor"
      />
      <path
        d="M8.5 13.5 3 20"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}
