"use client";

import { useMemo } from "react";

function pseudo(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function Starfield({ active }: { active: boolean }) {
  const stars = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      x: pseudo(i * 2.3) * 100,
      y: pseudo(i * 4.7) * 100,
      size: pseudo(i * 6.1) > 0.75 ? 1.5 : 1,
      duration: 2.5 + pseudo(i * 8.3) * 3.5,
      delay: pseudo(i * 13.1) * 5,
      color:
        i % 5 === 0 ? "#C9A84C"
        : i % 5 === 1 ? "#A78BFA"
        : i % 5 === 2 ? "#93C5FD"
        : "rgba(255,255,255,0.7)",
    })),
  []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
