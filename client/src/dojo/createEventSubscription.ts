import { createClient, Event } from "@dojoengine/torii-client";
import { gql } from "graphql-request";
import { BehaviorSubject, Observable } from "rxjs";

/**
 * Creates a WebSocket subscription to blockchain events using Torii client
 *
 * This function sets up a real-time connection to track specific blockchain events by:
 * 1. Creating a WebSocket connection to Torii server
 * 2. Setting up a GraphQL subscription
 * 3. Managing the event stream using RxJS
 *
 * @param {string[]} keys - Array of event keys to subscribe to
 * @returns {Promise<Observable<Event | null>>} Observable that emits events or null
 *
 * @example
 * const eventStream = await createEventSubscription(["key1", "key2"]);
 * eventStream.subscribe(event => console.log(event));
 */
export async function createEventSubscription(
  keys: string[],
): Promise<Observable<Event | null>> {
  // Initialize WebSocket connection to Torii server
  const wsClient = createClient({ url: import.meta.env.VITE_PUBLIC_TORII_WS });

  /**
   * BehaviorSubject to manage the event stream
   * - Maintains the last emitted value
   * - Allows late subscribers to receive the most recent event
   * - Initially set to null
   */
  const lastUpdate$ = new BehaviorSubject<Event | null>(null);

  // Format keys for GraphQL query
  const formattedKeys = keys.map((key) => `"${key}"`).join(",");

  /**
   * Set up GraphQL subscription
   * Subscribes to eventEmitted events for specified keys
   * Handles event processing and error management
   */
  wsClient.subscribe(
    {
      query: gql`
        subscription {
          eventEmitted(keys: [${formattedKeys}]) {
            id
            keys
            data
            createdAt
            transactionHash
          }
        }
      `,
    },
    {
      /**
       * Event handler for new data
       * Processes incoming events and updates the BehaviorSubject
       *
       * @param {Object} data - GraphQL response data
       */
      next: ({ data }) => {
        try {
          const event = data?.eventEmitted as Event;
          if (event) {
            lastUpdate$.next(event);
          }
        } catch (error) {
          console.log({ error });
        }
      },

      /**
       * Error handler for subscription errors
       * Logs errors but keeps the subscription alive
       */
      error: (error) => console.log({ error }),

      /**
       * Completion handler
       * Called when the subscription is terminated normally
       */
      complete: () => console.log("complete"),
    },
  );

  // Return the Observable for consumers to subscribe to
  return lastUpdate$;
}
