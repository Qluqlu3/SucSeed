// packages/api/index.ts
//
// /api/v1 のエンドポイント定義。URL とリクエストボディの形をここだけに閉じ込め、
// コンポーネントからは api.favorites.create(userId) のように呼ぶ。
//
// 対応する Rails 側は config/routes.rb の `namespace :api do namespace :v1 do ... end end`。

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPatchForm,
  apiPost,
  apiPostForm,
  setCsrfToken,
} from './client';
import type {
  ArtCategory,
  Collection,
  CommentCreated,
  CreatorCard,
  CreatorDetail,
  DiaryFeedItem,
  DiaryGoodState,
  EmailVerificationTarget,
  FavoriteState,
  GalleryDetail,
  GalleryFeedItem,
  GalleryGoodState,
  HeirDetail,
  Id,
  Match,
  Message,
  MessagePartner,
  MessageThread,
  MessageThreadCreated,
  Profile,
  PublicUser,
  PublicUserPage,
  RegistrationCreated,
  SessionPayload,
} from './types';

export type { ApiError, ApiResult } from './client';
export { getCsrfToken, setCsrfToken } from './client';
export type * from './types';

/** 一覧エンドポイント共通のページング指定。per_page はサーバー側で100件に打ち止め */
export interface PageParams {
  page?: number;
  perPage?: number;
}

const pageQuery = (params?: PageParams) => ({
  page: params?.page,
  per_page: params?.perPage,
});

/** 職人の詳細プロフィールの入力（登録・変更フォーム）。数値欄は未入力なら null */
export interface CreatorProfileInput {
  title: string;
  artCategoryId: number | null;
  establishment: number | null;
  employee: number | null;
  postalCode: string;
  isRecruitment: boolean;
}

/** 後継者の詳細プロフィールの入力。分野は未選択なら null */
export interface HeirProfileInput {
  artCategoryId: number | null;
  introduction: string;
}

/** 会員登録の入力。生年月日は "YYYY-MM-DD" */
export interface RegistrationInput {
  name: string;
  email: string;
  birthday: string;
  isMan: boolean;
  isCreator: boolean;
  password: string;
  passwordConfirmation: string;
}

const toCreatorParams = (creator: CreatorProfileInput) => ({
  title: creator.title,
  art_category_id: creator.artCategoryId,
  establishment: creator.establishment,
  employee: creator.employee,
  postal_code: creator.postalCode,
  is_recruitment: creator.isRecruitment,
});

const toHeirParams = (heir: HeirProfileInput) => ({
  art_category_id: heir.artCategoryId,
  introduction: heir.introduction,
});

export const api = {
  session: {
    show: () => apiGet<SessionPayload>('/api/v1/session'),
    create: (email: string, password: string) =>
      apiPost<SessionPayload>('/api/v1/session', { session: { email, password } }),
    destroy: () => apiDelete<SessionPayload>('/api/v1/session'),
  },

  /**
   * 会員登録。登録するとメールアドレス認証のメールが届く（ログインはしない）。
   * アバター画像を付けられるよう、常に multipart で送る
   */
  registration: {
    create: (input: RegistrationInput, avatar?: File | null) => {
      const form = new FormData();
      form.append('user[name]', input.name);
      form.append('user[email]', input.email);
      form.append('user[birthday]', input.birthday);
      form.append('user[is_man]', input.isMan ? '1' : '0');
      form.append('user[is_creator]', input.isCreator ? '1' : '0');
      form.append('user[password]', input.password);
      form.append('user[password_confirmation]', input.passwordConfirmation);
      if (avatar) {
        form.append('user[avatar_path]', avatar);
      }
      return apiPostForm<RegistrationCreated>('/api/v1/registration', form);
    },
  },

  /** パスワード再設定。token はメールのリンクに載った署名付きトークン（無効なら invalid_token） */
  passwordResets: {
    /** 登録の有無にかかわらず成功を返す */
    create: (email: string) => apiPost<void>('/api/v1/password_resets', { email }),
    /** リンクが有効かを確かめる */
    show: (token: string) => apiGet<void>(`/api/v1/password_resets/${encodeURIComponent(token)}`),
    update: (token: string, password: string, passwordConfirmation: string) =>
      apiPatch<void>(`/api/v1/password_resets/${encodeURIComponent(token)}`, {
        user: { password, password_confirmation: passwordConfirmation },
      }),
  },

  /** メールアドレス認証。token は認証メールのリンクに載った署名付きトークン（無効なら invalid_token） */
  emailVerifications: {
    show: (token: string) =>
      apiGet<EmailVerificationTarget>(`/api/v1/email_verifications/${encodeURIComponent(token)}`),
    /** 認証済みなら already_certified */
    verify: (token: string) =>
      apiPatch<void>(`/api/v1/email_verifications/${encodeURIComponent(token)}`),
  },

  artCategories: {
    index: () => apiGet<Collection<ArtCategory>>('/api/v1/art_categories'),
  },

  profile: {
    show: () => apiGet<Profile>('/api/v1/profile'),
    update: (user: Partial<Pick<Profile, 'name' | 'email' | 'profile'>>) =>
      apiPatch<Profile>('/api/v1/profile', { user }),
    /** アバター画像。CarrierWave が受け取れるよう multipart で送る */
    updateAvatar: (file: File) => {
      const form = new FormData();
      form.append('user[avatar_path]', file);
      return apiPatchForm<Profile>('/api/v1/profile', form);
    },
    /**
     * 名前・メール・紹介文とアバター画像を1回の multipart でまとめて更新する（プロフィール変更画面）。
     * avatar を省くと画像は変えない
     */
    updateWithAvatar: (
      user: Pick<Profile, 'name' | 'email'> & { profile: string },
      avatar?: File | null,
    ) => {
      const form = new FormData();
      form.append('user[name]', user.name);
      form.append('user[email]', user.email);
      form.append('user[profile]', user.profile);
      if (avatar) {
        form.append('user[avatar_path]', avatar);
      }
      return apiPatchForm<Profile>('/api/v1/profile', form);
    },
    /** 自分の職人としての詳細プロフィール（職人だけ）。未登録なら not_found */
    creator: {
      show: () => apiGet<CreatorDetail>('/api/v1/profile/creator'),
      create: (creator: CreatorProfileInput) =>
        apiPost<CreatorDetail>('/api/v1/profile/creator', { creator: toCreatorParams(creator) }),
      update: (creator: CreatorProfileInput) =>
        apiPatch<CreatorDetail>('/api/v1/profile/creator', { creator: toCreatorParams(creator) }),
    },
    /** 自分の後継者としての詳細プロフィール（職人以外）。未登録なら not_found */
    heir: {
      show: () => apiGet<HeirDetail>('/api/v1/profile/heir'),
      create: (heir: HeirProfileInput) =>
        apiPost<HeirDetail>('/api/v1/profile/heir', { heir: toHeirParams(heir) }),
      update: (heir: HeirProfileInput) =>
        apiPatch<HeirDetail>('/api/v1/profile/heir', { heir: toHeirParams(heir) }),
    },
  },

  creators: {
    index: (params?: PageParams & { artCategoryId?: number }) =>
      apiGet<Collection<CreatorCard>>('/api/v1/creators', {
        ...pageQuery(params),
        art_category_id: params?.artCategoryId,
      }),
    show: (userId: Id) => apiGet<CreatorDetail>(`/api/v1/creators/${userId}`),
  },

  heirs: {
    show: (userId: Id) => apiGet<HeirDetail>(`/api/v1/heirs/${userId}`),
  },

  users: {
    /** 任意のユーザーの公開情報（未ログインでも取れる） */
    show: (userId: Id) => apiGet<PublicUserPage>(`/api/v1/users/${userId}`),
  },

  favorites: {
    index: (params?: PageParams) =>
      apiGet<Collection<PublicUser>>('/api/v1/favorites', pageQuery(params)),
    create: (userId: Id) => apiPost<FavoriteState>('/api/v1/favorites', { id: userId }),
    destroy: (userId: Id) => apiDelete<FavoriteState>(`/api/v1/favorites/${userId}`),
  },

  diaries: {
    /** userId 未指定なら「自分 + お気に入り登録した相手」のフィード */
    index: (params?: PageParams & { userId?: Id }) =>
      apiGet<Collection<DiaryFeedItem>>('/api/v1/diaries', {
        ...pageQuery(params),
        user_id: params?.userId,
      }),
    create: (content: string) => apiPost<DiaryFeedItem>('/api/v1/diaries', { diary: { content } }),
    destroy: (diaryId: Id) => apiDelete<void>(`/api/v1/diaries/${diaryId}`),
    like: (diaryId: Id) => apiPost<DiaryGoodState>(`/api/v1/diaries/${diaryId}/good`),
    unlike: (diaryId: Id) => apiDelete<DiaryGoodState>(`/api/v1/diaries/${diaryId}/good`),
    comment: (diaryId: Id, comment: string) =>
      apiPost<CommentCreated>(`/api/v1/diaries/${diaryId}/comments`, {
        diary_comment: { comment },
      }),
  },

  galleries: {
    index: (params?: PageParams & { userId?: Id; tag?: string }) =>
      apiGet<Collection<GalleryFeedItem>>('/api/v1/galleries', {
        ...pageQuery(params),
        user_id: params?.userId,
        tag: params?.tag,
      }),
    show: (galleryId: Id) => apiGet<GalleryDetail>(`/api/v1/galleries/${galleryId}`),
    /** 作品投稿。画像を含むため multipart で送る（職人のみ） */
    create: (input: { data: File; comment: string; tagList?: string }) => {
      const form = new FormData();
      form.append('gallery[data]', input.data);
      form.append('gallery[comment]', input.comment);
      if (input.tagList) {
        form.append('gallery[tag_list]', input.tagList);
      }
      return apiPostForm<GalleryFeedItem>('/api/v1/galleries', form);
    },
    like: (galleryId: Id) => apiPost<GalleryGoodState>(`/api/v1/galleries/${galleryId}/good`),
    unlike: (galleryId: Id) => apiDelete<GalleryGoodState>(`/api/v1/galleries/${galleryId}/good`),
    comment: (galleryId: Id, comment: string) =>
      apiPost<CommentCreated>(`/api/v1/galleries/${galleryId}/comments`, {
        gallery_comment: { comment },
      }),
  },

  appeals: {
    index: (params?: PageParams) => apiGet<Collection<Match>>('/api/v1/appeals', pageQuery(params)),
    /** 後継者が職人に応募する */
    create: (creatorId: Id) => apiPost<Match>('/api/v1/appeals', { creator_id: creatorId }),
    /** 職人が応募に回答する（heirId は応募してきた後継者の id） */
    answer: (heirId: Id, accepted: boolean) =>
      apiPatch<Match>(`/api/v1/appeals/${heirId}`, { accepted }),
  },

  scouts: {
    index: (params?: PageParams) => apiGet<Collection<Match>>('/api/v1/scouts', pageQuery(params)),
    /** 職人が後継者をスカウトする */
    create: (heirId: Id) => apiPost<Match>('/api/v1/scouts', { heir_id: heirId }),
    /** 後継者がスカウトに回答する（creatorId はスカウトしてきた職人の id） */
    answer: (creatorId: Id, accepted: boolean) =>
      apiPatch<Match>(`/api/v1/scouts/${creatorId}`, { accepted }),
  },

  matches: {
    index: (params?: PageParams) => apiGet<Collection<Match>>('/api/v1/matches', pageQuery(params)),
  },

  messageThreads: {
    index: (params?: PageParams) =>
      apiGet<Collection<MessagePartner>>('/api/v1/message_threads', pageQuery(params)),
    /** page を増やすとより古いメッセージが取れる */
    show: (userId: Id, params?: PageParams) =>
      apiGet<MessageThread>(`/api/v1/message_threads/${userId}`, pageQuery(params)),
    create: (userId: Id) =>
      apiPost<MessageThreadCreated>('/api/v1/message_threads', { user_id: userId }),
    sendMessage: (userId: Id, content: string) =>
      apiPost<Message>(`/api/v1/message_threads/${userId}/messages`, { message: { content } }),
  },
};

/**
 * セッション情報を取得し、CSRF トークンをクライアントへ反映する。
 * ログイン直後などトークンが張り替わる場面ではこれを経由すること。
 */
export const refreshSession = async () => {
  const result = await api.session.show();
  if (result.ok) {
    setCsrfToken(result.data.csrfToken);
  }
  return result;
};
