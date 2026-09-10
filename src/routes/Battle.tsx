import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CabeceraPantalla } from '@/components/CabeceraPantalla/CabeceraPantalla'
import { GlifoFase } from '@/components/GlifoFase/GlifoFase'
import { ListaChecklist } from '@/components/ListaChecklist/ListaChecklist'
import { CONTENIDO_BATTLE } from '@/data/battle'
import { ORDEN_FASES, cierraRonda } from '@/lib/battle/fases'
import { useEstadoApp } from '@/store/estadoApp'
import styles from './Battle.module.css'

/**
 * Battle = selección de modo → bucle ronda/fase (handoff §2, §5).
 *
 * "Estar en el bucle" es estado local: al entrar en la pantalla se vuelve a
 * elegir modo, aunque ronda/fase sigan donde los dejó `localStorage`. Motivo en
 * docs/decisions.md.
 */
export function Battle() {
  const [enBucle, setEnBucle] = useState(false)
  const battle = useEstadoApp((s) => s.battle)
  const establecerModo = useEstadoApp((s) => s.establecerModo)
  const alternarItemFase = useEstadoApp((s) => s.alternarItemFase)
  const avanzarFase = useEstadoApp((s) => s.avanzarFase)

  const fase = CONTENIDO_BATTLE[battle.fase]
  const tutorial = battle.modo === 'tutorial'

  if (!enBucle) {
    const elegir = (modo: 'tutorial' | 'rapido') => () => {
      establecerModo(modo)
      setEnBucle(true)
    }
    return (
      <main className={styles.seleccion}>
        <CabeceraPantalla titulo="Battle" />
        <p className={styles.retomar}>
          Vas por la <strong>Ronda {battle.ronda}</strong> · Fase {fase.numero}:{' '}
          {fase.titulo}
        </p>
        <p className={styles.intro}>Elige cómo quieres el checklist:</p>
        <div className={styles.modos}>
          <button
            type="button"
            className={styles.modo}
            onClick={elegir('tutorial')}
          >
            <span className={styles.modoNombre}>Tutorial</span>
            <span className={styles.modoNota}>
              Cada paso con explicación y enlace a la regla
            </span>
          </button>
          <button
            type="button"
            className={styles.modo}
            onClick={elegir('rapido')}
          >
            <span className={styles.modoNombre}>Rápido</span>
            <span className={styles.modoNota}>
              Solo el texto corto de cada paso
            </span>
          </button>
        </div>
      </main>
    )
  }

  const todoMarcado = fase.items.every(
    (item) => battle.checklistFaseActual[item.id],
  )
  const cierra = cierraRonda(battle.fase)

  return (
    <main className="stack">
      <Link className="volver" to="/">
        Volver
      </Link>

      <header className={styles.cabecera}>
        <p className={styles.ronda}>Ronda {battle.ronda}</p>
        <ol className={styles.pista} aria-hidden="true">
          {ORDEN_FASES.map((f, i) => (
            <li
              key={f}
              className={styles.tramo}
              data-estado={
                i + 1 < fase.numero
                  ? 'hecha'
                  : i + 1 === fase.numero
                    ? 'activa'
                    : 'pendiente'
              }
            />
          ))}
        </ol>
        <div className={styles.faseLinea}>
          <GlifoFase fase={battle.fase} className={styles.glifo} />
          <h1 className={styles.tituloFase}>
            Fase {fase.numero} · {fase.titulo}
          </h1>
        </div>
      </header>

      <div
        className={styles.toggle}
        role="group"
        aria-label="Modo del checklist"
      >
        <button
          type="button"
          className={styles.toggleBoton}
          aria-pressed={tutorial}
          onClick={() => establecerModo('tutorial')}
        >
          Tutorial
        </button>
        <button
          type="button"
          className={styles.toggleBoton}
          aria-pressed={!tutorial}
          onClick={() => establecerModo('rapido')}
        >
          Rápido
        </button>
      </div>

      {tutorial && (
        <a
          className={styles.linkFase}
          href={fase.linkFase}
          target="_blank"
          rel="noopener noreferrer"
        >
          Reglas de la fase en mordheimer.net
        </a>
      )}

      {fase.notasFijas?.map((nota) => (
        <p key={nota} className={styles.nota}>
          {nota}
        </p>
      ))}

      <ListaChecklist
        items={fase.items}
        marcadas={battle.checklistFaseActual}
        onAlternar={alternarItemFase}
        mostrarDetalle={tutorial}
      />

      <button
        type="button"
        className={styles.siguiente}
        disabled={!todoMarcado}
        onClick={avanzarFase}
      >
        {cierra ? 'Cerrar ronda' : 'Siguiente fase'} →
      </button>
    </main>
  )
}
