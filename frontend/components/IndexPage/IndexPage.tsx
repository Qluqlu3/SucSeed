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

import { FlashMessages } from '../FlashMessages';

// ── 型定義 ──────────────────────────────────────────────────────────
interface Creator {
  userId: string;
  name: string;
  // creators.title（職種・屋号など）
  title: string;
  // CarrierWave が返すアップロード済み画像パス（例: /uploads/user/avatar_path/1/a.jpg）
  avatarPath: string;
  createdAt: string;
}

interface Props {
  creators: Creator[];
  // 後継者ログイン時のみ存在する。未ログイン・職人ログインは null
  recommend: Creator[] | null;
  loggedIn: boolean;
  isCreator: boolean;
  flash: Record<string, string>;
}

// ── ユーティリティ ───────────────────────────────────────────────────

// 登録から 3 日以内なら NEW バッジを表示する。
// 元 ERB の `distance_of_time_in_words_to_now(createdAt).to_i <= 3` に相当。
const isNew = (createdAt: string): boolean => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return diffMs <= 3 * 24 * 60 * 60 * 1000;
};

// ── サブコンポーネント ────────────────────────────────────────────────

// 職人プロフィールカード（一覧・おすすめ共通）
const CreatorCard = ({ creator }: { creator: Creator }) => (
  <div className='w-1/4 mt-[1.5%] new-box hover:opacity-85'>
    <a href={`/page/creator/${creator.userId}`} className='block hover:text-[#373737]!'>
      <div className="overflow-hidden relative bg-[url('/assets/card-background.jpg')] transition duration-300 hover:shadow-[0_8px_16px_0_rgba(0,0,0,0.2)]">
        {isNew(creator.createdAt) && (
          <span className='inline-block absolute top-[-1%] right-0 m-0 pt-[2.3%] pb-[1.3%] px-0 z-2 w-[17%] text-center text-white text-[1.3vw] bg-[#FFA30D] rounded-[7px]'>
            NEW
          </span>
        )}
        <div className='text-center'>
          <img
            src={creator.avatarPath}
            className='rounded-full h-[30vh] w-[30vw] max-w-[37vw] min-w-[20vw]'
            alt={creator.name}
          />
        </div>
        <div className='p-4'>
          <h4 className='text-center py-0.75 text-[43px] font-bold'>{creator.name}</h4>
          <p className='text-center py-0.75 text-[33px] font-bold'>{creator.title}</p>
        </div>
      </div>
    </a>
  </div>
);

// サービス説明（未ログイン時のみ表示）
const ServiceDescription = () => (
  <>
    <div className='bg-p-brand text-center w-full h-15.25' />
    <div className="w-full text-center min-h-[53vh] max-h-[310vh] bg-[url('/assets/main3.jpg')] bg-cover">
      <h3 className='text-[47px] text-white'>どんなシステム？</h3>
      <div className='flex justify-around w-full m-0'>
        <div className='w-1/3'>
              width={100}
              height={100}
              alt='後継者を募れる'
            />
            <h3 className='text-[200%]'>後継者を募れる</h3>
            <p className='mt-[6%] mr-[13%] ml-[13%] text-[130%] text-left'>
              素晴らしい伝統技術が失われてしまうのは勿体無い。
              <br />
              次世代に受け継ぐために後継者を募れます。
            </p>
          </div>
        </div>
        <div className='w-1/3'>
          <div className='pb-[8%] text-white h-[90%] bg-[rgba(80,55,128,0.7)] m-px rounded-[39px] mt-[3%]'>
            <img
              src='/assets/info.png'
              className='rounded-full block mx-auto'
              width={100}
              height={100}
              alt='詳細情報を入れる'
            />
            <h3 className='text-[200%]'>詳細情報を入れる</h3>
            <p className='mt-[6%] mr-[13%] ml-[13%] text-[130%] text-left'>
              自分の制作している作品を多くの人に宣伝して、知ってもらおう。
              <br />
              魅力を知ってもらうことで作品の評価などに繋がります。
            </p>
          </div>
        </div>
        <div className='w-1/3'>
          <div className='pb-[8%] text-white h-[90%] bg-[rgba(80,55,128,0.7)] m-px rounded-[39px] mt-[3%]'>
            <img
              src='/assets/handshake.png'
              className='rounded-full block mx-auto'
              width={100}
              height={100}
              alt='マッチング'
            />
            <h3 className='text-[200%]'>マッチング</h3>
            <p className='mt-[6%] mr-[13%] ml-[13%] text-[130%] text-left'>
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
      <div className='text-center relative'>
        <img
          src='/assets/main1.jpg'
          className='block w-full h-[57em] object-cover'
          alt='メインヴィジュアル'
          width='100%'
        />
        <h1 className='absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 m-0 p-0 text-[170px] font-bold text-white'>
          <img src='/assets/title.png' width='115%' height='115%' alt='SucSeed' />
        </h1>
      </div>

      {/* 未ログイン：サービス説明 */}
      {!loggedIn && <ServiceDescription />}

      {/* おすすめ職人（後継者ログイン時のみ） */}
      {recommend && recommend.length > 0 && (
        <>
          <div className='flex flex-wrap justify-center w-full m-0'>
            <p className='w-full p-0 m-0 text-[#FFA30D] text-[3em] bg-p-brand text-center'>
              おすすめ職人さん
            </p>
            {recommend.map((creator) => (
              <CreatorCard key={creator.userId} creator={creator} />
            ))}
          </div>
          <div className='h-[5vh] w-full bg-p-brand' />
        </>
      )}

      {/* 職人カード一覧 */}
      {/* 元 ERB は 4 件ごとに row を分けていたが Tailwind flex-wrap で自動折り返し */}
      <div className='flex flex-wrap justify-center w-full m-0'>
        {creators.map((creator) => (
          <CreatorCard key={creator.userId} creator={creator} />
        ))}
        {creators.length > 0 && <div className='w-full mt-[5%]' />}
      </div>
    </>
  );
};
