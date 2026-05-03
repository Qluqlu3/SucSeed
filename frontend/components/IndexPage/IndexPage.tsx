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

import { FlashMessages } from './FlashMessages';

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
  <div className='col-lg-3 my-card-col new-box'>
    <a href={`/page/creator/${creator.userId}`} className='nav-link'>
      <div className='card profile-card new-tag-content'>
        {isNew(creator.createdAt) && <span className='new-tag'>NEW</span>}
        <div className='text-center'>
          <img src={creator.avatarPath} className='rounded-circle avatar' alt={creator.name} />
        </div>
        <div className='card-body'>
          <h4 className='card-box-name text-center'>{creator.name}</h4>
          <p className='card-box-title text-center'>{creator.title}</p>
        </div>
      </div>
    </a>
  </div>
);

// サービス説明（未ログイン時のみ表示）
const ServiceDescription = () => (
  <>
    <div className='bg-1 text-center bar' />
    <div className='col-lg-12 text-center zone'>
      <h3 className='info-title'>どんなシステム？</h3>
      <div className='col-lg-12 row justify-content-around my-row'>
        <div className='col-lg-4'>
          <div className='three-box'>
            <img
              src='/assets/user.png'
              className='img-responsive margin img-circle img-icon'
              width={100}
              height={100}
              alt='後継者を募れる'
            />
            <h3>後継者を募れる</h3>
            <p>
              素晴らしい伝統技術が失われてしまうのは勿体無い。
              <br />
              次世代に受け継ぐために後継者を募れます。
            </p>
          </div>
        </div>
        <div className='col-lg-4'>
          <div className='three-box'>
            <img
              src='/assets/info.png'
              className='img-responsive margin img-circle img-icon'
              width={100}
              height={100}
              alt='詳細情報を入れる'
            />
            <h3>詳細情報を入れる</h3>
            <p>
              自分の制作している作品を多くの人に宣伝して、知ってもらおう。
              <br />
              魅力を知ってもらうことで作品の評価などに繋がります。
            </p>
          </div>
        </div>
        <div className='col-lg-4'>
          <div className='three-box'>
            <img
              src='/assets/handshake.png'
              className='img-responsive margin img-circle img-icon'
              width={100}
              height={100}
              alt='マッチング'
            />
            <h3>マッチング</h3>
            <p>
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
      <div className='text-center main-visual-box'>
        <img
          src='/assets/main1.jpg'
          className='img-responsive margin main-visual'
          alt='メインヴィジュアル'
          width='100%'
        />
        <h1>
          <img src='/assets/title.png' width='115%' height='115%' alt='SucSeed' />
        </h1>
      </div>

      {/* 未ログイン：サービス説明 */}
      {!loggedIn && <ServiceDescription />}

      {/* おすすめ職人（後継者ログイン時のみ） */}
      {recommend && recommend.length > 0 && (
        <>
          <div className='row card-group justify-content-center my-row'>
            <p className='recommend-title'>おすすめ職人さん</p>
            {recommend.map((creator) => (
              <CreatorCard key={creator.userId} creator={creator} />
            ))}
          </div>
          <div className='recommend-bar' />
        </>
      )}

      {/* 職人カード一覧 */}
      {/* 元 ERB は 4 件ごとに row を分けていたが Bootstrap の col で自動折り返しするため不要 */}
      <div className='row card-group justify-content-center my-row'>
        {creators.map((creator) => (
          <CreatorCard key={creator.userId} creator={creator} />
        ))}
        {creators.length > 0 && <div className='creator-card-last-bottom' />}
      </div>
    </>
  );
};
