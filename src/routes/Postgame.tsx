import { CabeceraPantalla } from '@/components/CabeceraPantalla/CabeceraPantalla'
import { ListaChecklist } from '@/components/ListaChecklist/ListaChecklist'
import { CHECKLIST_POSTGAME, NOTAS_POSTGAME } from '@/data/postgame'
import { useEstadoApp } from '@/store/estadoApp'
import styles from './Postgame.module.css'

/** Checklist plana, sin modo tutorial/rápido: siempre se muestra el detalle. */
export function Postgame() {
  const marcadas = useEstadoApp((s) => s.checklistPostgame)
  const alternar = useEstadoApp((s) => s.alternarItemPostgame)

  return (
    <main className="stack">
      <CabeceraPantalla titulo="Postgame" />
      <p className={styles.intro}>
        Después de la partida. El estado se guarda solo.
      </p>

      <ListaChecklist
        items={CHECKLIST_POSTGAME}
        marcadas={marcadas}
        onAlternar={alternar}
        mostrarDetalle
      />

      {NOTAS_POSTGAME.map((nota) => (
        <p key={nota} className={styles.nota}>
          {nota}
        </p>
      ))}
    </main>
  )
}
