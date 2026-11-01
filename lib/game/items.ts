export type Gender = "m" | "f";
export type Side = "left" | "right";

/** Armario izquierdo = hombre, derecho = mujer. */
export const SIDE_GENDER: Record<Side, Gender> = { left: "m", right: "f" };

export type ClothingKind =
  | "tie"
  | "bowtie"
  | "boxers"
  | "blazer"
  | "suspenders"
  | "trunks"
  | "dress"
  | "skirt"
  | "bra"
  | "heels"
  | "bikini"
  | "blouse";

export const CLOTHING: Record<ClothingKind, { gender: Gender; label: string }> = {
  tie: { gender: "m", label: "Corbata" },
  bowtie: { gender: "m", label: "Pajarita" },
  boxers: { gender: "m", label: "Bóxer" },
  blazer: { gender: "m", label: "Americana" },
  suspenders: { gender: "m", label: "Tirantes" },
  trunks: { gender: "m", label: "Bañador" },
  dress: { gender: "f", label: "Vestido" },
  skirt: { gender: "f", label: "Falda" },
  bra: { gender: "f", label: "Sujetador" },
  heels: { gender: "f", label: "Tacones" },
  bikini: { gender: "f", label: "Bikini" },
  blouse: { gender: "f", label: "Blusa" },
};

export const CLOTHING_KINDS = Object.keys(CLOTHING) as ClothingKind[];

export type HiddenKind = "phone" | "wallet" | "keys" | "glasses" | "purse";
export const HIDDEN_KINDS: HiddenKind[] = ["phone", "wallet", "keys", "glasses", "purse"];

/** Tonos pastel para las prendas: no indican género. */
export const PASTELS = ["#F9C6B4", "#B9DCF2", "#F6E7A8", "#F5BFD3", "#C9E8C1", "#D8CBF2", "#FFD8A8"];

export interface Item {
  id: number;
  kind: ClothingKind;
  color: string;
  dirty: boolean;
  hidden: HiddenKind | null;
}
