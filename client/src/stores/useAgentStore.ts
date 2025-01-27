import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Message {
  type: string;
  message?: string;
  error?: string;
  isLoading?: boolean;
  timestamp?: number;
}

interface AgentState {
  messages: Message[];
  isConnected: boolean;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const useAgentStore = create<AgentState>()(
  devtools(
    (set, _) => ({
      messages: [],
      isConnected: false,
      setIsConnected: (isConnected: boolean) => set({ isConnected }),
      setMessages: (messages: Message[]) => set({ messages }),
      addMessage: (message: Message) =>
        set((state) => {
          if (message.type === "response") {
            return {
              messages: state.messages
                .filter((msg) => !msg.isLoading)
                .concat(message),
            };
          }
          return {
            messages: [...state.messages, message],
          };
        }),
    }),
    {
      name: "Agent Store",
    },
  ),
);
