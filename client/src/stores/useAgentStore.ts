import { AppMessage, UserChatMessage } from "@/types/message";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AgentState {
  messages: AppMessage[];
  chats: UserChatMessage[];
  isConnected: boolean;
  setMessages: (messages: AppMessage[]) => void;
  addMessage: (message: AppMessage) => void;
  addChat: (message: UserChatMessage) => void;
  setIsConnected: (isConnected: boolean) => void;
}

export const useAgentStore = create<AgentState>()(
  devtools(
    (set, _) => ({
      messages: [],
      chats: [],
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
      addChat: (chat: UserChatMessage) =>
        set((state) => {
          return { chats: [...state.chats, chat] };
        }),
    }),
    {
      name: "Agent Store",
    },
  ),
);
