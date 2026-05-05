import { mountPage } from '../mountPage';
import { YourPage } from './YourPage';

mountPage('your-page', YourPage, {
  user: { id: 0, name: '', avatarPath: '', isMan: true, birthday: '' },
  creator: { title: '', establishment: 0, employee: 0, profile: null, isRecruitment: false },
  artCategoryName: '',
  isFavorited: false,
  loggedIn: false,
  isOwnPage: false,
  isCreator: false,
  isMatched: false,
  targetUserId: 0,
  flash: {},
});
