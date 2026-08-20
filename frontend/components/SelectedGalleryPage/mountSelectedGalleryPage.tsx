import { mountPage } from '../mountPage';
import { SelectedGalleryPage } from './SelectedGalleryPage';

mountPage('selected-gallery-page', SelectedGalleryPage, {
  galleryId: '',
  dataUrl: '',
  tags: [],
  comment: '',
  createdAt: '',
  goodCount: 0,
  myGood: false,
  comments: [],
  matchTagGalleries: [],
  otherGalleries: [],
  creator: null,
  loggedIn: false,
  currentUser: null,
  flash: {},
});
