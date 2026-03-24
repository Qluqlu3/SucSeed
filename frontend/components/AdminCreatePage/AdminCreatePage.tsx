// frontend/components/AdminCreatePage/AdminCreatePage.tsx
//
// /admin/create/07392 ページの React コンポーネント。
// 管理者アカウント登録フォーム。POST /admin/create/user。
//
// 【data-props】
//   errors: string[]

interface Props {
  errors: string[];
}

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

export const AdminCreatePage = ({ errors }: Props) => (
  <div>
    <h1 className="admin-main-title">管理者登録</h1>
    {errors.length > 0 && (
      <div id="error_explanation" className="error-box admin-error-box">
        <p className="error-title">入力内容にエラーが{errors.length}件あります</p>
        <ul className="error-index">
          {errors.map((msg, i) => (
            <li key={i} className="error-content">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="admin-create-box">
      <div className="admin-create-box-in">
        <form action="/admin/create/user" method="post">
          <input type="hidden" name="authenticity_token" value={getCsrfToken()} />
          <div className="form-group row create-form-box">
            <label htmlFor="admin_user_id" className="col-sm-2 col-form-label">
              ユーザーID
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                id="admin_user_id"
                name="admin[user_id]"
                className="form-control"
                placeholder="ユーザーID"
              />
            </div>
          </div>
          <div className="form-group row create-form-box">
            <label htmlFor="admin_name" className="col-sm-2 col-form-label">
              名前
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                id="admin_name"
                name="admin[name]"
                className="form-control"
                placeholder="名前"
              />
            </div>
          </div>
          <div className="form-group row create-form-box">
            <label htmlFor="admin_password" className="col-sm-2 col-form-label">
              パスワード
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                id="admin_password"
                name="admin[password]"
                className="form-control"
                placeholder="パスワード"
              />
            </div>
          </div>
          <div className="form-group row create-form-box">
            <label htmlFor="admin_password_confirmation" className="col-sm-2 col-form-label">
              パスワード確認
            </label>
            <div className="col-sm-10">
              <input
                type="password"
                id="admin_password_confirmation"
                name="admin[password_confirmation]"
                className="form-control"
                placeholder="パスワード確認"
              />
            </div>
          </div>
          <div className="text-right">
            <button type="submit" className="btn btn-lg btn-primary">
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);
