import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import NotFound from './components/NotFound'
import { parseRoute } from './lib/route'
import './styles.css'

const route = parseRoute(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {route ? <App schedule={route.schedule} reversed={route.reversed} /> : <NotFound />}
  </StrictMode>,
)
