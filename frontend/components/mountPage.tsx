import { type ComponentType, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';

// Rails の react_root が出力した要素（id）に Component をマウントする。
// props は data-props 属性の JSON。props を取らない画面（エラー画面など）は属性ごと無い。
export const mountPage = <P extends object>(
  elementId: string,
  Component: ComponentType<P>,
): void => {
  const rootElement = document.getElementById(elementId);
  if (!rootElement) {
    return;
  }

  const props = (rootElement.dataset.props ? JSON.parse(rootElement.dataset.props) : {}) as P;

  createRoot(rootElement).render(
    createElement(ErrorBoundary, null, createElement(Component, props)),
  );
};
