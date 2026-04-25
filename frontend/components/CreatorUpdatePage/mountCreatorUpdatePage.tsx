import { mountPage } from '../mountPage';
import { CreatorUpdatePage } from './CreatorUpdatePage';

mountPage('creator-update-page', CreatorUpdatePage, {
  creator: {
    title: '',
    categoryName: '',
    establishment: 0,
    employee: 0,
    postalCode: '',
    isRecruitment: false,
  },
  artCategories: [],
  isCreator: false,
  errors: [],
});
