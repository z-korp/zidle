import { Card, CardContent } from "@/ui/elements/card";
import { Character } from "@/hooks/useCharacter";
import { InventoryItem } from "@/dojo/game/models/miner";
import { getResourceImage } from "@/utils/resource";
import { ScrollArea } from "@/ui/elements/scroll-area";

interface InventoryViewProps {
  character: Character;
  inventory: InventoryItem[];
}

/**
 * InventoryView component - Displays the global inventory view
 * Shows all resources with their individual quantities per miner
 */
export const InventoryView: React.FC<InventoryViewProps> = ({
  character,
  inventory,
}) => {
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 pr-4">
        <h2 className="text-lg font-bold">Resources</h2>
        <div className="grid grid-cols-2 gap-2">
          {inventory
            .filter((item) => item.quantity > 0)
            .map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 py-1 px-2 pt-2 rounded-lg border border-gray-600 bg-gray-700"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={getResourceImage(item.rcs.value)}
                    alt={item.rcs.getSubresourceName()}
                    className="w-8 h-8 pixelated-image object-cover"
                  />
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
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
