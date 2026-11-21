// web/app/_components/FormErrors.tsx
//
// API が 422 で返したエラー（error.details）の一覧。Rails 版のフォームの error_explanation と同じ見た目。

export const FormErrors = ({ errors }: { errors: string[] }) =>
  errors.length === 0 ? null : (
    <div id="error_explanation" className="error-box">
      <p className="error-title">入力内容にエラーが{errors.length}件あります</p>
      <ul className="error-index">
        {errors.map((message) => (
          <li key={message} className="error-content">
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
