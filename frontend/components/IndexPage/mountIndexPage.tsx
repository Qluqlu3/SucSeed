import { mountPage } from '../mountPage';
import { IndexPage } from './IndexPage';

mountPage('index-page', IndexPage, {
  creators: [],
  recommend: null,
  loggedIn: false,
  isCreator: false,
});
