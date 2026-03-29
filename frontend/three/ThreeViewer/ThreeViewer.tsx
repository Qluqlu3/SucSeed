// frontend/three/ThreeViewer/ThreeViewer.tsx
//
// Three.js を使った 3D ビューワーコンポーネント。
// LatheGeometry（回転体）で陶器のシルエットを再現するダミー実装。
// マウスドラッグ / タッチで自由回転。
// このファイルは変更しやすいよう他のコンポーネントから独立させている。

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ── 陶器プロファイル座標（壺の側面シルエット） ─────────────────────────────
// x: 半径方向、y: 高さ方向（任意に変更可）
const POTTERY_PROFILE: [number, number][] = [
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
];

// ── ダミー釉薬カラー ─────────────────────────────────────────────────────
const GLAZE_COLOR = 0x8b7355; // 茶色系（信楽焼イメージ）

// ── マウス / タッチ回転のドラッグ感度 ───────────────────────────────────
const DRAG_SENSITIVITY = 0.005;

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
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xffd9b0, 2.5, 10);
    pointLight.position.set(1.5, 2, 1.5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-1, 1, -1);
    scene.add(fillLight);

    // ── 陶器メッシュ ────────────────────────────────────────────────
    const profilePoints = POTTERY_PROFILE.map(([x, y]) => new THREE.Vector2(x, y));
    const geometry = new THREE.LatheGeometry(profilePoints, 64);

    const material = new THREE.MeshStandardMaterial({
      color: GLAZE_COLOR,
      roughness: 0.55,
      metalness: 0.05,
    });

    const pottery = new THREE.Mesh(geometry, material);
    pottery.castShadow = true;
    // 壺の中心を高さ方向の中央に移動
    pottery.position.y = -0.5;
    scene.add(pottery);

    // ── 台座 ─────────────────────────────────────────────────────────
    const baseGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.02, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x6b5744, roughness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    base.receiveShadow = true;
    scene.add(base);

    // ── マウス / タッチ操作（オービット） ──────────────────────────────
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0; // Y軸回転（左右）
    let rotY = 0.2; // X軸回転（上下）

    const group = new THREE.Group();
    scene.remove(pottery);
    scene.remove(base);
    group.add(pottery);
    group.add(base);
    scene.add(group);

    const applyRotation = () => {
      group.rotation.y = rotX;
      group.rotation.x = rotY;
    };
    applyRotation();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      rotX += (e.clientX - prevX) * DRAG_SENSITIVITY;
      rotY += (e.clientY - prevY) * DRAG_SENSITIVITY;
      rotY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotY)); // 上下制限
      prevX = e.clientX;
      prevY = e.clientY;
      applyRotation();
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      rotX += (e.touches[0].clientX - prevX) * DRAG_SENSITIVITY;
      rotY += (e.touches[0].clientY - prevY) * DRAG_SENSITIVITY;
      rotY = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotY));
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
      applyRotation();
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // ── アニメーションループ ──────────────────────────────────────────
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      // ドラッグ中でないときはゆっくり自動回転
      if (!isDragging) {
        rotX += 0.003;
        applyRotation();
      }
      renderer.render(scene, camera);
    };
    animate();

    // ── クリーンアップ ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      baseGeo.dispose();
      baseMat.dispose();
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
