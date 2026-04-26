import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster 
        position="top-right" 
        containerStyle={{
          top: 60,
          right: 60,
        }}
      />
      <App />
    </AuthProvider>
  </StrictMode>,
)
