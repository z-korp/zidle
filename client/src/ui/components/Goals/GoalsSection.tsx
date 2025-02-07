import { Card, CardContent } from "@/ui/elements/card";
import { playerGoals as initialGoals } from "@/data/goals";
import { GoalProgress } from "./GoalProgress";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArenas } from "@/hooks/useArenas";
import { useGoalStore } from "@/stores/useGoalStore";

/**
 * GoalsSection Component
 * Displays a collapsible card containing player goals and their progress
 */
interface GoalsSectionProps {
  tokenId?: string;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ tokenId }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { arenas } = useArenas({ tokenId });
  const { berriesAmount, pineAmount, goldAmount } = useGoalStore();

  // Local state to track updated goal progress
  const [goals, setGoals] = useState(initialGoals);

  // Update goals when store values change
  useEffect(() => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        switch (goal.id) {
          case "gold_50":
            return { ...goal, current: goldAmount };
          case "resources_berries":
            return { ...goal, current: berriesAmount };
          case "resources_pine":
            return { ...goal, current: pineAmount };
          default:
            return goal;
        }
      }),
    );
  }, [berriesAmount, pineAmount, goldAmount]);

  // Filter out the Arena Champion goal if the NFT is not in an arena
  const filteredGoals = goals.filter((goal) => {
    if (goal.isUltimate) {
      return arenas.length > 0;
    }
    return true;
  });

  // Calculate completed goals
  const getCompletedGoals = () => {
    if (!arenas.length) return 0;
    const arena = arenas[0];
    const numTokenId = Number(tokenId);

    const isTeam1 = arena.tokenId1 === numTokenId;
    const isTeam2 = arena.tokenId2 === numTokenId;

    let completed = 0;

    if (isTeam1 || isTeam2) {
      if (
        arena.goal1.firstValidation === (isTeam1 ? "Team1" : "Team2") ||
        arena.goal1.secondValidation === (isTeam1 ? "Team1" : "Team2")
      ) {
        completed++;
      }
      if (
        arena.goal2.firstValidation === (isTeam1 ? "Team1" : "Team2") ||
        arena.goal2.secondValidation === (isTeam1 ? "Team1" : "Team2")
      ) {
        completed++;
      }
      if (
        arena.goal3.firstValidation === (isTeam1 ? "Team1" : "Team2") ||
        arena.goal3.secondValidation === (isTeam1 ? "Team1" : "Team2")
      ) {
        completed++;
      }
    }

    return completed;
  };

  const completedGoals = getCompletedGoals();
  const totalGoals = filteredGoals.length;

  return (
    <Card className="bg-gray-800/50">
      <CardContent className="p-4 space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Player Goals</h3>
            {!isExpanded && (
              <span className="text-xs text-gray-400">
                {completedGoals}/{totalGoals} completed
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
              {filteredGoals.map((goal) => (
                <GoalProgress key={goal.id} goal={goal} tokenId={tokenId} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
