import { Goal } from "@/types/goals";
import { Progress } from "@/ui/elements/ui/progress";
import {
  Coins,
  Package,
  Hammer,
  ArrowLeftRight,
  Check,
  Trophy,
} from "lucide-react";
import { useArenas } from "@/hooks/useArenas";

interface GoalProgressProps {
  goal: Goal;
  tokenId?: string;
}

const GoalIcons = {
  economy: Coins,
  resources: Package,
  crafting: Hammer,
  social: ArrowLeftRight,
  victory: Trophy,
};

export const GoalProgress: React.FC<GoalProgressProps> = ({
  goal,
  tokenId,
}) => {
  const { arenas } = useArenas({ tokenId });
  const Icon = GoalIcons[goal.category];

  const getTeamNumber = () => {
    if (!arenas.length || !tokenId) return null;
    const arena = arenas[0];
    const numTokenId = Number(tokenId);

    if (arena.tokenId1 === numTokenId) return 1;
    if (arena.tokenId2 === numTokenId) return 2;
    return null;
  };

  const getTeamPoints = () => {
    if (!arenas.length || !tokenId) return 0;
    const arena = arenas[0];
    return arena.get_total_points(Number(tokenId));
  };

  const getGoalPoints = (goalId: string) => {
    const teamNumber = getTeamNumber();
    if (!arenas.length || !tokenId || !teamNumber) return 0;
    const arena = arenas[0];

    // On vérifie si on est team1 ou team2 pour les validations
    const isTeam1 = teamNumber === 1;
    const goal = (() => {
      switch (goalId) {
        case "gold_1000":
          return arena.goal1;
        case "resources_10000":
          return arena.goal2;
        case "craft_10":
          return arena.goal3;
        default:
          return null;
      }
    })();

    if (!goal) return 0;

    // On vérifie si notre équipe a validé le goal
    const hasValidated = isTeam1
      ? goal.firstValidation === "Team1" || goal.secondValidation === "Team1"
      : goal.firstValidation === "Team2" || goal.secondValidation === "Team2";

    return hasValidated ? arena.get_goal_points(Number(tokenId), 1) : 0;
  };

  const isGoalValidated = () => {
    if (!arenas.length) return false;

    if (goal.id === "arena_victory") {
      return getTeamPoints() >= 1000;
    }

    return getGoalPoints(goal.id) > 0;
  };

  const calculateProgress = () => {
    if (!arenas.length)
      return {
        current: goal.current,
        progress: (goal.current / goal.target) * 100,
      };

    if (goal.id === "arena_victory") {
      const points = getTeamPoints();
      return {
        current: points,
        progress: (points / goal.target) * 100,
      };
    }

    const points = getGoalPoints(goal.id);
    return {
      current: points > 0 ? goal.target : goal.current,
      progress: points > 0 ? 100 : (goal.current / goal.target) * 100,
    };
  };

  const { current, progress } = calculateProgress();
  const validated = isGoalValidated();

  // Ajouter une barre de progression des points d'arène pour le goal ultime
  const renderArenaProgress = () => {
    if (!goal.isUltimate) return null;
    const points = getTeamPoints();
    const pointsProgress = (points / 1000) * 100;

    return (
      <div className="mt-2 space-y">
        <div className="flex items-center justify-between text-xs">
          <span className="text-yellow-500">Arena Points</span>
          <span className="text-yellow-500">{points} / 1000</span>
        </div>
        <Progress
          value={pointsProgress}
          className="h-1.5 bg-yellow-950/20 mt-2"
        />
      </div>
    );
  };

  return (
    <div
      className={`space-y-2 ${
        goal.isUltimate
          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className={`w-4 h-4 ${
              goal.isUltimate ? "text-yellow-400" : "text-gray-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              goal.isUltimate ? "text-yellow-200" : "text-gray-200"
            }`}
          >
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
      <p
        className={`text-xs ${
          goal.isUltimate ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        {goal.description}
      </p>
      {renderArenaProgress()}
    </div>
  );
};
