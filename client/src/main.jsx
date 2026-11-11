import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { ContentProvider } from './lib/content.jsx';
import './styles.css';

// The preview build runs inside a sandboxed frame, so it keeps routes in memory.
const Router = import.meta.env.VITE_DEMO === '1' ? MemoryRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ContentProvider>
        <App />
      </ContentProvider>
    </Router>
  </React.StrictMode>
);
