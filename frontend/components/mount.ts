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

import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { HelloReact } from "./HelloReact";

// コンポーネント名 → 実体のマッピング
// 新しいコンポーネントを追加したらここに登録する
const COMPONENTS: Record<string, React.ComponentType<any>> = {
  HelloReact,
};

document.addEventListener("DOMContentLoaded", () => {
  // data-react-component 属性を持つ要素を全て取得
  const nodes = document.querySelectorAll<HTMLElement>("[data-react-component]");

  nodes.forEach((node) => {
    const name = node.dataset.reactComponent!;
    const Component = COMPONENTS[name];

    if (!Component) {
      console.warn(`[React] コンポーネント "${name}" が見つかりません。mount.ts の COMPONENTS に追加してください。`);
      return;
    }

    // data-props に JSON で props を渡せる
    const props = node.dataset.props ? JSON.parse(node.dataset.props) : {};

    // React 18 の createRoot API でマウント
    createRoot(node).render(createElement(Component, props));
  });
});
