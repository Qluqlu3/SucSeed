import { mountPage } from '../mountPage';
import { DiarySelectPage } from './DiarySelectPage';

mountPage('diary-select-page', DiarySelectPage, {
  diaries: [],
  currentUser: { id: 0, name: '', avatarPath: '' },
});
