// frontend/three/ThreeViewer/setupDragRotation.ts
//
// canvas 要素へのマウス / タッチイベントを登録し、Three.js Group の回転を管理する。
// - tick()    : アニメーションループ内で毎フレーム呼ぶ（ドラッグ外は自動回転）
// - cleanup() : アンマウント時にイベントリスナーを一括解除する

import type * as THREE from 'three';

const DRAG_SENSITIVITY = 0.005;
const AUTO_ROTATE_SPEED = 0.003;
const ROT_Y_MIN = -Math.PI / 3;
const ROT_Y_MAX = Math.PI / 3;

interface DragRotationHandle {
  tick: () => void;
  cleanup: () => void;
}

export function setupDragRotation(
  canvas: HTMLCanvasElement,
  group: THREE.Group,
): DragRotationHandle {
  let dragging = false;
  let prevX = 0;
  let prevY = 0;
  let rotX = 0; // Y 軸回転（左右）
  let rotY = 0.2; // X 軸回転（上下）

  const apply = () => {
    group.rotation.y = rotX;
    group.rotation.x = rotY;
  };
  apply(); // 初期姿勢を適用

  // ── マウス ────────────────────────────────────────────────────────
  const onMouseDown = (e: MouseEvent) => {
    dragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    rotX += (e.clientX - prevX) * DRAG_SENSITIVITY;
    rotY += (e.clientY - prevY) * DRAG_SENSITIVITY;
    rotY = Math.max(ROT_Y_MIN, Math.min(ROT_Y_MAX, rotY));
    prevX = e.clientX;
    prevY = e.clientY;
    apply();
  };
  const onMouseUp = () => {
    dragging = false;
  };

  // ── タッチ ────────────────────────────────────────────────────────
  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    dragging = true;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    rotX += (e.touches[0].clientX - prevX) * DRAG_SENSITIVITY;
    rotY += (e.touches[0].clientY - prevY) * DRAG_SENSITIVITY;
    rotY = Math.max(ROT_Y_MIN, Math.min(ROT_Y_MAX, rotY));
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
    apply();
  };
  const onTouchEnd = () => {
    dragging = false;
  };

  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd);

  return {
    tick: () => {
      if (!dragging) {
        rotX += AUTO_ROTATE_SPEED;
        apply();
      }
    },
    cleanup: () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    },
  };
}
