import { AppMessage } from "@/types/message";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AgentState {
  messages: AppMessage[];
  isConnected: boolean;
  setMessages: (messages: AppMessage[]) => void;
  addMessage: (message: AppMessage) => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const useAgentStore = create<AgentState>()(
  devtools(
    (set, _) => ({
      messages: [],
      isConnected: false,
      setIsConnected: (isConnected: boolean) => set({ isConnected }),
      setMessages: (messages: AppMessage[]) => set({ messages }),
      addMessage: (message: AppMessage) =>
        set((state) => {
          /*if (message.type === "response") {
            return {
              messages: state.messages
                .filter((msg) => !msg.isLoading)
                .concat(message),
            };
          }*/
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
