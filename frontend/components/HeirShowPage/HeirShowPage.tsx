// frontend/components/HeirShowPage/HeirShowPage.tsx
//
// /heir/show（登録済み参照）ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   heir : { artCategoryName, introduction }

// ── 型定義 ──────────────────────────────────────────────────────────
interface Props {
  heir: {
    artCategoryName: string;
    introduction: string;
  };
}

// ── コンポーネント ───────────────────────────────────────────────────

export const HeirShowPage = ({ heir }: Props) => (
  <div>
    <h1 className="main-title">後継者情報参照</h1>
    <div className="wrapper">
      {/* 編集メニュー */}
      <div className="dropdown dropdown-right">
        <button
          type="button"
          className="btn btn-default dropdown-toggle"
          id="dropdownMenu1"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
        >
          <i className="fas fa-cog setting-icon" />
        </button>
        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
          <li>
            <a href="/my_page/my_page" className="dropdown-item">
              プロフィール一覧
            </a>
          </li>
          <li>
            <a href="/my_page/update" className="dropdown-item">
              プロフィール変更
            </a>
          </li>
          <li>
            <a href="/heir/show" className="dropdown-item">
              プロフィール詳細一覧
            </a>
          </li>
          <li>
            <a href="/heir/edit" className="dropdown-item">
              プロフィール詳細変更
            </a>
          </li>
        </ul>
      </div>

      <div className="my-card-box">
        <div className="card my-card">
          <div className="card-header my-card-header">興味のある分野</div>
          <div className="card-body my-card-body">
            <p className="my-card-text">{heir.artCategoryName}</p>
          </div>
        </div>

        <div className="card my-card">
          <div className="card-header my-card-header">自己紹介</div>
          <div className="card-body my-card-body">
            <p className="my-card-text">{heir.introduction}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
