import { mountPage } from '../mountPage';
import { YourDiaryPage } from './YourDiaryPage';

mountPage('your-diary-page', YourDiaryPage, {
  diaries: [],
  ownerName: '',
  currentUser: null,
});
