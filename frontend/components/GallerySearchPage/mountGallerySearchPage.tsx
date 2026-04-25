import { mountPage } from '../mountPage';
import { GallerySearchPage } from './GallerySearchPage';

mountPage('gallery-search-page', GallerySearchPage, { userName: '', userId: 0, galleries: [] });
