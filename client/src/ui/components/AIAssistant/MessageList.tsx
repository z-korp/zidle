import React, { useEffect, useRef } from "react";
import { useAgentStore } from "@/stores/useAgentStore";
import { DateTime } from "luxon";
import { ScrollArea } from "@/ui/elements/scroll-area";

// Test fixtures
const testMessages = [
  {
    id: "1",
    type: "action_start",
    data: {
      actionType: "MINING",
      target: "Iron Deposit",
    },
    timestamp: "2024-03-14T10:00:00.000Z",
    emoji: "⛏️",
  },
  {
    id: "2",
    type: "goal_created",
    data: {
      horizon: "short",
      description: "Mine 500 iron ore",
      id: "iron_500",
    },
    timestamp: "2024-03-14T10:01:00.000Z",
    emoji: "🎯",
  },
  {
    id: "3",
    type: "action_complete",
    data: {
      actionType: "MINING",
      result: "Successfully mined 50 iron ore",
    },
    timestamp: "2024-03-14T10:02:00.000Z",
    emoji: "✅",
  },
  {
    id: "4",
    type: "system",
    message: "New quest available: Master Miner",
    timestamp: "2024-03-14T10:03:00.000Z",
    emoji: "📜",
  },
  {
    id: "5",
    type: "action_error",
    data: {
      actionType: "MINING",
      error: "Tool needs repair",
    },
    timestamp: "2024-03-14T10:04:00.000Z",
    emoji: "🔧",
  },
  {
    id: "6",
    type: "goal_updated",
    data: {
      id: "iron_500",
      status: "Progress: 50/500 iron ore collected",
    },
    timestamp: "2024-03-14T10:05:00.000Z",
    emoji: "📊",
  },
  {
    id: "7",
    type: "thinking_start",
    message: "Analyzing mining efficiency...",
    timestamp: "2024-03-14T10:06:00.000Z",
    emoji: "🤔",
  },
  {
    id: "8",
    type: "response",
    message: "I suggest upgrading your pickaxe to increase mining speed",
    timestamp: "2024-03-14T10:07:00.000Z",
    emoji: "💡",
  },
  {
    id: "9",
    type: "action_start",
    data: {
      actionType: "UPGRADE",
      target: "Iron Pickaxe",
    },
    timestamp: "2024-03-14T10:08:00.000Z",
    emoji: "⚒️",
  },
  {
    id: "10",
    type: "action_complete",
    data: {
      actionType: "UPGRADE",
      result: "Pickaxe upgraded to level 2",
    },
    timestamp: "2024-03-14T10:09:00.000Z",
    emoji: "🌟",
  },
];

export const MessagesList: React.FC = () => {
  // Commentez l'une des deux lignes suivantes pour basculer entre les données réelles et de test
  //const { messages } = useAgentStore();
  const messages = testMessages; // Décommentez cette ligne pour tester

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="h-full min-h-0 flex-1">
      <div className="p-4 space-y-4">
        {messages.map((message, idx) => {
          // Format the timestamp with Luxon
          const formattedTime = DateTime.fromISO(
            message.timestamp,
          ).toLocaleString(DateTime.TIME_SIMPLE);

          // Define title and body based on the message type
          let title = "";
          let body = "";
          const emoji = message.emoji || "💬";

          switch (message.type) {
            case "welcome":
              title = "Welcome";
              body = message.message;
              break;
            case "response":
              title = "Response";
              body = message.message;
              break;
            case "error":
              title = "Error";
              body = message.error;
              break;
            case "goal_created":
              title = "Goal Created";
              body = `${message.data?.horizon.toUpperCase()} TERM - ${message.data?.description}`;
              break;
            case "goal_updated":
              title = "Goal Updated";
              body = message.data?.status;
              break;
            case "goal_completed":
              title = "Goal Completed";
              body = message.data?.description;
              break;
            case "goal_failed":
              title = "Goal Failed";
              body = `ID: ${message.data.id} – ${message.data.error}`;
              break;
            case "action_start":
              title = "Action Started";
              body = message.data?.actionType;
              break;
            case "action_complete":
              title = "Action Completed";
              body = message.data?.result;
              break;
            case "action_error":
              title = "Action Error";
              body = `(${message.data?.actionType}) ${message.data?.error}`;
              break;
            case "system":
              title = "System";
              body = message.message;
              break;
            case "thinking_start":
              title = "Thinking";
              body = message.message;
              break;
            case "thinking_end":
              title = "Thinking Complete";
              body = "";
              break;
            default:
              title = "Message";
              body = message.message || "";
          }

          return (
            <div key={idx} className="p-3 bg-gray-800 rounded-lg shadow-md">
              {/* Header: date, title, and emoji */}
              <div className="flex justify-between items-center text-sm text-gray-100">
                <div className="flex items-center gap-1">
                  <span className="mr-1">{emoji}</span>
                  <span className="font-semibold">{title}</span>
                </div>
                <span>{formattedTime}</span>
              </div>
              {/* Body text */}
              {body && <div className="mt-1 text-xs text-gray-400">{body}</div>}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
