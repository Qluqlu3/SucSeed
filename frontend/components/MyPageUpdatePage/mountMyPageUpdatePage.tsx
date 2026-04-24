import { mountPage } from '../mountPage';
import { MyPageUpdatePage } from './MyPageUpdatePage';

mountPage('my-page-update-page', MyPageUpdatePage, {
  user: { name: '', email: '', profile: null, avatarPath: '' },
  errors: [],
  isCreator: false,
});
