"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { ERROR_TEXT, newGame, QUEUE_SIZE, START_LIVES, step, type Action, type GameState } from "@/lib/game/engine";
import { levelFor, SPOILED_FROM } from "@/lib/game/difficulty";
import { FOOD } from "@/lib/game/items";
import { addScore, loadScores, type ScoreEntry } from "@/lib/scores";
import { FoodSvg, SpoiledOverlay } from "./svg/food";
import { HiddenSvg } from "./svg/objects";
import { Basket } from "./Basket";
import { ScoreBoard } from "./ScoreBoard";
import { StreakBurst } from "./StreakBurst";

type Screen = "menu" | "playing" | "over";

const RESTART_LOCK_MS = 700;

/**
 * Huecos de la pila: y = centro en % del tamaño del alimento actual, s = escala, o = opacidad.
 * El 0 es el actual; del 1 al QUEUE_SIZE se encogen y se solapan.
 */
const SLOTS = (() => {
  const slots = [{ y: 0, s: 1, o: 1 }];
  for (let i = 1; i <= QUEUE_SIZE; i++) {
    const t = QUEUE_SIZE > 1 ? (i - 1) / (QUEUE_SIZE - 1) : 0;
    const s = 0.4 - 0.22 * t;
    const prev = slots[i - 1];
    // Cada tarjeta asoma un 70 % por encima de la anterior (solape del 30 %).
    const y = i === 1 ? -(50 + 6 + (s * 100) / 2) : prev.y - ((prev.s + s) / 2) * 70;
    slots.push({ y, s, o: 0.9 - 0.65 * t });
  }
  return slots;
})();

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
      {/* Zonas izquierda (saludable) / derecha (no saludable) */}
      <div className="pointer-events-none absolute inset-0 flex">
        <div className="flex-1 bg-mint/25" />
        <div className="flex-1 bg-coral/10" />
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

          {/* Alimento actual + cola */}
          <section className="stage relative z-10 flex flex-1 items-end justify-center pb-[3dvh]">
            <div className="relative aspect-square w-[var(--item-size)]">
              {[item, ...game.queue].map((it, idx) => {
                const slot = SLOTS[idx];
                const active = idx === 0;
                return (
                  <div
                    key={it.id}
                    className="queue-slot absolute inset-0"
                    style={{
                      transform: `translateY(${slot.y}%) scale(${slot.s})`,
                      zIndex: 20 - idx,
                      pointerEvents: active ? "auto" : "none",
                    }}
                  >
                    <button
                      type="button"
                      tabIndex={active ? 0 : -1}
                      aria-hidden={!active}
                      aria-label={it.spoiled ? "Comida podrida: tirar" : FOOD[it.kind].label}
                      onPointerDown={active ? onItemPointer : undefined}
                      style={{ backgroundColor: it.color }}
                      className={`relative block h-full w-full rounded-[2rem] p-[10%] shadow-soft ring-white ${
                        it.spoiled ? "ring-4 ring-mold/40" : active ? "" : "ring-[6px]"
                      }`}
                    >
                      <span className="block h-full w-full transition-opacity duration-150" style={{ opacity: slot.o }}>
                        <FoodSvg kind={it.kind} className={`h-full w-full ${it.spoiled ? "spoiled" : ""}`} />
                        {it.spoiled && <SpoiledOverlay className="absolute inset-[10%]" />}
                      </span>
                    </button>
                    {it.hidden &&
                      (active ? (
                        <button
                          type="button"
                          aria-label="Quitar lo que tiene dentro"
                          onPointerDown={onHiddenPointer}
                          className="hidden-peek absolute -right-[10%] -top-[12%] aspect-square w-[40%] rounded-full bg-white p-[5%] shadow-soft"
                        >
                          <HiddenSvg kind={it.hidden} className="h-full w-full" />
                        </button>
                      ) : (
                        <span
                          className="absolute -right-[10%] -top-[12%] block aspect-square w-[40%] rotate-12 rounded-full bg-white p-[5%]"
                          style={{ opacity: slot.o }}
                        >
                          <HiddenSvg kind={it.hidden} className="h-full w-full" />
                        </span>
                      ))}
                  </div>
                );
              })}

              {/* Fantasmas de animación */}
              {ev && ev.type === "sorted" && (
                <div key={`g${ev.seq}`} className={`pointer-events-none absolute inset-0 z-30 arc-x arc-${ev.side}`}>
                  <div className="arc-y h-full w-full">
                    <div className="h-full w-full rounded-[2rem] p-[10%]" style={{ backgroundColor: ev.item.color }}>
                      <FoodSvg kind={ev.item.kind} className="h-full w-full" />
                    </div>
                  </div>
                </div>
              )}
              {ev && (ev.type === "discarded" || ev.type === "error") && (
                <div
                  key={`g${ev.seq}`}
                  className={`pointer-events-none absolute inset-0 z-0 ${ev.type === "discarded" ? "ghost-trash" : "ghost-shake"}`}
                >
                  <div className="h-full w-full rounded-[2rem] p-[10%]" style={{ backgroundColor: ev.item.color }}>
                    <FoodSvg kind={ev.item.kind} className="h-full w-full" />
                  </div>
                </div>
              )}
              {ev && ev.type === "extracted" && ev.item.hidden && (
                <div key={`x${ev.seq}`} className="ghost-extract pointer-events-none absolute z-30 aspect-square w-[40%]">
                  <HiddenSvg kind={ev.item.hidden} className="h-full w-full" />
                </div>
              )}
              {ev && (
                <div
                  key={`t${ev.seq}`}
                  className={`float-up pointer-events-none absolute inset-x-[-50%] top-[30%] z-40 text-center text-2xl font-extrabold [text-shadow:0_2px_0_var(--cream)] ${
                    ev.type === "error" ? "text-coral" : "text-ink"
                  }`}
                >
                  {ev.type === "error" ? ERROR_TEXT[ev.reason] : `+${ev.points}`}
                </div>
              )}
            </div>
          </section>

          {ev && ev.type !== "error" && ev.type !== "extracted" && ev.streak && (
            <StreakBurst key={`s${ev.seq}`} streak={ev.streak} />
          )}
          {ev?.type === "error" && <div key={`f${ev.seq}`} className="flash pointer-events-none absolute inset-0 z-20" />}

          {/* Cestas */}
          <footer className="relative z-10 flex justify-between px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Basket color="var(--mint)" label="Saludable" bump={bumpLeft} />
            <Basket color="var(--coral-soft)" label="No saludable" bump={bumpRight} />
          </footer>
        </>
      )}

      {screen === "menu" && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center text-ink">
          <div>
            <h1 className="text-6xl font-extrabold tracking-tight">Plato</h1>
            <p className="mt-2 text-ink/60">Separa lo sano de lo que no antes de que se acabe el tiempo</p>
          </div>
          <div className="flex w-full max-w-xs justify-between">
            <Basket color="var(--mint)" label="← Saludable" bump={0} />
            <Basket color="var(--coral-soft)" label="No saludable →" bump={0} />
          </div>
          <ul className="flex flex-col gap-2 text-left text-sm text-ink/70">
            <li className="flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 rounded-full bg-white p-1">
                <HiddenSvg kind="worm" className="h-full w-full" />
              </span>
              Quita gusanos, pegatinas… antes de guardar
            </li>
            <li className="flex items-center gap-3">
              <span className="relative h-9 w-9 shrink-0 rounded-xl bg-white/80 p-1">
                <FoodSvg kind="apple" className="spoiled h-full w-full" />
                <SpoiledOverlay className="absolute inset-1" />
              </span>
              <span>
                Toca la comida podrida para tirarla
                <span className="block text-xs text-ink/45">aparece a partir del alimento {SPOILED_FROM}</span>
              </span>
            </li>
          </ul>
          <div className="flex flex-col items-center gap-2">
            <span className="cta-pulse rounded-full bg-ink px-8 py-4 text-lg font-extrabold text-cream shadow-soft">
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
          <span className="cta-pulse rounded-full bg-ink px-8 py-4 text-lg font-extrabold text-cream shadow-soft">
            Toca para reintentar
          </span>
        </div>
      )}
    </main>
  );
}
