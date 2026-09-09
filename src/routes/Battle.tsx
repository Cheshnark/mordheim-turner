import { Link } from 'react-router-dom'

export function Battle() {
  return (
    <main className="stack">
      <p>
        <Link to="/">Volver a Home</Link>
      </p>
      <h1>Battle</h1>
      <p>
        Selección de modo y bucle de ronda/fase pendientes de implementar (ver
        docs/handoff.md §5).
      </p>
    </main>
  )
}
