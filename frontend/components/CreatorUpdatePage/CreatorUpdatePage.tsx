// frontend/components/CreatorUpdatePage/CreatorUpdatePage.tsx
//
// /creator/edit ページの React コンポーネント。
// ERB の data-props から Rails が組み立てた JSON を受け取って描画する。
//
// 【data-props に含まれるデータ】
//   creator      : 現在の職人情報
//   artCategories: ArtCategory 一覧
//   isCreator    : 職人セッションかどうか（設定ドロップダウンの出し分け）
//   errors       : バリデーションエラー文字列の配列

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';

// ── 型定義 ──────────────────────────────────────────────────────────
interface ArtCategory {
  id: number;
  name: string;
}

interface CreatorDetail {
  title: string;
  artCategoryId: number;
  categoryName: string;
  establishment: number;
  employee: number;
  postalCode: string;
  isRecruitment: boolean;
}

interface Props {
  creator: CreatorDetail;
  artCategories: ArtCategory[];
  isCreator: boolean;
  errors: string[];
}

// ── コンポーネント ───────────────────────────────────────────────────

export const CreatorUpdatePage = ({ creator, artCategories, isCreator, errors }: Props) => {
  const [title, setTitle] = useState(creator.title);
  const [artCategoryId, setArtCategoryId] = useState(creator.artCategoryId);
  const [establishment, setEstablishment] = useState(creator.establishment);
  const [employee, setEmployee] = useState(creator.employee);
  const [postalCode, setPostalCode] = useState(creator.postalCode);
  const [isRecruitment, setIsRecruitment] = useState(creator.isRecruitment);

  return (
    <div>
      {errors.length > 0 && (
        <div id="error_explanation" className="error-box">
          <p className="error-title">入力内容にエラーが{errors.length}件あります</p>
          <ul className="error-index">
            {errors.map((msg) => (
              <li key={msg} className="error-content">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h1 className="main-title">制作者情報</h1>

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

        <form action="/creator/edit" method="post">
          <input type="hidden" name="_method" value="patch" />
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />

          <div className="card out-line">
            <div className="card-header my-card-header">
              <label htmlFor="art_category_title">制作工芸名</label>
            </div>
            <div className="card-body my-card-body text-left">
              <div className="update-form-text">{creator.title}</div>
              <input
                id="art_category_title"
                type="text"
                name="art_category[title]"
                className="form-control update-form-input"
                placeholder="制作工芸名"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <small className="update-form-sub-text">必須</small>
            </div>
          </div>

          <div className="card out-line">
            <div className="card-header my-card-header">
              <label htmlFor="art_category_art_category_id">工芸カテゴリ</label>
            </div>
            <div className="card-body my-card-body text-left">
              <div className="update-form-text">{creator.categoryName}</div>
              <select
                id="art_category_art_category_id"
                name="art_category[art_category_id]"
                className="form-control update-form-input"
                value={artCategoryId}
                onChange={(e) => setArtCategoryId(Number(e.target.value))}
              >
                <option value="">選択してください</option>
                {artCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <small className="update-form-sub-text">必須</small>
            </div>
          </div>

          <div className="card out-line">
            <div className="card-header my-card-header">
              <label htmlFor="art_category_establishment">創業年数</label>
            </div>
            <div className="card-body my-card-body text-left">
              <div className="update-form-text">{creator.establishment}年</div>
              <input
                id="art_category_establishment"
                type="number"
                name="art_category[establishment]"
                className="form-control update-form-input"
                placeholder="創業年数"
                value={establishment}
                onChange={(e) => setEstablishment(Number(e.target.value))}
              />
              <small className="update-form-sub-text">必須</small>
            </div>
          </div>

          <div className="card out-line">
            <div className="card-header my-card-header">
              <label htmlFor="art_category_employee">従業員数</label>
            </div>
            <div className="card-body my-card-body text-left">
              <div className="update-form-text">{creator.employee}人</div>
              <input
                id="art_category_employee"
                type="number"
                name="art_category[employee]"
                className="form-control update-form-input"
                placeholder="従業員数"
                value={employee}
                onChange={(e) => setEmployee(Number(e.target.value))}
              />
              <small className="update-form-sub-text">必須</small>
            </div>
          </div>

          <div className="card out-line">
            <div className="card-header my-card-header">
              <label htmlFor="art_category_postal_code">作業所郵便番号</label>
            </div>
            <div className="card-body my-card-body text-left">
              <div className="update-form-text">{creator.postalCode}</div>
              <input
                id="art_category_postal_code"
                type="text"
                name="art_category[postal_code]"
                className="form-control update-form-input"
                placeholder="郵便番号"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <small className="update-form-sub-text">必須</small>
            </div>
          </div>

          <div className="card out-line">
            <div className="card-header my-card-header">
              <label htmlFor="art_category_is_recruitment">募集チェック</label>
            </div>
            <div className="card-body my-card-body text-left update-form-check">
              <input
                id="art_category_is_recruitment"
                type="checkbox"
                name="art_category[is_recruitment]"
                className="form-check-input update-check-box"
                value="1"
                checked={isRecruitment}
                onChange={(e) => setIsRecruitment(e.target.checked)}
              />
              {/* チェックなし時に "0" を送信するための hidden */}
              <input type="hidden" name="art_category[is_recruitment]" value="0" />
              <label htmlFor="art_category_is_recruitment" className="form-check-label">
                後継者を募集中
              </label>
            </div>
          </div>

          <div className="text-right update-btn-box">
            <button type="submit" className="btn btn-lg my-update-btn">
              変更
            </button>
          </div>

          <div className="bottom-box" />
        </form>
      </div>
    </div>
  );
};
