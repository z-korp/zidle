import React from "react";
import { Button } from "../elements/button";
import wood from "/assets/wood2.png";
import rock from "/assets/rock2.png";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: "wood" | "rock";
}

interface InventoryDivProps {
  items: InventoryItem[];
  setIsInInventory: (state: boolean) => void;
}

const InventoryDiv: React.FC<InventoryDivProps> = ({
  items,
  setIsInInventory,
}) => {
  const getResourceImage = (type: "wood" | "rock") => {
    return type === "wood" ? wood : rock;
  };

  return (
    <div className="space-y-2 border-4 border-grey-600 shadow-lg rounded-xl p-4 bg-gray-800 text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Inventory</h2>
        <Button
          onClick={() => setIsInInventory(false)}
          size="sm"
          variant="outline"
          className="text-white border-white hover:bg-gray-700"
        >
          Close
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 py-1 rounded-lg border border-gray-600 bg-gray-700"
          >
            <div className="relative flex-shrink-0">
              <img
                src={getResourceImage(item.type)}
                alt={item.name}
                className="w-8 h-8 object-cover"
              />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <span className="font-medium text-sm truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryDiv;
