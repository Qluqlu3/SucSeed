import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
