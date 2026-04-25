import { mountPage } from '../mountPage';
import { HeirUpdatePage } from './HeirUpdatePage';

mountPage('heir-update-page', HeirUpdatePage, {
  heir: { artCategoryId: 0, introduction: '' },
  artCategories: [],
  errors: [],
});
