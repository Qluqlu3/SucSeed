import type { JSX } from 'react';
import { createRoot } from 'react-dom/client';

export const mountIsland = (elementId: string, element: JSX.Element): HTMLElement | null => {
  const mountPoint = document.getElementById(elementId);
  if (!mountPoint) {
    return null;
  }

  createRoot(mountPoint).render(element);
  return mountPoint;
};
