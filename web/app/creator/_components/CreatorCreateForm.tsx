'use client';

// web/app/creator/_components/CreatorCreateForm.tsx
//
// 職人の詳細プロフィールの登録フォーム（/creator/show で未登録のときに出す）。
// Rails 版（frontend/components/CreatorCreatePage）と同じ見た目。送信は POST /api/v1/profile/creator。

import { api } from '@sucseed/api';
import { type ArtCategory, FlashMessages } from '@sucseed/ui';
import type { FormEvent, ReactNode } from 'react';
import { useDetailProfileSubmit } from '../../../lib/detailProfile';
import { FormErrors } from '../../_components/FormErrors';
import { useCreatorFields } from './useCreatorFields';

const inputClass =
  'w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none';

const Row = ({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint: string;
  children: ReactNode;
}) => (
  <div className="flex my-[2.7%] min-h-[9vh]">
    <div className="w-1/6 shrink-0 pt-[0.7%] text-[19px] text-p-text">
      {htmlFor ? (
        <label htmlFor={htmlFor} className="form-input-label">
          {label}
        </label>
      ) : (
        label
      )}
    </div>
    <div className="flex-1">
      {children}
      <small className="text-p-muted text-[13px] m-0 p-0">{hint}</small>
    </div>
  </div>
);

export const CreatorCreateForm = ({ artCategories }: { artCategories: ArtCategory[] }) => {
  const fields = useCreatorFields(null);
  const { saving, flash, errors, submit } = useDetailProfileSubmit('/creator/show');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submit(() => api.profile.creator.create(fields.toInput()));
  };

  return (
    <div>
      <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">制作者情報</h1>

      <FlashMessages flash={flash} />

      <div className="min-h-screen">
        <div className="w-[85%] mx-auto mb-[5%] bg-p-light border border-p-mid rounded-[7px]">
          <FormErrors errors={errors} />

          <form onSubmit={onSubmit}>
            <Row label="制作工芸名" htmlFor="creator_title" hint="必須 30文字以内">
              <input
                id="creator_title"
                type="text"
                className={inputClass}
                placeholder="制作工芸名"
                maxLength={30}
                value={fields.title}
                onChange={(e) => fields.setTitle(e.target.value)}
              />
            </Row>

            <Row label="工芸カテゴリ" htmlFor="creator_art_category_id" hint="必須　選択">
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
            </Row>

            <Row label="創業年数" htmlFor="creator_establishment" hint="必須">
              <input
                id="creator_establishment"
                type="number"
                className={inputClass}
                placeholder="創業年数"
                min={0}
                max={500}
                value={fields.establishment}
                onChange={(e) => fields.setEstablishment(e.target.value)}
              />
            </Row>

            <Row label="従業員数" htmlFor="creator_employee" hint="必須">
              <input
                id="creator_employee"
                type="number"
                className={inputClass}
                placeholder="従業員数"
                min={0}
                max={500}
                value={fields.employee}
                onChange={(e) => fields.setEmployee(e.target.value)}
              />
            </Row>

            <Row
              label="作業所郵便番号"
              htmlFor="creator_postal_code"
              hint="必須　半角数字ハイフンなし7文字"
            >
              <input
                id="creator_postal_code"
                type="text"
                className={inputClass}
                placeholder="作業所郵便番号"
                maxLength={7}
                value={fields.postalCode}
                onChange={(e) => fields.setPostalCode(e.target.value)}
              />
            </Row>

            <Row label="募集チェック" hint="必須　募集している場合はチェック">
              <input
                id="creator_is_recruitment"
                type="checkbox"
                className="ml-[0.1%]"
                checked={fields.isRecruitment}
                onChange={(e) => fields.setIsRecruitment(e.target.checked)}
              />
              <label htmlFor="creator_is_recruitment" className="ml-[2%] text-[20px] text-p-text">
                後継者を募集中
              </label>
            </Row>

            <div className="text-right mt-[5%] mr-[1%] mb-[1%]">
              <button
                type="submit"
                className="rounded bg-p-brand px-5 py-2 text-[23px] text-white hover:opacity-80"
                disabled={saving}
              >
                登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
