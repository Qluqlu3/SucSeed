// frontend/components/Error500Page/Error500Page.tsx
//
// 500 エラーページの React コンポーネント。

export const Error500Page = () => (
  <div>
    <h1 className="error-title error-page-title">エラーが発生しました</h1>
    <div className="error-page-box">
      <div className="error-btn-box">
        <a href="/index" className="btn btn-lg btn-default">
          トップページ
        </a>
      </div>
    </div>
  </div>
);
