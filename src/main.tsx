import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SavedProductsProvider } from './context/SavedProductsContext';
import { ToastProvider } from './context/ToastContext';
import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element #root was not found.');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <SavedProductsProvider>
          <App />
        </SavedProductsProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
