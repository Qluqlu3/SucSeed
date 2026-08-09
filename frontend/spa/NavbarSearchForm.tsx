import { Search } from 'lucide-react';
import type { FC } from 'react';
import type { ArtCategory } from './sessionTypes';

type NavbarSearchFormProps = {
  artCategories: ArtCategory[];
};

export const NavbarSearchForm: FC<NavbarSearchFormProps> = ({ artCategories }) => (
  <div className="flex items-center">
    {/* 検索は読み取り専用なのでGET。ページネーションのリンクからも同じクエリ形式で絞り込み条件を再現できる */}
    <form method="get" action="/search/user">
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
        <Search className="search_icon" size={20} aria-hidden="true" />
      </button>
    </form>
  </div>
);
