import { mountPage } from '../mountPage';
import { AdminInquiryDetailPage } from './AdminInquiryDetailPage';

mountPage('admin-inquiry-detail-page', AdminInquiryDetailPage, {
  inquiryDetail: { id: 0, categoryName: '', content: '', createdAt: '' },
  isCheck: false,
});
