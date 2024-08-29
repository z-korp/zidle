import React, { useState } from "react";
import { Button } from "../elements/button";
import wood from "/assets/wood2.png";
import rock from "/assets/rock2.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../elements/dialog";
import { Input } from "../elements/input";
import { InventoryItem } from "@/dojo/game/models/miner";
import { ResourceType } from "@/dojo/game/types/resource";
import { Sell } from "../actions/Sell";

interface InventoryDivProps {
  tokenId: string;
  items: InventoryItem[];
  setIsInInventory: (state: boolean) => void;
}

const InventoryDiv: React.FC<InventoryDivProps> = ({
  tokenId,
  items,
  setIsInInventory,
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [sellQuantity, setSellQuantity] = useState(1);

  const getResourceImage = (type: ResourceType) => {
    return type === ResourceType.Wood ? wood : rock;
  };

  return (
    <>
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
          {items
            .filter((item) => item.quantity > 0)
            .map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 py-1 px-2 rounded-lg border border-gray-600 bg-gray-700 cursor-pointer hover:bg-gray-600"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={getResourceImage(item.rcs.value)}
                    alt={item.rcs.getSubresourceName()}
                    className="w-8 h-8 object-cover"
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

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.rcs.getName()}</DialogTitle>
            <DialogDescription>Item details and actions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Quantity: {selectedItem?.quantity}</p>
            <p>Type: {selectedItem?.rcs.value}</p>
            <p>Unit price: {selectedItem?.rcs.getUnitPrice() || 1} golds</p>
            <div>
              <label
                htmlFor="sellQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity to sell
              </label>
              <Input
                id="sellQuantity"
                type="number"
                value={sellQuantity || ""}
                onChange={(e) => setSellQuantity(Number(e.target.value))}
                min={1}
                max={selectedItem?.quantity || 1}
                className="mt-1"
              />
            </div>
            <p>
              Total price:{" "}
              {(selectedItem?.rcs.getUnitPrice() || 1) * sellQuantity} golds
            </p>
          </div>
          <DialogFooter>
            <Sell
              tokenId={tokenId}
              rcs_type={selectedItem?.rcs.into()}
              rcs_sub_type={selectedItem?.rcs.getSubresource().into()}
              amount={sellQuantity}
              afterSellCallback={() => {
                setSelectedItem(null);
              }}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryDiv;
