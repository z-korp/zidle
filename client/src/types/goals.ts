export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  description: string;
  category: "economy" | "resources" | "crafting" | "social" | "victory";
  isUltimate?: boolean;
}
