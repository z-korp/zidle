import { useEffect } from "react";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { addAddressPadding } from "starknet";
import { useEventsStore } from "@/stores/useEventsStore";
import { Subscription } from "@dojoengine/torii-client";

/**
 * Custom hook to handle game events (Mining and Harvesting)
 * This hook does two main things:
 * 1. Fetches historical events when the component mounts
 * 2. Subscribes to new events in real-time
 *
 * @returns The events store containing all events
 */
export function useGameEvents() {
  // Get the connected wallet account
  const { account } = useAccount();
  // Get access to the Dojo SDK
  const { sdk } = useDojoSDK();
  // Get functions to manage events from our store
  const { setEvents, addEvent } = useEventsStore();

  useEffect(() => {
    // Store the subscription to clean it up later
    let subscription: Subscription | null = null;

    /**
     * Fetches all past events for the connected account
     * This includes all Mine and Harvest events
     */
    async function getHistoricalEvents() {
      if (!account) return;

      try {
        const events = await sdk.getEventMessages({
          query: {
            event_messages_historical: {
              // Query for Mining events
              Mine: {
                $: {
                  where: {
                    player: { $eq: addAddressPadding(account.address) },
                  },
                },
              },
              // Query for Harvesting events
              Harvest: {
                $: {
                  where: {
                    player: { $eq: addAddressPadding(account.address) },
                  },
                },
              },
            },
          },
          // Callback function when new events are received
          callback: ({ data }) => {
            if (data) {
              addEvent(data);
            }
          },
          historical: true, // Indicate we want past events
        });

        // Store all fetched events in our global store
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
      if (!account) return;

      try {
        subscription = await sdk.subscribeEventQuery({
          // Same query structure as getHistoricalEvents
          query: {
            event_messages_historical: {
              Mine: {
                $: {
                  where: {
                    player: { $eq: addAddressPadding(account.address) },
                  },
                },
              },
              Harvest: {
                $: {
                  where: {
                    player: { $eq: addAddressPadding(account.address) },
                  },
                },
              },
            },
          },
          // Called whenever a new event occurs
          callback: ({ data }) => {
            if (data) {
              addEvent(data);
            }
          },
          historical: true,
        });
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
  }, [account, sdk, setEvents, addEvent]);

  // Return the store so components can access all events
  return useEventsStore();
}
