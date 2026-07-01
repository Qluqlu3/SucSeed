import type { FC } from 'react';
import { PostForm } from '../components/PostForm';
import type { ArtCategory } from './sessionTypes';

type NavbarSearchFormProps = {
  artCategories: ArtCategory[];
};

export const NavbarSearchForm: FC<NavbarSearchFormProps> = ({ artCategories }) => (
  <div className="flex items-center">
    <PostForm action="/search/user">
      <select
        name="search[art_category_id]"
        className="rounded border border-gray-300 px-2 py-1 focus:border-p-brand focus:outline-none"
      >
        <option value="">select category ...</option>
        {artCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded px-3 py-2 search_btn">
        <i className="fas fa-search search_icon" aria-hidden="true" />
      </button>
    </PostForm>
  </div>
);
