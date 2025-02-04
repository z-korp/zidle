import { Card, CardContent } from "@/ui/elements/card";
import { playerGoals } from "@/data/goals";
import { GoalProgress } from "./GoalProgress";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * GoalsSection Component
 * Displays a collapsible card containing player goals and their progress
 * Features:
 * - Expandable/collapsible content with animation
 * - Progress bars for each goal
 * - Visual feedback for interaction
 */
export const GoalsSection = () => {
  // State to track if the goals section is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    // Main container card with semi-transparent dark background
    <Card className="bg-gray-800/50">
      <CardContent className="p-4 space-y-4">
        {/* Clickable header section with title and toggle arrow */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Section title */}
          <h3 className="text-sm font-semibold text-white">Player Goals</h3>

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
              {playerGoals.map((goal) => (
                <GoalProgress key={goal.id} goal={goal} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
