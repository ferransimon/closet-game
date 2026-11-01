export const BASE_TIME_MS = 3000;
export const MIN_TIME_MS = 650;
const DECAY = 0.965;
export const HIDDEN_TIME_FACTOR = 1.4;

/** Tiempo disponible para la prenda número `n` (0-indexado). */
export function timeForItem(n: number, hasHidden = false): number {
  const t = Math.max(MIN_TIME_MS, BASE_TIME_MS * Math.pow(DECAY, n));
  return Math.round(hasHidden ? t * HIDDEN_TIME_FACTOR : t);
}

const RAMP_ITEMS = 40;
const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));

export function dirtyChance(n: number): number {
  return lerp(0.1, 0.22, n / RAMP_ITEMS);
}

export function hiddenChance(n: number): number {
  return lerp(0.08, 0.2, n / RAMP_ITEMS);
}

/** Nivel visible (1..), sube cada 8 prendas. */
export function levelFor(n: number): number {
  return Math.floor(n / 8) + 1;
}
