export enum BlueprintCategory {
  TOOLS = "Tools",
  WEAPONS = "Weapons",
  ARMOR = "Armor",
  CONSUMABLES = "Consumables",
}

export interface BlueprintResource {
  type: "wood" | "iron" | "gold" | "food";
  amount: number;
}

export interface Blueprint {
  id: number;
  name: string;
  description: string;
  category: BlueprintCategory;
  level: number;
  craftingTime: number; // en secondes
  resources: BlueprintResource[];
  experienceReward: number;
  imageUrl?: string;
}

export const blueprints: Blueprint[] = [
  {
    id: 1,
    name: "Basic Pickaxe",
    description: "A simple tool for mining. Increases mining efficiency by 10%",
    category: BlueprintCategory.TOOLS,
    level: 1,
    craftingTime: 30,
    resources: [
      { type: "wood", amount: 5 },
      { type: "iron", amount: 3 },
    ],
    experienceReward: 25,
  },
  {
    id: 2,
    name: "Iron Sword",
    description: "Standard iron sword. Increases attack power by 15",
    category: BlueprintCategory.WEAPONS,
    level: 2,
    craftingTime: 45,
    resources: [
      { type: "iron", amount: 8 },
      { type: "wood", amount: 2 },
    ],
    experienceReward: 40,
  },
  {
    id: 3,
    name: "Leather Armor",
    description: "Basic protection. Increases defense by 10",
    category: BlueprintCategory.ARMOR,
    level: 1,
    craftingTime: 40,
    resources: [
      { type: "food", amount: 10 },
      { type: "wood", amount: 5 },
    ],
    experienceReward: 30,
  },
  {
    id: 4,
    name: "Health Potion",
    description: "Restores 50 HP when consumed",
    category: BlueprintCategory.CONSUMABLES,
    level: 1,
    craftingTime: 15,
    resources: [
      { type: "food", amount: 5 },
      { type: "wood", amount: 1 },
    ],
    experienceReward: 15,
  },
  {
    id: 5,
    name: "Advanced Pickaxe",
    description: "Better mining tool. Increases mining efficiency by 25%",
    category: BlueprintCategory.TOOLS,
    level: 3,
    craftingTime: 60,
    resources: [
      { type: "iron", amount: 12 },
      { type: "wood", amount: 8 },
      { type: "gold", amount: 2 },
    ],
    experienceReward: 75,
  },
  {
    id: 6,
    name: "Golden Sword",
    description: "Powerful sword. Increases attack power by 30",
    category: BlueprintCategory.WEAPONS,
    level: 4,
    craftingTime: 90,
    resources: [
      { type: "gold", amount: 5 },
      { type: "iron", amount: 10 },
      { type: "wood", amount: 3 },
    ],
    experienceReward: 100,
  },
  {
    id: 7,
    name: "Iron Armor",
    description: "Solid protection. Increases defense by 25",
    category: BlueprintCategory.ARMOR,
    level: 3,
    craftingTime: 75,
    resources: [
      { type: "iron", amount: 15 },
      { type: "wood", amount: 5 },
    ],
    experienceReward: 80,
  },
  {
    id: 8,
    name: "Super Health Potion",
    description: "Restores 150 HP when consumed",
    category: BlueprintCategory.CONSUMABLES,
    level: 3,
    craftingTime: 30,
    resources: [
      { type: "food", amount: 12 },
      { type: "gold", amount: 1 },
    ],
    experienceReward: 45,
  },
];
