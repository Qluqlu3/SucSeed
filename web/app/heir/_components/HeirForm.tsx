'use client';

// web/app/heir/_components/HeirForm.tsx
//
// 後継者の詳細プロフィールの登録・変更フォーム。Rails 版の HeirCreatePage / HeirUpdatePage と同じ見た目で、
// 違いは見出しと送信先だけ（ボタンの文言は Rails と同じくどちらも「登録」）。

import { api, type HeirDetail } from '@sucseed/api';
import type { ArtCategory } from '@sucseed/ui';
import { type FormEvent, useState } from 'react';
import { toNumberOrNull, useDetailProfileSubmit } from '../../../lib/detailProfile';
import { HeirBox, HeirFrame } from './HeirFrame';

const inputClass =
  'w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none';

export const HeirForm = ({
  heir,
  artCategories,
}: {
  /** 変更なら今の値、登録なら null */
  heir: HeirDetail | null;
  artCategories: ArtCategory[];
}) => {
  const [artCategoryId, setArtCategoryId] = useState(
    heir?.artCategoryId != null ? String(heir.artCategoryId) : '',
  );
  const [introduction, setIntroduction] = useState(heir?.introduction ?? '');
  const { saving, flash, errors, submit } = useDetailProfileSubmit('/heir/show');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = { artCategoryId: toNumberOrNull(artCategoryId), introduction };
    void submit(() => (heir ? api.profile.heir.update(input) : api.profile.heir.create(input)));
  };

  return (
    <HeirFrame title={heir ? '後継者情報更新' : '後継者情報'} flash={flash} errors={errors}>
      <form onSubmit={onSubmit}>
        <div className="w-[80%] h-screen mt-[7%] mx-auto">
          <HeirBox title={<label htmlFor="heir_art_category_id">興味のある分野</label>}>
            <div className={heir ? 'mb-3' : ''}>
              <select
                id="heir_art_category_id"
                className={inputClass}
                value={artCategoryId}
                onChange={(e) => setArtCategoryId(e.target.value)}
              >
                <option value="">選択してください</option>
                {artCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <small className="text-red-500">必須</small>
            </div>
          </HeirBox>

          <HeirBox title={<label htmlFor="heir_introduction">自己紹介</label>}>
            <div className={heir ? 'mb-3' : ''}>
              <textarea
                id="heir_introduction"
                className={inputClass}
                rows={15}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
              />
            </div>
          </HeirBox>

          <div className="mt-[1%] mb-[3%] text-right">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-[23px] text-white hover:opacity-80"
              disabled={saving}
            >
              登録
            </button>
          </div>
        </div>
      </form>
    </HeirFrame>
  );
};
