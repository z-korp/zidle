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

/**
 * Props interface for the GoalProgress component
 * @property goal - The goal object containing information about the goal
 * @property tokenId - The NFT token ID used to identify the player
 */
interface GoalProgressProps {
  goal: Goal;
  tokenId?: string;
}

/**
 * Mapping of goal categories to their respective icons
 * Each category is represented by a Lucide icon component
 */
const GoalIcons = {
  economy: Coins,
  resources: Package,
  crafting: Hammer,
  social: ArrowLeftRight,
  victory: Trophy,
};

/**
 * GoalProgress Component
 * Displays a single goal's progress with visual indicators and validation status
 * Handles both regular goals and the ultimate arena victory goal
 */
export const GoalProgress: React.FC<GoalProgressProps> = ({
  goal,
  tokenId,
}) => {
  // Get arena data for the current NFT
  const { arenas } = useArenas({ tokenId });
  const Icon = GoalIcons[goal.category];

  /**
   * Determines which team number (1 or 2) the current NFT belongs to in the arena
   * @returns 1 for team1, 2 for team2, or null if not in an arena
   */
  const getTeamNumber = () => {
    if (!arenas.length || !tokenId) return null;
    const arena = arenas[0];
    const numTokenId = Number(tokenId);

    if (arena.tokenId1 === numTokenId) return 1;
    if (arena.tokenId2 === numTokenId) return 2;
    return null;
  };

  /**
   * Gets the total points accumulated by the player's team in the arena
   * @returns Total points for the team, or 0 if not in an arena
   */
  const getTeamPoints = () => {
    if (!arenas.length || !tokenId) return 0;
    const arena = arenas[0];
    return arena.get_total_points(Number(tokenId));
  };

  /**
   * Calculates points earned for a specific goal
   * Takes into account which team the player is on and validates accordingly
   * @param goalId - The ID of the goal to check
   * @returns Points earned for the goal, or 0 if not validated
   */
  const getGoalPoints = (goalId: string) => {
    const teamNumber = getTeamNumber();
    if (!arenas.length || !tokenId || !teamNumber) return 0;
    const arena = arenas[0];

    // Determine which team we're checking for
    const isTeam1 = teamNumber === 1;

    // Get the corresponding goal object based on the goal ID
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

    // Check if the player's team has validated this goal
    const hasValidated = isTeam1
      ? goal.firstValidation === "Team1" || goal.secondValidation === "Team1"
      : goal.firstValidation === "Team2" || goal.secondValidation === "Team2";

    return hasValidated ? arena.get_goal_points(Number(tokenId), 1) : 0;
  };

  /**
   * Checks if a goal has been validated
   * For the arena victory goal, checks if total points >= 1000
   * For other goals, checks if any points have been earned
   */
  const isGoalValidated = () => {
    if (!arenas.length) return false;
    const arena = arenas[0];
    const numTokenId = Number(tokenId);

    const isTeam1 = arena.tokenId1 === numTokenId;
    const isTeam2 = arena.tokenId2 === numTokenId;

    if (!isTeam1 && !isTeam2) return false;

    // Vérifier quel goal est validé en fonction de son ID
    switch (goal.id) {
      case "gold_50":
        return (
          arena.goal1.firstValidation === (isTeam1 ? "Team1" : "Team2") ||
          arena.goal1.secondValidation === (isTeam1 ? "Team1" : "Team2")
        );
      case "resources_berries":
        return (
          arena.goal2.firstValidation === (isTeam1 ? "Team1" : "Team2") ||
          arena.goal2.secondValidation === (isTeam1 ? "Team1" : "Team2")
        );
      case "resources_pine":
        return (
          arena.goal3.firstValidation === (isTeam1 ? "Team1" : "Team2") ||
          arena.goal3.secondValidation === (isTeam1 ? "Team1" : "Team2")
        );
      case "arena_victory":
        return getTeamPoints() >= 1000;
      default:
        return false;
    }
  };

  /**
   * Calculates the current progress of a goal
   * Handles both regular goals and the arena victory goal differently
   * @returns Object containing current value and progress percentage
   */
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

  /**
   * Renders the additional progress bar for the arena victory goal
   * Shows total points progress towards 1000
   */
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

  // Render the goal with appropriate styling based on type and validation status
  return (
    <div
      className={`space-y-2 ${
        goal.isUltimate
          ? "bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 rounded-lg border border-yellow-500/20"
          : ""
      }`}
    >
      {/* Goal header with icon and progress */}
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

      {/* Goal description */}
      <p
        className={`text-xs ${
          goal.isUltimate ? "text-yellow-500" : "text-gray-500"
        }`}
      >
        {goal.description}
      </p>

      {/* Additional progress bar for arena victory goal */}
      {renderArenaProgress()}
    </div>
  );
};
