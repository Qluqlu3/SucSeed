'use client';

// web/app/creator/edit/page.tsx
//
// 職人の詳細プロフィールの変更（職人のみ）。Rails の CreatorController#edit / update を置き換える。
// 今の値は GET /api/v1/profile/creator、変更は PATCH /api/v1/profile/creator。
// 未登録なら Rails と同じく /creator/show（登録フォーム）へ移す。

import { api, type CreatorDetail } from '@sucseed/api';
import { type ArtCategory, FlashMessages } from '@sucseed/ui';
import { useRouter } from 'next/navigation';
import { type FormEvent, type ReactNode, useEffect } from 'react';
import { useDetailProfileSubmit } from '../../../lib/detailProfile';
import { useResource } from '../../../lib/resource';
import { isCreator, useRequireRole } from '../../../lib/session';
import { FormErrors } from '../../_components/FormErrors';
import { ProfileMenu } from '../../_components/ProfileMenu';
import { useCreatorFields } from '../_components/useCreatorFields';

const loadOwnCreator = () => api.profile.creator.show();

const inputClass =
  'w-[85%]! mx-auto rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none';

// 見出し・今の値・入力欄の箱
const Field = ({
  title,
  htmlFor,
  current,
  children,
}: {
  title: string;
  htmlFor: string;
  current: ReactNode;
  children: ReactNode;
}) => (
  <div className="min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg">
    <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">
      <label htmlFor={htmlFor}>{title}</label>
    </div>
    <div className="text-[27px] py-[2%] bg-white">
      <div className="pl-[2%]">{current}</div>
      {children}
      <small className="pt-0 mt-0 ml-[8%] text-[16px] text-red-600">必須</small>
    </div>
  </div>
);

const CreatorEditForm = ({
  creator,
  artCategories,
}: {
  creator: CreatorDetail;
  artCategories: ArtCategory[];
}) => {
  const fields = useCreatorFields(creator);
  const { saving, flash, errors, submit } = useDetailProfileSubmit('/creator/show');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(() => api.profile.creator.update(fields.toInput()));
  };

  return (
    <div>
      <FormErrors errors={errors} />

      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">制作者情報</h1>

      <FlashMessages flash={flash} />

      <div className="w-[85%] mx-auto mb-[5%] bg-p-light border border-p-mid rounded-[7px]">
        <ProfileMenu isCreator />

        <form onSubmit={onSubmit}>
          <Field title="制作工芸名" htmlFor="creator_title" current={creator.title}>
            <input
              id="creator_title"
              type="text"
              className={inputClass}
              placeholder="制作工芸名"
              value={fields.title}
              onChange={(e) => fields.setTitle(e.target.value)}
            />
          </Field>

          <Field
            title="工芸カテゴリ"
            htmlFor="creator_art_category_id"
            current={creator.artCategoryName}
          >
            <select
              id="creator_art_category_id"
              className={inputClass}
              value={fields.artCategoryId}
              onChange={(e) => fields.setArtCategoryId(e.target.value)}
            >
              <option value="">選択してください</option>
              {artCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            title="創業年数"
            htmlFor="creator_establishment"
            current={`${creator.establishment}年`}
          >
            <input
              id="creator_establishment"
              type="number"
              className={inputClass}
              placeholder="創業年数"
              value={fields.establishment}
              onChange={(e) => fields.setEstablishment(e.target.value)}
            />
          </Field>

          <Field title="従業員数" htmlFor="creator_employee" current={`${creator.employee}人`}>
            <input
              id="creator_employee"
              type="number"
              className={inputClass}
              placeholder="従業員数"
              value={fields.employee}
              onChange={(e) => fields.setEmployee(e.target.value)}
            />
          </Field>

          <Field title="作業所郵便番号" htmlFor="creator_postal_code" current={creator.postalCode}>
            <input
              id="creator_postal_code"
              type="text"
              className={inputClass}
              placeholder="郵便番号"
              value={fields.postalCode}
              onChange={(e) => fields.setPostalCode(e.target.value)}
            />
          </Field>

          <div className="min-h-[9vh] w-[93%] mt-[4vh] mx-auto border-2 border-[#D7CDE9] rounded-lg">
            <div className="pt-[1%] pb-[0.3%] pl-[1.5%] text-[23px] text-white bg-p-brand">
              <label htmlFor="creator_is_recruitment">募集チェック</label>
            </div>
            <div className="text-[27px] py-[2%] bg-white pl-[5%]">
              <input
                id="creator_is_recruitment"
                type="checkbox"
                className="transform-[scale(1.7,1.7)]"
                checked={fields.isRecruitment}
                onChange={(e) => fields.setIsRecruitment(e.target.checked)}
              />
              <label htmlFor="creator_is_recruitment" className="ml-2">
                後継者を募集中
              </label>
            </div>
          </div>

          <div className="text-right mt-[3%] mr-[4%]">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-[23px] text-white hover:opacity-80"
              disabled={saving}
            >
              変更
            </button>
          </div>

          <div className="pb-[5%] mb-[7%]" />
        </form>
      </div>
    </div>
  );
};

export default function CreatorEditPage() {
  const session = useRequireRole(isCreator);
  const state = useResource('me', loadOwnCreator, session !== null);
  const router = useRouter();
  const notRegistered = state.status === 'not_found';

  useEffect(() => {
    if (notRegistered) {
      router.replace('/creator/show');
    }
  }, [notRegistered, router]);

  if (!session || state.status === 'loading' || state.status === 'not_found') {
    return null;
  }

  if (state.status === 'error') {
    return <FlashMessages flash={{ danger: state.message }} />;
  }

  return <CreatorEditForm creator={state.data} artCategories={session.artCategories} />;
}
