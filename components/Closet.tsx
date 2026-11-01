const INK = "#5B5470";

export function Closet({ color, label, bump }: { color: string; label: string; bump: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        key={bump}
        viewBox="0 0 100 110"
        className={`h-auto w-[min(34vw,150px)] ${bump ? "closet-bump" : ""}`}
        aria-hidden
      >
        <g stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round">
          <rect x="10" y="6" width="80" height="94" rx="8" fill={color} />
          <path d="M50 14 V92" />
          <rect x="16" y="14" width="68" height="78" rx="4" fill="#fff" fillOpacity={0.35} />
          <path d="M50 14 V92" />
          <path d="M44 48 V60 M56 48 V60" strokeWidth={4} />
          <path d="M20 100 V106 M80 100 V106" strokeWidth={4} />
        </g>
      </svg>
      <span className="text-sm font-bold tracking-wide text-ink/70">{label}</span>
    </div>
  );
}
