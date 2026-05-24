// frontend/components/GalleryCard/GalleryCard.tsx
//
// ギャラリーサムネイルカード共通コンポーネント。
// UserGalleryViewPage / MyGalleryPage / FavoriteGalleryPage / HeirFavoriteGalleryPage で共用。

export interface GalleryItem {
  id: number;
  dataUrl: string;
  tags: string[];
  goodCount: number;
  myGood: boolean;
}

export const GalleryCard = ({ gallery }: { gallery: GalleryItem }) => (
  <div className="col-lg-4 h-auto py-[5px] px-[2px]">
    <a href={`/gallery/selected/${gallery.id}`}>
      <div className="card p-0 w-full border border-p-mid rounded-[0_0_3px_3px] hover:opacity-80">
        <div className="card-header p-0 border-none">
          <img src={gallery.dataUrl} width="100%" height="380px" alt="ギャラリー画像" />
        </div>
        <div className="card-body h-[70px] p-0 bg-p-brand">
          <p className="mt-[10px]">
            {gallery.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="label bg-[#F29626] py-[5px] px-[5px] mx-[3px] rounded-[5px] text-[#181818] text-[18px]">
                {tag}
              </span>
            ))}
          </p>
          <div className="text-right pt-[1%] pr-[2%] text-white">
            <i className="fas fa-thumbs-up text-[23px] text-[#FFA30D]" />
            {gallery.goodCount}
          </div>
        </div>
      </div>
    </a>
  </div>
);
