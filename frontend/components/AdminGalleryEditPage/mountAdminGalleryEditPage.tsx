import { mountPage } from '../mountPage';
import { AdminGalleryEditPage } from './AdminGalleryEditPage';

mountPage('admin-gallery-edit-page', AdminGalleryEditPage, {
  galleries: [],
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  flash: {},
});
