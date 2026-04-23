import type { ComponentProps } from 'react';
import { mountPage } from '../mountPage';
import { InquiryInputPage } from './InquiryInputPage';

mountPage<ComponentProps<typeof InquiryInputPage>>('inquiry-input-page', InquiryInputPage, {
  categories: [],
  errors: [],
  prevValues: { inquiryCategoryId: '', content: '' },
});
