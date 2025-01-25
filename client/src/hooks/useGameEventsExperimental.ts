import { useEffect } from "react";
import { useEventsStore } from "@/stores/useEventsStore";
import { Subscription } from "@dojoengine/torii-client";
import { useDojo } from "@/dojo/useDojo";
import {
  ToriiQueryBuilder,
  ClauseBuilder,
  ParsedEntity,
} from "@dojoengine/sdk";
import { ParsedGameEvent, SchemaType } from "@/dojo/types";
import { useTokenStore } from "@/stores/useTokenStore";
import { parseGameEvent } from "@/utils/events";

/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook does two main things:
 * 1. Fetches historical events when the component mounts or token_id changes
 * 2. Subscribes to new events in real-time based on token_id
 *
 * @returns The events store containing all events
 */
export function useGameEventsExperimental() {
  const {
    setup: { sdk },
  } = useDojo();

  const { setEvents, addEvent, events } = useEventsStore();
  const { tokenId } = useTokenStore();

  useEffect(() => {
    if (!tokenId) {
      console.warn("No token_id available. Skipping event subscription.");
      setEvents([]); // Clear events if no token_id
      return;
    }

    let subscription: Subscription | null = null;
    let initialData: ParsedEntity<SchemaType>[] = [];

    /**
     * Constructs a query with the current token_id
     */
    const buildQuery = () =>
      new ToriiQueryBuilder()
        .withClause(
          new ClauseBuilder()
            .keys(["zidle-Mine", "zidle-Harvest"], [tokenId.toString()])
            .build(),
        )
        .build();

    /**
     * Fetches all past events for the connected account and specific token_id
     * This includes all Mine and Harvest events
     */
    async function getHistoricalEvents() {
      try {
        const events: { [key: string]: ParsedEntity<SchemaType> }[] =
          await sdk.getEvents(buildQuery(), true); // Indicate we want past events

        const parsedEvents: ParsedGameEvent[] = events
          .map((event) => {
            const key = Object.keys(event)[0]; // Get the first (and in this case, the only) key
            const value = event[key]; // Access the value inside that key
            return parseGameEvent(value);
          })
          .filter((e): e is ParsedGameEvent => e !== undefined);

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error fetching historical events:", error);
        setEvents([]);
      }
    }

    /**
     * Sets up a real-time subscription to new events based on token_id
     * Will trigger whenever new Mine or Harvest events occur for the token_id
     */
    async function subscribeToEvents() {
      console.log("Subscribing to events with token_id:", tokenId);

      try {
        [initialData, subscription] = await sdk.subscribeEvents(
          buildQuery(),
          ({ data }: { data: any }) => {
            const event = data?.[0]?.[0]; // Safely index into double array
            if (event?.models?.zidle) {
              const parsed = parseGameEvent(event);
              if (parsed) {
                addEvent(parsed);
              }
            }
          },
          true,
        );
        console.log("initialData:", initialData);
      } catch (error) {
        console.error("Error subscribing to events:", error);
      }
    }

    // Initialize both historical and real-time events
    getHistoricalEvents();
    subscribeToEvents();

    // Cleanup subscription on unmount or when token_id changes
    return () => {
      if (subscription) {
        subscription.free();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdk, tokenId]);

  useEffect(() => {
    console.log("Events:", events);
  }, [events]);

  // Return the store so components can access all events
  return useEventsStore();
}
