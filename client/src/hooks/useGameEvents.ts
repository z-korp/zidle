import { useEffect } from "react";
import { useEventsStore } from "@/stores/useEventsStore";
import { Subscription } from "@dojoengine/torii-client";
import { useDojo } from "@/dojo/useDojo";
import { ToriiQueryBuilder, ClauseBuilder } from "@dojoengine/sdk";

/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook does two main things:
 * 1. Fetches historical events when the component mounts
 * 2. Subscribes to new events in real-time
 *
 * @returns The events store containing all events
 */
export function useGameEvents() {
  const {
    setup: { sdk },
  } = useDojo();

  const { setEvents, addEvent, events } = useEventsStore();

  useEffect(() => {
    let subscription: Subscription | null = null;

    /**
     * Fetches all past events for the connected account
     * This includes all Mine and Harvest events
     */
    async function getHistoricalEvents() {
      try {
        const events = await sdk.getEvents(
          new ToriiQueryBuilder()
            .withClause(
              new ClauseBuilder().keys(["zidle-Mine"], [undefined]).build(),
            )
            .build(),
          true, // Indicate we want past events
        );

        setEvents(events);
      } catch (error) {
        console.error("Error fetching historical events:", error);
        setEvents([]);
      }
    }

    /**
     * Sets up a real-time subscription to new events
     * Will trigger whenever new Mine or Harvest events occur
     */
    async function subscribeToEvents() {
      console.log(
        JSON.stringify(
          new ToriiQueryBuilder()
            .withClause(
              new ClauseBuilder().keys(["zidle-Mine"], [undefined]).build(),
            )
            .build(),
        ),
      );

      try {
        subscription = await sdk.subscribeEvents(
          new ToriiQueryBuilder()
            .withClause(
              new ClauseBuilder().keys(["zidle-Mine"], [undefined]).build(),
            )
            .build(),
          // Called whenever a new event occurs
          (test) => {
            console.log("New event:", test);
          },
          true,
        );
      } catch (error) {
        console.error("Error subscribing to events:", error);
      }
    }

    // Initialize both historical and real-time events
    getHistoricalEvents();
    subscribeToEvents();

    return () => {
      if (subscription) {
        subscription.free();
      }
    };
  }, [sdk, setEvents, addEvent]);

  useEffect(() => {
    console.log("Events:", events);
  }, [events]);

  // Return the store so components can access all events
  return useEventsStore();
}
