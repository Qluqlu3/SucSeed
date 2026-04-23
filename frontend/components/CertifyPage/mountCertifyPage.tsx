import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { CertifyPage } from './CertifyPage';

const rootElement = document.getElementById('certify-page');

if (rootElement) {
  createRoot(rootElement).render(createElement(CertifyPage));
}
