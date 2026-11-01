import { describe, expect, it } from "vitest";
import { newGame, POINTS, QUEUE_SIZE, START_LIVES, step, type Ctx, type GameState } from "@/lib/game/engine";
import { MIN_TIME_MS, timeForItem } from "@/lib/game/difficulty";
import type { Item } from "@/lib/game/items";

const ctx = (now = 1000): Ctx => ({ now, rng: () => 0.99 });

function withItem(partial: Partial<Item>): GameState {
  const s = newGame(ctx());
  return { ...s, current: { id: 1, kind: "tie", color: "#fff", dirty: false, hidden: null, ...partial } };
}

describe("engine", () => {
  it("suma puntos al clasificar bien", () => {
    const s = step(withItem({ kind: "tie" }), { type: "SORT", side: "left" }, ctx());
    expect(s.score).toBe(POINTS.sort);
    expect(s.lives).toBe(START_LIVES);
    expect(s.resolved).toBe(1);
    const s2 = step(withItem({ kind: "dress" }), { type: "SORT", side: "right" }, ctx());
    expect(s2.score).toBe(POINTS.sort);
  });

  it("quita vida con armario equivocado", () => {
    const s = step(withItem({ kind: "dress" }), { type: "SORT", side: "left" }, ctx());
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.event).toMatchObject({ type: "error", reason: "wrong" });
  });

  it("quita vida al guardar ropa sucia", () => {
    const s = step(withItem({ dirty: true }), { type: "SORT", side: "left" }, ctx());
    expect(s.event).toMatchObject({ type: "error", reason: "dirty" });
    expect(s.lives).toBe(START_LIVES - 1);
  });

  it("descartar sucia da puntos, descartar limpia quita vida", () => {
    expect(step(withItem({ dirty: true }), { type: "TAP_ITEM" }, ctx()).score).toBe(POINTS.discard);
    const s = step(withItem({}), { type: "TAP_ITEM" }, ctx());
    expect(s.event).toMatchObject({ type: "error", reason: "clean" });
  });

  it("guardar con objeto escondido quita vida", () => {
    const s = step(withItem({ hidden: "phone" }), { type: "SORT", side: "left" }, ctx());
    expect(s.event).toMatchObject({ type: "error", reason: "hidden" });
  });

  it("extraer y luego guardar suma ambos", () => {
    let s = withItem({ hidden: "wallet" });
    const id = s.current.id;
    s = step(s, { type: "EXTRACT" }, ctx());
    expect(s.current.id).toBe(id);
    expect(s.current.hidden).toBeNull();
    s = step(s, { type: "SORT", side: "left" }, ctx());
    expect(s.score).toBe(POINTS.extract + POINTS.sort);
    expect(s.lives).toBe(START_LIVES);
  });

  it("tiempo agotado quita vida", () => {
    const s0 = withItem({});
    expect(step(s0, { type: "TICK" }, ctx(s0.deadline - 1))).toBe(s0);
    const s = step(s0, { type: "TICK" }, ctx(s0.deadline));
    expect(s.event).toMatchObject({ type: "error", reason: "timeout" });
  });

  it("termina al quedarse sin vidas", () => {
    let s = withItem({ kind: "dress" });
    for (let i = 0; i < START_LIVES; i++) {
      s = step({ ...s, current: { ...s.current, kind: "dress", dirty: false, hidden: null } }, { type: "SORT", side: "left" }, ctx());
    }
    expect(s.phase).toBe("over");
    expect(step(s, { type: "SORT", side: "right" }, ctx())).toBe(s);
  });

  it("bonus de racha", () => {
    let s = withItem({});
    for (let i = 0; i < POINTS.streakEvery; i++) {
      s = step({ ...s, current: { ...s.current, kind: "tie", dirty: false, hidden: null } }, { type: "SORT", side: "left" }, ctx());
    }
    expect(s.score).toBe(POINTS.sort * POINTS.streakEvery + POINTS.streakBonus);
  });
});

describe("cola", () => {
  it("avanza la cola al resolver y mantiene su tamaño", () => {
    const s0 = newGame(ctx());
    expect(s0.queue).toHaveLength(QUEUE_SIZE);
    const s1 = step(s0, { type: "TAP_ITEM" }, ctx());
    expect(s1.current).toBe(s0.queue[0]);
    expect(s1.queue.slice(0, -1)).toEqual(s0.queue.slice(1));
    expect(s1.queue).toHaveLength(QUEUE_SIZE);
  });

  it("extraer no avanza la cola", () => {
    const s0 = withItem({ hidden: "keys" });
    expect(step(s0, { type: "EXTRACT" }, ctx()).queue).toBe(s0.queue);
  });
});

describe("difficulty", () => {
  it("el tiempo baja hasta un mínimo", () => {
    expect(timeForItem(0)).toBe(3000);
    expect(timeForItem(10)).toBeLessThan(timeForItem(5));
    expect(timeForItem(500)).toBe(MIN_TIME_MS);
    expect(timeForItem(0, true)).toBeGreaterThan(timeForItem(0));
  });
});
