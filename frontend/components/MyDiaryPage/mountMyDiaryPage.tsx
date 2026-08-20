import { mountPage } from '../mountPage';
import { MyDiaryPage } from './MyDiaryPage';

mountPage('my-diary-page', MyDiaryPage, {
  diaries: [],
  errors: [],
  currentUser: { id: '', name: '', avatarPath: '' },
  flash: {},
});
