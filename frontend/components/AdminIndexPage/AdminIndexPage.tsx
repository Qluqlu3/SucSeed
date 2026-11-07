// frontend/components/AdminIndexPage/AdminIndexPage.tsx
//
// /admin/index ページの React コンポーネント。
// サイドメニュー + 管理者トップ見出しのみ。
//
// 【data-props】なし（props なし）

import { AdminSideMenu } from '../AdminSideMenu';

export const AdminIndexPage = () => (
  <div className="w-full m-0 p-0 overflow-x-scroll overflow-y-scroll flex flex-wrap">
    <AdminSideMenu />
    <div className="w-full lg:w-10/12 h-screen bg-[#EEE] overflow-x-scroll overflow-y-scroll">
      <h1 className="text-center text-[60px]">管理者トップ</h1>
    </div>
  </div>
);
