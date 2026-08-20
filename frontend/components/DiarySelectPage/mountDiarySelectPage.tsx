import { mountPage } from '../mountPage';
import { DiarySelectPage } from './DiarySelectPage';

mountPage('diary-select-page', DiarySelectPage, {
  diaries: [],
  currentUser: { id: '', name: '', avatarPath: '' },
  flash: {},
});
