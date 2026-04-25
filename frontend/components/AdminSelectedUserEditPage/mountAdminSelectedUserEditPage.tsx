import { mountPage } from '../mountPage';
import { AdminSelectedUserEditPage } from './AdminSelectedUserEditPage';

mountPage('admin-selected-user-edit-page', AdminSelectedUserEditPage, {
  user: { id: 0, avatarPath: '', profile: '' },
});
