import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppShell } from './AppShell';

const rootElement = document.getElementById('spa-root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppShell />
    </StrictMode>,
  );
}
