// frontend/components/YourPage/YourPage.tsx
//
// /page/creator/:id ページの React コンポーネント（職人ページ）。
// お気に入り追加/削除は fetch API で Rails に送信する。

import { useState } from 'react';
import { getCsrfToken } from '../../utils/csrf';

function calcAge(birthday: string): number {
  const today = new Date();
  const birth = new Date(birthday);
  const todayNum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const birthNum = birth.getFullYear() * 10000 + (birth.getMonth() + 1) * 100 + birth.getDate();
  return Math.floor((todayNum - birthNum) / 10000);
}

interface User {
  id: number;
  name: string;
  avatarPath: string;
  isMan: boolean;
  birthday: string; // "YYYY-MM-DD"
}

interface Creator {
  title: string;
  establishment: number;
  employee: number;
  profile: string | null;
  isRecruitment: boolean;
}

interface Props {
  user: User;
  creator: Creator;
  artCategoryName: string;
  isFavorited: boolean;
  loggedIn: boolean;
  isOwnPage: boolean; // 自分自身のページかどうか
  isCreator: boolean; // 閲覧者が職人か
  isMatched: boolean; // アピール済みか
  targetUserId: number;
}

export const YourPage = ({
  user,
  creator,
  artCategoryName,
  isFavorited: initialFavorited,
  loggedIn,
  isOwnPage,
  isCreator,
  isMatched: initialMatched,
  targetUserId,
}: Props) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isMatched, setIsMatched] = useState(initialMatched);

  const handleFavorite = async () => {
    const url = isFavorited ? `/favorite/${targetUserId}/delete` : `/favorite/${targetUserId}/add`;
    await fetch(url, {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
    });
    setIsFavorited(!isFavorited);
  };

  const handleAppeal = async () => {
    await fetch(`/match/send/${targetUserId}`, {
      method: 'POST',
      headers: { 'X-CSRF-Token': getCsrfToken() },
    });
    setIsMatched(true);
  };

  return (
    <div className="wrapper">
      {/* プロフィールヘッダー */}
      <div>
        <div className="background-img-box">
          <img src="/assets/main1.jpg" height="850px" width="100%" alt="背景画像" />
          <div>
            <div className="name-age-box">
              <h1 className="h1-box">{user.name}</h1>
              <p className={`sex-box ${user.isMan ? 'is_man' : 'is_woman'}`}>
                {user.isMan ? '男性' : '女性'}
              </p>
              <p className="age-box">{calcAge(user.birthday)}歳</p>
            </div>
            <div className="label-box">
              {creator.isRecruitment ? (
                <span className="badge badge-primary">募集中</span>
              ) : (
                <span className="badge badge-danger">募集停止中</span>
              )}
            </div>
          </div>
          <div className="profile-avatar">
            <img
              src={user.avatarPath}
              className="card-img-top rounded-circle"
              width="100%"
              height="100%"
              alt="アバター画像"
            />
          </div>
        </div>
      </div>

      <div className="bar-box" />

      {/* お気に入りボタン */}
      <div className="favorite_btn_box">
        {loggedIn && !isOwnPage && (
          <button
            type="button"
            className="btn btn-default btn-lg favorite_btn"
            onClick={handleFavorite}
          >
            {isFavorited ? (
              <i className="fas fa-star favorite_star_set" />
            ) : (
              <i className="far fa-star favorite_star_none" />
            )}
          </button>
        )}
      </div>

      {/* タブナビゲーション */}
      <ul className="nav justify-content-center original-nav">
        <li className="nav-item">
          <a href={`/diary/show/${user.id}`} className="nav-link">
            日記
          </a>
        </li>
        <li className="nav-item my-nav-item">
          <a href={`/gallery/view/${user.id}`} className="nav-link">
            ギャラリー
          </a>
        </li>
      </ul>

      {/* 制作工芸名・ジャンル */}
      <div className="content-box top-box">
        <div className="row">
          <div className="col-md-6">
            <div className="card my-card">
              <h3 className="my-card-header">制作工芸名</h3>
              <div className="card-body my-card-body">
                <p className="card-text">{creator.title}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card my-card">
              <h3 className="my-card-header">工芸品ジャンル</h3>
              <div className="card-body my-card-body">
                <p className="card-text">{artCategoryName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 創業年数・従業員数 */}
      <div className="content-box">
        <div className="row">
          <div className="col-md-6">
            <div className="card my-card">
              <h3 className="my-card-header">創業年数</h3>
              <div className="card-body my-card-body">
                <p className="card-text">{creator.establishment}年</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card my-card">
              <h3 className="my-card-header">従業員数</h3>
              <div className="card-body my-card-body">
                <p className="card-text">{creator.employee}人</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 紹介文 */}
      <div className="card my-card-pro">
        <h3 className="my-card-header-pro">紹介文</h3>
        <div className="card-body card-body-intro">
          <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
            {creator.profile}
          </p>
        </div>
      </div>

      {/* アピールボタン（後継者ログイン時のみ） */}
      {loggedIn && !isCreator && (
        <div className="appeal-box">
          <button
            type="button"
            className="btn btn-lg appeal-btn"
            onClick={handleAppeal}
            disabled={isMatched}
          >
            {isMatched ? 'アピール済' : 'アピール'}
          </button>
        </div>
      )}
    </div>
  );
};
