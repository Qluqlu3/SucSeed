import { mountPage } from '../mountPage';
import { MyPage } from './MyPage';

mountPage('my-page', MyPage, {
  user: { name: '', avatarPath: '', isMan: true, email: '', birthday: '', profile: null },
  profileIncomplete: false,
  isCreator: false,
});
