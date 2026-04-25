import { mountPage } from '../mountPage';
import { UserGalleryViewPage } from './UserGalleryViewPage';

mountPage('user-gallery-view-page', UserGalleryViewPage, {
  userName: '',
  userId: 0,
  galleries: [],
});
