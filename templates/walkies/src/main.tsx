import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/fraunces';
import App from './App';
import './styles/foundation.css';
import './styles/sections.css';
import './styles/responsive.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
