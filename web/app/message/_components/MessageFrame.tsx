'use client';

// web/app/message/_components/MessageFrame.tsx
//
// メッセージ一覧・メッセージ画面で共通の枠。左にやり取りする相手の一覧、右に children を出す。
// Rails の MessageListPage / MessagePage の左パネルと同じ見た目。
// Rails は相手を選ぶとフォームで POST /message/history/:id していたが、ここではリンクで移る。

import type { MessagePartner } from '@sucseed/api';
import { type Flash, FlashMessages } from '@sucseed/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface Props {
  threads: MessagePartner[];
  flash: Flash;
  children: ReactNode;
}

export const MessageFrame = ({ threads, flash, children }: Props) => (
  <div>
    <h1 className="mt-[2%] mb-[3%] pl-[2%] text-[71px] text-white bg-p-brand">メッセージ</h1>

    <FlashMessages flash={flash} />
    <div className="min-h-screen">
      <div className="w-[90%] mx-auto bg-p-light border border-p-mid rounded-[7px]">
        <div className="flex flex-wrap w-[90%] h-[67vh] mt-[1%] mb-[3%] mx-auto p-0 rounded-[5px] justify-center">
          {/* 左パネル: メッセージリスト */}
          <div className="w-full md:w-5/12 h-[80vh] p-0 m-0 rounded-[5px]">
            <div className="h-[65vh] bg-p-dark rounded-[5px] overflow-scroll">
              {threads.map((partner) => (
                // Rails は <form> の中の <button>（inline-block）だったので、行の間に同じ隙間が出るよう
                // ブロックの中に inline-block のリンクを置く
                <div key={partner.id}>
                  <Link
                    href={`/message/history/${partner.id}`}
                    className="inline-block w-full h-[90px] bg-[#D3C9E7] hover:opacity-90"
                  >
                    <div className="flex w-full h-[100px] m-0">
                      <div className="w-3/12 p-0 m-0">
                        {/* biome-ignore lint/performance/noImgElement: アップロード画像は Rails から中継して配るので next/image を通さない */}
                        <img
                          src={partner.avatarPath}
                          width={80}
                          height={80}
                          className="rounded-full"
                          alt={partner.name}
                        />
                      </div>
                      <div className="w-9/12 p-0 m-0 text-[25px] text-left leading-[80px]">
                        {partner.name}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* 右パネル */}
          <div className="w-full md:w-7/12 h-[65vh] p-0 m-0 rounded-[5px]">{children}</div>
        </div>
      </div>
    </div>
  </div>
);
