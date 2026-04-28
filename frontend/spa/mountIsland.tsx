import type { JSX } from 'react';
import { createRoot } from 'react-dom/client';

export const mountIsland = (elementId: string, element: JSX.Element): void => {
  const mountPoint = document.getElementById(elementId);
  if (!mountPoint) {
    return;
  }

  createRoot(mountPoint).render(element);
};
