"use client";

import { useState, type CSSProperties } from "react";

const COLORS = ["#F7A8A8", "#BDE7D6", "#D9C8F0", "#F8E39A", "#BFDDF3", "#F7B4CB", "#F9BE8C"];
const PARTICLES = 28;

function makeParticles() {
  return Array.from({ length: PARTICLES }, (_, i) => {
    const angle = (i / PARTICLES) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 90 + Math.random() * 110;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 40,
      rot: Math.round(Math.random() * 720 - 360),
      color: COLORS[i % COLORS.length],
      round: Math.random() < 0.4,
      delay: Math.round(Math.random() * 80),
    };
  });
}

/** Confeti + texto al completar una racha. No bloquea la interacción. */
export function StreakBurst({ streak }: { streak: number }) {
  const [particles] = useState(makeParticles);
  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
      {particles.map((p, i) => (
        <span
          key={i}
          className={`confetti absolute h-3 w-2 ${p.round ? "rounded-full" : "rounded-[2px]"}`}
          style={
            {
              backgroundColor: p.color,
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              "--rot": `${p.rot}deg`,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
      <div className="streak-text flex flex-col items-center rounded-3xl bg-white/85 px-6 py-3 text-ink shadow-soft">
        <span className="text-3xl font-extrabold">¡Racha ×{streak}!</span>
        <span className="text-sm font-bold text-ink/60">bonus +20</span>
      </div>
    </div>
  );
}
