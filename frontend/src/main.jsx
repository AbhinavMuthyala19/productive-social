import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CommunityProvider } from './context/CommunityContext.jsx'
import { PostProvider } from './context/PostContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CommunityProvider>
          <PostProvider>
            <App />
          </PostProvider>
        </CommunityProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
