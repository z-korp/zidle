import { Card, CardContent } from "@/ui/elements/card";
import { Character } from "@/hooks/useCharacter";
import { InventoryItem } from "@/dojo/game/models/miner";

interface InventoryViewProps {
  character: Character;
  inventory: InventoryItem[];
}

/**
 * InventoryView component - Displays the global inventory view
 * Shows harvested resources with total and per-miner quantities
 */
export const InventoryView: React.FC<InventoryViewProps> = ({
  character,
  inventory,
}) => {
  // Group items by type and filter out empty resources
  const groupedItems = inventory.reduce(
    (acc, item) => {
      if (item.quantity > 0) {
        if (!acc[item.resource_type]) {
          acc[item.resource_type] = [];
        }
        acc[item.resource_type].push(item);
      }
      return acc;
    },
    {} as Record<string, InventoryItem[]>,
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Resources</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(groupedItems).map(([type, items]) => {
          const totalQuantity = items.reduce(
            (sum, item) => sum + item.quantity,
            0,
          );
          if (totalQuantity === 0) return null;

          return (
            <Card key={type} className="bg-gray-800/50">
              <CardContent className="p-4 space-y-3">
                {/* Resource header with total */}
                <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold capitalize">{type}</span>
                    <span className="text-sm text-gray-400">
                      Total: {totalQuantity}
                    </span>
                  </div>
                </div>

                {/* Per-miner details */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-900/40 rounded p-2"
                    >
                      <span className="text-sm text-gray-400">
                        Miner {index + 1}
                      </span>
                      <span className="text-sm font-medium">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
