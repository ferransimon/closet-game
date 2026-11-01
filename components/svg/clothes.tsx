import type { ClothingKind } from "@/lib/game/items";

const INK = "#5B5470";

interface Props {
  kind: ClothingKind;
  color: string;
  className?: string;
}

const common = {
  stroke: INK,
  strokeWidth: 2.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function Shape({ kind, color }: { kind: ClothingKind; color: string }) {
  switch (kind) {
    case "tie":
      return (
        <g {...common}>
          <path d="M42 10 H58 L55 22 H45 Z" fill={color} />
          <path d="M45 22 H55 L62 72 L50 90 L38 72 Z" fill={color} />
          <path d="M43 40 L57 50 M41 58 L59 68" stroke={INK} opacity={0.35} />
        </g>
      );
    case "bowtie":
      return (
        <g {...common}>
          <path d="M44 42 L14 26 Q8 50 14 74 L44 58 Z" fill={color} />
          <path d="M56 42 L86 26 Q92 50 86 74 L56 58 Z" fill={color} />
          <rect x="42" y="40" width="16" height="20" rx="5" fill={color} />
          <path d="M22 40 L34 46 M22 60 L34 54 M78 40 L66 46 M78 60 L66 54" opacity={0.35} />
        </g>
      );
    case "boxers":
      return (
        <g {...common}>
          <path d="M18 22 H82 L88 78 H58 L50 50 L42 78 H12 Z" fill={color} />
          <path d="M18 22 H82 V32 H18 Z" fill="#fff" fillOpacity={0.6} />
          <path d="M50 32 V48" />
          <circle cx="30" cy="56" r="3" fill={INK} opacity={0.25} stroke="none" />
          <circle cx="70" cy="60" r="3" fill={INK} opacity={0.25} stroke="none" />
          <circle cx="24" cy="70" r="3" fill={INK} opacity={0.25} stroke="none" />
          <circle cx="76" cy="44" r="3" fill={INK} opacity={0.25} stroke="none" />
        </g>
      );
    case "blazer":
      return (
        <g {...common}>
          <path d="M36 12 L18 20 L8 70 L18 72 L24 40 L24 90 H76 V40 L82 72 L92 70 L82 20 L64 12 L50 30 Z" fill={color} />
          <path d="M36 12 L44 50 L50 30 L56 50 L64 12" fill="#fff" fillOpacity={0.55} />
          <path d="M50 30 V90" />
          <circle cx="50" cy="62" r="2.5" fill={INK} stroke="none" />
          <circle cx="50" cy="74" r="2.5" fill={INK} stroke="none" />
          <path d="M60 58 H70" />
        </g>
      );
    case "suspenders":
      return (
        <g {...common}>
          <path d="M28 10 L40 54 L36 86" fill="none" stroke={color} strokeWidth={9} />
          <path d="M72 10 L60 54 L64 86" fill="none" stroke={color} strokeWidth={9} />
          <path d="M28 10 L40 54 L36 86 M72 10 L60 54 L64 86" fill="none" opacity={0.3} />
          <path d="M38 50 H62" stroke={color} strokeWidth={7} />
          <rect x="29" y="80" width="14" height="12" rx="2" fill="#E8E4F0" />
          <rect x="57" y="80" width="14" height="12" rx="2" fill="#E8E4F0" />
          <rect x="22" y="6" width="12" height="8" rx="2" fill="#E8E4F0" />
          <rect x="66" y="6" width="12" height="8" rx="2" fill="#E8E4F0" />
        </g>
      );
    case "trunks":
      return (
        <g {...common}>
          <path d="M16 26 H84 L90 74 H60 L50 54 L40 74 H10 Z" fill={color} />
          <path d="M16 26 H84 V34 H16 Z" fill="#fff" fillOpacity={0.6} />
          <path d="M46 34 Q44 44 40 46 M54 34 Q56 44 60 46" />
          <path d="M14 50 L22 74 M86 50 L78 74" stroke="#fff" strokeWidth={5} />
        </g>
      );
    case "dress":
      return (
        <g {...common}>
          <path d="M38 8 V20 M62 8 V20" />
          <path d="M36 20 Q50 30 64 20 L62 44 L86 90 H14 L38 44 Z" fill={color} />
          <path d="M38 44 Q50 50 62 44" fill="none" />
          <path d="M30 78 Q50 84 70 78" opacity={0.3} fill="none" />
        </g>
      );
    case "skirt":
      return (
        <g {...common}>
          <path d="M30 18 H70 L88 84 H12 Z" fill={color} />
          <path d="M30 18 H70 V28 H30 Z" fill="#fff" fillOpacity={0.6} />
          <path d="M40 28 L32 84 M50 28 V84 M60 28 L68 84" opacity={0.35} />
        </g>
      );
    case "bra":
      return (
        <g {...common}>
          <path d="M28 20 L22 50 M72 20 L78 50" />
          <path d="M10 56 Q14 34 30 34 Q46 34 50 56 Q54 34 70 34 Q86 34 90 56 Q78 70 60 68 Q52 66 50 62 Q48 66 40 68 Q22 70 10 56 Z" fill={color} />
          <path d="M10 56 H4 M90 56 H96" />
          <path d="M50 56 V62" />
          <circle cx="50" cy="58" r="2.5" fill={INK} stroke="none" />
        </g>
      );
    case "heels":
      return (
        <g {...common}>
          <path d="M10 72 Q12 50 30 54 Q48 58 62 40 L84 28 Q92 26 90 36 L86 70 H78 L80 44 Q66 74 40 76 L10 76 Z" fill={color} />
          <path d="M80 44 L78 86 H84 L86 70" fill={color} />
          <path d="M20 66 Q36 66 50 60" opacity={0.3} fill="none" />
        </g>
      );
    case "bikini":
      return (
        <g {...common}>
          <path d="M30 10 L24 36 M70 10 L76 36" />
          <path d="M12 42 L28 22 L46 42 Z" fill={color} />
          <path d="M54 42 L72 22 L88 42 Z" fill={color} />
          <path d="M46 40 Q50 36 54 40 M12 42 H4 M88 42 H96" />
          <path d="M18 60 H82 Q68 86 50 88 Q32 86 18 60 Z" fill={color} />
          <path d="M18 60 L10 56 M82 60 L90 56" />
        </g>
      );
    case "blouse":
      return (
        <g {...common}>
          <path d="M38 12 Q50 22 62 12 L82 20 Q94 30 90 46 L76 44 L74 88 H26 L24 44 L10 46 Q6 30 18 20 Z" fill={color} />
          <path d="M50 22 L38 32 L40 22 Z M50 22 L62 32 L60 22 Z" fill="#fff" />
          <path d="M50 22 L44 40 M50 22 L56 40" />
          <circle cx="50" cy="22" r="3" fill="#fff" />
        </g>
      );
  }
}

export function ClothingSvg({ kind, color, className }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <Shape kind={kind} color={color} />
    </svg>
  );
}

/** Manchas y moscas para la ropa sucia. */
export function DirtOverlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="#8B6B4A" opacity={0.55}>
        <path d="M30 50 q6 -8 14 -2 q8 2 4 10 q-4 8 -12 4 q-10 -2 -6 -12z" />
        <path d="M60 64 q4 -6 10 -2 q6 4 2 9 q-4 5 -9 2 q-6 -3 -3 -9z" />
        <circle cx="62" cy="38" r="4" />
        <circle cx="40" cy="74" r="3" />
        <circle cx="70" cy="50" r="2" />
      </g>
      {[
        [26, 26],
        [74, 22],
        [80, 70],
      ].map(([x, y], i) => (
        <g key={i} className="fly" style={{ animationDelay: `${i * 0.25}s`, transformOrigin: `${x}px ${y}px` }}>
          <ellipse cx={x - 2.5} cy={y - 2.5} rx={2.5} ry={1.6} fill="#fff" stroke="#5B5470" strokeWidth={0.8} />
          <ellipse cx={x + 2.5} cy={y - 2.5} rx={2.5} ry={1.6} fill="#fff" stroke="#5B5470" strokeWidth={0.8} />
          <circle cx={x} cy={y} r={2.2} fill="#5B5470" />
        </g>
      ))}
    </svg>
  );
}
