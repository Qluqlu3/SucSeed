import { mountPage } from '../mountPage';
import { CreatorShowPage } from './CreatorShowPage';

mountPage('creator-show-page', CreatorShowPage, {
  creator: {
    title: '',
    categoryName: '',
    establishment: 0,
    employee: 0,
    postalCode: '',
    isRecruitment: false,
  },
  isCreator: false,
});
