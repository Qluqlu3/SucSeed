import { mountPage } from '../mountPage';
import { HeirPage } from './HeirPage';

mountPage('heir-page', HeirPage, {
  user: { id: 0, name: '', avatarPath: '', isMan: true, birthday: '', profile: null },
  artName: null,
  isScouted: false,
  loggedIn: false,
  isCreator: false,
  targetUserId: 0,
});
