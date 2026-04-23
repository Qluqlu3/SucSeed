import type { ComponentProps } from 'react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { SearchUserPage } from './SearchUserPage';

const rootElement = document.getElementById('search-user-page');

if (rootElement) {
  const props: ComponentProps<typeof SearchUserPage> = rootElement.dataset.props
    ? JSON.parse(rootElement.dataset.props)
    : { creators: [] };

  createRoot(rootElement).render(createElement(SearchUserPage, props));
}
