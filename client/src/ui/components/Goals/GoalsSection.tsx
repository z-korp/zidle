import { Card, CardContent } from "@/ui/elements/card";
import { playerGoals } from "@/data/goals";
import { GoalProgress } from "./GoalProgress";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GoalsSection = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="bg-gray-800/50">
      <CardContent className="p-4 space-y-4">
        {/* Header with toggle button */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-sm font-semibold text-white">Player Goals</h3>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>

        {/* Animated content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 overflow-hidden"
            >
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
