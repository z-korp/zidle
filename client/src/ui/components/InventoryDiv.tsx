import React, { useState } from "react";
import { Button } from "../elements/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../elements/dialog";
import gold from "/assets/gold.png";
import { Input } from "../elements/input";
import { InventoryItem } from "@/dojo/game/models/miner";
import { Sell } from "../actions/Sell";
import { getResourceImage } from "@/utils/resource";

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

  return (
    <>
      <div className="space-y-2 border border-grey-600 shadow-lg rounded-xl p-4 bg-gray-800 text-white">
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

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.rcs.getName()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>Type: {selectedItem?.rcs.getSubresource().value}</p>
              <p>Quantity: {selectedItem?.quantity}</p>
              <div className="flex gap-1">
                <p>Unit price: {selectedItem?.rcs.getUnitPrice() || 1}</p>
                <img
                  src={gold}
                  alt="Gold"
                  className="w-6 h-6 pixelated-image"
                />
              </div>
            </div>

            <div>
              <div className="flex gap-2">
                <Input
                  id="sellQuantity"
                  type="number"
                  className="mt-1 col-span-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={sellQuantity || ""}
                  onChange={(e) => setSellQuantity(Number(e.target.value))}
                  min={1}
                  max={selectedItem?.quantity || 1}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[36px] mt-1"
                  onClick={() => setSellQuantity(selectedItem?.quantity || 1)}
                >
                  Max
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-1">
                <p className="">
                  Total price:{" "}
                  {(selectedItem?.rcs.getUnitPrice() || 1) * sellQuantity}
                </p>
                <img
                  src={gold}
                  alt="Gold"
                  className="w-6 h-6 pixelated-image"
                />
              </div>
              <Sell
                tokenId={tokenId}
                rcs_type={selectedItem?.rcs.into()}
                rcs_sub_type={selectedItem?.rcs.getSubresource().into()}
                amount={sellQuantity}
                afterSellCallback={() => {
                  setSelectedItem(null);
                }}
              />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryDiv;
