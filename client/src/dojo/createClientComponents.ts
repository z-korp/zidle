import { overridableComponent } from "@dojoengine/recs";
import { ContractComponents } from "./contractModels";

/**
 * Type definition for the return value of createClientComponents
 * This ensures type safety when using the client components elsewhere
 */
export type ClientComponents = ReturnType<typeof createClientComponents>;

/**
 * Creates client-side components with overridable capabilities
 *
 * This function is crucial for the client-side state management as it:
 * 1. Takes the base contract components
 * 2. Adds client-specific overrides
 * 3. Enables optimistic updates
 *
 * @param {Object} params - Configuration object
 * @param {ContractComponents} params.contractComponents - Base components from the contract
 * @returns {ClientComponents} Enhanced components with client-side capabilities
 *
 * @example
 * const clientComponents = createClientComponents({
 *   contractComponents: baseComponents
 * });
 */
export function createClientComponents({
  contractComponents,
}: {
  contractComponents: ContractComponents;
}) {
  return {
    // Spread all existing contract components
    ...contractComponents,

    /**
     * Player component with override capability
     * Allows for optimistic updates before blockchain confirmation
     * Essential for responsive UI updates
     */
    Player: overridableComponent(contractComponents.Player),
  };
}
