'use client';

// web/lib/session.tsx
//
// ログイン状態を画面へ配る。レイアウト（AppShell）が起動時に1回だけ /api/v1/session を叩き、
// 各画面は useSession / useRequireLogin で受け取る。
// セッション API の呼び出しは CSRF トークンの取得も兼ねるので、画面の更新系はこの後に行える。

import { fetchSessionPayload, pushFlash, type SessionState } from '@sucseed/ui';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

// 取得前は null
const SessionContext = createContext<SessionState | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionState | null>(null);

  useEffect(() => {
    let active = true;
    void fetchSessionPayload().then((payload) => {
      if (active) {
        setSession(payload);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
};

/** セッション情報。取得中は null */
export const useSession = (): SessionState | null => useContext(SessionContext);

/**
 * ログイン必須の画面で使う。未ログインなら Rails の HTML 側（ApplicationController
 * #on_authentication_required）と同じく、メッセージを積んでトップへ移す。
 * ログイン済みと分かったときだけセッションを返し、取得中・未ログインは null。
 */
export const useRequireLogin = (): SessionState | null => {
  const session = useSession();
  const isGuest = session?.role === 'guest';

  useEffect(() => {
    if (isGuest) {
      redirectToLogin();
    }
  }, [isGuest]);

  return session && !isGuest ? session : null;
};

/** 未ログイン・セッション切れのときの遷移。API が 401 を返したときにも使う */
export const redirectToLogin = (): void => {
  pushFlash('danger', 'ログインしてください');
  // /index はまだ Rails の画面なので、Next のルーターではなく通常の遷移にする
  window.location.replace('/index');
};
