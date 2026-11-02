import { describe, expect, it } from "vitest";
import { newGame, POINTS, QUEUE_SIZE, START_LIVES, step, type Ctx, type GameState } from "@/lib/game/engine";
import { MIN_TIME_MS, SPOILED_FROM, spoiledChance, timeForItem } from "@/lib/game/difficulty";
import { makeItem } from "@/lib/game/engine";
import type { Item } from "@/lib/game/items";

const ctx = (now = 1000): Ctx => ({ now, rng: () => 0.99 });

function withItem(partial: Partial<Item>): GameState {
  const s = newGame(ctx());
  return { ...s, current: { id: 1, kind: "apple", color: "#fff", spoiled: false, hidden: null, ...partial } };
}

describe("engine", () => {
  it("suma puntos al clasificar bien", () => {
    const s = step(withItem({ kind: "apple" }), { type: "SORT", side: "left" }, ctx());
    expect(s.score).toBe(POINTS.sort);
    expect(s.lives).toBe(START_LIVES);
    expect(s.resolved).toBe(1);
    const s2 = step(withItem({ kind: "donut" }), { type: "SORT", side: "right" }, ctx());
    expect(s2.score).toBe(POINTS.sort);
  });

  it("quita vida con lado equivocado", () => {
    const s = step(withItem({ kind: "donut" }), { type: "SORT", side: "left" }, ctx());
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.event).toMatchObject({ type: "error", reason: "wrong" });
  });

  it("quita vida al guardar comida podrida", () => {
    const s = step(withItem({ spoiled: true }), { type: "SORT", side: "left" }, ctx());
    expect(s.event).toMatchObject({ type: "error", reason: "spoiled" });
    expect(s.lives).toBe(START_LIVES - 1);
  });

  it("descartar podrida da puntos, descartar buena quita vida", () => {
    expect(step(withItem({ spoiled: true }), { type: "TAP_ITEM" }, ctx()).score).toBe(POINTS.discard);
    const s = step(withItem({}), { type: "TAP_ITEM" }, ctx());
    expect(s.event).toMatchObject({ type: "error", reason: "fresh" });
  });

  it("guardar con objeto escondido quita vida", () => {
    const s = step(withItem({ hidden: "worm" }), { type: "SORT", side: "left" }, ctx());
    expect(s.event).toMatchObject({ type: "error", reason: "hidden" });
  });

  it("extraer y luego guardar suma ambos", () => {
    let s = withItem({ hidden: "sticker" });
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
    let s = withItem({ kind: "donut" });
    for (let i = 0; i < START_LIVES; i++) {
      s = step({ ...s, current: { ...s.current, kind: "donut", spoiled: false, hidden: null } }, { type: "SORT", side: "left" }, ctx());
    }
    expect(s.phase).toBe("over");
    expect(step(s, { type: "SORT", side: "right" }, ctx())).toBe(s);
  });

  it("bonus de racha", () => {
    let s = withItem({});
    for (let i = 0; i < POINTS.streakEvery; i++) {
      s = step({ ...s, current: { ...s.current, kind: "apple", spoiled: false, hidden: null } }, { type: "SORT", side: "left" }, ctx());
    }
    expect(s.score).toBe(POINTS.sort * POINTS.streakEvery + POINTS.streakBonus);
    expect(s.event).toMatchObject({ type: "sorted", streak: POINTS.streakEvery });
  });

  it("sin racha el evento no la marca", () => {
    const s = step(withItem({}), { type: "SORT", side: "left" }, ctx());
    expect(s.event).toMatchObject({ streak: null });
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
    const s0 = withItem({ hidden: "bone" });
    expect(step(s0, { type: "EXTRACT" }, ctx()).queue).toBe(s0.queue);
  });
});

describe("difficulty", () => {
  it("no hay comida podrida al principio", () => {
    expect(spoiledChance(0)).toBe(0);
    expect(spoiledChance(SPOILED_FROM - 1)).toBe(0);
    expect(spoiledChance(SPOILED_FROM)).toBeGreaterThan(0);
    for (let n = 0; n < SPOILED_FROM; n++) expect(makeItem(n, () => 0).spoiled).toBe(false);
    expect(makeItem(SPOILED_FROM, () => 0).spoiled).toBe(true);
  });

  it("el tiempo baja hasta un mínimo", () => {
    expect(timeForItem(0)).toBe(3000);
    expect(timeForItem(10)).toBeLessThan(timeForItem(5));
    expect(timeForItem(500)).toBe(MIN_TIME_MS);
    expect(timeForItem(0, true)).toBeGreaterThan(timeForItem(0));
  });
});
