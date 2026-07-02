import { ChevronRight, Image as ImageIcon } from 'lucide-react';

export interface Creator {
  userId: string;
  name: string;
  title: string;
  avatarPath: string;
  createdAt: string;
  galleryCount: number;
  galleryPreviewPath: string | null;
}

const isNew = (createdAt: string): boolean => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return diffMs <= 3 * 24 * 60 * 60 * 1000;
};

export const CreatorCard = ({ creator }: { creator: Creator }) => (
  <div className="w-1/4 mt-[1.5%] new-box">
    <div className="overflow-hidden relative bg-[url('/assets/card-background.jpg')] transition duration-300 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]">
      {isNew(creator.createdAt) && (
        <span className="inline-block absolute top-[-1%] right-0 m-0 pt-[2.3%] pb-[1.3%] px-0 z-2 w-[17%] text-center text-white text-[1.3vw] bg-p-gold rounded-[7px]">
          NEW
        </span>
      )}
      {/* プロフィールへ */}
      <a
        href={`/page/creator/${creator.userId}`}
        className="block hover:text-[#373737]! hover:opacity-85"
      >
        <div className="text-center">
          <img
            src={creator.avatarPath}
            className="rounded-full h-[30vh] w-[30vw] max-w-[37vw] min-w-[20vw]"
            width={300}
            height={300}
            alt={creator.name}
            loading="lazy"
          />
        </div>
        <div className="p-4 pb-2">
          <h4 className="text-center py-0.75 text-[43px] font-bold">{creator.name}</h4>
          <p className="text-center py-0.75 text-[33px] font-bold">{creator.title}</p>
        </div>
      </a>

      {/* 作品ギャラリーへ直接遷移するショートカット */}
      <a
        href={`/gallery/view/${creator.userId}`}
        className="flex items-center gap-3 border-t border-p-mid bg-p-light px-4 py-3 hover:bg-p-pale"
      >
        {creator.galleryPreviewPath ? (
          <img
            src={creator.galleryPreviewPath}
            className="h-[50px] w-[50px] shrink-0 rounded object-cover"
            width={50}
            height={50}
            alt=""
          />
        ) : (
          <span className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded bg-p-mid text-white">
            <ImageIcon size={22} />
          </span>
        )}
        <span className="flex-1 text-[20px] text-p-text">
          {creator.galleryCount > 0
            ? `作品を見る（${creator.galleryCount}件）`
            : '作品はまだありません'}
        </span>
        <ChevronRight size={20} className="shrink-0 text-p-muted" />
      </a>
    </div>
  </div>
);
