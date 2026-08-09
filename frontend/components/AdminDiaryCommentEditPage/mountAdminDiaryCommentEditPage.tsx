import { mountPage } from '../mountPage';
import { AdminDiaryCommentEditPage } from './AdminDiaryCommentEditPage';

mountPage('admin-diary-comment-edit-page', AdminDiaryCommentEditPage, {
  comments: [],
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  flash: {},
});
