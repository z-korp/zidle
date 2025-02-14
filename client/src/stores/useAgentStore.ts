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
  goals: Goal[];
  setMessages: (messages: AppMessage[]) => void;
  addMessage: (message: AppMessage) => void;
  addChat: (message: UserChatMessage) => void;
  setIsConnected: (isConnected: boolean) => void;
  messageSystem: () => StartThinkingMessage[];
}

const initialState: AgentState = {
  messages: [],
  isConnected: false,
  goals: [],
  setIsConnected: (isConnected: boolean) => {},
  setMessages: (messages: AppMessage[]) => {},
  addMessage: (message: AppMessage) => {},
};

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
          // Traitement spécial pour les messages de chat
          if (message.type === "chat_reply") {
            try {
              const parsedContent = JSON.parse(message.message);
              return {
                messages: [...state.messages, message],
                chats: [...state.chats, {
                  type: "user_chat",
                  from: "ai",
                  message: parsedContent.message,
                  timestamp: message.timestamp
                }]
              };
            } catch {
              return { messages: [...state.messages, message] };
            }
          }
          return { messages: [...state.messages, message] };
        }),
        addChat: (chat: UserChatMessage) =>
          set((state) => {
            return { chats: [...state.chats, chat] };
          }),
      addChat: (chat: UserChatMessage) =>
        set((state) => ({
          chats: [...state.chats, chat],
        })),
      // Selector to get only system messages
      messageSystem: () =>
        get().messages.filter((msg) => msg.type === "thinking_start"),
    }),
    {
      name: "Agent Store",
    },
  ),
);
