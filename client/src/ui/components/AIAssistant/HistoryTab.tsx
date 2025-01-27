import React from "react";
import { Action } from "@/types/ai";

interface HistoryTabProps {
  actions: Action[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ actions }) => {
  return (
    <div className="space-y-4 overflow-auto pr-2">
      {actions.map((action) => (
        <div
          key={action.id}
          className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              action.status === "success"
                ? "bg-green-500"
                : action.status === "pending"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
          />
          <div className="flex-grow">
            <p className="text-sm">{action.action}</p>
            <p className="text-xs text-gray-400">
              {action.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
