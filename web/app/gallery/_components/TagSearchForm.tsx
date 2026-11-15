'use client';

// web/app/gallery/_components/TagSearchForm.tsx
//
// :id の人の作品をタグで探すフォーム。Rails は POST /gallery/user/search/tag/:id で検索結果の画面を返していたが、
// Next の画面は GET でしか開けないので、同じパスにクエリ（?search_tag=）を付けて移る。
// 空のまま送ったときは何もしない（Rails も 204 を返し、画面は変わらなかった）。

import type { Id } from '@sucseed/api';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

export const tagSearchPath = (userId: Id, tag: string): string =>
  `/gallery/user/search/tag/${userId}?search_tag=${encodeURIComponent(tag)}`;

export const TagSearchForm = ({ userId }: { userId: Id }) => {
  const router = useRouter();
  const [tag, setTag] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = tag.trim();
    if (trimmed === '') {
      return;
    }
    router.push(tagSearchPath(userId, trimmed));
  };

  return (
    <div className="w-full pr-[2%] pb-[1%] text-right">
      <form onSubmit={handleSubmit} className="inline-flex">
        <input
          type="text"
          name="search_tag"
          className="rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
          placeholder="search tag ..."
          value={tag}
          onChange={(event) => setTag(event.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-p-brand px-3 py-2 text-white hover:opacity-80 search_btn"
          aria-label="タグで検索"
        >
          <Search className="search_icon" size={20} />
        </button>
      </form>
    </div>
  );
};
