const KEY = "armario.scores";
export const MAX_SCORES = 20;

export interface ScoreEntry {
  score: number;
  date: number;
}

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e): e is ScoreEntry => typeof e?.score === "number" && typeof e?.date === "number")
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SCORES);
  } catch {
    return [];
  }
}

/** Guarda la puntuación y devuelve la lista nueva y la posición (0-indexada) o -1 si no entra. */
export function addScore(score: number, date = Date.now()): { scores: ScoreEntry[]; rank: number } {
  const entry = { score, date };
  const all = [...loadScores(), entry].sort((a, b) => b.score - a.score || a.date - b.date);
  const scores = all.slice(0, MAX_SCORES);
  const rank = score > 0 ? scores.indexOf(entry) : -1;
  try {
    localStorage.setItem(KEY, JSON.stringify(scores));
  } catch {
    /* almacenamiento no disponible */
  }
  return { scores, rank };
}
