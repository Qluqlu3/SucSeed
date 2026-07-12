import { mountPage } from '../mountPage';
import { IndexPage } from './IndexPage';

mountPage('index-page', IndexPage, {
  creators: [],
  recommend: null,
  traditionalCrafts: [],
  loggedIn: false,
  isCreator: false,
  flash: {},
});
