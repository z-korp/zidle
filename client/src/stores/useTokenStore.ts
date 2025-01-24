import { create } from "zustand";

interface EventsState {
  tokenId: number | undefined;
  setTokenId: (tokenId: number | undefined) => void;
}

export const useTokenStore = create<EventsState>((set) => ({
  tokenId: undefined,
  setTokenId: (tokenId) => set({ tokenId }),
}));
