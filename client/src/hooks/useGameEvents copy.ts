import { useEffect } from "react";
import { useEventsStore } from "@/stores/useEventsStore";
import { Subscription } from "@dojoengine/torii-client";
import { ToriiQueryBuilder, ClauseBuilder } from "@dojoengine/sdk";
import { useDojo } from "@/dojo/useDojo";
/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook performs the following:
 * 1. Fetches historical events and subscribes to new events in real-time
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

    async function subscribeToEvents() {
      const query = new ToriiQueryBuilder()
        .withClause(
          new ClauseBuilder()
            .keys(["zidle-Mine", "zidle-Harvest"], [undefined])
            .build(),
        )
        .build();

      try {
        const [initialData, newSubscription] = await sdk.subscribeEvents(
          query,
          (newEvent) => {
            console.log("New event:", newEvent);
            addEvent(newEvent);
          },
          true, // Indicate we want past events as well
        );

        console.log("Initial events:", initialData);

        setEvents(initialData);

        subscription = newSubscription;
      } catch (error) {
        console.error("Error subscribing to events:", error);
        setEvents([]);
      }
    }

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
}
