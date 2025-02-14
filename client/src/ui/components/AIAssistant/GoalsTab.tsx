import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAgentStore } from "@/stores/useAgentStore";
import { Goal } from "@/types/ai";
import { ScrollArea } from "@/ui/elements/scroll-area";

interface GoalsTabProps {
  debugMode?: boolean;
}

const GoalsTab: React.FC<GoalsTabProps> = ({ debugMode = false }) => {
  const { messages } = useAgentStore();

  console.log("🔍 Raw Messages:", messages);

  // Extraction des actions avec leurs goals associés
  const extractedActions = useMemo(() => {
    return messages
      .filter((m) => m.type === "action_start" || m.type === "action_complete")
      .map((m) => ({
        id: m.data?.action_id || String(Date.now()),
        type: m.type,
        description:
          typeof m.data?.description === "string"
            ? m.data.description
            : typeof m.message === "string"
              ? m.message
              : "Unknown action",
        goalId: m.data?.goal_id,
        timestamp: m.timestamp,
        status: m.type === "action_complete" ? "completed" : "pending",
      }));
  }, [messages]);

  const extractedGoals = useMemo(() => {
    const goalMessages = messages.filter(
      (m) =>
        m.type === "goal_created" ||
        m.type === "goal_updated" ||
        m.type === "goal_completed",
    );

    console.log("📝 Goal Messages:", goalMessages);

    const goals = goalMessages.map((m) => ({
      id: m.data?.goal_id || m.data?.id || String(Date.now()),
      description:
        typeof m.data?.description === "string"
          ? m.data.description
          : typeof m.message === "string"
            ? m.message
            : "Unknown goal",
      status:
        m.type === "goal_completed"
          ? "completed"
          : m.type === "goal_created"
            ? "active"
            : "pending",
      progress: 0,
      timestamp: m.timestamp,
      horizon: m.data?.horizon || "medium",
      ...m.data,
    }));

    console.log("🎯 Processed Goals:", goals);
    return goals;
  }, [messages]);

  const mergedGoals = useMemo(() => {
    console.log("⚡ Starting goals merge");

    const goalMap = new Map();

    extractedGoals.forEach((goal) => {
      if (!goal.id) return;

      const existing = goalMap.get(goal.id);
      if (existing) {
        console.log("🔄 Updating goal:", {
          id: goal.id,
          oldStatus: existing.status,
          newStatus: goal.status,
          timestamp: goal.timestamp,
        });

        // Garder la version la plus récente
        if (new Date(goal.timestamp) > new Date(existing.timestamp)) {
          goalMap.set(goal.id, goal);
        }
      } else {
        goalMap.set(goal.id, goal);
      }
    });

    const result = Array.from(goalMap.values());
    console.log("✅ Final Goals:", result);
    return result;
  }, [extractedGoals]);

  const getStatusColor = (status: Goal["status"]) => {
    const colors = {
      ready: "bg-blue-500",
      active: "bg-green-500",
      pending: "bg-yellow-500",
      completed: "bg-purple-500",
      failed: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getHorizonEmoji = (horizon: Goal["horizon"]) => {
    const emojis = {
      short: "⚡",
      medium: "🕐",
      long: "🎯",
    };
    return emojis[horizon] || "📋";
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Zone scrollable pour les goals */}
      <ScrollArea className="flex-1 overflow-y-auto scrollbar-hide h-full">
        <div className="space-y-4 pr-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {mergedGoals.map((goal) => (
              <Card
                key={goal.id}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      className={`${getStatusColor(goal.status)} text-white`}
                    >
                      {String(goal.status)}
                    </Badge>
                    <span className="text-2xl" title={`${goal.horizon} term`}>
                      {getHorizonEmoji(goal.horizon)}
                    </span>
                  </div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Goal
                  </CardTitle>
                  <CardDescription>{String(goal.description)}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Progress</h4>
                      <Progress
                        value={Number(goal.progress)}
                        className="w-full"
                      />
                    </div>

                    {/* Affichage des actions liées */}
                    {extractedActions.filter(
                      (action) => action.goalId === goal.id,
                    ).length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Actions</h4>
                        <div className="space-y-2">
                          {extractedActions
                            .filter((action) => action.goalId === goal.id)
                            .map((action) => (
                              <div
                                key={action.id}
                                className="text-sm flex items-center gap-2 p-2 rounded bg-gray-700"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    action.status === "completed"
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                                  }`}
                                />
                                <span>{action.description}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {mergedGoals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No goals available
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default GoalsTab;
