import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  // 指定するとページ全体のエラー画面の代わりにこれを出す（部分的な失敗をその場で扱う用）
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) return this.props.fallback;
      return (
        <div>
          <h1 className="error-title error-page-title">エラーが発生しました</h1>
          <div className="error-page-box">
            <div className="error-btn-box">
              <a
                href="/index"
                className="inline-block rounded bg-gray-200 px-5 py-2 text-lg hover:opacity-80"
              >
                トップページ
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
