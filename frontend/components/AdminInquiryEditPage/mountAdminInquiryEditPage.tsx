import { mountPage } from '../mountPage';
import { AdminInquiryEditPage } from './AdminInquiryEditPage';

mountPage('admin-inquiry-edit-page', AdminInquiryEditPage, {
  inquiries: [],
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  flash: {},
});
