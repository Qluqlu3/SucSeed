// frontend/components/AdminLoginPage/AdminLoginPage.tsx
//
// /admin/login ページの React コンポーネント。
// フォームは POST /admin/login。
//
// 【data-props】なし（props なし）

import { getCsrfToken } from '../../utils/csrf';

export const AdminLoginPage = () => (
  <div>
    <h1 className="admin-main-title">管理者ログイン</h1>
    <div className="admin-wrapper">
      <div className="admin-login-from-box">
        <form action="/admin/login" method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <div className="form-group">
            <label htmlFor="admin_user_id">ユーザーID</label>
            <input
              type="text"
              id="admin_user_id"
              name="admin[user_id]"
              className="form-control"
              placeholder="ユーザーID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin_password">パスワード</label>
            <input
              type="password"
              id="admin_password"
              name="admin[password]"
              className="form-control"
              placeholder="パスワード"
            />
          </div>
          <div className="text-right">
            <button type="submit" className="btn btn-primary">
              ログイン
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
