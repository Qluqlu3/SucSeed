import { mountPage } from '../mountPage';
import { YourDiaryPage } from './YourDiaryPage';

mountPage('your-diary-page', YourDiaryPage, {
  diaries: [],
  ownerName: '',
  targetUserId: 0,
  targetIsCreator: false,
  currentUser: null,
  flash: {},
});
