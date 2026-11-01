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
    case "phone":
      return (
        <g {...common}>
          <rect x="30" y="10" width="40" height="80" rx="8" fill="#6E6A86" />
          <rect x="35" y="18" width="30" height="60" rx="3" fill="#BFE3F5" stroke="none" />
          <path d="M45 84 H55" stroke="#fff" />
        </g>
      );
    case "wallet":
      return (
        <g {...common}>
          <rect x="12" y="26" width="76" height="52" rx="8" fill="#B98B6A" />
          <path d="M60 42 H88 V62 H60 Q54 52 60 42 Z" fill="#A27654" />
          <circle cx="66" cy="52" r="3" fill="#F6E7A8" />
          <rect x="18" y="18" width="40" height="12" rx="2" fill="#C9E8C1" />
        </g>
      );
    case "keys":
      return (
        <g {...common}>
          <circle cx="32" cy="32" r="18" fill="none" strokeWidth={4} />
          <path d="M44 44 L80 80 M66 66 L74 58 M74 74 L82 66" strokeWidth={6} stroke="#E0B84C" />
          <path d="M44 44 L80 80" />
          <circle cx="44" cy="44" r="8" fill="#E0B84C" />
        </g>
      );
    case "glasses":
      return (
        <g {...common}>
          <circle cx="28" cy="54" r="16" fill="#BFE3F5" fillOpacity={0.7} strokeWidth={4} />
          <circle cx="72" cy="54" r="16" fill="#BFE3F5" fillOpacity={0.7} strokeWidth={4} />
          <path d="M44 52 Q50 46 56 52 M12 50 L4 40 M88 50 L96 40" strokeWidth={4} />
        </g>
      );
    case "purse":
      return (
        <g {...common}>
          <path d="M14 46 Q14 86 50 86 Q86 86 86 46 Z" fill="#F5A3B9" />
          <path d="M28 46 Q28 30 40 30 M72 46 Q72 30 60 30" fill="none" strokeWidth={4} />
          <circle cx="40" cy="30" r="5" fill="#E0B84C" />
          <circle cx="60" cy="30" r="5" fill="#E0B84C" />
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
