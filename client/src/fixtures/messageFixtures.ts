import { AgentMessage } from "@/types/agent";

export const testMessages: AgentMessage[] = [
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
