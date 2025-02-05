import { Goal } from "@/types/goals";
import { Progress } from "@/ui/elements/ui/progress";
import { Coins, Package, Hammer, ArrowLeftRight } from "lucide-react";

interface GoalProgressProps {
  goal: Goal;
}

const GoalIcons = {
  economy: Coins,
  resources: Package,
  crafting: Hammer,
  social: ArrowLeftRight,
};

export const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const Icon = GoalIcons[goal.category];
  const progress = (goal.current / goal.target) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">
            {goal.title}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {goal.current} / {goal.target}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-gray-500">{goal.description}</p>
    </div>
  );
};
