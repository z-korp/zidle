import { Card, CardContent } from "@/ui/elements/card";
import { playerGoals } from "@/data/goals";
import { GoalProgress } from "./GoalProgress";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArenas } from "@/hooks/useArenas";

/**
 * GoalsSection Component
 * Displays a collapsible card containing player goals and their progress
 * Features:
 * - Expandable/collapsible content with animation
 * - Progress bars for each goal
 * - Visual feedback for interaction
 */
interface GoalsSectionProps {
  tokenId?: string;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({ tokenId }) => {
  // State to track if the goals section is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(true);
  const { arenas } = useArenas({ tokenId });

  // Filter out the Arena Champion goal if the NFT is not in an arena
  const filteredGoals = playerGoals.filter((goal) => {
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

    // Determine if we're team1 or team2
    const isTeam1 = arena.tokenId1 === numTokenId;
    const isTeam2 = arena.tokenId2 === numTokenId;

    let completed = 0;

    if (isTeam1 || isTeam2) {
      // Check each goal validation
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
    // Main container card with semi-transparent dark background
    <Card className="bg-gray-800/50">
      <CardContent className="p-4 space-y-4">
        {/* Clickable header section with title and toggle arrow */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {/* Section title */}
            <h3 className="text-sm font-semibold text-white">Player Goals</h3>
            {!isExpanded && (
              <span className="text-xs text-gray-400">
                {completedGoals}/{totalGoals} completed
              </span>
            )}
          </div>

          {/* Animated arrow icon that rotates based on expanded state */}
          <motion.div
            // Rotate 180 degrees when expanded, 0 when collapsed
            animate={{ rotate: isExpanded ? 180 : 0 }}
            // Smooth rotation animation
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

        {/* Animated content section */}
        <AnimatePresence initial={false}>
          {/* Only render content when expanded */}
          {isExpanded && (
            <motion.div
              // Initial state when content appears
              initial={{ height: 0, opacity: 0 }}
              // Animated state when content is visible
              animate={{ height: "auto", opacity: 1 }}
              // Exit animation when content is hidden
              exit={{ height: 0, opacity: 0 }}
              // Animation configuration
              transition={{ duration: 0.2 }}
              // Prevent content from overflowing during animation
              className="space-y-4 overflow-hidden"
            >
              {/* Map through all goals and render progress bars */}
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
