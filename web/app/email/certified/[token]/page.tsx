'use client';

// web/app/email/certified/[token]/page.tsx
//
// メールアドレス認証（認証メールのリンク先）。Rails の UserController#email_certified_show /
// email_certified を置き換える。名前の取得は GET、認証は PATCH /api/v1/email_verifications/:token。
// Rails と同じく、リンクが無効なら理由を出してトップへ、ボタンを押したら結果を出してトップへ。

import { api } from '@sucseed/api';
import { FlashMessages, pushFlash } from '@sucseed/ui';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useResource } from '../../../../lib/resource';

// Rails の t('flash.success.email_certified') と同じ文言
const CERTIFIED = 'メールアドレスの認証が完了しました。';

const goTop = () => window.location.assign('/index');

export default function EmailCertifiedPage() {
  // useParams は URL のままの（パーセントエンコードされた）値を返す。トークンには = が含まれ、
  // メールのリンクでは %3D になっていることがあるので、戻してから API へ渡す（渡すときに改めてエンコードする）
  const token = decodeURIComponent(useParams<{ token: string }>().token);
  const target = useResource(token, api.emailVerifications.show);
  const [sending, setSending] = useState(false);

  const invalidLink =
    target.status === 'error' && target.code === 'invalid_token' ? target.message : null;
  useEffect(() => {
    if (invalidLink !== null) {
      pushFlash('danger', invalidLink);
      window.location.replace('/index');
    }
  }, [invalidLink]);

  if (target.status === 'loading' || invalidLink !== null) {
    return null;
  }

  if (target.status !== 'loaded') {
    return (
      <FlashMessages
        flash={{ danger: target.status === 'error' ? target.message : 'エラーが発生しました' }}
      />
    );
  }

  const verify = async () => {
    setSending(true);
    const result = await api.emailVerifications.verify(token);
    // 認証済み・リンク切れなども Rails と同じく理由を出してトップへ
    pushFlash(result.ok ? 'success' : 'danger', result.ok ? CERTIFIED : result.error.message);
    goTop();
  };

  return (
    <>
      <p className="mt-[10%] ml-[31%] text-p-text text-[23px]">
        {target.data.userName}さんメールアドレスの認証をお願いいたします。
      </p>
      <div className="h-[68vh] text-center">
        <button
          type="button"
          className="mt-[3%] h-15 rounded bg-green-600 px-6 text-[26px] text-white hover:opacity-80"
          onClick={() => void verify()}
          disabled={sending}
        >
          メールアドレス認証
        </button>
      </div>
    </>
  );
}
