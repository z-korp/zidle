import { ParsedGameEvent } from "@/dojo/types";
import { create } from "zustand";

/**
 * Interface defining the structure of our events store
 * This store keeps track of all game events (Mining and Harvesting)
 */
interface EventsState {
  // Array of parsed events from the blockchain
  events: ParsedGameEvent[];
  // Function to set all events at once (used for historical events)
  setEvents: (events: ParsedGameEvent[]) => void;
  // Function to add a single new event (used for real-time updates)
  addEvent: (event: ParsedGameEvent) => void;
  // Function to clear all events
  clearEvents: () => void;
}

/**
 * Global store for managing game events
 * Uses Zustand for state management
 * Provides functions to:
 * - Store events
 * - Add new events
 * - Clear all events
 */
export const useEventsStore = create<EventsState>((set) => ({
  events: [], // Initial empty state
  // Replace all events with new array
  setEvents: (events) => set({ events }),
  // Add a new event to the existing array
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  // Reset events array to empty
  clearEvents: () => set({ events: [] }),
}));
