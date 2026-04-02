import React from 'react'
import ReactDOM from 'react-dom/client'
import AppContent from './App.jsx'
import { FinanceProvider } from './context/FinanceContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  </React.StrictMode>,
)
