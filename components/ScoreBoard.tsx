import type { ScoreEntry } from "@/lib/scores";

const fmt = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" });

export function ScoreBoard({ scores, highlight }: { scores: ScoreEntry[]; highlight: number }) {
  if (!scores.length) return null;
  return (
    <ol className="scrollbar-none w-full max-h-[34dvh] overflow-y-auto rounded-3xl bg-white/70 p-2 text-ink shadow-soft">
      {scores.map((s, i) => (
        <li
          key={`${s.date}-${i}`}
          className={`flex items-center justify-between rounded-2xl px-4 py-1.5 text-sm ${
            i === highlight ? "bg-peach font-extrabold" : ""
          }`}
        >
          <span className="w-6 text-ink/50">{i + 1}</span>
          <span className="flex-1 tabular-nums font-bold">{s.score}</span>
          <span className="text-ink/50">{fmt.format(s.date)}</span>
        </li>
      ))}
    </ol>
  );
}
