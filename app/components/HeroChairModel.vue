<template>
  <primitive
    v-if="chair"
    :object="chair"
  />
</template>

<script setup lang="ts">
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Box3,
  Sphere,
  Vector3,
  Group,
  Matrix3,
  PMREMGenerator,
  MeshStandardMaterial,
  DoubleSide,
  type Mesh,
  type Texture,
  type WebGLRenderer
} from 'three';
import { useTres, useTresContext } from '@tresjs/core';

/**
 * Loads the ~40 KB single-chair GLB, re-skins it as dark charcoal METAL lit by a
 * procedural studio environment (RoomEnvironment → PMREM, reflections only, the
 * canvas stays transparent), and animates it on a CONTINUOUS in-view-gated loop:
 * a slow Y turntable + a gentle organic TILT/wobble (rotation only — no float).
 *
 * The chair is wrapped in a PIVOT group with the model offset by −center, so the
 * pivot rotates around the chair's true centre (it turns in place, never orbits).
 * The camera is fitted to the bounding SPHERE so the widest silhouette stays in
 * frame with margin at every rotation + tilt angle.
 */
const props = defineProps<{ active: boolean }>();
const emit = defineEmits<{ ready: [] }>();
const { camera, advance } = useTres();
const { renderer, scene } = useTresContext();

// ── TUNABLE — material ───────────────────────────────────────────────────────
const FRAME_COLOR = 0x36332f;
const FRAME_METALNESS = 0.78;
const FRAME_ROUGHNESS = 0.42;
const ENV_INTENSITY = 0.9;
const GOLD_SEAT = true;
const GOLD_COLOR = 0xc6a15c;
const GOLD_METALNESS = 0.95;
const GOLD_ROUGHNESS = 0.3;
const SEAT_Y = [-0.16, 0.22] as const; // seat-face band (centred world Y, ±~0.9) — tune in browser
const SEAT_UP = 0.45;
// ── TUNABLE — framing ────────────────────────────────────────────────────────
const TARGET_HEIGHT = 1.85;
const CAMERA_FOV = 35;
const FRAME_MARGIN = 1.2; // ~20% padding around the chair at its widest
const CAMERA_DIR = new Vector3(0.42, 0.16, 1); // 3/4 front-right, slightly above
const BASE_YAW = -0.5;
const BASE_TILT = 0.03;
// ── TUNABLE — motion (rotation only) ─────────────────────────────────────────
const SPIN_PERIOD = 26; // seconds per full turn
const SPIN_AXIS: 'x' | 'y' | 'z' = 'y';
const SPIN_DIR = 1;
const TILT_AMP = 0.06; // wobble amplitude (rad, ~3.5°); set 0 to disable
const TILT_SPEED = 0.5;
// ─────────────────────────────────────────────────────────────────────────────

const chair = shallowRef<Group | null>(null); // the PIVOT group
let modelRadius = 1;

const frameMat = new MeshStandardMaterial({
  color: FRAME_COLOR,
  metalness: FRAME_METALNESS,
  roughness: FRAME_ROUGHNESS,
  envMapIntensity: ENV_INTENSITY,
  side: DoubleSide
});
const goldMat = new MeshStandardMaterial({
  color: GOLD_COLOR,
  metalness: GOLD_METALNESS,
  roughness: GOLD_ROUGHNESS,
  envMapIntensity: ENV_INTENSITY,
  side: DoubleSide
});

let envTexture: Texture | null = null;
let destroyed = false;
let raf = 0;
let elapsed = 0;
let lastNow = 0;
let resizeTimer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.active,
  (on) => (on ? startLoop() : stopLoop())
);

onMounted(() => {
  setupEnvironment();
  new GLTFLoader().load(
    '/models/chair.glb',
    (gltf) => {
      if (destroyed) return;
      const model = gltf.scene as Group;

      model.traverse((o) => {
        const m = o as Mesh;
        if (!m.isMesh) return;
        const old = m.material;
        if (Array.isArray(old)) old.forEach((x) => x?.dispose?.());
        else old?.dispose?.();
        m.material = frameMat;
      });

      // Scale to a known height, then build a pivot centred on the chair so it
      // rotates IN PLACE (offset the model by −center inside the pivot).
      const box = new Box3().setFromObject(model);
      model.scale.setScalar(TARGET_HEIGHT / (box.getSize(new Vector3()).y || 1));
      box.setFromObject(model);
      modelRadius = box.getBoundingSphere(new Sphere()).radius;
      model.position.sub(box.getCenter(new Vector3()));

      const pivot = new Group();
      pivot.add(model);
      pivot.updateMatrixWorld(true);

      if (GOLD_SEAT) model.traverse((o) => (o as Mesh).isMesh && applyGoldSeat(o as Mesh));

      chair.value = pivot;
      applyTransform(0);
      frameCamera();
      advance();
      if (props.active) startLoop();
      requestAnimationFrame(() => requestAnimationFrame(() => emit('ready')));
    },
    undefined,
    (err) => console.warn('[hero] chair.glb failed to load', err)
  );
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  destroyed = true;
  stopLoop();
  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);
  chair.value?.traverse((o) => {
    const m = o as Mesh;
    if (m.isMesh) m.geometry?.dispose?.();
  });
  chair.value = null;
  frameMat.dispose();
  goldMat.dispose();
  if (scene.value) scene.value.environment = null;
  envTexture?.dispose();
});

// Split the unified mesh into frame + gold-seat groups by face height/normal.
const applyGoldSeat = (mesh: Mesh) => {
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  const nrm = geo.attributes.normal;
  if (!geo.index || !nrm) return;
  mesh.updateWorldMatrix(true, false);
  const nmat = new Matrix3().getNormalMatrix(mesh.matrixWorld);
  const wn = new Vector3();
  const idx = geo.index.array as ArrayLike<number>;
  const frame: number[] = [];
  const seat: number[] = [];
  for (let f = 0; f < idx.length / 3; f++) {
    const a = idx[f * 3], b = idx[f * 3 + 1], c = idx[f * 3 + 2];
    const cy =
      (mesh.localToWorld(new Vector3().fromBufferAttribute(pos, a)).y +
        mesh.localToWorld(new Vector3().fromBufferAttribute(pos, b)).y +
        mesh.localToWorld(new Vector3().fromBufferAttribute(pos, c)).y) /
      3;
    const ny = wn.fromBufferAttribute(nrm, a).applyMatrix3(nmat).normalize().y;
    if (cy >= SEAT_Y[0] && cy <= SEAT_Y[1] && ny > SEAT_UP) seat.push(a, b, c);
    else frame.push(a, b, c);
  }
  if (!seat.length) return;
  geo.setIndex([...frame, ...seat]);
  geo.clearGroups();
  geo.addGroup(0, frame.length, 0);
  geo.addGroup(frame.length, seat.length, 1);
  mesh.material = [frameMat, goldMat];
};

// Fit the camera to the model's bounding sphere so it never clips at any angle.
const frameCamera = () => {
  const cam = camera.value as unknown as {
    position: Vector3;
    fov: number;
    aspect: number;
    near: number;
    far: number;
    updateProjectionMatrix: () => void;
    lookAt: (x: number, y: number, z: number) => void;
  } | null;
  const gl = renderer?.instance as WebGLRenderer | undefined;
  if (!cam || !gl) return;
  const el = gl.domElement;
  const aspect = (el.clientWidth || 1) / (el.clientHeight || 1);
  const vHalf = ((CAMERA_FOV * Math.PI) / 180) / 2;
  const hHalf = Math.atan(Math.tan(vHalf) * aspect);
  const dist = (modelRadius * FRAME_MARGIN) / Math.sin(Math.min(vHalf, hHalf));
  cam.fov = CAMERA_FOV;
  cam.aspect = aspect;
  cam.near = Math.max(0.01, dist - modelRadius * 2);
  cam.far = dist + modelRadius * 4;
  cam.position.copy(CAMERA_DIR.clone().normalize().multiplyScalar(dist));
  cam.updateProjectionMatrix();
  cam.lookAt(0, 0, 0);
};

const setupEnvironment = () => {
  const gl = renderer?.instance as WebGLRenderer | undefined;
  if (!gl || !scene.value) return;
  const pmrem = new PMREMGenerator(gl);
  const room = new RoomEnvironment();
  envTexture = pmrem.fromScene(room, 0.04).texture;
  scene.value.environment = envTexture;
  (room as unknown as { dispose?: () => void }).dispose?.();
  pmrem.dispose();
};

const applyTransform = (t: number) => {
  const o = chair.value;
  if (!o) return;
  const spin = SPIN_DIR * ((Math.PI * 2) / SPIN_PERIOD) * t;
  // organic wobble: two layered sines per axis (rotation only — no float)
  const wob = (a: number, b: number, p: number) =>
    TILT_AMP * (0.65 * Math.sin(t * TILT_SPEED * a + p) + 0.35 * Math.sin(t * TILT_SPEED * b + p * 1.7));
  o.rotation.x = BASE_TILT + wob(1.0, 1.7, 0) + (SPIN_AXIS === 'x' ? spin : 0);
  o.rotation.z = wob(0.8, 1.3, 1.5) + (SPIN_AXIS === 'z' ? spin : 0);
  o.rotation.y = BASE_YAW + (SPIN_AXIS === 'y' ? spin : 0);
};

const tick = (now: number) => {
  const dt = lastNow ? (now - lastNow) / 1000 : 0;
  lastNow = now;
  elapsed += dt;
  applyTransform(elapsed);
  advance();
  raf = requestAnimationFrame(tick);
};
const startLoop = () => {
  if (raf || destroyed) return;
  lastNow = 0;
  raf = requestAnimationFrame(tick);
};
const stopLoop = () => {
  if (!raf) return;
  cancelAnimationFrame(raf);
  raf = 0;
};

const onResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    frameCamera();
    advance();
  }, 150);
};
</script>
