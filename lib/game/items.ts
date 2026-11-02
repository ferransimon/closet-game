export type Category = "healthy" | "junk";
export type Side = "left" | "right";

/** Izquierda = saludable, derecha = no saludable. */
export const SIDE_CATEGORY: Record<Side, Category> = { left: "healthy", right: "junk" };

export type FoodKind =
  | "apple"
  | "banana"
  | "broccoli"
  | "carrot"
  | "fish"
  | "avocado"
  | "strawberry"
  | "egg"
  | "burger"
  | "donut"
  | "fries"
  | "pizza"
  | "soda"
  | "icecream"
  | "lollipop"
  | "hotdog";

export const FOOD: Record<FoodKind, { category: Category; label: string }> = {
  apple: { category: "healthy", label: "Manzana" },
  banana: { category: "healthy", label: "Plátano" },
  broccoli: { category: "healthy", label: "Brócoli" },
  carrot: { category: "healthy", label: "Zanahoria" },
  fish: { category: "healthy", label: "Pescado" },
  avocado: { category: "healthy", label: "Aguacate" },
  strawberry: { category: "healthy", label: "Fresa" },
  egg: { category: "healthy", label: "Huevo cocido" },
  burger: { category: "junk", label: "Hamburguesa" },
  donut: { category: "junk", label: "Donut" },
  fries: { category: "junk", label: "Patatas fritas" },
  pizza: { category: "junk", label: "Pizza" },
  soda: { category: "junk", label: "Refresco" },
  icecream: { category: "junk", label: "Helado" },
  lollipop: { category: "junk", label: "Piruleta" },
  hotdog: { category: "junk", label: "Perrito" },
};

export const FOOD_KINDS = Object.keys(FOOD) as FoodKind[];

export type HiddenKind = "worm" | "sticker" | "fishbone" | "bone" | "cap";
export const HIDDEN_KINDS: HiddenKind[] = ["worm", "sticker", "fishbone", "bone", "cap"];

/** Tonos pastel para el fondo de la tarjeta: no indican categoría. */
export const PASTELS = ["#FDEBDD", "#E3F1FA", "#FBF4D3", "#FBE4EC", "#E6F4E1", "#EEE7FA", "#FFEBD6"];

export interface Item {
  id: number;
  kind: FoodKind;
  /** Color de fondo de la tarjeta. */
  color: string;
  spoiled: boolean;
  hidden: HiddenKind | null;
}
