import { useEffect } from "react";
import { useEventsStore } from "@/stores/useEventsStore";
import { Subscription } from "@dojoengine/torii-client";
import { useDojo } from "@/dojo/useDojo";
import { ToriiQueryBuilder, ClauseBuilder } from "@dojoengine/sdk";
import { Resource } from "@/dojo/game/types/resource";

/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook provides two main functionalities:
 * 1. Fetches historical events when the component mounts
 * 2. Subscribes to new events in real-time
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

  /**
   * First useEffect: Handles event fetching and subscription
   * This effect runs once when the component mounts and
   * sets up the event listeners
   */
  useEffect(() => {
    // Store subscription reference for cleanup
    let subscription: Subscription | null = null;

    /**
     * Fetches all historical mining events from the blockchain
     * Uses ToriiQueryBuilder to construct the appropriate query
     * for zidle-Mine events
     */
    async function getHistoricalEvents() {
      try {
        const events = await sdk.getEvents(
          new ToriiQueryBuilder()
            .withClause(
              new ClauseBuilder().keys(["zidle-Mine"], [undefined]).build(),
            )
            .build(),
          true, // true indicates we want historical events
        );

        setEvents(events);
      } catch (error) {
        console.error("Error fetching historical events:", error);
        setEvents([]);
      }
    }

    /**
     * Sets up a real-time subscription to new mining events
     * Will be triggered whenever a new mining event occurs on the blockchain
     */
    async function subscribeToEvents() {
      // Debug log to see the query structure
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
          // Callback function executed when new events are received
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

    // Cleanup function to remove subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.free();
      }
    };
  }, [sdk, setEvents, addEvent]);

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
