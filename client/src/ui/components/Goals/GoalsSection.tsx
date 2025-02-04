import { Card, CardContent } from "@/ui/elements/card";
import { playerGoals } from "@/data/goals";
import { GoalProgress } from "./GoalProgress";

export const GoalsSection = () => {
  return (
    <Card className="bg-gray-800/50">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white">Player Goals</h3>
        <div className="space-y-4">
          {playerGoals.map((goal) => (
            <GoalProgress key={goal.id} goal={goal} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
