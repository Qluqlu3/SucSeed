// frontend/three/ThreeViewer/potteryTypes.ts
//
// ThreeViewer に渡す陶器データの型定義。
// 副作用なし・React / Three.js に非依存なため、単独でテスト可能。

/** 壺の側面プロファイル座標。[半径, 高さ] の配列（LatheGeometry に渡す） */
export type PotteryProfile = [number, number][];

/** ThreeViewer に渡す陶器データ */
export type PotteryData = {
  /** 壺の側面プロファイル座標 */
  profile: PotteryProfile;
  /** 釉薬カラー（0x 記法の 16 進数） */
  glazeColor: number;
  /** 台座カラー（0x 記法の 16 進数） */
  baseColor: number;
};
