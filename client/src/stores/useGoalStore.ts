import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface GoalState {
  goldAmount: number;
  setGoldAmount: (amount: number) => void;
  berriesAmount: number;
  setBerriesAmount: (amount: number) => void;
  pineAmount: number;
  setPineAmount: (amount: number) => void;
}

export const useGoalStore = create<GoalState>()(
  devtools(
    (set) => ({
      goldAmount: 0,
      setGoldAmount: (goldAmount) => set(() => ({ goldAmount })),
      berriesAmount: 0,
      setBerriesAmount: (berriesAmount) => set(() => ({ berriesAmount })),
      pineAmount: 0,
      setPineAmount: (pineAmount) => set(() => ({ pineAmount })),
    }),
    {
      name: "Goal Store",
    },
  ),
);
