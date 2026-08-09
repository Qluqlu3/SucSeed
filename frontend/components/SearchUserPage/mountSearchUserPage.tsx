import type { ComponentProps } from 'react';
import { mountPage } from '../mountPage';
import { SearchUserPage } from './SearchUserPage';

mountPage<ComponentProps<typeof SearchUserPage>>('search-user-page', SearchUserPage, {
  creators: [],
  pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  artCategoryId: 0,
  flash: {},
});
