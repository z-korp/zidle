import { useDojo } from "@/dojo/useDojo";
import { useEffect, useRef, useState } from "react";
import { Subscription } from "rxjs";

/**
 * Interface for event data structure
 * @property timestamp - Time when the event occurred
 * @property action - Description of the event action
 */
interface EventData {
  timestamp: string;
  action: string;
}

/**
 * Custom hook to handle real-time contract events for a specific NFT
 * This hook manages subscriptions to blockchain events and maintains a list of events
 *
 * @param tokenId - The ID of the NFT to track events for
 * @returns Object containing the events array
 */
export const useContractEvents = (tokenId: string) => {
  // Get the event creation function from Dojo setup
  const {
    setup: {
      updates: {
        eventUpdates: { createNFTEvents },
      },
    },
  } = useDojo();

  // Ref to track subscription status and prevent multiple subscriptions
  const subscribedRef = useRef(false);

  // State to store the events list, newest events are added to the start
  const [events, setEvents] = useState<EventData[]>([]);

  // Effect to handle event subscriptions
  useEffect(() => {
    // Only subscribe if we have a tokenId and aren't already subscribed
    if (tokenId && !subscribedRef.current) {
      // Array to store all active subscriptions for cleanup
      const subscriptions: Subscription[] = [];

      /**
       * Async function to set up event subscriptions
       * Creates an observable for NFT events and subscribes to it
       */
      const subscribeToEvents = async () => {
        // Create an observable for the NFT's events
        const nftEventsObservable = await createNFTEvents(tokenId);

        // Subscribe to the observable and handle incoming events
        subscriptions.push(
          nftEventsObservable.subscribe((event) => {
            if (event) {
              // Add new event to the start of the events array
              setEvents((prev) => [
                {
                  timestamp: new Date().toLocaleTimeString(),
                  action: event.data,
                },
                ...prev,
              ]);
            }
          }),
        );

        // Mark as subscribed to prevent multiple subscriptions
        subscribedRef.current = true;
      };

      // Initialize the subscription
      subscribeToEvents();
      console.log(`Subscribed to events for NFT #${tokenId}`);

      /**
       * Cleanup function that runs when the component unmounts
       * or when tokenId changes
       * - Unsubscribes from all active subscriptions
       * - Resets the subscription status
       */
      return () => {
        console.log(`Unsubscribed from events for NFT #${tokenId}`);
        subscriptions.forEach((sub) => sub.unsubscribe());
        subscribedRef.current = false;
      };
    }
  }, [tokenId, createNFTEvents]);

  // Return the events array for use in components
  return {
    events,
  };
};
