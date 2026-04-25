import { mountPage } from '../mountPage';
import { SelectedGalleryPage } from './SelectedGalleryPage';

mountPage('selected-gallery-page', SelectedGalleryPage, {
  galleryId: 0,
  dataUrl: '',
  tags: [],
  comment: '',
  createdAt: '',
  goodCount: 0,
  myGood: false,
  comments: [],
  matchTagGalleries: [],
  otherGalleries: [],
  creator: { userId: 0, name: '', avatarPath: '', title: '', establishment: 0, employee: 0 },
  loggedIn: false,
  currentUser: null,
});
