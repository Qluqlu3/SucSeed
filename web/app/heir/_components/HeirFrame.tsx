// web/app/heir/_components/HeirFrame.tsx
//
// 後継者の詳細プロフィールの3画面（参照・登録・変更）に共通の見出し・枠・歯車メニュー。
// Rails 版（frontend/components/HeirShowPage ほか）と同じ見た目。

import { type Flash, FlashMessages } from '@sucseed/ui';
import type { ReactNode } from 'react';
import { ProfileMenu } from '../../_components/ProfileMenu';

export const HeirFrame = ({
  title,
  flash = {},
  errors = [],
  children,
}: {
  title: string;
  flash?: Flash;
  errors?: string[];
  children: ReactNode;
}) => (
  <div>
    <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">{title}</h1>

    <FlashMessages flash={flash} />

    <div className="w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]">
      {errors.length > 0 && (
        <div
          id="error_explanation"
          className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700"
        >
          <ul>
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <ProfileMenu isCreator={false} />

      {children}
    </div>
  </div>
);

/** 見出し付きの箱（興味のある分野・自己紹介） */
export const HeirBox = ({ title, children }: { title: ReactNode; children: ReactNode }) => (
  <div className="mb-[3%] border border-p-mid rounded overflow-hidden">
    <div className="px-3 py-2 text-[17px] text-white bg-p-brand">{title}</div>
    <div className="bg-white p-3">{children}</div>
  </div>
);
