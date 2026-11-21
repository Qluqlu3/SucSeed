'use client';

// web/app/creator/_components/useCreatorFields.ts
//
// 職人の詳細プロフィールの登録・変更フォームの入力。数値欄は入力途中の空欄を許すため文字列で持つ。

import type { CreatorDetail, CreatorProfileInput } from '@sucseed/api';
import { useState } from 'react';
import { toNumberOrNull } from '../../../lib/detailProfile';

export const useCreatorFields = (initial: CreatorDetail | null) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [artCategoryId, setArtCategoryId] = useState(initial ? String(initial.artCategoryId) : '');
  const [establishment, setEstablishment] = useState(initial ? String(initial.establishment) : '');
  const [employee, setEmployee] = useState(initial ? String(initial.employee) : '');
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? '');
  // 登録フォームは Rails と同じく「募集中」にチェックが入った状態から始める
  const [isRecruitment, setIsRecruitment] = useState(initial?.isRecruitment ?? true);

  const toInput = (): CreatorProfileInput => ({
    title,
    artCategoryId: toNumberOrNull(artCategoryId),
    establishment: toNumberOrNull(establishment),
    employee: toNumberOrNull(employee),
    postalCode,
    isRecruitment,
  });

  return {
    title,
    setTitle,
    artCategoryId,
    setArtCategoryId,
    establishment,
    setEstablishment,
    employee,
    setEmployee,
    postalCode,
    setPostalCode,
    isRecruitment,
    setIsRecruitment,
    toInput,
  };
};
