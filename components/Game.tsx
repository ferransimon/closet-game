"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { ERROR_TEXT, newGame, START_LIVES, step, type Action, type GameState } from "@/lib/game/engine";
import { levelFor } from "@/lib/game/difficulty";
import { CLOTHING } from "@/lib/game/items";
import { addScore, loadScores, type ScoreEntry } from "@/lib/scores";
import { ClothingSvg, DirtOverlay } from "./svg/clothes";
import { HiddenSvg } from "./svg/objects";
import { Closet } from "./Closet";
import { ScoreBoard } from "./ScoreBoard";

type Screen = "menu" | "playing" | "over";

const RESTART_LOCK_MS = 700;
const ctx = () => ({ now: performance.now(), rng: Math.random });

function Heart({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-6 w-6 transition-transform ${full ? "" : "scale-90 opacity-40"}`} aria-hidden>
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.2 0 3.6 1.3 4.3 2.6.7-1.3 2.1-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
        fill={full ? "#F49FAE" : "none"}
        stroke="#5B5470"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Game() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [game, setGame] = useState<GameState | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [rank, setRank] = useState(-1);

  const gameRef = useRef<GameState | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const savedFor = useRef<GameState | null>(null);

  gameRef.current = game;

  useEffect(() => setScores(loadScores()), []);

  const dispatch = useCallback((action: Action) => {
    setGame((s) => (s ? step(s, action, ctx()) : s));
  }, []);

  const start = useCallback(() => {
    if (performance.now() < lockUntil.current) return;
    setRank(-1);
    setGame(newGame(ctx()));
    setScreen("playing");
  }, []);

  // Fin de partida: guardar puntuación una sola vez.
  useEffect(() => {
    if (!game || game.phase !== "over" || savedFor.current === game) return;
    savedFor.current = game;
    const res = addScore(game.score);
    setScores(res.scores);
    setRank(res.rank);
    lockUntil.current = performance.now() + RESTART_LOCK_MS;
    const t = setTimeout(() => setScreen("over"), 450);
    return () => clearTimeout(t);
  }, [game]);

  // Feedback háptico en errores.
  const lastSeq = useRef(0);
  useEffect(() => {
    const ev = game?.event;
    if (!ev || ev.seq === lastSeq.current) return;
    lastSeq.current = ev.seq;
    if (ev.type === "error") navigator.vibrate?.(90);
  }, [game?.event]);

  // Bucle: barra de tiempo + timeout.
  useEffect(() => {
    if (screen !== "playing") return;
    let raf = 0;
    const loop = () => {
      const g = gameRef.current;
      if (g && g.phase === "playing") {
        const now = performance.now();
        const frac = Math.max(0, Math.min(1, (g.deadline - now) / g.duration));
        const bar = barRef.current;
        if (bar) {
          bar.style.transform = `scaleX(${frac})`;
          bar.style.backgroundColor = frac > 0.5 ? "var(--mint-strong)" : frac > 0.25 ? "var(--lemon-strong)" : "var(--coral)";
        }
        if (now >= g.deadline) dispatch({ type: "TICK" });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      if (document.visibilityState === "visible") dispatch({ type: "RESUME" });
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [screen, dispatch]);

  // Teclado (desktop).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const playing = gameRef.current?.phase === "playing" && screen === "playing";
      if (!playing) {
        if (screen !== "playing" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          start();
        }
        return;
      }
      const map: Record<string, Action> = {
        ArrowLeft: { type: "SORT", side: "left" },
        a: { type: "SORT", side: "left" },
        ArrowRight: { type: "SORT", side: "right" },
        d: { type: "SORT", side: "right" },
        " ": { type: "TAP_ITEM" },
        ArrowDown: { type: "TAP_ITEM" },
        ArrowUp: { type: "EXTRACT" },
        e: { type: "EXTRACT" },
      };
      const action = map[e.key];
      if (action) {
        e.preventDefault();
        dispatch(action);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, start, dispatch]);

  const isPrimary = (e: RPointerEvent) => e.isPrimary && (e.pointerType !== "mouse" || e.button === 0);

  const onStagePointer = (e: RPointerEvent<HTMLDivElement>) => {
    if (!isPrimary(e)) return;
    if (screen !== "playing") return start();
    if (game?.phase !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    dispatch({ type: "SORT", side: e.clientX < rect.left + rect.width / 2 ? "left" : "right" });
  };

  const onItemPointer = (e: RPointerEvent) => {
    if (!isPrimary(e) || screen !== "playing") return;
    e.stopPropagation();
    dispatch({ type: "TAP_ITEM" });
  };

  const onHiddenPointer = (e: RPointerEvent) => {
    if (!isPrimary(e) || screen !== "playing") return;
    e.stopPropagation();
    dispatch({ type: "EXTRACT" });
  };

  const ev = game?.event;
  const best = scores[0]?.score ?? 0;
  const item = game?.current;
  const bumpLeft = ev && ev.type === "sorted" && ev.side === "left" ? ev.seq : 0;
  const bumpRight = ev && ev.type === "sorted" && ev.side === "right" ? ev.seq : 0;

  return (
    <main
      className="relative mx-auto flex h-dvh w-full max-w-[480px] select-none flex-col overflow-hidden"
      onPointerDown={onStagePointer}
    >
      {/* Zonas izquierda / derecha */}
      <div className="pointer-events-none absolute inset-0 flex">
        <div className="flex-1 bg-mint/25" />
        <div className="flex-1 bg-lavender/25" />
      </div>

      {screen === "playing" && game && item && (
        <>
          {/* HUD */}
          <header className="relative z-10 px-5 pt-[max(1rem,env(safe-area-inset-top))]">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tabular-nums text-ink">{game.score}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-ink/40">Nv {levelFor(game.resolved)}</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: START_LIVES }, (_, i) => (
                  <Heart key={i} full={i < game.lives} />
                ))}
              </div>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/80 shadow-inner">
              <div ref={barRef} className="h-full w-full origin-left rounded-full" />
            </div>
          </header>

          {/* Prenda */}
          <section className="relative z-10 flex flex-1 items-center justify-center">
            <div key={item.id} className="item-in relative z-10 w-[min(46vw,210px)]">
              <button
                type="button"
                aria-label={item.dirty ? "Prenda sucia: descartar" : CLOTHING[item.kind].label}
                onPointerDown={onItemPointer}
                className={`relative block aspect-square w-full rounded-[2rem] bg-white/80 p-4 shadow-soft ${
                  item.dirty ? "ring-4 ring-dirt/30" : ""
                }`}
              >
                <ClothingSvg kind={item.kind} color={item.color} className="h-full w-full" />
                {item.dirty && <DirtOverlay className="absolute inset-4" />}
              </button>
              {item.hidden && (
                <button
                  type="button"
                  aria-label="Sacar objeto"
                  onPointerDown={onHiddenPointer}
                  className="hidden-peek absolute -right-5 -top-6 h-20 w-20 rounded-full bg-lemon/80 p-2 shadow-soft"
                >
                  <HiddenSvg kind={item.hidden} className="h-full w-full" />
                </button>
              )}
            </div>

            {/* Fantasmas de animación */}
            {ev && ev.type !== "extracted" && (
              <div
                key={`g${ev.seq}`}
                className={`pointer-events-none absolute w-[min(46vw,210px)] ${
                  ev.type === "sorted"
                    ? `ghost-${ev.side}`
                    : ev.type === "discarded"
                      ? "ghost-trash"
                      : ev.side
                        ? `ghost-${ev.side} ghost-error`
                        : "ghost-shake"
                }`}
              >
                <div className="aspect-square w-full rounded-[2rem] bg-white/80 p-4">
                  <ClothingSvg kind={ev.item.kind} color={ev.item.color} className="h-full w-full" />
                </div>
              </div>
            )}
            {ev && ev.type === "extracted" && ev.item.hidden && (
              <div key={`x${ev.seq}`} className="ghost-extract pointer-events-none absolute h-20 w-20">
                <HiddenSvg kind={ev.item.hidden} className="h-full w-full" />
              </div>
            )}
            {ev && (
              <div
                key={`t${ev.seq}`}
                className={`float-up pointer-events-none absolute top-[12%] text-2xl font-extrabold ${
                  ev.type === "error" ? "text-coral" : "text-ink"
                }`}
              >
                {ev.type === "error" ? ERROR_TEXT[ev.reason] : `+${ev.points}`}
              </div>
            )}
          </section>

          {ev?.type === "error" && <div key={`f${ev.seq}`} className="flash pointer-events-none absolute inset-0 z-20" />}

          {/* Armarios */}
          <footer className="relative z-10 flex justify-between px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Closet color="var(--mint)" label="Hombre" bump={bumpLeft} />
            <Closet color="var(--lavender)" label="Mujer" bump={bumpRight} />
          </footer>
        </>
      )}

      {screen === "menu" && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center text-ink">
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight">Armario</h1>
            <p className="mt-2 text-ink/60">Ordena la colada antes de que se acabe el tiempo</p>
          </div>
          <div className="flex w-full max-w-xs justify-between">
            <Closet color="var(--mint)" label="← Hombre" bump={0} />
            <Closet color="var(--lavender)" label="Mujer →" bump={0} />
          </div>
          <ul className="flex flex-col gap-2 text-sm text-ink/70">
            <li className="flex items-center gap-3">
              <span className="relative h-9 w-9 shrink-0 rounded-xl bg-white/80 p-1">
                <ClothingSvg kind="skirt" color="#F9C6B4" className="h-full w-full" />
                <DirtOverlay className="absolute inset-1" />
              </span>
              Toca la ropa sucia para tirarla
            </li>
            <li className="flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 rounded-full bg-lemon/80 p-1">
                <HiddenSvg kind="phone" className="h-full w-full" />
              </span>
              Saca los objetos antes de guardar
            </li>
          </ul>
          <div className="flex flex-col items-center gap-2">
            <span className="pulse rounded-full bg-ink px-8 py-4 text-lg font-extrabold text-cream shadow-soft">
              Toca para jugar
            </span>
            {best > 0 && <span className="text-sm font-bold text-ink/50">Récord: {best}</span>}
          </div>
        </div>
      )}

      {screen === "over" && game && (
        <div className="item-in relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-[env(safe-area-inset-bottom)] text-center text-ink">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-ink/50">Fin de partida</p>
          <p className="text-7xl font-extrabold tabular-nums">{game.score}</p>
          <p className="h-6 font-bold text-ink/70">
            {rank === 0 ? "¡Nuevo récord!" : rank > 0 ? `Puesto #${rank + 1}` : `Récord: ${best}`}
          </p>
          <div className="w-full" onPointerDown={(e) => e.stopPropagation()}>
            <ScoreBoard scores={scores} highlight={rank} />
          </div>
          <span className="pulse rounded-full bg-ink px-8 py-4 text-lg font-extrabold text-cream shadow-soft">
            Toca para reintentar
          </span>
        </div>
      )}
    </main>
  );
}
