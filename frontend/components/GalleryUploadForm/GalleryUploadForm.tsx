// frontend/components/GalleryUploadForm/GalleryUploadForm.tsx
//
// 作品投稿フォーム。MyGalleryPage と FavoriteGalleryPage で同じフォームが
// 重複していたのを共通化し、あわせて POST /api/v1/galleries へ移行した。
//
// 従来はプレーンな HTML フォーム送信だったため、投稿のたびにページ全体が
// 再読み込みされ、バリデーションエラーは flash 経由でしか分からなかった。

import { type FormEvent, useId, useState } from 'react';
import type { GalleryFeedItem } from '../../api';
import { api } from '../../api';

interface Props {
  /** 投稿成功時に呼ばれる。呼び出し側が一覧の先頭に差し込む */
  onUploaded: (gallery: GalleryFeedItem) => void;
}

export const GalleryUploadForm = ({ onUploaded }: Props) => {
  const fileId = useId();
  const tagsId = useId();
  const commentId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [tagList, setTagList] = useState('');
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (uploading) return;

    if (!file) {
      setErrors(['画像を選択してください']);
      return;
    }

    setUploading(true);
    setErrors([]);
    const result = await api.galleries.create({ data: file, comment, tagList });
    setUploading(false);

    if (result.ok) {
      onUploaded(result.data);
      setFile(null);
      setTagList('');
      setComment('');
      // input[type=file] は value を制御できないのでフォームごとリセットする
      (event.target as HTMLFormElement).reset();
    } else {
      setErrors(result.error.details.length > 0 ? result.error.details : [result.error.message]);
    }
  };

  return (
    <div className="bg-[#F7F5FB] rounded-[13px] max-h-[70vh] mt-[1vh]">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="bg-p-brand rounded-t-[7px]">
            <label
              className="block text-white text-[31px] mt-[1.5%] mb-[1%] ml-[5%]"
              htmlFor={fileId}
            >
              投稿
            </label>
          </div>

          {errors.length > 0 && (
            <div className="mx-[5%] mt-[2vh] rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700">
              <ul>
                {errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          <input
            type="file"
            id={fileId}
            className="mt-[3vh] block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50"
            accept="image/jpg,image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <label className="text-[16px] mt-[2vh] ml-[5%]" htmlFor={tagsId}>
            タグ：
          </label>
          <div className="text-black mt-[1vh] ml-[5%]">
            <input
              id={tagsId}
              type="text"
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              placeholder="タグをカンマ区切りで入力"
              value={tagList}
              onChange={(e) => setTagList(e.target.value)}
            />
          </div>

          <div className="w-[90%] mx-auto mt-[8%]">
            <label className="form-input-label" htmlFor={commentId}>
              コメント：
            </label>
            <textarea
              id={commentId}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:border-p-brand focus:outline-none"
              placeholder="100文字以内"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="text-right mt-[7%] mr-[5%]">
            <button
              type="submit"
              className="rounded bg-p-brand px-5 py-2 text-lg text-white hover:opacity-80 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? '投稿中…' : '投稿'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
