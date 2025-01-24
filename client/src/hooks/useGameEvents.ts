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
import { Resource } from "@/dojo/game/types/resource";

/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook does two main things:
 * 1. Fetches historical events when the component mounts or token_id changes
 * 2. Subscribes to new events in real-time based on token_id
 *
 * It uses the Dojo SDK to interact with the blockchain and
 * stores events in a global Zustand store for easy access
 * across the application.
 *
 * @returns The events store containing all events
 */
export function useGameEvents() {
  // Get the Dojo SDK instance for blockchain interactions
  const {
    setup: { sdk },
  } = useDojo();

  // Get access to the events store and its methods
  const { setEvents, addEvent, events } = useEventsStore();
  const { tokenId } = useTokenStore();

  /**
   * First useEffect: Handles event fetching and subscription
   * This effect runs once when the component mounts and
   * sets up the event listeners
   */
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
            .keys(["zidle-Mine"], [tokenId.toString()])
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
          // Callback invoked whenever a new event occurs
          (newEvent) => {
            console.log("New event:", newEvent);
            const parsed = parseGameEvent(newEvent);
            if (parsed) {
              addEvent(parsed);
            }
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

    // Cleanup subscription on unmount or when token_id changes
    return () => {
      if (subscription) {
        subscription.free();
      }
    };
  }, [sdk, setEvents, addEvent, tokenId]); // Added tokenId to dependencies

  /**
   * Second useEffect: Handles event formatting and processing
   * This effect runs whenever the events array changes
   * It transforms raw blockchain events into a more readable format
   */
  useEffect(() => {
    /**
     * Formats a raw mining event into a user-friendly structure
     * @param event Raw event data from the blockchain
     * @returns Formatted event object or null if invalid
     */
    const formatMiningEvent = (event: any) => {
      // Extract entityId which is the first key of the event object
      const entityId = Object.keys(event)[0];
      const eventData = event[entityId];

      // Verify the event has the expected structure
      if (!eventData?.models?.zidle?.Mine) return null;

      const mineData = eventData.models.zidle.Mine;
      try {
        // Create a Resource instance from the mining data
        const resource = Resource.from(
          parseInt(mineData.rcs_type),
          parseInt(mineData.rcs_sub_type),
        );

        // Return formatted event with resource details
        return {
          tokenId: mineData.token_id,
          resource: {
            type: resource.getName(), // e.g., "Wood", "Rock"
            subType: resource.getSubresourceName(), // e.g., "Oak", "Granite"
            baseXp: resource.baseXp(),
            minLevel: resource.minLevel(),
            maxLevel: resource.maxLevel(),
          },
          entityId: entityId,
          timestamp: new Date(mineData.timestamp || 0).toLocaleString(),
        };
      } catch (error) {
        console.error("Error formatting resource:", {
          error,
          mineData,
        });
        return null;
      }
    };

    // Debug log to see the structure of the first event
    if (events.length > 0) {
      console.log("First raw event structure:", {
        event: events[0],
        keys: Object.keys(events[0]),
      });
    }

    // Format all events and filter out any invalid ones
    const formattedEvents = events
      .map((eventArray) => formatMiningEvent(eventArray))
      .filter((event) => event !== null);

    // Log the final formatted events
    console.log("Historical Mining Events:", {
      totalEvents: events.length,
      formattedEvents,
    });
  }, [events]);

  // Return the store so components can access all events
  return useEventsStore();
}
