'use client';

// web/app/_components/ProfileMenu.tsx
//
// マイページ・プロフィール変更・詳細プロフィールの画面の右上にある歯車メニュー。
// Rails 版は画面ごとに項目が少しずつ違っていた（マイページでは職人に「詳細変更」が無い、
// 後継者の詳細画面だけ「プロフィール詳細一覧」など）ので、どの画面でも同じ項目に揃えた。

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
        <li>
          <Link href={isCreator ? '/creator/show' : '/heir/show'} className={itemClass}>
            プロフィール詳細
          </Link>
        </li>
        <li>
          <Link href={isCreator ? '/creator/edit' : '/heir/edit'} className={itemClass}>
            プロフィール詳細変更
          </Link>
        </li>
      </ul>
    </div>
  );
};
