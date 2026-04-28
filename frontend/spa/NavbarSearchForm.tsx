import type { FC } from 'react';
import { PostForm } from './PostForm';
import type { ArtCategory } from './sessionTypes';

type NavbarSearchFormProps = {
  artCategories: ArtCategory[];
};

export const NavbarSearchForm: FC<NavbarSearchFormProps> = ({ artCategories }) => (
  <div className='form-inline'>
    <PostForm action='/search/user'>
      <select name='search[art_category_id]' className='form-control'>
        <option value=''>select category ...</option>
        {artCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button type='submit' className='btn search_btn'>
        <i className='fas fa-search search_icon' aria-hidden='true' />
      </button>
    </PostForm>
  </div>
);
