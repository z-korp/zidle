import { Card, CardContent } from "@/ui/elements/card";
import { Character } from "@/hooks/useCharacter";
import { InventoryItem } from "@/dojo/game/models/miner";
import { getResourceImage } from "@/utils/resource";
import { ScrollArea } from "@/ui/elements/scroll-area";

interface InventoryViewProps {
  character: Character;
  inventory: InventoryItem[]; // Array of all items across all miners
}

/**
 * InventoryView component - Displays a scrollable grid of all resources
 * Shows each resource with its image, name and quantity per miner
 * Filters out resources with 0 quantity
 *
 * @param character - Current character data
 * @param inventory - Array of all inventory items from all miners
 */
export const InventoryView: React.FC<InventoryViewProps> = ({
  character,
  inventory,
}) => {
  return (
    // Scrollable container with fixed height
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        {/* Section title */}
        <h2 className="text-lg font-bold">Resources</h2>

        {/* Grid layout for resource cards */}
        <div className="grid grid-cols-2 gap-2">
          {inventory
            // Only show resources with quantity > 0
            .filter((item) => item.quantity > 0)
            .map((item, index) => (
              // Individual resource card
              <div
                key={index}
                className="flex items-center space-x-4 py-1 px-2 pt-2 rounded-lg border border-gray-600 bg-gray-700"
              >
                {/* Resource image with quantity badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getResourceImage(item.rcs.value)}
                    alt={item.rcs.getSubresourceName()}
                    className="w-8 h-8 pixelated-image object-cover"
                  />
                  {/* Quantity badge */}
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                {/* Resource name */}
                <span className="font-medium text-sm truncate">
                  {item.rcs.getSubresourceName()}
                </span>
              </div>
            ))}
        </div>
      </div>
    </ScrollArea>
  );
};
