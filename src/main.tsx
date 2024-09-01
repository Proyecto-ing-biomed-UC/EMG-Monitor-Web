import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CiervoLogin from './CiervoLogin'
// import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CiervoLogin />
  </StrictMode>,
)
