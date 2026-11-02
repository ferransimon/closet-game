const INK = "#5B5470";

export function Basket({ color, label, bump }: { color: string; label: string; bump: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        key={bump}
        viewBox="0 0 100 80"
        className={`h-auto w-[min(34vw,150px)] ${bump ? "closet-bump" : ""}`}
        aria-hidden
      >
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round">
          <path d="M22 34 Q22 6 50 6 Q78 6 78 34" fill="none" strokeWidth={4} />
          <path d="M6 32 H94 L84 74 Q83 78 78 78 H22 Q17 78 16 74 Z" fill={color} />
          <path d="M6 32 H94 V40 H6 Z" fill="#fff" fillOpacity={0.45} />
          <path d="M30 40 L32 78 M50 40 V78 M70 40 L68 78 M12 56 H88" fill="none" opacity={0.3} />
        </g>
      </svg>
      <span className="text-sm font-bold tracking-wide text-ink/70">{label}</span>
    </div>
  );
}
