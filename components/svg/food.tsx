import type { FoodKind } from "@/lib/game/items";

const INK = "#5B5470";

const common = {
  stroke: INK,
  strokeWidth: 2.5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function Shape({ kind }: { kind: FoodKind }) {
  switch (kind) {
    case "apple":
      return (
        <g {...common}>
          <path d="M50 30 Q34 20 22 32 Q10 48 20 68 Q30 88 44 84 Q50 82 56 84 Q70 88 80 68 Q90 48 78 32 Q66 20 50 30 Z" fill="#F7A8A8" />
          <path d="M50 30 Q50 18 56 12" fill="none" />
          <path d="M54 22 Q66 10 76 18 Q66 28 54 22 Z" fill="#B8E0B0" />
          <path d="M30 44 Q28 52 32 60" fill="none" stroke="#fff" strokeWidth={4} />
        </g>
      );
    case "banana":
      return (
        <g {...common}>
          <path d="M20 28 Q22 66 52 78 Q76 86 88 70 Q70 76 52 66 Q32 54 30 26 Z" fill="#F8E39A" />
          <path d="M20 28 L18 20 L28 18 L30 26" fill="#C9A86A" />
          <path d="M34 40 Q40 58 60 68" fill="none" opacity={0.35} />
        </g>
      );
    case "broccoli":
      return (
        <g {...common}>
          <path d="M42 56 L38 88 H62 L58 56 Z" fill="#D9EDC0" />
          <circle cx="32" cy="44" r="14" fill="#9ED39A" />
          <circle cx="68" cy="44" r="14" fill="#9ED39A" />
          <circle cx="50" cy="30" r="16" fill="#9ED39A" />
          <circle cx="50" cy="52" r="12" fill="#9ED39A" />
          <path d="M44 28 h0.1 M56 34 h0.1 M30 46 h0.1 M70 42 h0.1" strokeWidth={4} opacity={0.4} />
        </g>
      );
    case "carrot":
      return (
        <g {...common}>
          <path d="M30 30 Q44 22 62 40 Q70 50 64 56 L22 90 Q14 92 16 84 Z" fill="#F9BE8C" />
          <path d="M34 50 L42 54 M26 66 L34 70 M44 40 L50 46" opacity={0.4} />
          <path d="M60 36 Q66 18 80 14 Q76 28 66 40 M64 40 Q80 34 90 40 Q78 48 66 44" fill="#B8E0B0" />
        </g>
      );
    case "fish":
      return (
        <g {...common}>
          <path d="M14 50 Q34 24 64 34 Q74 40 78 50 Q74 60 64 66 Q34 76 14 50 Z" fill="#BFDDF3" />
          <path d="M78 50 L94 34 V66 Z" fill="#BFDDF3" />
          <circle cx="28" cy="46" r="3" fill={INK} stroke="none" />
          <path d="M44 38 Q50 50 44 62 M54 38 Q60 50 54 62" fill="none" opacity={0.35} />
          <path d="M40 30 Q50 18 62 30" fill="#9CCBEB" />
        </g>
      );
    case "avocado":
      return (
        <g {...common}>
          <path d="M50 10 Q36 10 32 34 Q18 52 22 70 Q28 92 50 92 Q72 92 78 70 Q82 52 68 34 Q64 10 50 10 Z" fill="#9ED39A" />
          <path d="M50 20 Q42 20 40 38 Q30 52 32 68 Q36 84 50 84 Q64 84 68 68 Q70 52 60 38 Q58 20 50 20 Z" fill="#E5F2B8" stroke="none" />
          <circle cx="50" cy="62" r="13" fill="#C9A06E" />
          <path d="M44 56 Q46 52 50 52" fill="none" stroke="#fff" strokeWidth={3} />
        </g>
      );
    case "strawberry":
      return (
        <g {...common}>
          <path d="M50 88 Q20 70 18 44 Q18 30 34 28 Q42 28 50 32 Q58 28 66 28 Q82 30 82 44 Q80 70 50 88 Z" fill="#F7A0B0" />
          <path d="M32 26 L40 16 L46 26 L54 14 L58 26 L68 18 L68 30 Q50 38 32 26 Z" fill="#B8E0B0" />
          {[
            [36, 46],
            [50, 44],
            [64, 46],
            [42, 60],
            [58, 60],
            [50, 74],
          ].map(([x, y]) => (
            <path key={`${x}-${y}`} d={`M${x} ${y} l0 3`} stroke="#F8E39A" strokeWidth={3} />
          ))}
        </g>
      );
    case "egg":
      return (
        <g {...common}>
          <path d="M50 10 Q24 12 20 52 Q18 88 50 90 Q82 88 80 52 Q76 12 50 10 Z" fill="#FFFFFF" />
          <circle cx="50" cy="58" r="18" fill="#F9D77A" />
          <path d="M42 52 Q44 46 50 46" fill="none" stroke="#fff" strokeWidth={3} />
        </g>
      );
    case "burger":
      return (
        <g {...common}>
          <path d="M14 46 Q16 18 50 18 Q84 18 86 46 Z" fill="#F4C78D" />
          <path d="M12 52 Q22 46 30 54 Q40 46 50 54 Q60 46 70 54 Q78 46 88 52 L86 58 H14 Z" fill="#B8E0B0" />
          <rect x="12" y="56" width="76" height="12" rx="6" fill="#B98B6A" />
          <path d="M14 70 H86 Q86 84 72 84 H28 Q14 84 14 70 Z" fill="#F4C78D" />
          <path d="M34 28 h0.1 M50 24 h0.1 M64 30 h0.1 M44 34 h0.1" stroke="#fff" strokeWidth={4} />
        </g>
      );
    case "donut":
      return (
        <g {...common}>
          <circle cx="50" cy="52" r="36" fill="#F4C78D" />
          <path d="M20 46 Q22 18 50 16 Q80 18 82 46 Q84 56 76 54 Q70 64 62 56 Q54 66 46 58 Q36 66 32 56 Q22 62 20 46 Z" fill="#F7B4CB" />
          <circle cx="50" cy="48" r="11" fill="#FFF8F0" />
          <path d="M34 32 l4 3 M60 28 l-3 4 M68 42 l4 1 M30 46 l3 -3 M48 28 l2 4" stroke="#BFDDF3" strokeWidth={3} />
        </g>
      );
    case "fries":
      return (
        <g {...common}>
          <path d="M32 40 L28 10 L36 10 L38 40 M42 40 L42 6 L50 6 L50 40 M54 40 L58 12 L66 14 L60 40 M64 40 L72 20 L78 24 L68 40" fill="#F8E39A" />
          <path d="M22 38 H78 L70 92 H30 Z" fill="#F7A8A8" />
          <path d="M40 58 Q50 66 60 58" fill="none" stroke="#fff" strokeWidth={3} />
        </g>
      );
    case "pizza":
      return (
        <g {...common}>
          <path d="M14 22 Q50 8 86 22 L50 92 Z" fill="#F8E39A" />
          <path d="M14 22 Q50 8 86 22 L82 30 Q50 18 18 30 Z" fill="#E9B984" />
          <circle cx="40" cy="40" r="6" fill="#F49FAE" />
          <circle cx="60" cy="42" r="6" fill="#F49FAE" />
          <circle cx="50" cy="62" r="6" fill="#F49FAE" />
          <path d="M30 52 l4 2 M62 58 l-3 3" stroke="#9ED39A" strokeWidth={3} />
        </g>
      );
    case "soda":
      return (
        <g {...common}>
          <path d="M28 26 H72 L66 90 H34 Z" fill="#F7A8A8" />
          <rect x="24" y="18" width="52" height="10" rx="3" fill="#fff" />
          <path d="M54 18 L60 4 H70" fill="none" strokeWidth={3.5} />
          <path d="M31 50 H69 L67 66 H33 Z" fill="#fff" fillOpacity={0.7} />
          <path d="M40 76 h0.1 M50 82 h0.1 M56 74 h0.1" stroke="#fff" strokeWidth={4} />
        </g>
      );
    case "icecream":
      return (
        <g {...common}>
          <path d="M32 50 L50 94 L68 50 Z" fill="#F4C78D" />
          <path d="M38 58 L60 56 M42 70 L56 68" opacity={0.35} />
          <circle cx="50" cy="24" r="14" fill="#C7E7F5" />
          <path d="M28 50 Q18 50 20 40 Q22 30 34 32 Q44 28 50 36 Q56 28 66 32 Q78 30 80 40 Q82 50 72 50 Z" fill="#F7B4CB" />
          <circle cx="54" cy="10" r="5" fill="#F49FAE" />
        </g>
      );
    case "lollipop":
      return (
        <g {...common}>
          <path d="M50 58 V94" strokeWidth={5} />
          <path d="M50 58 V94" stroke="#fff" strokeWidth={2} />
          <circle cx="50" cy="34" r="26" fill="#D8CBF2" />
          <path d="M50 34 Q50 22 60 24 Q70 28 66 40 Q60 52 46 50 Q32 46 32 32 Q34 16 52 12" fill="none" stroke="#F7A0B0" strokeWidth={5} />
        </g>
      );
    case "hotdog":
      return (
        <g {...common}>
          <path d="M8 46 Q8 34 22 36 H78 Q92 34 92 46 Q92 58 78 58 H22 Q8 58 8 46 Z" fill="#E9A68A" />
          <path d="M12 52 Q14 74 30 74 H70 Q86 74 88 52 Q74 62 50 62 Q26 62 12 52 Z" fill="#F4C78D" />
          <path d="M14 42 Q22 34 30 42 T46 42 T62 42 T78 42 T88 42" fill="none" stroke="#F8E39A" strokeWidth={4} />
        </g>
      );
  }
}

export function FoodSvg({ kind, className }: { kind: FoodKind; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <Shape kind={kind} />
    </svg>
  );
}

/** Moho y moscas para la comida en mal estado. */
export function SpoiledOverlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="#7E9A6A" opacity={0.6}>
        <path d="M30 50 q6 -8 14 -2 q8 2 4 10 q-4 8 -12 4 q-10 -2 -6 -12z" />
        <path d="M60 64 q4 -6 10 -2 q6 4 2 9 q-4 5 -9 2 q-6 -3 -3 -9z" />
        <circle cx="62" cy="38" r="5" />
        <circle cx="40" cy="74" r="3.5" />
        <circle cx="70" cy="50" r="2.5" />
        <circle cx="34" cy="36" r="2" />
      </g>
      <g fill="#fff" opacity={0.5}>
        <circle cx="35" cy="52" r="1.5" />
        <circle cx="63" cy="66" r="1.2" />
        <circle cx="61" cy="37" r="1.4" />
      </g>
      {[
        [26, 22],
        [74, 20],
        [82, 72],
      ].map(([x, y], i) => (
        <g key={i} className="fly" style={{ animationDelay: `${i * 0.25}s`, transformOrigin: `${x}px ${y}px` }}>
          <ellipse cx={x - 2.5} cy={y - 2.5} rx={2.5} ry={1.6} fill="#fff" stroke={INK} strokeWidth={0.8} />
          <ellipse cx={x + 2.5} cy={y - 2.5} rx={2.5} ry={1.6} fill="#fff" stroke={INK} strokeWidth={0.8} />
          <circle cx={x} cy={y} r={2.2} fill={INK} />
        </g>
      ))}
    </svg>
  );
}
