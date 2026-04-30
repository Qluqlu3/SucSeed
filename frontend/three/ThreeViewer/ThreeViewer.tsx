// frontend/three/ThreeViewer/ThreeViewer.tsx
//
// Three.js を使った 3D ビューワーコンポーネント。
// 陶器メッシュ組み立て → buildPotteryGroup.ts
// ドラッグ / タッチ回転   → setupDragRotation.ts
// ダミーデータ           → dummyPotteryData.ts

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { buildPotteryGroup } from './buildPotteryGroup';
import { DUMMY_POTTERY } from './dummyPotteryData';
import { setupDragRotation } from './setupDragRotation';

interface Props {
  width?: number;
  height?: number;
}

export const ThreeViewer = ({ width = 400, height = 400 }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── シーン / カメラ / レンダラー ───────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f0eb);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 1.8);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // ── ライト ──────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const pointLight = new THREE.PointLight(0xffd9b0, 2.5, 10);
    pointLight.position.set(1.5, 2, 1.5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-1, 1, -1);
    scene.add(fillLight);

    // ── 陶器グループをシーンへ追加 ────────────────────────────────────
    const { group, dispose: disposePottery } = buildPotteryGroup(DUMMY_POTTERY);
    scene.add(group);

    // ── ドラッグ / タッチ回転をセットアップ ───────────────────────────
    const dragRotation = setupDragRotation(canvas, group);

    // ── アニメーションループ ──────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      dragRotation.tick();
      renderer.render(scene, camera);
    };
    animate();

    // ── クリーンアップ ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      dragRotation.cleanup();
      renderer.dispose();
      disposePottery();
    };
  }, [width, height]);

  return (
    <div style={{ display: 'inline-block', cursor: 'grab' }}>
      <canvas ref={canvasRef} style={{ display: 'block', borderRadius: '8px' }} />
      <p
        style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#888',
          margin: '4px 0 0',
        }}
      >
        ドラッグで回転
      </p>
    </div>
  );
};
