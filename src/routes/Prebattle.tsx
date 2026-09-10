import { CabeceraPantalla } from '@/components/CabeceraPantalla/CabeceraPantalla'
import { ListaChecklist } from '@/components/ListaChecklist/ListaChecklist'
import { CHECKLIST_PREBATTLE } from '@/data/prebattle'
import { useEstadoApp } from '@/store/estadoApp'
import styles from './Prebattle.module.css'

/** Checklist plana, sin modo tutorial/rápido: siempre se muestra el detalle. */
export function Prebattle() {
  const marcadas = useEstadoApp((s) => s.checklistPrebattle)
  const alternar = useEstadoApp((s) => s.alternarItemPrebattle)

  return (
    <main className="stack">
      <CabeceraPantalla titulo="Prebattle" />
      <p className={styles.intro}>
        Antes de desplegar. Marca cada paso cuando lo tengas resuelto; el estado
        se guarda solo.
      </p>

      <ListaChecklist
        items={CHECKLIST_PREBATTLE}
        marcadas={marcadas}
        onAlternar={alternar}
        mostrarDetalle
      />
    </main>
  )
}
