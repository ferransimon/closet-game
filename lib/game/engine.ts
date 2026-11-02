import { hiddenChance, spoiledChance, timeForItem } from "./difficulty";
import {
  FOOD,
  FOOD_KINDS,
  HIDDEN_KINDS,
  PASTELS,
  SIDE_CATEGORY,
  type Item,
  type Side,
} from "./items";

export const START_LIVES = 3;
/** Prendas visibles en cola después de la actual. */
export const QUEUE_SIZE = 10;
export const POINTS = { sort: 10, discard: 15, extract: 25, streakBonus: 20, streakEvery: 10 };

export type ErrorReason = "wrong" | "spoiled" | "hidden" | "fresh" | "timeout";

export const ERROR_TEXT: Record<ErrorReason, string> = {
  wrong: "¡Lado equivocado!",
  spoiled: "¡Estaba podrida!",
  hidden: "¡Tenía algo dentro!",
  fresh: "¡Estaba buena!",
  timeout: "¡Tiempo!",
};

export type GameEvent =
  | { seq: number; type: "sorted"; item: Item; side: Side; points: number; streak: number | null }
  | { seq: number; type: "discarded"; item: Item; points: number; streak: number | null }
  | { seq: number; type: "extracted"; item: Item; points: number }
  | { seq: number; type: "error"; item: Item; reason: ErrorReason; side?: Side };

export interface GameState {
  phase: "playing" | "over";
  score: number;
  lives: number;
  /** Alimentos resueltos (acierto o error): marca la dificultad. */
  resolved: number;
  streak: number;
  current: Item;
  /** Próximos alimentos, en orden de llegada. */
  queue: Item[];
  /** Duración total asignada al alimento actual (ms). */
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
  let kind = FOOD_KINDS[Math.floor(rng() * FOOD_KINDS.length)];
  if (kind === prevKind) {
    kind = FOOD_KINDS[(FOOD_KINDS.indexOf(kind) + 1 + Math.floor(rng() * 3)) % FOOD_KINDS.length];
  }
  const color = PASTELS[Math.floor(rng() * PASTELS.length)];
  const roll = rng();
  const spoiled = roll < spoiledChance(n);
  const hidden =
    !spoiled && roll < spoiledChance(n) + hiddenChance(n)
      ? HIDDEN_KINDS[Math.floor(rng() * HIDDEN_KINDS.length)]
      : null;
  return { id: nextId++, kind, color, spoiled, hidden };
}

function withNextItem(s: GameState, ctx: Ctx): GameState {
  if (s.lives <= 0) return { ...s, phase: "over" };
  const [current, ...rest] = s.queue;
  // El alimento que entra al final de la cola se genera con la dificultad de su posición.
  const queue = [...rest, makeItem(s.resolved + QUEUE_SIZE, ctx.rng, rest.at(-1)?.kind ?? current.kind)];
  const duration = timeForItem(s.resolved, current.hidden !== null);
  return { ...s, current, queue, duration, deadline: ctx.now + duration };
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
  const bonus = streak % POINTS.streakEvery === 0;
  const points = base + (bonus ? POINTS.streakBonus : 0);
  const streakHit = bonus ? streak : null;
  const event: GameEvent =
    ev === "sorted"
      ? { seq, type: "sorted", item: s.current, side: side!, points, streak: streakHit }
      : { seq, type: "discarded", item: s.current, points, streak: streakHit };
  return withNextItem({ ...s, score: s.score + points, resolved: s.resolved + 1, streak, event }, ctx);
}

export function newGame(ctx: Ctx): GameState {
  const items = [makeItem(0, ctx.rng)];
  for (let i = 1; i <= QUEUE_SIZE; i++) items.push(makeItem(i, ctx.rng, items[i - 1].kind));
  const [current, ...queue] = items;
  const duration = timeForItem(0, current.hidden !== null);
  return {
    phase: "playing",
    score: 0,
    lives: START_LIVES,
    resolved: 0,
    streak: 0,
    current,
    queue,
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
      if (item.spoiled) return fail(s, ctx, "spoiled", action.side);
      if (item.hidden) return fail(s, ctx, "hidden", action.side);
      if (FOOD[item.kind].category !== SIDE_CATEGORY[action.side]) return fail(s, ctx, "wrong", action.side);
      return succeed(s, ctx, POINTS.sort, "sorted", action.side);
    }
    case "TAP_ITEM": {
      if (!item.spoiled) return fail(s, ctx, "fresh");
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
