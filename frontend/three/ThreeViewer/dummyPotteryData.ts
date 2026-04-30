// frontend/three/ThreeViewer/dummyPotteryData.ts
//
// ThreeViewer で表示するダミー陶器データ。
// 実際の作品データに差し替える際はこのファイルだけ編集すればよい。

import type { PotteryData } from './potteryTypes';

export const DUMMY_POTTERY: PotteryData = {
  // 壺の側面プロファイル座標 [半径, 高さ]（LatheGeometry に渡す）
  profile: [
    [0.0, 0.0], // 底の中心
    [0.15, 0.0], // 底の外縁
    [0.18, 0.05], // 底面の丸み
    [0.2, 0.15], // 胴の下部
    [0.28, 0.4], // 胴の最大径
    [0.26, 0.6], // 胴の上部
    [0.18, 0.75], // 首へのくびれ
    [0.12, 0.85], // 首
    [0.16, 0.92], // 口縁の広がり
    [0.17, 1.0], // 口縁の先端
  ],
  glazeColor: 0x8b7355, // 茶色系（信楽焼イメージ）
  baseColor: 0x6b5744,
};
