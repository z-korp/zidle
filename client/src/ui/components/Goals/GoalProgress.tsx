import { Goal } from "@/types/goals";
import { Progress } from "@/ui/elements/ui/progress";
import { Coins, Package, Hammer, ArrowLeftRight, Check } from "lucide-react";
import { useArenas } from "@/hooks/useArenas";
import { useEffect } from "react";

interface GoalProgressProps {
  goal: Goal;
  tokenId?: string;
}

const GoalIcons = {
  economy: Coins,
  resources: Package,
  crafting: Hammer,
  social: ArrowLeftRight,
};

export const GoalProgress: React.FC<GoalProgressProps> = ({
  goal,
  tokenId,
}) => {
  const { arenas } = useArenas({ tokenId });
  const Icon = GoalIcons[goal.category];

  useEffect(() => {
    if (arenas.length > 0) {
      const arena = arenas[0];
      arenas;
      console.log("Arena Goals:", {
        gold: arena.goal1,
        wood: arena.goal2,
        food: arena.goal3,
        team1Points: arena.team1_points,
        team2Points: arena.team2_points,
      });
    }
  }, [arenas]);

  const isGoalValidated = () => {
    if (!arenas.length) return false;
    const arena = arenas[0];

    switch (goal.id) {
      case "gold_1000":
        return (
          arena.goal1.goal_type === "Gold" &&
          (arena.goal1.first_validation === "Team1" ||
            arena.goal1.second_validation === "Team1")
        );
      case "resources_10000":
        return (
          arena.goal2.goal_type === "Wood" &&
          (arena.goal2.first_validation === "Team1" ||
            arena.goal2.second_validation === "Team1")
        );
      case "craft_10":
        return (
          arena.goal3.goal_type === "Food" &&
          (arena.goal3.first_validation === "Team1" ||
            arena.goal3.second_validation === "Team1")
        );
      default:
        return false;
    }
  };

  const calculateProgress = () => {
    if (!arenas.length)
      return {
        current: goal.current,
        progress: (goal.current / goal.target) * 100,
      };

    return {
      current: isGoalValidated() ? goal.target : goal.current,
      progress: isGoalValidated() ? 100 : (goal.current / goal.target) * 100,
    };
  };

  const { current, progress } = calculateProgress();
  const validated = isGoalValidated();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">
            {goal.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {current} / {goal.target}
          </span>
          <Check
            className={`w-4 h-4 ${
              validated ? "text-green-400" : "text-gray-500"
            }`}
          />
        </div>
      </div>
      <Progress
        value={progress}
        className={`h-2 ${validated ? "bg-green-900/20" : ""}`}
      />
      <p className="text-xs text-gray-500">{goal.description}</p>
    </div>
  );
};
