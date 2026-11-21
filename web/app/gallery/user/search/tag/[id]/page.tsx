'use client';

// web/app/gallery/user/search/tag/[id]/page.tsx
//
// :id の人の作品のタグ検索の結果（未ログインでも見られる）。Rails の GalleryController#search_user_tag を置き換える。
// Rails はフォームの POST で開いていたが、Next では ?search_tag= を付けた GET で開く（TagSearchForm）。
// 作品は GET /api/v1/galleries?user_id=:id&tag=...。Rails の検索結果はいいね数を数えておらず 0 と出ていたが、
// API は数えて返すので正しい数が出る。タグが無ければその人のギャラリーへ移す。

import { FlashMessages } from '@sucseed/ui';
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useAllGalleries } from '../../../../../../lib/galleries';
import { usePublicUser } from '../../../../../../lib/users';
import { GalleryCards } from '../../../../_components/GalleryCards';
import { TagSearchForm } from '../../../../_components/TagSearchForm';

// useSearchParams を使う部分は Suspense の内側に置く（Next のビルドが求める）
export default function GallerySearchPage() {
  return (
    <Suspense fallback={null}>
      <GallerySearchResult />
    </Suspense>
  );
}

const GallerySearchResult = () => {
  const { id } = useParams<{ id: string }>();
  const tag = useSearchParams().get('search_tag')?.trim() ?? '';
  const router = useRouter();
  const owner = usePublicUser(id);
  const { galleries, error } = useAllGalleries(owner.status === 'loaded' && tag !== '', {
    userId: id,
    tag,
  });

  useEffect(() => {
    if (tag === '') {
      router.replace(`/gallery/view/${id}`);
    }
  }, [tag, id, router]);

  if (owner.status === 'not_found') {
    notFound();
  }

  if (owner.status === 'error') {
    return <FlashMessages flash={{ danger: owner.message }} />;
  }

  if (tag === '' || owner.status === 'loading' || (galleries === null && error === null)) {
    return null;
  }

  const items = galleries ?? [];

  return (
    <>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">
        {owner.data.name}さんのギャラリー
      </h1>

      <FlashMessages flash={error ? { danger: error } : {}} />

      <TagSearchForm userId={id} />

      <div className="flex flex-wrap min-h-[70vh] m-0 py-0 px-[0.7%] w-full">
        <div className="w-full p-0 mb-[10%] bg-p-light border border-p-mid rounded-[7px]">
          {items.length === 0 ? (
            <div className="h-[50vh]">
              <p className="mt-[10%] ml-[15%] text-[39px] text-white">検索結果なし</p>
            </div>
          ) : (
            <GalleryCards galleries={items} />
          )}
        </div>
      </div>
    </>
  );
};
