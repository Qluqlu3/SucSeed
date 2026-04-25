import { mountPage } from '../mountPage';
import { MessagePage } from './MessagePage';

mountPage('message-page', MessagePage, {
  messageLists: [],
  messageHistory: [],
  fromUser: { id: '', avatarPath: '', name: '' },
  toUser: { id: '', avatarPath: '', name: '' },
});
