import { dirtyChance, hiddenChance, timeForItem } from "./difficulty";
import {
  CLOTHING,
  CLOTHING_KINDS,
  HIDDEN_KINDS,
  PASTELS,
  SIDE_GENDER,
  type Item,
  type Side,
} from "./items";

export const START_LIVES = 3;
export const POINTS = { sort: 10, discard: 15, extract: 25, streakBonus: 20, streakEvery: 10 };

export type ErrorReason = "wrong" | "dirty" | "hidden" | "clean" | "timeout";

export const ERROR_TEXT: Record<ErrorReason, string> = {
  wrong: "¡Armario equivocado!",
  dirty: "¡Estaba sucia!",
  hidden: "¡Había algo dentro!",
  clean: "¡Estaba limpia!",
  timeout: "¡Tiempo!",
};

export type GameEvent =
  | { seq: number; type: "sorted"; item: Item; side: Side; points: number }
  | { seq: number; type: "discarded"; item: Item; points: number }
  | { seq: number; type: "extracted"; item: Item; points: number }
  | { seq: number; type: "error"; item: Item; reason: ErrorReason; side?: Side };

export interface GameState {
  phase: "playing" | "over";
  score: number;
  lives: number;
  /** Prendas resueltas (acierto o error): marca la dificultad. */
  resolved: number;
  streak: number;
  current: Item;
  /** Duración total asignada a la prenda actual (ms). */
  duration: number;
  /** Timestamp (ms) en que se agota el tiempo. */
  deadline: number;
  event: GameEvent | null;
}

export type Action =
  | { type: "SORT"; side: Side }
  | { type: "TAP_ITEM" }
  | { type: "EXTRACT" }
  | { type: "TICK" }
  | { type: "RESUME" };

export interface Ctx {
  now: number;
  rng: () => number;
}

let nextId = 1;

export function makeItem(n: number, rng: () => number, prevKind?: Item["kind"]): Item {
  let kind = CLOTHING_KINDS[Math.floor(rng() * CLOTHING_KINDS.length)];
  if (kind === prevKind) {
    kind = CLOTHING_KINDS[(CLOTHING_KINDS.indexOf(kind) + 1 + Math.floor(rng() * 3)) % CLOTHING_KINDS.length];
  }
  const color = PASTELS[Math.floor(rng() * PASTELS.length)];
  const roll = rng();
  const dirty = roll < dirtyChance(n);
  const hidden =
    !dirty && roll < dirtyChance(n) + hiddenChance(n)
      ? HIDDEN_KINDS[Math.floor(rng() * HIDDEN_KINDS.length)]
      : null;
  return { id: nextId++, kind, color, dirty, hidden };
}

function withNextItem(s: GameState, ctx: Ctx): GameState {
  if (s.lives <= 0) return { ...s, phase: "over" };
  const current = makeItem(s.resolved, ctx.rng, s.current.kind);
  const duration = timeForItem(s.resolved, current.hidden !== null);
  return { ...s, current, duration, deadline: ctx.now + duration };
}

function fail(s: GameState, ctx: Ctx, reason: ErrorReason, side?: Side): GameState {
  const seq = (s.event?.seq ?? 0) + 1;
  return withNextItem(
    {
      ...s,
      lives: s.lives - 1,
      resolved: s.resolved + 1,
      streak: 0,
      event: { seq, type: "error", item: s.current, reason, side },
    },
    ctx,
  );
}

function succeed(s: GameState, ctx: Ctx, base: number, ev: "sorted" | "discarded", side?: Side): GameState {
  const seq = (s.event?.seq ?? 0) + 1;
  const streak = s.streak + 1;
  const points = base + (streak % POINTS.streakEvery === 0 ? POINTS.streakBonus : 0);
  const event: GameEvent =
    ev === "sorted"
      ? { seq, type: "sorted", item: s.current, side: side!, points }
      : { seq, type: "discarded", item: s.current, points };
  return withNextItem({ ...s, score: s.score + points, resolved: s.resolved + 1, streak, event }, ctx);
}

export function newGame(ctx: Ctx): GameState {
  const current = makeItem(0, ctx.rng);
  const duration = timeForItem(0, current.hidden !== null);
  return {
    phase: "playing",
    score: 0,
    lives: START_LIVES,
    resolved: 0,
    streak: 0,
    current,
    duration,
    deadline: ctx.now + duration,
    event: null,
  };
}

export function step(s: GameState, action: Action, ctx: Ctx): GameState {
  if (s.phase !== "playing") return s;
  const item = s.current;

  switch (action.type) {
    case "SORT": {
      if (item.dirty) return fail(s, ctx, "dirty", action.side);
      if (item.hidden) return fail(s, ctx, "hidden", action.side);
      if (CLOTHING[item.kind].gender !== SIDE_GENDER[action.side]) return fail(s, ctx, "wrong", action.side);
      return succeed(s, ctx, POINTS.sort, "sorted", action.side);
    }
    case "TAP_ITEM": {
      if (!item.dirty) return fail(s, ctx, "clean");
      return succeed(s, ctx, POINTS.discard, "discarded");
    }
    case "EXTRACT": {
      if (!item.hidden) return s;
      const seq = (s.event?.seq ?? 0) + 1;
      return {
        ...s,
        score: s.score + POINTS.extract,
        current: { ...item, hidden: null },
        event: { seq, type: "extracted", item, points: POINTS.extract },
      };
    }
    case "TICK":
      return ctx.now >= s.deadline ? fail(s, ctx, "timeout") : s;
    case "RESUME":
      return { ...s, deadline: ctx.now + s.duration };
  }
}
