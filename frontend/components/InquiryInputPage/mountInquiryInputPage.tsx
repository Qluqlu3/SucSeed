import type { ComponentProps } from 'react';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { InquiryInputPage } from './InquiryInputPage';

const rootElement = document.getElementById('inquiry-input-page');

if (rootElement) {
  const props: ComponentProps<typeof InquiryInputPage> = rootElement.dataset.props
    ? JSON.parse(rootElement.dataset.props)
    : { categories: [], errors: [], prevValues: { inquiryCategoryId: '', content: '' } };

  createRoot(rootElement).render(createElement(InquiryInputPage, props));
}
