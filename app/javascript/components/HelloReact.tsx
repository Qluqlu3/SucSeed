// app/javascript/components/HelloReact.tsx
//
// 動作確認用の最小コンポーネント。
// React が正しくセットアップされているかを確認するためだけのもの。
// 確認できたら削除して構わない。

interface Props {
  name: string;
}

export const HelloReact = ({ name }: Props) => {
  return (
    <div style={{ padding: "8px 16px", background: "#d1fae5", borderRadius: 6, display: "inline-block" }}>
      👋 Hello from <strong>React</strong>, {name}!
    </div>
  );
};
