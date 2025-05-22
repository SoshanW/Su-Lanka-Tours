import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { AppProvider } from './contexts/AppContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

// Lazy load App component
const App = lazy(() => import('./App.jsx'));

// Simple loading component
const Loading = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AppProvider>
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        </AppProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);