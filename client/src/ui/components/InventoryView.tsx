import { Card, CardContent } from "@/ui/elements/card";
import { Character } from "@/hooks/useCharacter";
import { InventoryItem } from "@/dojo/game/models/miner";
import { ScrollArea } from "@/ui/elements/scroll-area";

interface InventoryViewProps {
  character: Character;
  inventory: InventoryItem[];
}

/**
 * InventoryView component - Displays the global inventory view
 * Shows all resources grouped by type with detailed information
 */
export const InventoryView: React.FC<InventoryViewProps> = ({
  character,
  inventory,
}) => {
  // Group items by type for better organization
  const groupedItems = inventory.reduce(
    (acc, item) => {
      if (!acc[item.resource_type]) {
        acc[item.resource_type] = [];
      }
      acc[item.resource_type].push(item);
      return acc;
    },
    {} as Record<string, InventoryItem[]>,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Global Inventory</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(groupedItems).map(([type, items]) => (
          <Card key={type} className="bg-gray-800/50">
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white capitalize">
                    {type}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Total: {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    Resource
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm bg-gray-900/50 p-2 rounded"
                  >
                    <span className="text-gray-400">Miner {index + 1}</span>
                    <span className="text-gray-300">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
