'use client';

// web/app/page/creator/[id]/page.tsx
//
// 職人ページ（未ログインでも見られる）。Rails の YourPageController#creator_show を置き換える。
// 中身は GET /api/v1/creators/:id（閲覧者から見たお気に入り済み・アピール済みも含む）。
// お気に入りは /api/v1/favorites、アピールは POST /api/v1/appeals。
// 職人の詳細プロフィールが無い人・存在しない人は 404 の画面（Rails はトップへ移していた）。

import { type ApiError, api } from '@sucseed/api';
import { CreatorProfileTabs, FlashMessages } from '@sucseed/ui';
import { Star } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import { useResource } from '../../../../lib/resource';
import { isAuthError, redirectToLogin, useSession } from '../../../../lib/session';
import { FixedActionButton, ProfileHero, ProfileSection } from '../../_components/ProfileHero';

// 制作工芸名・ジャンル・創業年数・従業員数の箱
const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="w-full md:w-1/2">
    <div className="mx-auto border-none bg-p-light mb-[25px] rounded-[11px] h-[17vh]">
      <h3 className="text-white bg-p-brand text-[25px] [border-radius:11px_11px_0_0] pt-[3%] pr-0 pb-[1%] pl-[2%]">
        {title}
      </h3>
      <div className="p-[9px] text-center text-[27px]">
        <p className="text-[39px] leading-[9vh]">{value}</p>
      </div>
    </div>
  </div>
);

export default function CreatorPage() {
  const { id } = useParams<{ id: string }>();
  const session = useSession();
  const state = useResource(id, api.creators.show);
  // 押す前は取得した値、押した後は API の返事（null は「まだ押していない」）
  const [favoritedOverride, setIsFavorited] = useState<boolean | null>(null);
  const [appealedOverride, setIsAppealed] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (state.status === 'not_found') {
    notFound();
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  if (state.status === 'loading' || session === null) {
    return null;
  }

  const creator = state.data;
  const loggedIn = session.role !== 'guest';
  const isFavorited = favoritedOverride ?? creator.isFavorited;
  const isAppealed = appealedOverride ?? creator.isAppealed;

  const fail = (error: ApiError) => {
    if (isAuthError(error)) {
      redirectToLogin();
    } else {
      setErrorMessage(error.message);
    }
  };

  const toggleFavorite = async () => {
    setErrorMessage(null);
    const result = isFavorited
      ? await api.favorites.destroy(creator.userId)
      : await api.favorites.create(creator.userId);
    if (result.ok) {
      setIsFavorited(result.data.favorited);
    } else {
      fail(result.error);
    }
  };

  const appeal = async () => {
    setErrorMessage(null);
    const result = await api.appeals.create(creator.userId);
    if (result.ok) {
      setIsAppealed(true);
    } else {
      fail(result.error);
    }
  };

  return (
    <div className="w-full">
      <FlashMessages flash={errorMessage ? { danger: errorMessage } : {}} />

      <ProfileHero
        user={creator.user}
        height="850px"
        badge={
          creator.isRecruitment ? (
            <span className="inline-block rounded bg-p-brand px-2 py-1 text-sm text-white">
              募集中
            </span>
          ) : (
            <span className="inline-block rounded bg-red-600 px-2 py-1 text-sm text-white">
              募集停止中
            </span>
          )
        }
      />

      <div className="w-full h-[50px] bg-p-brand" />

      {/* お気に入り（自分のページには出さない） */}
      <div className="text-right mt-[1%] mr-[2%] mb-[1%]">
        {loggedIn && !creator.isOwn && (
          <button
            type="button"
            className="rounded bg-p-brand px-4 py-2 text-lg text-white hover:opacity-80"
            onClick={toggleFavorite}
            aria-label={isFavorited ? 'お気に入りを解除' : 'お気に入りに追加'}
          >
            {isFavorited ? (
              <Star className="text-p-gold" size={33} fill="currentColor" />
            ) : (
              <Star className="text-white" size={33} />
            )}
          </button>
        )}
      </div>

      <CreatorProfileTabs targetUserId={creator.userId} active="profile" />

      <div className="w-[93%] mx-auto">
        <div className="flex flex-wrap">
          <InfoCard title="制作工芸名" value={creator.title} />
          <InfoCard title="工芸品ジャンル" value={creator.artCategoryName ?? ''} />
        </div>
      </div>

      <div className="w-[93%] mx-auto">
        <div className="flex flex-wrap">
          <InfoCard title="創業年数" value={`${creator.establishment}年`} />
          <InfoCard title="従業員数" value={`${creator.employee}人`} />
        </div>
      </div>

      <ProfileSection title="紹介文">
        <p style={{ whiteSpace: 'pre-wrap' }}>{creator.user.profile}</p>
      </ProfileSection>

      {/* アピールは職人でないログイン中のユーザーだけ */}
      {loggedIn && session.role !== 'creator' && (
        <FixedActionButton
          label="アピール"
          doneLabel="アピール済"
          done={isAppealed}
          onClick={appeal}
        />
      )}
    </div>
  );
}
