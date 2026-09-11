import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* basename = base de Vite: '/' en dev, '/mordheim-turner/' en el build de
        GitHub Pages (vite.config.ts). Sin esto, los enlaces internos se
        romperían bajo la subruta del sitio de proyecto. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
