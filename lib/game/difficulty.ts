export const BASE_TIME_MS = 3000;
export const MIN_TIME_MS = 650;
const DECAY = 0.965;
export const HIDDEN_TIME_FACTOR = 1.4;

/** Tiempo disponible para el alimento número `n` (0-indexado). */
export function timeForItem(n: number, hasHidden = false): number {
  const t = Math.max(MIN_TIME_MS, BASE_TIME_MS * Math.pow(DECAY, n));
  return Math.round(hasHidden ? t * HIDDEN_TIME_FACTOR : t);
}

const RAMP_ITEMS = 40;
const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));

/** La comida podrida no aparece hasta el alimento número SPOILED_FROM. */
export const SPOILED_FROM = 15;
const SPOILED_RAMP = 40;

export function spoiledChance(n: number): number {
  if (n < SPOILED_FROM) return 0;
  return lerp(0.12, 0.22, (n - SPOILED_FROM) / SPOILED_RAMP);
}

export function hiddenChance(n: number): number {
  return lerp(0.08, 0.2, n / RAMP_ITEMS);
}

/** Nivel visible (1..), sube cada 8 alimentos. */
export function levelFor(n: number): number {
  return Math.floor(n / 8) + 1;
}
