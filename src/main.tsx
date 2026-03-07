import React from 'react';
window.addEventListener('error', (e) => {
  console.error('[MD Solution] Erro global:', e.message, e.filename, e.lineno);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[MD Solution] Promise rejeitada:', e.reason?.message || e.reason);
});
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { HelmetProvider } from 'react-helmet-async';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const appComponent = (
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Lógica crucial de Hydration SEO SSR
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, appComponent);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(appComponent);
}
