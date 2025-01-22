export enum MonsterCategory {
  NORMAL = "Normal",
  ELITE = "Elite",
  BOSS = "Boss",
}

export interface Monster {
  id: number;
  name: string;
  description: string;
  category: MonsterCategory;
  level: number;
  health: number;
  attack: number;
  defense: number;
  rewards: {
    gold: number;
    experience: number;
  };
  requiredLevel?: number;
  imageUrl?: string;
}

export const monsters: Monster[] = [
  {
    id: 1,
    name: "Forest Wolf",
    description: "A common wolf prowling the forest",
    category: MonsterCategory.NORMAL,
    level: 1,
    health: 50,
    attack: 5,
    defense: 3,
    rewards: {
      gold: 10,
      experience: 20,
    },
  },
  {
    id: 2,
    name: "Cave Spider",
    description: "A venomous spider lurking in dark caves",
    category: MonsterCategory.NORMAL,
    level: 2,
    health: 40,
    attack: 8,
    defense: 2,
    rewards: {
      gold: 15,
      experience: 25,
    },
  },
  {
    id: 3,
    name: "Alpha Wolf",
    description: "Leader of the wolf pack",
    category: MonsterCategory.ELITE,
    level: 5,
    health: 120,
    attack: 15,
    defense: 8,
    rewards: {
      gold: 50,
      experience: 100,
    },
    requiredLevel: 3,
  },
  {
    id: 4,
    name: "Ancient Golem",
    description: "A powerful stone guardian",
    category: MonsterCategory.BOSS,
    level: 10,
    health: 300,
    attack: 25,
    defense: 20,
    rewards: {
      gold: 200,
      experience: 500,
    },
    requiredLevel: 8,
  },
];
