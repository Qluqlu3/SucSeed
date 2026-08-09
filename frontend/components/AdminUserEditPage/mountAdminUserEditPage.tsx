import { mountPage } from '../mountPage';
import { AdminUserEditPage } from './AdminUserEditPage';

mountPage('admin-user-edit-page', AdminUserEditPage, {
  users: [],
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  flash: {},
});
