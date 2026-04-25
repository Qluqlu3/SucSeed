import { mountPage } from '../mountPage';
import { HeirShowPage } from './HeirShowPage';

mountPage('heir-show-page', HeirShowPage, {
  heir: { artCategoryName: '', introduction: '' },
});
