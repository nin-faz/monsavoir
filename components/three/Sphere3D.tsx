"use client";

import { Suspense, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#E8C46A";
const GOLD_PALE = "#F5EDD8";
const VIOLET = "#9333EA";

// Fixed local positions on the gem's own surface: these sparkles are
// children of the rotating group, so they physically sweep across the
// silhouette as the gem turns — unlike a lighting highlight, which stays
// put on screen regardless of rotation.
const SPARKLES: [number, number, number][] = [
  [0.75, 0.45, 0.6],
  [-0.6, -0.3, 0.75],
  [0.1, -0.8, -0.5],
];

type Boost = { spin: number; pulse: number };

function useIsDark() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const compute = () =>
      root.classList.contains("dark")
        ? true
        : root.classList.contains("light")
          ? false
          : window.matchMedia("(prefers-color-scheme: dark)").matches;

    setIsDark(compute());
    const observer = new MutationObserver(() => setIsDark(compute()));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setIsDark(compute());
    mql.addEventListener("change", onChange);
    return () => {
      observer.disconnect();
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return isDark;
}

// Single decay tick shared by the gem and the sparkle field, so a tap
// pulses both in sync instead of each component decaying independently.
function BurstDecay({ boost, reduceMotion }: { boost: MutableRefObject<Boost>; reduceMotion: boolean }) {
  useFrame((_, delta) => {
    if (reduceMotion) {
      boost.current.spin = 0;
      boost.current.pulse = 0;
      return;
    }
    boost.current.spin *= Math.pow(0.002, delta);
    boost.current.pulse *= Math.pow(0.002, delta);
  });
  return null;
}

function CuriosityGem({
  reduceMotion,
  isDark,
  boost,
  onTap,
}: {
  reduceMotion: boolean;
  isDark: boolean;
  boost: MutableRefObject<Boost>;
  onTap: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (!reduceMotion) {
        groupRef.current.rotation.y += delta * (0.5 + boost.current.spin);
      }
      groupRef.current.scale.setScalar(1 + boost.current.pulse * 0.18);
    }
  });

  return (
    <Float
      speed={reduceMotion ? 0 : 1.1}
      rotationIntensity={reduceMotion ? 0 : 0.08}
      floatIntensity={reduceMotion ? 0 : 0.35}
    >
      <group ref={groupRef} rotation={[0.15, 0.5, 0]}>
        <mesh
          castShadow
          onPointerDown={onTap}
          onPointerOver={() => { document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
          <icosahedronGeometry args={[1, 3]} />
          <meshPhysicalMaterial
            color={isDark ? GOLD : GOLD_BRIGHT}
            metalness={0.6}
            roughness={isDark ? 0.22 : 0.32}
            clearcoat={0.6}
            clearcoatRoughness={0.15}
            reflectivity={0.6}
          />
        </mesh>
        {SPARKLES.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={GOLD_PALE} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Wraps the ambient Sparkles in a group so a tap can visibly fling them
// outward (scale) and spin them faster, on top of drei's own per-particle
// drift.
function SparkleField({ boost }: { boost: MutableRefObject<Boost> }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + boost.current.pulse * 0.4);
      groupRef.current.rotation.y += delta * (0.05 + boost.current.spin * 0.35);
    }
  });

  return (
    <group ref={groupRef}>
      <Sparkles count={30} scale={3.2} size={3} speed={0.25} color={GOLD_PALE} noise={0.6} />
      <Sparkles count={18} scale={2.6} size={4} speed={0.15} color={VIOLET} noise={0.4} />
    </group>
  );
}

export function Sphere3D({ className }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const isDark = useIsDark();
  const boost = useRef<Boost>({ spin: 0, pulse: 0 });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  const handleTap = () => {
    if (reduceMotion) return;
    boost.current.spin = 5;
    boost.current.pulse = 1;
  };

  return (
    <div className={className} style={{ touchAction: "none" }} onPointerDown={handleTap}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 40 }}
        dpr={[1, 2.5]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 0.55 : 1.1} color={GOLD_PALE} />
          <pointLight
            position={[2.4, 1.6, 2.6]}
            intensity={isDark ? 35 : 22}
            color={VIOLET}
          />
          <pointLight
            position={[-2.2, -1.4, 1.8]}
            intensity={isDark ? 18 : 30}
            color={GOLD_PALE}
          />
          <BurstDecay boost={boost} reduceMotion={reduceMotion} />
          <CuriosityGem reduceMotion={reduceMotion} isDark={isDark} boost={boost} onTap={handleTap} />
          {!reduceMotion && <SparkleField boost={boost} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
