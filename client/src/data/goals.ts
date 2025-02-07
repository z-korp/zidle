import { Goal } from "@/types/goals";

export const playerGoals: Goal[] = [
  {
    id: "gold_50",
    title: "Gold Hoarder",
    current: 0,
    target: 50,
    description: "Accumulate 1000 gold",
    category: "economy",
  },
  {
    id: "resources_berries",
    title: "Master Gatherer",
    current: 0,
    target: 50,
    description: "Harvest 50 berries",
    category: "resources",
  },
  {
    id: "resources_pine",
    title: "Skilled Chopper",
    current: 0,
    target: 50,
    description: "Chop 50 pines",
    category: "resources",
  },
  /*{
    id: "transactions_10",
    title: "Active Trader",
    current: 7, // Example data
    target: 10,
    description: "Complete 10 transactions",
    category: "social",
  },*/
  {
    id: "arena_victory",
    title: "Arena Champion",
    current: 0,
    target: 1000,
    description: "Reach 1000 points to win the arena",
    category: "victory",
    isUltimate: true,
  },
];
