import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import { App } from './App'
import { ConApp } from './ConApp'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConApp />
  </StrictMode>,
)
