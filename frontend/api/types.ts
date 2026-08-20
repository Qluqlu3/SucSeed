// frontend/api/types.ts
//
// Rails の app/serializers が返す JSON の型定義。
// シリアライザ側が transform_keys :lower_camel でキーを camelCase に変換しているため、
// ここでも camelCase で書く。
//
// 【シリアライザとの対応】
//   SessionPayload      -> Api::V1::SessionController#session_payload
//   CreatorCard         -> CreatorCardSerializer
//   CreatorDetail       -> CreatorSerializer
//   HeirDetail          -> HeirSerializer
//   PublicUser          -> PublicUserSerializer
//   Comment             -> CommentSerializer
//   DiaryFeedItem       -> DiarySerializer
//   GalleryFeedItem     -> GallerySerializer
//   GalleryDetail       -> GalleryDetailSerializer
//   Match               -> MatchSerializer
//   Message             -> MessageSerializer
//
// Rails 側のシリアライザを変更したらこのファイルも合わせて更新すること。

// ── 共通 ────────────────────────────────────────────────────────────

/** users.id / diaries.id / galleries.id は has_secure_token による文字列トークン */
export type Id = string;

export type Role = 'creator' | 'heir' | 'user' | 'guest';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

/** コレクション系エンドポイントの共通形。pagination はページングする一覧のみ */
export interface Collection<T> {
  items: T[];
  pagination?: Pagination;
}

// ── セッション ──────────────────────────────────────────────────────

export interface ArtCategory {
  id: number;
  name: string;
}

export interface LayoutAssets {
  logoSrc: string;
  titleSrc: string;
}

export interface SessionPayload {
  loggedIn: boolean;
  userId: Id | null;
  role: Role;
  csrfToken: string;
  layoutAssets: LayoutAssets;
  artCategories: ArtCategory[];
}

// ── ユーザー / プロフィール ────────────────────────────────────────

export interface PublicUser {
  id: Id;
  name: string;
  isMan: boolean;
  profile: string | null;
  avatarPath: string;
  birthday: string;
}

export interface Profile {
  id: Id;
  name: string;
  email: string;
  profile: string | null;
  avatarPath: string;
  isMan: boolean;
  birthday: string;
  isCertified: boolean;
  role: Role;
  /** 職人/後継者としての詳細プロフィールを登録済みか */
  detailRegistered: boolean;
}

// ── 職人 / 後継者 ───────────────────────────────────────────────────

export interface CreatorCard {
  userId: Id;
  name: string;
  title: string;
  avatarPath: string;
  createdAt: string;
  prefectureCode: number | null;
  galleryCount: number;
  galleryPreviewPath: string | null;
}

export interface CreatorDetail {
  userId: Id;
  title: string;
  establishment: number;
  employee: number;
  postalCode: string;
  prefectureCode: number | null;
  isRecruitment: boolean;
  artCategoryId: number;
  artCategoryName: string | null;
  user: PublicUser;
  isFavorited: boolean;
  isAppealed: boolean;
  isOwn: boolean;
}

export interface HeirDetail {
  userId: Id;
  artCategoryId: number;
  introduction: string;
  artCategoryName: string | null;
  user: PublicUser;
  isScouted: boolean;
  isOwn: boolean;
}

// ── 日記 / ギャラリー ───────────────────────────────────────────────

export interface Comment {
  id: number;
  comment: string;
  name: string;
  avatarPath: string;
  postTime: string;
}

export interface DiaryFeedItem {
  diaryId: Id;
  userId: Id;
  name: string;
  avatarPath: string;
  content: string;
  postTime: string;
  goodCount: number;
  commentCount: number;
  myGood: boolean;
  goodAvatars: { avatarPath: string }[];
  comments: Comment[];
}

export interface GalleryFeedItem {
  id: Id;
  dataUrl: string;
  tags: string[];
  goodCount: number;
  myGood: boolean;
}

export interface GalleryDetail {
  galleryId: Id;
  dataUrl: string;
  tags: string[];
  comment: string;
  createdAt: string;
  goodCount: number;
  myGood: boolean;
  comments: Comment[];
  matchTagGalleries: { id: Id; dataUrl: string }[];
  otherGalleries: { id: Id; dataUrl: string }[];
  /** 投稿者が職人プロフィール未登録の場合は null */
  creator: {
    userId: Id;
    name: string;
    avatarPath: string;
    title: string;
    establishment: number;
    employee: number;
  } | null;
}

// ── 操作結果 ────────────────────────────────────────────────────────

export interface FavoriteState {
  favorited: boolean;
  userId: Id;
}

export interface GoodState {
  goodCount: number;
  myGood: boolean;
}

export interface DiaryGoodState extends GoodState {
  diaryId: Id;
}

export interface GalleryGoodState extends GoodState {
  galleryId: Id;
}

export interface CommentCreated {
  comment: Comment;
  commentCount: number;
}

// ── マッチング ──────────────────────────────────────────────────────

export interface Match {
  isScout: boolean;
  /** 未回答は null */
  isOk: boolean | null;
  isAddList: boolean;
  createdAt: string;
  heirUserId: Id;
  creatorUserId: Id;
  heir: PublicUser;
  creator: PublicUser;
  creatorTitle: string | null;
}

// ── メッセージ ──────────────────────────────────────────────────────

export interface MessagePartner {
  id: Id;
  name: string;
  avatarPath: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  sendUserId: Id;
  receiveUserId: Id;
  /** 自分が送ったメッセージか */
  mine: boolean;
}

export interface MessageThread {
  partner: MessagePartner;
  messages: Message[];
}

export interface MessageThreadCreated {
  userId: Id;
  alreadyExists: boolean;
}
