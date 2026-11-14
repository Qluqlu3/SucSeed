'use client';

// web/app/diary/_components/DiaryCards.tsx
//
// 日記の各画面で共通の、カードを並べる部分（空なら「まだありません」）。
// カード自体は Rails 側と共用の DiaryCard（@sucseed/ui）。

import type { DiaryFeedItem, Profile } from '@sucseed/api';
import { DiaryCard } from '@sucseed/ui';

interface Props {
  diaries: DiaryFeedItem[];
  /** 未ログインなら null（コメント欄に「ログインしてください」が出る） */
  currentUser: Profile | null;
  /** マイ日記は全カードに削除ボタンを出す */
  canDelete?: boolean;
}

export const DiaryCards = ({ diaries, currentUser, canDelete = false }: Props) =>
  diaries.length === 0 ? (
    <p className="text-[39px] text-white">まだありません</p>
  ) : (
    diaries.map((entry) => (
      <DiaryCard
        key={entry.diaryId}
        entry={entry}
        currentUserId={currentUser?.id ?? null}
        currentUserName={currentUser?.name ?? null}
        currentUserAvatar={currentUser?.avatarPath ?? null}
        canDelete={canDelete}
      />
    ))
  );
