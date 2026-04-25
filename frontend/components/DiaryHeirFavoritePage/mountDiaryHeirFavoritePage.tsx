import { mountPage } from '../mountPage';
import { DiaryHeirFavoritePage } from './DiaryHeirFavoritePage';

mountPage('diary-heir-favorite-page', DiaryHeirFavoritePage, {
  diaries: [],
  currentUser: { id: 0, name: '', avatarPath: '' },
});
