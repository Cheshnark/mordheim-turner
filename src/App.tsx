import { Route, Routes } from 'react-router-dom'
import { Battle } from './routes/Battle'
import { Home } from './routes/Home'
import { Postgame } from './routes/Postgame'
import { Prebattle } from './routes/Prebattle'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/prebattle" element={<Prebattle />} />
      <Route path="/battle" element={<Battle />} />
      <Route path="/postgame" element={<Postgame />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
