// app/javascript/components/mount.ts
//
// ERB のページに埋め込まれた <div data-react-component="..."> を探して
// 対応する React コンポーネントを自動的にマウントする仕組み。
//
// 使い方（ERB 側）:
//   <div data-react-component="HelloReact" data-props='{"name":"世界"}'></div>
//
// 【この仕組みの利点】
//   - ERB への変更が最小限（div を置くだけ）
//   - どのページでも同じ書き方でコンポーネントをマウントできる
//   - モノレポ移行時はこのファイルを削除し、
//     frontend 側で React Router を使ったフルSPA に切り替える

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { HelloReact } from './HelloReact';

// JSON.parse の戻り値は any なので、ジェネリクス関数を経由すると
// ComponentType<P> に as なしで渡せる。
// 型の不確かな境界をこの関数一箇所に集約する。
// P extends object: React の createElement が内部で要求する制約と揃える
function mount<P extends object>(Component: React.ComponentType<P>, node: HTMLElement): void {
  // JSON.parse は any を返す → P への代入が型安全に通る
  const props = node.dataset.props ? JSON.parse(node.dataset.props) : {};
  createRoot(node).render(createElement(Component, props));
}

// コンポーネント名 → マウント関数のマッピング
// 新しいコンポーネントを追加したらここに登録する
type MountFn = (node: HTMLElement) => void;

const COMPONENTS: Record<string, MountFn> = {
  HelloReact: (node) => mount(HelloReact, node),
};

document.addEventListener('DOMContentLoaded', () => {
  // data-react-component 属性を持つ要素を全て取得
  const nodes = document.querySelectorAll<HTMLElement>('[data-react-component]');

  nodes.forEach((node) => {
    const name = node.dataset.reactComponent;
    if (!name) return;

    const mountFn = COMPONENTS[name];

    if (!mountFn) {
      // biome-ignore lint/suspicious/noConsole: 開発者向けのデバッグ警告（意図的）
      console.warn(
        `[React] コンポーネント "${name}" が見つかりません。mount.ts の COMPONENTS に追加してください。`,
      );
      return;
    }

    // React 18 の createRoot API でマウント
    mountFn(node);
  });
});
