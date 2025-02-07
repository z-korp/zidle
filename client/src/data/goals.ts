import { Goal } from "@/types/goals";

export const playerGoals: Goal[] = [
  {
    id: "gold_1000",
    title: "Gold Hoarder",
    current: 750, // Example data
    target: 1000,
    description: "Accumulate 1000 gold",
    category: "economy",
  },
  {
    id: "resources_10000",
    title: "Master Gatherer",
    current: 6500, // Example data
    target: 10000,
    description: "Mine 10,000 resources",
    category: "resources",
  },
  {
    id: "craft_10",
    title: "Skilled Craftsman",
    current: 4, // Example data
    target: 10,
    description: "Craft 10 items",
    category: "crafting",
  },
  {
    id: "transactions_10",
    title: "Active Trader",
    current: 7, // Example data
    target: 10,
    description: "Complete 10 transactions",
    category: "social",
  },
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
