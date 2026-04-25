import { mountPage } from '../mountPage';
import { MyDiaryPage } from './MyDiaryPage';

mountPage('my-diary-page', MyDiaryPage, {
  diaries: [],
  errors: [],
  currentUser: { id: 0, name: '', avatarPath: '' },
});
