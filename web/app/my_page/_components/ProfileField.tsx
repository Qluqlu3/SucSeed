// web/app/my_page/_components/ProfileField.tsx
//
// マイページ・プロフィール変更の、見出し付きの1項目の枠。Rails 版と同じ見た目。

import type { ReactNode } from 'react';

export const ProfileField = ({
  title,
  centered = false,
  children,
}: {
  title: string;
  centered?: boolean;
  children: ReactNode;
}) => (
  <div className="min-h-[9vh] w-[93%] mt-[3%] mx-auto border border-p-mid rounded-lg">
    <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">{title}</div>
    <div className={`text-[2.3em] py-[2%] bg-white [&_p]:pl-[1%] ${centered ? 'text-center' : ''}`}>
      {children}
    </div>
  </div>
);
