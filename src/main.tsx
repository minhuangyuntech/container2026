import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HashRouter } from './router'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
