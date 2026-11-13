"use client";

/*
  An animated 3D chirashi bowl for the home hero.

  Colourful ingredients fly in from off-screen, settle onto a mound of rice in a
  dark lacquer bowl, hold for a moment, then drift away — and the loop repeats.
  Built with react-three-fiber. Loaded lazily and only on the client (see
  `hero-visual.tsx`), so the rest of the site stays static and light.

  The whole thing is deliberately stylised rather than photoreal: the shapes are
  simple primitives tinted with the site palette.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/* -------------------------------------------------------------------------- */
/* Tunables                                                                   */
/* -------------------------------------------------------------------------- */

const CYCLE = 9.6; // seconds per loop
const FLY_IN_DUR = 1.5; // each ingredient's flight time
const OUT_START = 7.6; // when the ingredients drift away again
const OUT_DUR = 1.9;

const RICE_COUNT = 520;
const DOME_RADIUS = 1.02;
const DOME_BASE_Y = 0.34;
const DOME_HEIGHT = 0.72;

/* Palette — mirrors the design tokens in globals.css. */
const C = {
  salmon: "#f0906a",
  tuna: "#a5342c",
  shrimp: "#f2a68a",
  ikura: "#e2622a",
  cucumber: "#7d9b5a",
  egg: "#f0c94a",
  avocado: "#8fae5c",
  nori: "#242b22",
  ginger: "#f0b7a2",
  rice: "#f4ebd8",
  bowl: "#211a14",
};

const CAMERA = {
  position: [0, 2.45, 5.3] as [number, number, number],
  fov: 36,
  near: 0.1,
  far: 100,
};

const GL = {
  antialias: true,
  alpha: true,
  powerPreference: "high-performance" as const,
};

/* -------------------------------------------------------------------------- */
/* Geometry (created once, shared by every instance)                          */
/* -------------------------------------------------------------------------- */

const GEO = {
  slice: new RoundedBoxGeometry(0.66, 0.13, 0.36, 4, 0.05),
  egg: new RoundedBoxGeometry(0.3, 0.26, 0.3, 4, 0.06),
  leaf: new RoundedBoxGeometry(0.44, 0.07, 0.28, 4, 0.03),
  ball: new THREE.SphereGeometry(0.15, 24, 18),
  roe: new THREE.SphereGeometry(0.045, 12, 10),
  shrimp: new THREE.TorusGeometry(0.17, 0.062, 14, 28, Math.PI * 1.25),
  cucumber: new THREE.CylinderGeometry(0.055, 0.055, 0.36, 16),
};

const ROE_OFFSETS: [number, number, number][] = [
  [0, 0, 0],
  [0.09, 0.02, 0.05],
  [-0.08, 0.03, 0.06],
  [0.05, 0.08, -0.07],
  [-0.06, 0.07, -0.06],
  [0.02, 0.12, 0.02],
  [-0.02, -0.03, 0.1],
];

/* -------------------------------------------------------------------------- */
/* Types & helpers                                                            */
/* -------------------------------------------------------------------------- */

type Shape = "slice" | "egg" | "leaf" | "ball" | "shrimp" | "cucumber";

type Ingredient = {
  shape: Shape;
  color: string;
  scale: number;
  end: [number, number, number];
  endRot: [number, number, number];
  start: [number, number, number];
  startRot: [number, number, number];
  delay: number;
  spin: number;
  phase: number;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/*
  A tiny deterministic pseudo-random generator. Staying pure (no Math.random)
  keeps the scene identical on every load and satisfies React's purity rules.
*/
function noise(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* Some shapes need a base rotation so they lie flat on the rice. */
const BASE_ROT: Record<Shape, [number, number, number]> = {
  slice: [0, 0, 0],
  egg: [0, 0, 0],
  leaf: [0, 0, 0],
  ball: [0, 0, 0],
  shrimp: [-Math.PI / 2, 0, 0],
  cucumber: [0, 0, Math.PI / 2],
};

/* -------------------------------------------------------------------------- */
/* Ingredient list                                                            */
/* -------------------------------------------------------------------------- */

function makeIngredients(): Ingredient[] {
  const kinds: { shape: Shape; color: string; weight: number; scale: number }[] =
    [
      { shape: "slice", color: C.salmon, weight: 4, scale: 1 },
      { shape: "slice", color: C.tuna, weight: 3, scale: 1 },
      { shape: "shrimp", color: C.shrimp, weight: 3, scale: 1 },
      { shape: "ball", color: C.ikura, weight: 3, scale: 1 },
      { shape: "cucumber", color: C.cucumber, weight: 2, scale: 1 },
      { shape: "egg", color: C.egg, weight: 2, scale: 1 },
      { shape: "leaf", color: C.avocado, weight: 2, scale: 1 },
      { shape: "leaf", color: C.nori, weight: 1, scale: 1.05 },
      { shape: "leaf", color: C.ginger, weight: 1, scale: 0.9 },
    ];

  const pool: { shape: Shape; color: string; scale: number }[] = [];
  for (const kind of kinds) {
    for (let i = 0; i < kind.weight; i += 1) {
      pool.push({ shape: kind.shape, color: kind.color, scale: kind.scale });
    }
  }
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(noise(i * 3.7 + 0.5) * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const items: Ingredient[] = [];
  const n = pool.length;

  for (let i = 0; i < n; i += 1) {
    const angle = (i / n) * Math.PI * 2 + (noise(i + 11) - 0.5) * 0.5;
    const radius = DOME_RADIUS * (0.15 + noise(i + 21) * 0.72);
    const slope = radius / DOME_RADIUS;
    const y =
      DOME_BASE_Y + DOME_HEIGHT * Math.cos(slope * (Math.PI / 2)) + 0.07;

    const end: [number, number, number] = [
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius,
    ];
    const endRot: [number, number, number] = [
      slope * 0.5,
      -angle,
      (noise(i + 31) - 0.5) * 0.3,
    ];

    const dx = Math.cos(angle) * (2.2 + noise(i + 41) * 1.6);
    const dz = Math.sin(angle) * (2.2 + noise(i + 51) * 1.6);
    const start: [number, number, number] = [
      end[0] + dx,
      end[1] + 2.2 + noise(i + 61) * 1.8,
      end[2] + dz,
    ];
    const startRot: [number, number, number] = [
      (noise(i + 71) - 0.5) * 4,
      (noise(i + 81) - 0.5) * 4,
      (noise(i + 91) - 0.5) * 4,
    ];

    items.push({
      ...pool[i],
      end,
      endRot,
      start,
      startRot,
      delay: 0.15 + (i / n) * 1.3 + noise(i + 111) * 0.25,
      spin: noise(i + 121) < 0.5 ? -1 : 1,
      phase: noise(i + 131) * Math.PI * 2,
    });
  }

  return items;
}

/* -------------------------------------------------------------------------- */
/* Bowl                                                                       */
/* -------------------------------------------------------------------------- */

function Bowl() {
  const geometry = useMemo(() => {
    // A lathe profile: outer wall up to the rim, then back down the inside.
    const profile: [number, number][] = [
      [0.0, 0.0],
      [0.62, 0.0],
      [1.02, 0.18],
      [1.28, 0.6],
      [1.4, 1.02],
      [1.44, 1.2],
      [1.36, 1.22],
      [1.28, 1.16],
      [1.12, 0.82],
      [0.86, 0.44],
      [0.62, 0.26],
      [0.0, 0.24],
    ];
    return new THREE.LatheGeometry(
      profile.map(([x, y]) => new THREE.Vector2(x, y)),
      64,
    );
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={C.bowl}
        roughness={0.34}
        metalness={0.18}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* Rice                                                                       */
/* -------------------------------------------------------------------------- */

function Rice() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const grains = useMemo(() => {
    const dummy = new THREE.Object3D();
    const list: THREE.Matrix4[] = [];
    for (let i = 0; i < RICE_COUNT; i += 1) {
      const angle = noise(i + 1) * Math.PI * 2;
      const radius = DOME_RADIUS * Math.sqrt(noise(i + 101));
      const y =
        DOME_BASE_Y +
        DOME_HEIGHT * Math.cos((radius / DOME_RADIUS) * (Math.PI / 2)) +
        (noise(i + 201) - 0.5) * 0.03;
      dummy.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      );
      dummy.rotation.set(
        noise(i + 301) * Math.PI,
        noise(i + 401) * Math.PI,
        noise(i + 501) * Math.PI,
      );
      const scale = 0.7 + noise(i + 601) * 0.6;
      dummy.scale.set(scale, scale * 0.72, scale);
      dummy.updateMatrix();
      list.push(dummy.matrix.clone());
    }
    return list;
  }, []);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    grains.forEach((matrix, i) => mesh.setMatrixAt(i, matrix));
    mesh.instanceMatrix.needsUpdate = true;
  }, [grains]);

  return (
    <instancedMesh ref={ref} args={[GEO.roe, undefined, RICE_COUNT]}>
      <meshStandardMaterial color={C.rice} roughness={0.55} metalness={0.02} />
    </instancedMesh>
  );
}

/* -------------------------------------------------------------------------- */
/* A single ingredient's mesh                                                 */
/* -------------------------------------------------------------------------- */

function IngredientMesh({ item }: { item: Ingredient }) {
  const material = (
    <meshStandardMaterial
      color={item.color}
      roughness={0.42}
      metalness={0.05}
    />
  );

  let mesh: React.ReactNode = null;
  switch (item.shape) {
    case "slice":
      mesh = <mesh geometry={GEO.slice}>{material}</mesh>;
      break;
    case "egg":
      mesh = <mesh geometry={GEO.egg}>{material}</mesh>;
      break;
    case "leaf":
      mesh = <mesh geometry={GEO.leaf}>{material}</mesh>;
      break;
    case "shrimp":
      mesh = <mesh geometry={GEO.shrimp}>{material}</mesh>;
      break;
    case "cucumber":
      mesh = <mesh geometry={GEO.cucumber}>{material}</mesh>;
      break;
    case "ball":
      mesh = (
        <group>
          {ROE_OFFSETS.map((position, i) => (
            <mesh key={i} geometry={GEO.roe} position={position}>
              {material}
            </mesh>
          ))}
        </group>
      );
      break;
    default:
      mesh = null;
  }

  return <group rotation={BASE_ROT[item.shape]}>{mesh}</group>;
}

/* -------------------------------------------------------------------------- */
/* Animated ingredients                                                       */
/* -------------------------------------------------------------------------- */

function Ingredients({
  items,
  reduced,
}: {
  items: Ingredient[];
  reduced: boolean;
}) {
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime() % CYCLE;

    for (let i = 0; i < items.length; i += 1) {
      const group = refs.current[i];
      if (!group) continue;
      const item = items[i];

      const inProgress = clamp((t - item.delay) / FLY_IN_DUR, 0, 1);
      const e = easeOutCubic(inProgress);
      const outProgress = clamp((t - OUT_START) / OUT_DUR, 0, 1);

      // Fly in from the start position to the settled position…
      let x = lerp(item.start[0], item.end[0], e);
      let y = lerp(item.start[1], item.end[1], e);
      let z = lerp(item.start[2], item.end[2], e);

      // …with a gentle arc on the way in.
      y += Math.sin(Math.PI * inProgress) * 0.7 * (1 - outProgress);

      // A quiet bob while it rests on the rice.
      if (inProgress >= 1 && outProgress === 0) {
        y += Math.sin(t * 1.5 + item.phase) * 0.012;
      }

      // …then drift back out again at the end of the loop.
      x = lerp(x, item.start[0], outProgress);
      y = lerp(y, item.start[1], outProgress);
      z = lerp(z, item.start[2], outProgress);

      group.position.set(x, y, z);

      const spin = 1 - e;
      group.rotation.set(
        lerp(item.startRot[0], item.endRot[0], e) + spin * item.spin * 2.2,
        lerp(item.startRot[1], item.endRot[1], e) + spin * item.spin * 3.4,
        lerp(item.startRot[2], item.endRot[2], e) + spin * item.spin * 1.6,
      );

      group.scale.setScalar((0.6 + 0.4 * e) * item.scale);
    }
  });

  return (
    <>
      {items.map((item, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={reduced ? item.end : item.start}
          rotation={reduced ? item.endRot : item.startRot}
          scale={reduced ? item.scale : 0.6 * item.scale}
        >
          <IngredientMesh item={item} />
        </group>
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Soft contact shadow under the bowl                                         */
/* -------------------------------------------------------------------------- */

function useShadowTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    gradient.addColorStop(0, "rgba(0,0,0,0.5)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.24)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                      */
/* -------------------------------------------------------------------------- */

function Scene({ reduced }: { reduced: boolean }) {
  const sway = useRef<THREE.Group>(null);
  const items = useMemo(() => makeIngredients(), []);
  const shadow = useShadowTexture();
  const { size } = useThree();

  // Nudge the bowl to the right on wide screens so it sits beside the headline.
  const wide = size.width >= 1024;

  useFrame((state) => {
    if (reduced || !sway.current) return;
    const t = state.clock.getElapsedTime();
    sway.current.rotation.y = Math.sin(t * 0.2) * 0.09;
    sway.current.position.y = Math.sin(t * 0.45) * 0.025;
  });

  return (
    <>
      <hemisphereLight args={["#fff2df", "#171210", 0.9]} />
      <ambientLight intensity={0.35} color="#fff2df" />
      <directionalLight
        position={[3.5, 5.5, 2.5]}
        intensity={2.3}
        color="#ffe9cf"
      />
      <directionalLight
        position={[-4.5, 2.5, -2]}
        intensity={1.5}
        color="#b23a2e"
      />
      <directionalLight
        position={[0, 4, -5]}
        intensity={0.9}
        color="#c6a15b"
      />

      <group
        ref={sway}
        position={wide ? [0.35, 0, 0] : [0, -0.15, 0]}
        scale={wide ? 1 : 0.86}
      >
        {shadow ? (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
            <planeGeometry args={[3.8, 3.8]} />
            <meshBasicMaterial map={shadow} transparent depthWrite={false} />
          </mesh>
        ) : null}

        <Bowl />
        <Rice />
        <Ingredients items={items} reduced={reduced} />
      </group>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Canvas                                                                     */
/* -------------------------------------------------------------------------- */

export default function ChirashiScene({ reduced = false }: { reduced?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Pause the render loop while the hero is scrolled out of view.
  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => setActive(entries[0]?.isIntersecting ?? true),
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        flat
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.8]}
        gl={GL}
        camera={CAMERA}
        onCreated={({ camera }) => camera.lookAt(0, 0.78, 0)}
      >
        <Scene reduced={reduced} />
      </Canvas>
    </div>
  );
}
