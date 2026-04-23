import type { ComponentProps } from 'react';
import { mountPage } from '../mountPage';
import { SearchUserPage } from './SearchUserPage';

mountPage<ComponentProps<typeof SearchUserPage>>('search-user-page', SearchUserPage, {
  creators: [],
});
