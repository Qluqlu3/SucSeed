// frontend/components/HelloReact.tsx
//
// 動作確認用の最小コンポーネント。
// Tailwind CSS のクラスを使って React + Tailwind が両方動いていることを確認する。
// 確認できたら削除して構わない。

interface Props {
  name: string;
}

export const HelloReact = ({ name }: Props) => {
  return (
    <div className='inline-block rounded-md bg-emerald-100 px-4 py-2 text-emerald-800 font-medium shadow-sm'>
      👋 Hello from <strong>React</strong> + <span className='text-sky-600'>Tailwind</span>, {name}!
    </div>
  );
};
