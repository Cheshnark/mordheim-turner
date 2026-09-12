import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  TIRADAS_MAX,
  TIRADAS_MIN,
  tiradaHerir,
  tiradaImpactar,
} from '@/lib/tiradas/tiradas'
import styles from './CalculadoraTiradas.module.css'

type Calculadora = 'impactar' | 'herir'

/**
 * Botón flotante + modal de calculadoras de tiradas (Impactar cuerpo a
 * cuerpo, Herir). Se monta una única vez en `App.tsx`, fuera de las rutas:
 * disponible en toda la app para no perder el hilo de la partida al
 * consultarla (docs/decisions.md).
 *
 * Es una herramienta de consulta, sin relación con `useEstadoApp`: su
 * estado es local y no se persiste ni afecta a la partida en curso.
 */
export function CalculadoraTiradas() {
  const [abierta, setAbierta] = useState(false)

  useEffect(() => {
    if (!abierta) return
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(false)
    }
    document.addEventListener('keydown', alTeclear)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = ''
    }
  }, [abierta])

  return (
    <>
      <button
        type="button"
        className={styles.disparador}
        onClick={() => setAbierta(true)}
        aria-label="Abrir calculadora de tiradas"
        title="Calculadora de tiradas"
      >
        <IconoDado />
      </button>
      {abierta &&
        createPortal(
          <Modal onCerrar={() => setAbierta(false)} />,
          document.body,
        )}
    </>
  )
}

function Modal({ onCerrar }: { onCerrar: () => void }) {
  const [calculadora, setCalculadora] = useState<Calculadora>('impactar')

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div
        className={styles.dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calculadora-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.cabecera}>
          <h2 id="calculadora-titulo" className={styles.titulo}>
            Calculadora de tiradas
          </h2>
          <button
            type="button"
            className={styles.cerrar}
            onClick={onCerrar}
            aria-label="Cerrar calculadora"
          >
            ×
          </button>
        </div>

        <div className={styles.toggle} role="group" aria-label="Tipo de tirada">
          <button
            type="button"
            className={styles.toggleBoton}
            aria-pressed={calculadora === 'impactar'}
            onClick={() => setCalculadora('impactar')}
          >
            Impactar
          </button>
          <button
            type="button"
            className={styles.toggleBoton}
            aria-pressed={calculadora === 'herir'}
            onClick={() => setCalculadora('herir')}
          >
            Herir
          </button>
        </div>

        {calculadora === 'impactar' ? <Impactar /> : <Herir />}
      </div>
    </div>
  )
}

/** Impactar en cuerpo a cuerpo: Habilidad de Combate del atacante vs defensor. */
function Impactar() {
  const [atacante, setAtacante] = useState(3)
  const [defensor, setDefensor] = useState(3)
  const resultado = tiradaImpactar(atacante, defensor)

  return (
    <div className={styles.cuerpo}>
      <div className={styles.contadores}>
        <Contador
          etiqueta="Habilidad de Combate — atacante"
          valor={atacante}
          onCambiar={setAtacante}
        />
        <Contador
          etiqueta="Habilidad de Combate — defensor"
          valor={defensor}
          onCambiar={setDefensor}
        />
      </div>
      <Resultado texto={`Necesitas ${resultado}+`} />
    </div>
  )
}

/** Herir: Fuerza del atacante vs Resistencia del objetivo. */
function Herir() {
  const [fuerza, setFuerza] = useState(3)
  const [resistencia, setResistencia] = useState(3)
  const resultado = tiradaHerir(fuerza, resistencia)

  return (
    <div className={styles.cuerpo}>
      <div className={styles.contadores}>
        <Contador
          etiqueta="Fuerza — atacante"
          valor={fuerza}
          onCambiar={setFuerza}
        />
        <Contador
          etiqueta="Resistencia — objetivo"
          valor={resistencia}
          onCambiar={setResistencia}
        />
      </div>
      <Resultado
        texto={
          resultado == null ? 'Imposible herir' : `Necesitas ${resultado}+`
        }
      />
    </div>
  )
}

function Resultado({ texto }: { texto: string }) {
  return (
    <p className={styles.resultado} aria-live="polite">
      {texto}
    </p>
  )
}

function Contador({
  etiqueta,
  valor,
  onCambiar,
}: {
  etiqueta: string
  valor: number
  onCambiar: (v: number) => void
}) {
  return (
    <div className={styles.contador}>
      <span className={styles.contadorEtiqueta}>{etiqueta}</span>
      <div className={styles.contadorFila}>
        <button
          type="button"
          className={styles.paso}
          onClick={() => onCambiar(Math.max(TIRADAS_MIN, valor - 1))}
          disabled={valor <= TIRADAS_MIN}
          aria-label={`Bajar ${etiqueta}`}
        >
          −
        </button>
        <span className={styles.contadorValor}>{valor}</span>
        <button
          type="button"
          className={styles.paso}
          onClick={() => onCambiar(Math.min(TIRADAS_MAX, valor + 1))}
          disabled={valor >= TIRADAS_MAX}
          aria-label={`Subir ${etiqueta}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

/** Icono propio de dado (d6): trazo simple, mismo estilo que el de enlace externo. */
function IconoDado() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
