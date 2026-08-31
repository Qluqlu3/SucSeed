// frontend/api/index.ts
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
  SessionPayload,
} from './types';

export type { ApiError, ApiResult } from './client';
export { setCsrfToken } from './client';
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

export const api = {
  session: {
    show: () => apiGet<SessionPayload>('/api/v1/session'),
    create: (email: string, password: string) =>
      apiPost<SessionPayload>('/api/v1/session', { session: { email, password } }),
    destroy: () => apiDelete<SessionPayload>('/api/v1/session'),
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
