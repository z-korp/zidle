import {
  AppMessage,
  StartThinkingMessage,
  UserChatMessage,
} from "@/types/message";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Goal } from "@/types/ai";

interface AgentState {
  messages: AppMessage[];
  isConnected: boolean;
  chats: UserChatMessage[];
  goals: Goal[];
  setMessages: (messages: AppMessage[]) => void;
  addMessage: (message: AppMessage) => void;
  addChat: (message: UserChatMessage) => void;
  setIsConnected: (isConnected: boolean) => void;
  messageSystem: () => StartThinkingMessage[];
}

export const useAgentStore = create<AgentState>()(
  devtools(
    (set, get) => ({
      messages: [],
      chats: [],
      isConnected: false,
      goals: [],
      setIsConnected: (isConnected: boolean) => set({ isConnected }),
      setMessages: (messages: AppMessage[]) => set({ messages }),
      addMessage: (message: AppMessage) =>
        set((state) => {
          return { messages: [...state.messages, message] };
        }),
      addChat: (chat: UserChatMessage) =>
        set((state) => {
          return { chats: [...state.chats, chat] };
        }),

      // Selector to get only system messages
      messageSystem: () =>
        get().messages.filter((msg) => msg.type === "thinking_start"),
    }),
    {
      name: "Agent Store",
    },
  ),
);
