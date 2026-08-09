import { mountPage } from '../mountPage';
import { IndexPage } from './IndexPage';

mountPage('index-page', IndexPage, {
  creators: [],
  creatorCountByPrefecture: {},
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  recommend: null,
  traditionalCrafts: [],
  loggedIn: false,
  isCreator: false,
  flash: {},
});
