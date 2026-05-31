// frontend/components/Error404Page/Error404Page.tsx
//
// 404 エラーページの React コンポーネント。

export const Error404Page = () => (
  <div>
    <h1 className="error-title error-page-title">エラーが発生しました</h1>
    <div className="error-page-box">
      <div className="error-btn-box">
        <a href="/index" className="inline-block rounded bg-gray-200 px-5 py-2 text-lg hover:opacity-80">
          トップページ
        </a>
      </div>
    </div>
  </div>
);
