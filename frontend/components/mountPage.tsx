import { type ComponentType, createElement } from 'react';
import { createRoot } from 'react-dom/client';

export const mountPage = <P extends object>(
  elementId: string,
  Component: ComponentType<P>,
  fallbackProps?: P,
): void => {
  const rootElement = document.getElementById(elementId);
  if (!rootElement) {
    return;
  }

  const props: P = rootElement.dataset.props
    ? (JSON.parse(rootElement.dataset.props) as P)
    : (fallbackProps ?? ({} as P));

  createRoot(rootElement).render(createElement(Component, props));
};
