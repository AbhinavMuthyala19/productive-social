import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CommunityProvider } from './context/CommunityContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CommunityProvider>
          <App />
        </CommunityProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
