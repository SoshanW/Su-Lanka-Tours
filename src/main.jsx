// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AppProvider } from './contexts/AppContext.jsx'
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);