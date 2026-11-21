'use client';

// web/app/my_page/_components/ProfileMenu.tsx
//
// マイページ・プロフィール変更の右上の歯車メニュー。Rails 版と同じ項目を出す。
// 詳細プロフィール（/creator/show・/heir/show・/heir/edit）はまだ Rails の画面なので通常のリンク。

import { Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const itemClass = 'block px-4 py-2 text-sm hover:bg-gray-100';

export const ProfileMenu = ({
  isCreator,
  className = '',
}: {
  isCreator: boolean;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        className="rounded bg-white border border-gray-300 px-3 py-2 hover:opacity-80"
        type="button"
        id="profileMenuButton"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Settings size={50} />
      </button>
      <ul
        className={`absolute right-0 z-10 mt-1 w-48 rounded bg-white shadow-lg border border-gray-200${open ? '' : ' hidden'}`}
        aria-labelledby="profileMenuButton"
      >
        <li>
          <Link href="/my_page/my_page" className={itemClass}>
            プロフィール一覧
          </Link>
        </li>
        <li>
          <Link href="/my_page/update" className={itemClass}>
            プロフィール変更
          </Link>
        </li>
        {isCreator ? (
          <li>
            <a href="/creator/show" className={itemClass}>
              プロフィール詳細
            </a>
          </li>
        ) : (
          <>
            <li>
              <a href="/heir/show" className={itemClass}>
                プロフィール詳細
              </a>
            </li>
            <li>
              <a href="/heir/edit" className={itemClass}>
                プロフィール詳細変更
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};
