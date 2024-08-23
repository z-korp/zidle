import React from "react";
import { Button } from "../elements/button";
import wood from "/assets/wood.png";
import rock from "/assets/rock.png";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

interface InventoryDivProps {
  items: InventoryItem[];
  setIsInInventory: (state: boolean) => void;
}

const InventoryDiv: React.FC<InventoryDivProps> = ({
  items,
  setIsInInventory,
}) => {
  return (
    <div className="space-y-4 border-4 border-grey-600 shadow-lg rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Inventory</h2>
        <Button onClick={() => setIsInInventory(false)} size="sm">
          Close
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg"
          >
            <div className="relative">
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-full"
              />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryDiv;
