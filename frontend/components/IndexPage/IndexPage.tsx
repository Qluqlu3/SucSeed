// frontend/components/IndexPage.tsx
//
// /index ページ全体の React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creators   : 募集中の職人一覧
//   recommend  : おすすめ職人（後継者ログイン時のみ）
//   logged_in  : ログイン状態
//   is_creator : 職人アカウントか
//
// 【スタイル】
//   既存の index.scss / application.scss / Bootstrap を引き続き使う。
//   Tailwind は今後新規コンポーネントから段階的に導入する。

import { Handshake, Info, UserPlus } from 'lucide-react';
import type { Creator } from '../CreatorCard';
import { CreatorCard } from '../CreatorCard';
import { FlashMessages } from '../FlashMessages';

// サービス説明カードのアイコン共通スタイル（画像アイコンからライブラリアイコンに統一）
const ServiceIcon = ({ icon: IconComponent }: { icon: typeof UserPlus }) => (
  <div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-p-gold">
    <IconComponent className="text-white" size={50} />
  </div>
);

// ── 型定義 ──────────────────────────────────────────────────────────
interface Props {
  creators: Creator[];
  // 後継者ログイン時のみ存在する。未ログイン・職人ログインは null
  recommend: Creator[] | null;
  loggedIn: boolean;
  isCreator: boolean;
  flash: Record<string, string>;
}

// サービス説明（未ログイン時のみ表示）
const ServiceDescription = () => (
  <>
    <div className="bg-p-brand text-center w-full h-15.25" />
    <div className="w-full text-center min-h-[53vh] max-h-[310vh] bg-[url('/assets/main3.jpg')] bg-cover">
      <h3 className="text-[47px] text-white">どんなシステム？</h3>
      <div className="flex justify-around w-full m-0">
        <div className="w-1/3">
          <div className="pb-[8%] text-white h-[90%] bg-[rgba(80,55,128,0.7)] m-px rounded-[39px] mt-[3%]">
            <ServiceIcon icon={UserPlus} />
            <h3 className="text-[200%]">後継者を募れる</h3>
            <p className="mt-[6%] mr-[13%] ml-[13%] text-[130%] text-left">
              素晴らしい伝統技術が失われてしまうのは勿体無い。
              <br />
              次世代に受け継ぐために後継者を募れます。
            </p>
          </div>
        </div>
        <div className="w-1/3">
          <div className="pb-[8%] text-white h-[90%] bg-[rgba(80,55,128,0.7)] m-px rounded-[39px] mt-[3%]">
            <ServiceIcon icon={Info} />
            <h3 className="text-[200%]">詳細情報を入れる</h3>
            <p className="mt-[6%] mr-[13%] ml-[13%] text-[130%] text-left">
              自分の制作している作品を多くの人に宣伝して、知ってもらおう。
              <br />
              魅力を知ってもらうことで作品の評価などに繋がります。
            </p>
          </div>
        </div>
        <div className="w-1/3">
          <div className="pb-[8%] text-white h-[90%] bg-[rgba(80,55,128,0.7)] m-px rounded-[39px] mt-[3%]">
            <ServiceIcon icon={Handshake} />
            <h3 className="text-[200%]">マッチング</h3>
            <p className="mt-[6%] mr-[13%] ml-[13%] text-[130%] text-left">
              制作者サイドはスカウト機能で気になった方をスカウトしてお話ができます。
              <br />
              後継を検討されている方はアピール機能で自分を宣伝できます。
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);

// ── メインコンポーネント ──────────────────────────────────────────────
export const IndexPage = ({ creators, recommend, loggedIn, flash }: Props) => {
  return (
    <>
      <FlashMessages flash={flash} />

      {/* メインビジュアル */}
      <div className="text-center relative">
        <img
          src="/assets/main1.jpg"
          className="block w-full h-[57em] object-cover"
          alt="メインヴィジュアル"
          width="100%"
        />
        <h1 className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 m-0 p-0 text-[170px] font-bold text-white">
          <img src="/assets/title.png" width="115%" height="115%" alt="SucSeed" />
        </h1>
      </div>

      {/* 未ログイン：サービス説明 */}
      {!loggedIn && <ServiceDescription />}

      {/* おすすめ職人（後継者ログイン時のみ） */}
      {recommend && recommend.length > 0 && (
        <>
          <div className="flex flex-wrap justify-center w-full m-0">
            <p className="w-full p-0 m-0 text-p-gold text-[3em] bg-p-brand text-center">
              おすすめ職人さん
            </p>
            {recommend.map((creator) => (
              <CreatorCard key={creator.userId} creator={creator} />
            ))}
          </div>
          <div className="h-[5vh] w-full bg-p-brand" />
        </>
      )}

      {/* 職人カード一覧 */}
      {/* 元 ERB は 4 件ごとに row を分けていたが Tailwind flex-wrap で自動折り返し */}
      <div className="flex flex-wrap justify-center w-full m-0">
        {creators.map((creator) => (
          <CreatorCard key={creator.userId} creator={creator} />
        ))}
        {creators.length > 0 && <div className="w-full mt-[5%]" />}
      </div>
    </>
  );
};
