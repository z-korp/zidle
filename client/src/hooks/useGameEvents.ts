import { useEffect, useState } from "react";
import { ParsedEntity } from "@dojoengine/sdk";
import { Subscription } from "@dojoengine/torii-client";
import { useEventsStore } from "@/stores/useEventsStore";
import { useTokenStore } from "@/stores/useTokenStore";
import { ParsedGameEvent, SchemaType } from "@/dojo/types";
import { parseGameEvent } from "@/utils/events";
import { useDojo } from "@/dojo/useDojo";
import { addAddressPadding, events } from "starknet";

/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook performs the following:
 * 1. Fetches historical events based on token_id when the component mounts or token_id changes
 * 2. Subscribes to new events in real-time based on token_id
 *
 * @returns The events store containing all events
 */
export function useGameEvents() {
  const { setEvents, addEvent, events } = useEventsStore();
  const { tokenId } = useTokenStore();
  const {
    setup: { sdk },
  } = useDojo();

  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (!tokenId) {
      console.warn(
        "Account or token_id not available. Skipping event operations.",
      );
      setEvents([]); // Clear events if account or token_id is missing
      return;
    }

    let isMounted = true; // To prevent state updates on unmounted component

    /**
     * Constructs a query with the current token_id and account address
     */

    /**
     * Fetches all past events for the connected account and specific token_id
     * This includes all Mine and Harvest events
     */
    async function getHistoricalEvents() {
      console.log("qqqqqq");
      try {
        const historicalEvents: ParsedEntity<SchemaType>[] =
          await sdk.getEventMessages({
            query: {
              event_messages: {
                Mine: {
                  $: {
                    where: {
                      token_id: {
                        $eq: "1",
                      },
                    },
                  },
                },
              },
            },
            callback: () => {}, // No-op callback for historical fetch
            historical: true,
          });
        console.log("historicalEvents", historicalEvents);

        const parsedEvents: ParsedGameEvent[] = historicalEvents
          .map((event) => parseGameEvent(event))
          .filter((e): e is ParsedGameEvent => e !== undefined);

        if (isMounted) {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error("Error fetching historical events:", error);
        if (isMounted) {
          setEvents([]);
        }
      }
    }

    /**
     * Sets up a real-time subscription to new events based on token_id
     * Will trigger whenever new Mine or Harvest events occur for the token_id
     */
    async function subscribeToEvents() {
      try {
        const newSubscription: Subscription = await sdk.subscribeEventQuery({
          query: {
            event_messages_historical: {
              Mine: {
                $: {
                  where: {
                    token_id: {
                      $eq: "1",
                    },
                  },
                },
              },
            },
          },
          callback: ({
            data,
            error,
          }: {
            data: ParsedEntity<SchemaType> | null;
            error: Error | null;
          }) => {
            if (error) {
              console.error("Subscription error:", error);
              return;
            }
            if (data) {
              console.log("New event received:", data);
              const parsed = parseGameEvent(data);
              if (parsed) {
                addEvent(parsed);
              }
            }
          },
          historical: false, // Only subscribe to new events
        });

        if (isMounted) {
          setSubscription(newSubscription);
        }
      } catch (error) {
        console.error("Error subscribing to events:", error);
      }
    }

    // Initialize both historical and real-time events
    getHistoricalEvents();
    //subscribeToEvents();

    // Cleanup subscription on unmount or when dependencies change
    return () => {
      isMounted = false;
      if (subscription) {
        subscription.free();
      }
    };
  }, [tokenId, sdk, setEvents, addEvent]);

  useEffect(() => {
    console.log("Events:", events);
  }, [events]);

  // Return the events from the store so components can access all events
  return events;
}
