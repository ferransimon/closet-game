import type { HiddenKind } from "@/lib/game/items";

const INK = "#5B5470";
const common = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function Shape({ kind }: { kind: HiddenKind }) {
  switch (kind) {
    case "worm":
      return (
        <g {...common}>
          <path d="M14 70 Q24 50 38 64 Q52 78 62 58 Q70 40 82 46" fill="none" stroke={INK} strokeWidth={16} />
          <path d="M14 70 Q24 50 38 64 Q52 78 62 58 Q70 40 82 46" fill="none" stroke="#F7B4CB" strokeWidth={11} />
          <circle cx="84" cy="42" r="3" fill={INK} stroke="none" />
          <path d="M30 58 l-2 8 M46 66 l2 8 M60 56 l6 4" stroke={INK} strokeWidth={2} opacity={0.4} />
        </g>
      );
    case "sticker":
      return (
        <g {...common}>
          <ellipse cx="50" cy="50" rx="36" ry="28" fill="#BFDDF3" />
          <ellipse cx="50" cy="50" rx="26" ry="18" fill="none" stroke="#fff" strokeWidth={3} />
          <path d="M38 50 h24 M44 42 h12 M44 58 h12" strokeWidth={3} />
          <path d="M78 34 Q86 30 84 42 Z" fill="#fff" />
        </g>
      );
    case "fishbone":
      return (
        <g {...common} fill="none">
          <path d="M12 50 H78" strokeWidth={4} />
          <path d="M78 50 L90 38 M78 50 L90 62" strokeWidth={4} />
          <path d="M24 50 L18 36 M24 50 L18 64 M38 50 L32 32 M38 50 L32 68 M52 50 L46 32 M52 50 L46 68 M66 50 L60 36 M66 50 L60 64" />
          <circle cx="14" cy="50" r="6" fill="#fff" />
        </g>
      );
    case "bone":
      return (
        <g {...common}>
          <path
            d="M28 36 Q20 22 12 30 Q6 38 16 44 Q8 52 16 60 Q24 66 30 56 L70 56 Q76 66 84 60 Q92 52 84 44 Q94 38 88 30 Q80 22 72 36 Z"
            fill="#FFF6E5"
            transform="rotate(-20 50 46)"
          />
        </g>
      );
    case "cap":
      return (
        <g {...common}>
          <circle cx="50" cy="50" r="30" fill="#F2D36B" />
          <path
            d="M50 14 l5 6 l8 -3 l1 8 l8 1 l-3 8 l6 5 l-6 5 l3 8 l-8 1 l-1 8 l-8 -3 l-5 6 l-5 -6 l-8 3 l-1 -8 l-8 -1 l3 -8 l-6 -5 l6 -5 l-3 -8 l8 -1 l1 -8 l8 3 z"
            fill="none"
            transform="translate(0 6) scale(1 0.92)"
            opacity={0.5}
          />
          <circle cx="50" cy="50" r="18" fill="#F8E39A" />
        </g>
      );
  }
}

export function HiddenSvg({ kind, className }: { kind: HiddenKind; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <Shape kind={kind} />
    </svg>
  );
}
