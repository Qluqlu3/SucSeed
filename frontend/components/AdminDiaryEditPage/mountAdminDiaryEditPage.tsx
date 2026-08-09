import { mountPage } from '../mountPage';
import { AdminDiaryEditPage } from './AdminDiaryEditPage';

mountPage('admin-diary-edit-page', AdminDiaryEditPage, {
  diaries: [],
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  flash: {},
});
