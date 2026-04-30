// frontend/three/ThreeViewer/buildPotteryGroup.ts
//
// 陶器メッシュ（本体＋台座）を Three.js Group として組み立てる純粋なファクトリ関数。
// React ライフサイクルに依存しないため、このファイル単独でテスト・差し替えが可能。

import * as THREE from 'three';
import type { PotteryData } from './potteryTypes';

interface PotteryGroupResult {
  group: THREE.Group;
  /** Three.js リソースを一括破棄する */
  dispose: () => void;
}

export function buildPotteryGroup(data: PotteryData): PotteryGroupResult {
  // 陶器本体
  const profilePoints = data.profile.map(([x, y]) => new THREE.Vector2(x, y));
  const geometry = new THREE.LatheGeometry(profilePoints, 64);
  const material = new THREE.MeshStandardMaterial({
    color: data.glazeColor,
    roughness: 0.55,
    metalness: 0.05,
  });
  const pottery = new THREE.Mesh(geometry, material);
  pottery.castShadow = true;
  pottery.position.y = -0.5;

  // 台座
  const baseGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 32);
  const baseMat = new THREE.MeshStandardMaterial({ color: data.baseColor, roughness: 0.8 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.5;
  base.receiveShadow = true;

  const group = new THREE.Group();
  group.add(pottery);
  group.add(base);

  return {
    group,
    dispose: () => {
      geometry.dispose();
      material.dispose();
      baseGeo.dispose();
      baseMat.dispose();
    },
  };
}
