import { CONTRACT_EVENT } from "../constants/events";
import { createEventSubscription } from "./createEventSubscription";
import { Components } from "@dojoengine/recs";

/**
 * Creates update handlers for the application's real-time events
 *
 * This function initializes the event management system by:
 * 1. Setting up contract event subscriptions
 * 2. Creating event streams for specific game instances
 * 3. Providing a unified interface for event handling
 *
 * @param {Components} components - Dojo ECS components for state management
 * @returns {Promise<{ eventUpdates: EventUpdates }>} Object containing event update handlers
 *
 * @example
 * const { eventUpdates } = await createUpdates(components);
 * const eventStream = await eventUpdates.createContractEvents("gameId123");
 */
export const createUpdates = async (components: Components) => {
  /**
   * Event update handlers object
   * Contains methods for creating different types of event subscriptions
   */
  const eventUpdates = {
    /**
     * Creates a subscription for contract-specific events
     * Combines the CONTRACT_EVENT identifier with a specific gameId
     *
     * @param {string} gameId - Unique identifier for the game instance
     * @returns {Promise<Observable<Event | null>>} Stream of contract events
     */
    createContractEvents: async (gameId: string) =>
      createEventSubscription([CONTRACT_EVENT, gameId]),
  };

  return {
    eventUpdates,
  };
};
