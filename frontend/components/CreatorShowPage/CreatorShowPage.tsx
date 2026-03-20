// frontend/components/CreatorShowPage/CreatorShowPage.tsx
//
// /creator/show ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creator : { title, categoryName, establishment, employee,
//               postalCode, isRecruitment }
//   isCreator : 職人セッションかどうか（設定ドロップダウンの出し分けに使用）

// ── 型定義 ──────────────────────────────────────────────────────────
interface CreatorDetail {
  title: string;
  categoryName: string;
  establishment: number;
  employee: number;
  postalCode: string;
  isRecruitment: boolean;
}

interface Props {
  creator: CreatorDetail;
  isCreator: boolean;
}

// ── コンポーネント ───────────────────────────────────────────────────

export const CreatorShowPage = ({ creator, isCreator }: Props) => (
  <div>
    <h1 className="main-title">制作者情報</h1>
    <div className="all-cover-box">
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
          <ul
            className="dropdown-menu dropdown-menu-right dropdown-box"
            aria-labelledby="dropdownMenu1"
          >
            <li className="setting-item">
              <a href="/my_page/my_page" className="dropdown-item">
                プロフィール一覧
              </a>
            </li>
            <li className="setting-item">
              <a href="/my_page/update" className="dropdown-item">
                プロフィール変更
              </a>
            </li>
            {isCreator ? (
              <>
                <li className="setting-item">
                  <a href="/creator/show" className="dropdown-item">
                    プロフィール詳細
                  </a>
                </li>
                <li className="setting-item">
                  <a href="/creator/edit" className="dropdown-item">
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="setting-item">
                  <a href="/heir/show" className="dropdown-item">
                    プロフィール詳細
                  </a>
                </li>
                <li className="setting-item">
                  <a href="/heir/edit" className="dropdown-item">
                    プロフィール詳細変更
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="card out-line">
          <div className="card-header my-card-header">工芸名</div>
          <div className="card-body my-card-body text-center">{creator.title}</div>
        </div>

        <div className="card out-line">
          <div className="card-header my-card-header">工芸カテゴリー</div>
          <div className="card-body my-card-body text-center">{creator.categoryName}</div>
        </div>

        <div className="card out-line">
          <div className="card-header my-card-header">創業年数</div>
          <div className="card-body my-card-body text-center">{creator.establishment}年</div>
        </div>

        <div className="card out-line">
          <div className="card-header my-card-header">従業員数</div>
          <div className="card-body my-card-body text-center">{creator.employee}人</div>
        </div>

        <div className="card out-line">
          <div className="card-header my-card-header">作業所郵便番号</div>
          <div className="card-body my-card-body text-center">{creator.postalCode}</div>
        </div>

        <div className="card out-line">
          <div className="card-header my-card-header">募集チェック</div>
          <div className="card-body my-card-body text-center">
            <p>{creator.isRecruitment ? '募集中' : '募集停止中'}</p>
          </div>
        </div>

        <div className="bottom-box" />
      </div>
    </div>
  </div>
);
