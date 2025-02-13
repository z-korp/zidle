import { UserChatMessage } from "@/types/message";

export const testMessages: UserChatMessage[] = [
  {
    type: "user_chat",
    from: "user",
    message: "Hey, can you help me with my mining strategy?",
    timestamp: (Date.now() - 500000).toString(),
  },
  {
    type: "agent_chat",
    from: "ai",
    message:
      "Of course! I see you're currently focusing on pine trees. For optimal resource gathering, I recommend:",
    timestamp: (Date.now() - 400000).toString(),
  },
  {
    type: "agent_chat",
    from: "ai",
    message:
      "1. Focus on upgrading your woodcutting skill first\n2. Aim for the gold_50 goal\n3. Then switch to berries for a balanced inventory",
    timestamp: (Date.now() - 390000).toString(),
  },
  {
    type: "user_chat",
    from: "user",
    message: "What about the arena goals?",
    timestamp: (Date.now() - 300000).toString(),
  },
  {
    type: "agent_chat",
    from: "ai",
    message:
      "For the arena, you've already completed 2 goals! Just need to gather 50 berries to complete all objectives. Would you like me to help you plan this?",
    timestamp: (Date.now() - 200000).toString(),
  },
  {
    type: "user_chat",
    from: "user",
    message: "Yes please!",
    timestamp: (Date.now() - 100000).toString(),
  },
  {
    type: "agent_chat",
    from: "ai",
    message:
      "Great! I'll create a step-by-step plan for berry gathering. First, let's check the best berry spots in your current area...",
    timestamp: Date.now().toString(),
  },
];
