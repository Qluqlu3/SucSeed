'use client';

// web/lib/detailProfile.ts
//
// 職人/後継者の詳細プロフィールの登録・変更フォームの送信。
// 成功したら Rails と同じく「保存しました」を出して参照画面（/creator/show・/heir/show）へ移る。
// 失敗したら入力を残したまま「エラーが発生しました」と理由の一覧を出す
// （Rails は変更の失敗で入力を捨てて変更画面へ戻し、後継者の登録の失敗では理由も出していなかった）。

import type { ApiResult } from '@sucseed/api';
import { type Flash, pushFlash } from '@sucseed/ui';
import { useState } from 'react';
import { isAuthError, redirectToLogin } from './session';

// Rails の flash（t('flash.success.saved') / t('flash.danger.error')）と同じ文言
const SAVED = '保存しました';
const FAILED = 'エラーが発生しました';

export const useDetailProfileSubmit = (afterSavePath: '/creator/show' | '/heir/show') => {
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>({});
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async (save: () => Promise<ApiResult<unknown>>) => {
    setSaving(true);
    setFlash({});
    setErrors([]);
    const result = await save();
    if (result.ok) {
      pushFlash('success', SAVED);
      // 後継者は登録でロールが変わりナビバーも変わるので、Next の画面でも読み込み直す
      window.location.assign(afterSavePath);
      return;
    }
    setSaving(false);
    if (isAuthError(result.error)) {
      redirectToLogin();
      return;
    }
    setFlash({ danger: FAILED });
    setErrors(result.error.details.length > 0 ? result.error.details : [result.error.message]);
  };

  return { saving, flash, errors, submit };
};

/** 数値の入力欄の値。空なら null（API のバリデーションで「入力してください」になる） */
export const toNumberOrNull = (value: string): number | null =>
  value.trim() === '' ? null : Number(value);
