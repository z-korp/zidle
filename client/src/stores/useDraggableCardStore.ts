import { create } from "zustand";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

type TabType = "chat" | "settings" | "history";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface DraggableCardStore {
  position: Position;
  size: Size;
  isMinimized: boolean;
  activeTab: TabType;
  messages: Message[];
  inputText: string;
  setPosition: (position: Position) => void;
  setSize: (size: Size) => void;
  setIsMinimized: (isMinimized: boolean) => void;
  setActiveTab: (tab: TabType) => void;
  addMessage: (message: Message) => void;
  setInputText: (text: string) => void;
}

export const useDraggableCardStore = create<DraggableCardStore>((set) => ({
  position: { x: 0, y: 0 },
  size: { width: 300, height: 400 },
  isMinimized: false,
  activeTab: "chat",
  messages: [],
  inputText: "",

  setPosition: (position) => set({ position }),
  setSize: (size) => set({ size }),
  setIsMinimized: (isMinimized) => set({ isMinimized }),
  setActiveTab: (activeTab) => set({ activeTab }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setInputText: (inputText) => set({ inputText }),
}));
